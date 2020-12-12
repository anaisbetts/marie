import type { NextApiRequest, NextApiResponse } from 'next';
import { Payload } from '../../components/api/types';

import firebase from 'firebase-admin';
import gql from 'graphql-tag';

import { Draqula } from 'draqula';

const client = new Draqula(process.env.NEXT_PUBLIC_DB_URL, {
  hooks: {
    beforeRequest: [
      (rq) =>
        rq.headers.set(
          'X-Hasura-Admin-Secret',
          process.env.HASURA_ADMIN_SECRET
        ),
    ],
  },
});

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
};

firebase.initializeApp(firebaseConfig);

interface PushRow {
  created_at: Date;
  id: string;
  token: string;
  payload: string;
}

const UPDATE_PUSH = gql`
  mutation MyMutation(
    $id: uuid!
    $delivered_at: timestamptz!
    $delivery_result: String = ""
    $error: String = ""
  ) {
    update_pushes_by_pk(
      pk_columns: { id: $id }
      _set: {
        error: $error
        delivery_result: $delivery_result
        delivered_at: $delivered_at
      }
    ) {
      id
    }
  }
`;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const row: Payload<PushRow> = req.body;

  let error: string, result: string;
  try {
    result = await firebase
      .messaging()
      .send(JSON.parse(row.event.data.new.payload));
  } catch (e) {
    error = e.message;
    console.log(`Failed to send push! ${error}`);
  }

  try {
    await client.mutate(
      UPDATE_PUSH,
      {
        id: row.event.data.new.id,
        delivered_at: new Date(),
        delivery_result: result,
        error: error,
      },
      {}
    );
  } catch (e) {
    console.error(`Failed to update push record! ${e.message}`);
  }

  res.statusCode = 200
  res.send({});
};
