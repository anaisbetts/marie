import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { AuthedUploadButton } from '../components/signed-upload-button';
import { useAuth } from '../components/use-firebase';
import { Providers } from '../components/providers';
import { isServer } from '../components/util';

import firebase from 'firebase/app';

const UploadImage: React.FC = () => {
  const auth = useAuth();
  const router = useRouter();
  const [img, setImg] = useState<string>(null);

  useEffect(() => {
    if (isServer) return;

    if (!firebase.auth().currentUser) {
      //router.push('/signin');
    }
  }, [auth]);

  if (!auth) {
    <h2>no.</h2>;
  }

  const imageContent = img ? <img src={img} /> : null;

  return (
    <Providers>
      <h2>Hello, upload an image please!</h2>
      <AuthedUploadButton onSubmitted={(i) => setImg(i.imageUrl)}>
        Click here
      </AuthedUploadButton>
      {imageContent}
    </Providers>
  );
};

export default UploadImage;
