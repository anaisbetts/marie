import { useEffect, useState } from 'react';
import { Observable, Observer, of, concat } from 'rxjs';
import { distinctUntilChanged, mergeMap } from 'rxjs/operators';

import firebase from 'firebase/app';
import './firebase';
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

  return concat(of(firebase.auth().currentUser), auth).pipe(
    distinctUntilChanged((x, y) => x?.email === y?.email)
  );
}

export function useAuth() {
  const listen = listenAuth();
  return useObservable(() => listen);
}

export function useToken() {
  const listen = listenAuth();
  return useObservable(() =>
    listen.pipe(mergeMap((u) => (u ? of(u.getIdToken()) : of(''))))
  );
}
