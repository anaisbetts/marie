import { Draqula, DraqulaProvider } from 'draqula';
import { useToken } from './use-firebase';

import Uploady from '@rpldy/uploady';
import React from 'react';

export const Providers: React.FC = ({ children }) => {
  const token = useToken();

  const destination = {
    url: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_BUCKET}/upload`,
    params: {
      upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_PRESET,
    },
  };

  const client = new Draqula(process.env.NEXT_PUBLIC_DB_URL, {
    hooks: {
      beforeRequest: [
        (rq) => rq.headers.set('Authorization', `Bearer ${token}`),
      ],
    },
  });

  return (
    <Uploady destination={destination}>
      <DraqulaProvider client={client}>
        <>{children}</>
      </DraqulaProvider>
    </Uploady>
  );
};
