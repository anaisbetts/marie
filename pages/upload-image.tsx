import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import firebase from 'firebase/app';

import { AuthedUploadButton } from '../components/signed-upload-button';
import { useAuth } from '../components/use-firebase';
import { Providers } from '../components/providers';
import { isServer } from '../components/util';

const UploadImage: React.FC = () => {
  const auth = useAuth();
  const router = useRouter();
  const [img, setImg] = useState<string>(null);

  useEffect(() => {
    if (isServer) return;

    setTimeout(() => {
      if (!firebase.auth().currentUser) {
        router.push('/signin');
      }
    }, 1000);
  }, [auth]);

  if (!auth) {
    <h2>Redirecting you shortly...</h2>;
  }

  const imageContent = img ? <img src={img} /> : null;

  return (
    <Providers>
      <h2>Hello, upload an image please!</h2>
      <section>
        <p>Here is some example text</p>
        <AuthedUploadButton onSubmitted={(i) => setImg(i.imageUrl)}>
          Click here
        </AuthedUploadButton>
        {imageContent}
      </section>
    </Providers>
  );
};

export default UploadImage;
