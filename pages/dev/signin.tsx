import React, { useRef } from 'react';
import firebase from 'firebase/app';
import gql from 'graphql-tag';
import { Draqula, DraqulaProvider, useMutation } from 'draqula';

import { useAuth, useToken } from '../../components/use-firebase';

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

const ADD_PUSH_TOKEN = gql`
  mutation insertPushToken($token: String!) {
    insert_push_tokens_one(object: { token: $token }) {
      token
      created_at
    }
  }
`;

let tempToken;

async function getWebPushToken() {
  const token = await firebase
    .messaging()
    .getToken({ vapidKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY });
  return token;
}

const SigninTestPage: React.FC = (_props) => {
  const auth = useAuth();
  const hasUpdated = useRef(false);
  const addUser = useMutation<{ email: string }>(ADD_USER);
  const insertToken = useMutation<{ created_at: Date; token: string }>(
    ADD_PUSH_TOKEN
  );

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
          addUser.mutate({ email: firebase.auth().currentUser.email });
        }}
      >
        Sign In with Google
      </button>

      <button disabled={!auth} onClick={() => firebase.auth().signOut()}>
        Goodbye
      </button>

      <button
        disabled={!auth && !insertToken.isLoading}
        onClick={async () => {
          const token = await getWebPushToken();
          await insertToken.mutate({ token });
          console.log('u did it!');
        }}
      >
        Register push token
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
