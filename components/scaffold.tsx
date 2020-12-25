import * as React from 'react';
import { BottomNav } from './navbar';

export const Scaffold: React.FC<{ title: string; buttonIndex: number }> = ({
  title,
  buttonIndex,
  children,
}) => {
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
        }
      `}</style>
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
          color: #fff;
        }
      `}</style>
      <header>
        <h1>{title}</h1>
      </header>
      <main>{children}</main>
      <footer>
        <BottomNav selected={buttonIndex} />
      </footer>
    </>
  );
};
