import * as React from 'react';

import { GetServerSideProps } from 'next';
import { Scaffold } from '../components/scaffold';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { now: new Date().toISOString() },
  };
};

const SettingsPage: React.FC<{ now: string }> = ({ now }) => {
  return (
    <Scaffold buttonIndex={1} title="Settings">
      <h3>{`The page was generated on ${now}`}</h3>
    </Scaffold>
  );
};

export default SettingsPage;
