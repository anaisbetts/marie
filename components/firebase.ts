import firebase from 'firebase/app';
import 'firebase/auth';

import { firebaseConfig } from './firebase-config';
export { firebaseConfig as config } from './firebase-config';

const wnd = global as any;
if (!wnd.hasFirebased) {
  firebase.initializeApp(firebaseConfig);
  wnd.hasFirebased = true;
}

export const firebaseApp = firebase;
