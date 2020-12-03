import dynamic from 'next/dynamic';

const NoSSRComponent = dynamic(() => import('../components/pages/signin'), {
  ssr: false,
});

export default NoSSRComponent;
