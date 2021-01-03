import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';

import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Scaffold } from '../components/scaffold';
import { AuthedUploadButton } from '../components/signed-upload-button';
import { useListUsers } from '../components/api/swr';

const NewMessPage: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>(null);
  const userList = useListUsers();

  const users = userList.data
    ? userList.data.map((x) => (
        <option key={x.uid} value={x.uid}>
          {x.display_name ?? 'Mystery user!'}
        </option>
      ))
    : [<option key="loading">Loading...</option>];

  const imageContent = imageUrl ? (
    <img src={imageUrl} style={{ maxHeight: 300 }} />
  ) : (
    <FontAwesomeIcon icon={faCamera} size="10x" />
  );

  return (
    <Scaffold buttonIndex={0} title="New Mess" showNav={false} showBack>
      <style jsx>{`
        section {
          overflow-y: auto;

          display: flex;
          flex-direction: column;

          align-items: flex-start;
        }

        textarea {
          align-self: stretch;
        }

        select {
          margin-bottom: 28px;
        }

        button {
          align-self: stretch;

          margin-left: 32px;
          margin-right: 32px;
          margin-top: 16px;
        }

        .camera {
          height: 300px;
          width: 100%;

          margin-top: 16px;
          margin-bottom: 16px;

          color: hsla(var(--text-hs), var(--text-l), 0.2);

          display: grid;
          align-content: center;
          justify-content: center;
          grid-column: 1fr;
          position: relative;
        }

        .camera img {
          max-height: 300px;
          max-width: 100%;
        }
      `}</style>

      <section>
        <h3>Take a photo of this mess!</h3>
        <div className="camera">{imageContent}</div>
        <AuthedUploadButton onSubmitted={(e) => setImageUrl(e.imageUrl)}>
          <>
            <FontAwesomeIcon icon={faCamera} size="lg" />
            &nbsp;&nbsp;Take a Photo
          </>
        </AuthedUploadButton>

        <h4>Who would know best where these things go?</h4>
        <select>{users}</select>

        <h3>Anything else they should know?</h3>
        <textarea />

        <button>Let's get started!</button>
      </section>
    </Scaffold>
  );
};

export default NewMessPage;
