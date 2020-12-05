import React, { useRef } from 'react';
import firebase from 'firebase/app';
import gql from 'graphql-tag';
import { Draqula, DraqulaProvider, useMutation } from 'draqula';

import { useAuth, useToken } from '../components/use-firebase';

const ADD_USER = gql`
  mutation upsertUser($email: String!) {
    insert_users(
      objects: { email: $email }
      on_conflict: { update_columns: email, constraint: users_email_key }
    ) {
      returning {
        email
      }
    }
  }
`;

let tempToken;

const SigninTestPage: React.FC = (_props) => {
  const auth = useAuth();
  const hasUpdated = useRef(false);
  const { mutate } = useMutation<{ email: string }>(ADD_USER);

  const signedIn = auth ? <h2>{'Hi ' + auth.displayName}</h2> : <p>no.</p>;

  return (
    <>
      <button
        disabled={!!auth}
        onClick={async () => {
          const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
          await firebase.auth().signInWithPopup(googleAuthProvider);
          hasUpdated.current = false;

          tempToken = await firebase.auth().currentUser.getIdToken();
          mutate({ email: firebase.auth().currentUser.email }); //.then(() => (hasUpdated.current = true));
        }}
      >
        Sign In with Google
      </button>

      <button disabled={!auth} onClick={() => firebase.auth().signOut()}>
        Goodbye
      </button>

      {signedIn}
    </>
  );
};

const SigninTestHost: React.FC = () => {
  const token = useToken();

  const client = new Draqula(process.env.NEXT_PUBLIC_DB_URL, {
    hooks: {
      beforeRequest: [
        (rq) => rq.headers.set('Authorization', `Bearer ${tempToken ?? token}`),
      ],
    },
  });

  return (
    <DraqulaProvider client={client}>
      <SigninTestPage />
    </DraqulaProvider>
  );
};

export default SigninTestHost;
