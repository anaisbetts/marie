import * as React from 'react';
import Link from 'next/link';

import { Scaffold } from '../components/scaffold';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const MessesPage: React.FC = () => {
  return (
    <Scaffold buttonIndex={0} title="Messes">
      <style jsx global>{`
        main {
          height: 100%;

          display: flex;
          flex-direction: column;
        }

        section {
          flex: 1 1 auto;
        }

        a.button {
          margin-left: 32px;
          margin-right: 32px;
          margin-top: 16px;
          margin-bottom: 16px;

          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        h3 {
          color: var(--accent-text);

          margin-bottom: 0;
          margin-left: 8px;
          margin-top: 6px;
        }
      `}</style>

      <section></section>

      <Link href="/new-mess">
        <a className="button">
          <FontAwesomeIcon icon={faCamera} size="lg" />
          <h3>I see a mess!</h3>
        </a>
      </Link>
    </Scaffold>
  );
};

export default MessesPage;
