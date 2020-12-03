import firebase from 'firebase/app';
import 'firebase/auth';

import { firebaseConfig } from './firebase-config';
export { firebaseConfig as config } from './firebase-config';

firebase.initializeApp(firebaseConfig);

export const firebaseApp = firebase;
