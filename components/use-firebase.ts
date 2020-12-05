import { useEffect, useState } from 'react';
import { Observable, Observer, of, from } from 'rxjs';
import {
  distinctUntilChanged,
  mergeMap,
  publish,
  publishBehavior,
  refCount,
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

  return auth.pipe(distinctUntilChanged((x, y) => x?.email === y?.email));
}

const authObs = listenAuth().pipe(publishBehavior(null), refCount());

export function useAuth() {
  return useObservable(() => authObs, firebase.auth().currentUser);
}

export function useToken() {
  return useObservable(() =>
    authObs.pipe(mergeMap((u) => (u ? from(u.getIdToken()) : of(''))))
  );
}
