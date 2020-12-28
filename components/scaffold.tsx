import * as React from 'react';
import { useEffect, useState } from 'react';

import firebase from 'firebase/app';

import { BottomNav } from './navbar';
import { SigninButton } from './signin-button';
import { useAuth } from './use-firebase';
import { isServer } from './util';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';

export const Scaffold: React.FC<{ title: string; buttonIndex: number }> = ({
  title,
  buttonIndex,
  children,
}) => {
  const user = useAuth();
  const [probablySignedIn, setProbablySignedIn] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const props = useSpring({ width: drawerOpen ? 200 : 0 });
  const bind = useDrag(({ swipe: [swipeX] }) => {
    console.log(`In drag!! ${swipeX}`);
    if (swipeX === 0) return;

    const newDrawer = swipeX > 0 ? true : false;
    if (newDrawer !== drawerOpen) setDrawerOpen(newDrawer);
  });

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

  const authedContent = (
    <>
      <style jsx>{`
        main {
          flex: 1 1 auto;
        }

        header {
          color: var(--accent);
          padding: 16px;

          display: flex;
          flex-direction: column;
        }

        footer {
          color: var(--chrome);
        }

        #content {
          background-color: var(--background);
          color: var(--text);

          display: flex;
          height: 100%;
          flex-direction: column;

          position: relative;
        }
      `}</style>

      <div id="content" {...bind()}>
        <animated.aside
          className="scaffold-drawer"
          style={props}
        ></animated.aside>

        <header>
          {userPicture}
          <h1>{user ? title : null}</h1>
        </header>
        <main>{user ? children : null}</main>
        <footer>
          <BottomNav selected={user ? buttonIndex : 0} />
        </footer>
      </div>
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

        .scaffold-drawer {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 60px;
          background-color: red;
          z-index: 10;
        }

        #__next {
          height: 100%;
        }
      `}</style>
      {user || probablySignedIn ? authedContent : signinContent}
    </>
  );
};
