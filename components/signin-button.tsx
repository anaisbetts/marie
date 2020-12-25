import React from 'react';

import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import gql from 'graphql-tag';
import firebase from 'firebase/app';

import { getDraqulaClientForToken } from './util';

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

async function getWebPushToken() {
  const token = await firebase
    .messaging()
    .getToken({ vapidKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY });
  return token;
}

export const SigninButton: React.FC = () => {
  const signin = async () => {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(googleAuthProvider);

    const tempToken = await firebase.auth().currentUser.getIdToken();
    const client = getDraqulaClientForToken(tempToken);

    try {
      await client.mutate(
        ADD_USER,
        { email: firebase.auth().currentUser.email },
        {}
      );
    } catch (e) {
      console.error(
        `Signed in via Google but failed to upsert user: ${e.message}`
      );

      firebase.auth().signOut();
    }

    try {
      await client.mutate(
        ADD_PUSH_TOKEN,
        { token: await getWebPushToken() },
        {}
      );
    } catch (e) {
      console.error(
        `Couldn't register for push notifications, continuing anyways - ${e.message}`
      );
    }
  };

  return (
    <button onClick={signin}>
      <FontAwesomeIcon icon={faGoogle} />
      &nbsp;&nbsp; Sign in with Google
    </button>
  );
};
