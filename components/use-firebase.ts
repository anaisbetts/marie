import { useEffect, useState } from 'react';
import { Observable, Observer, of, from } from 'rxjs';
import {
  distinctUntilChanged,
  mergeMap,
  publishBehavior,
  refCount,
  tap,
} from 'rxjs/operators';

import firebase from 'firebase/app';
import './setup-firebase';

import { isServer } from './util';

export function useObservable<T>(
  target: () => Observable<T>,
  initial?: T
): T | undefined {
  const [ret, setter] = useState(initial);
  const [obs] = useState(target);

  useEffect(() => {
    const sub = obs.subscribe(setter);
    return sub.unsubscribe.bind(sub);
  }, [obs]);

  return ret;
}

export function listenAuth() {
  const auth = isServer
    ? of<firebase.User>(null)
    : new Observable((subj: Observer<firebase.User>) =>
        firebase.auth().onAuthStateChanged(subj)
      );

  return auth.pipe(
    distinctUntilChanged((x, y) => x?.email === y?.email),
    tap((x) => {
      // NB: Firebase has to make an initial fetch before it can inform us
      // whether we're actually logged in or not. This sucks. So, we'll save
      // off in LocalStorage whether we *think* we may be logged in.
      window.localStorage.setItem('probablyLoggedIn', x ? 'true' : 'false');
    })
  );
}

const authObs = listenAuth().pipe(
  publishBehavior<firebase.User>(null),
  refCount()
);

export function useAuth() {
  return useObservable(() => authObs, firebase.auth().currentUser);
}

export function useToken() {
  return useObservable(() =>
    authObs.pipe(mergeMap((u) => (u ? from(u.getIdToken()) : of(''))))
  );
}
