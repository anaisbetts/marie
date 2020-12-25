import * as React from 'react';
import { useEffect, useState } from 'react';

import { BottomNav } from './navbar';
import { SigninButton } from './signin-button';
import { useAuth } from './use-firebase';
import { isServer } from './util';

export const Scaffold: React.FC<{ title: string; buttonIndex: number }> = ({
  title,
  buttonIndex,
  children,
}) => {
  const user = useAuth();
  const [probablySignedIn, setProbablySignedIn] = useState(true);

  useEffect(() => {
    if (isServer) return;

    if (window.localStorage.getItem('probablyLoggedIn') !== 'true') {
      setProbablySignedIn(false);
    }
  }, [isServer]);

  const authedContent = (
    <>
      <style jsx>{`
        main {
          flex: 1 1 auto;
        }

        header {
          color: var(--accent);
          margin: 16px;
          margin-top: 64px;
        }

        footer {
          color: var(--chrome);
        }
      `}</style>

      <header>
        <h1>{user ? title : null}</h1>
      </header>
      <main>{user ? children : null}</main>
      <footer>
        <BottomNav selected={user ? buttonIndex : 0} />
      </footer>
    </>
  );

  const signinContent = (
    <>
      <style jsx>{`
        div {
          align-self: center;
        }

        .expando {
          flex: 1 1 auto;
        }

        h1 {
          margin-top: 64px;
        }

        button {
          align-self: center;
        }
      `}</style>
      <div className="expando">
        <h1>Welcome to Marie</h1>
      </div>
      <div>
        <SigninButton />
      </div>
      <div className="expando" />
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
