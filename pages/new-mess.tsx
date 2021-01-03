import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Scaffold } from '../components/scaffold';
import {
  AuthedUploadButton,
  SignedUploadButton,
} from '../components/signed-upload-button';

const SettingsPage: React.FC = () => {
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
      `}</style>
      <section>
        <h3>Take a photo of this mess!</h3>
        <p>[the mess]</p>
        <AuthedUploadButton />

        <h4>Who would know best where these things go?</h4>
        <select>
          <option>Ulrike</option>
          <option>Effie</option>
          <option>Ani</option>
          <option>I don't know!</option>
        </select>

        <h3>Anything else they should know?</h3>
        <textarea />

        <button>Let's get started!</button>
      </section>
    </Scaffold>
  );
};

export default SettingsPage;
