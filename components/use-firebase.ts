import { useEffect, useState } from 'react';
import { Observable, Observer, of, concat, merge } from 'rxjs';
import { mergeAll } from 'rxjs/operators';

import firebase from 'firebase';
import './firebase';

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

export function useAuth() {
  return useObservable(() => {
    const auth = new Observable((subj: Observer<firebase.User>) =>
      firebase.auth().onAuthStateChanged(subj)
    );
    const tok = new Observable((subj: Observer<firebase.User>) =>
      firebase.auth().onIdTokenChanged(subj)
    );

    return concat(of(firebase.auth().currentUser), merge(auth, tok));
  });
}

/*
export function useDocument(doc: () => DocumentReference) {
  return useObservable(() => {
    return new Observable((subj: Observer<DocumentSnapshot>) =>
      doc().onSnapshot(subj)
    );
  });
}
*/
