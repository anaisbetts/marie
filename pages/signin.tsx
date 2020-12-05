import * as React from 'react';
import firebase from 'firebase/app';
import { useAuth } from '../components/use-firebase';

const SigninTestPage: React.FC = (_props) => {
  const auth = useAuth();

  const signedIn = auth ? <h2>{'Hi ' + auth.displayName}</h2> : <p>no.</p>;

  return (
    <>
      <button
        onClick={() => {
          const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithPopup(googleAuthProvider);
        }}
      >
        Sign In with Google
      </button>

      <button onClick={() => firebase.auth().signOut()}>Goodbye</button>

      {signedIn}
    </>
  );
};

export default SigninTestPage;
