import * as React from 'react';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';

import firebase from 'firebase/app';

import { BottomNav } from './navbar';
import { SigninButton } from './signin-button';
import { useAuth } from './use-firebase';
import { isServer } from './util';

export const Scaffold: React.FC<{
  title: string;
  buttonIndex: number;
  showBack?: boolean;
  showNav?: boolean;
}> = ({ title, buttonIndex, children, showBack = false, showNav = true }) => {
  const user = useAuth();
  const [probablySignedIn, setProbablySignedIn] = useState(true);

  useEffect(() => {
    if (isServer) return;

    if (window.localStorage.getItem('probablyLoggedIn') !== 'true') {
      setProbablySignedIn(false);
    }
  }, [isServer]);

  const userPicture = user ? (
    <a
      onClick={() => {
        firebase.auth().signOut();
        setProbablySignedIn(false);
      }}
      href="#"
      style={{ alignSelf: 'flex-end' }}
    >
      <img
        style={{
          borderRadius: '50%',
          padding: 2,
          border: '3px solid var(--accent)',
        }}
        src={user.photoURL}
        width={48}
        height={48}
      />
    </a>
  ) : null;

  const router = useRouter();
  const backButton = showBack ? (
    <a onClick={() => router.back()}>
      <FontAwesomeIcon icon={faLongArrowAltLeft} />
      &nbsp; &nbsp;
    </a>
  ) : null;

  const authedContent = (
    <>
      <style jsx>{`
        main {
          flex: 1 1 auto;
        }

        header {
          color: var(--accent);
          margin: 16px;
          margin-top: 16px;

          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
        }

        h1 {
          margin-bottom: 0;

          display: inline-flex;
          align-items: center;
        }

        footer {
          color: var(--chrome);
        }
      `}</style>

      <header>
        <h1>
          {backButton}
          {user ? title : null}
        </h1>

        <div className="expando-flex" />

        {userPicture}
      </header>
      <main>{user ? children : null}</main>
      <footer>
        {showNav ? <BottomNav selected={user ? buttonIndex : 0} /> : null}
      </footer>
    </>
  );

  const signinContent = (
    <>
      <style jsx>{`
        div {
          align-self: center;
        }

        h1 {
          margin-top: 64px;
        }

        button {
          align-self: center;
        }
      `}</style>
      <div className="expando-flex">
        <h1>Welcome to Marie</h1>
      </div>
      <div>
        <SigninButton />
      </div>
      <div className="expando-flex" />
    </>
  );

  return (
    <>
      <style jsx global>{`
        body,
        html {
          height: 100%;
        }

        #__next {
          display: flex;
          height: 100%;
          flex-direction: column;
          background-color: var(--background);
          color: var(--text);
        }
      `}</style>
      {user || probablySignedIn ? authedContent : signinContent}
    </>
  );
};
