import * as React from 'react';

import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBrush,
  faSave,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

const BottomNavItem: React.FC<{
  selected: boolean;
  title: string;
  icon: IconDefinition;
  href: string;
}> = ({ selected, title, icon, href }) => {
  return (
    <>
      <style jsx>{`
        a {
          color: var(${selected ? '--accent' : '--text-disabled'});

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          flex: 1 1 auto;

          height: 60px;
          border-radius: var(--strong-radius);

          font-size: 12px;
          transition: var(--fast-anim-delay) box-shadow ease-in-out,
            var(--fast-anim-delay) opacity ease-in-out;
        }

        a:hover {
          text-decoration: none;
        }
      `}</style>
      <Link href={href} replace>
        <a className={selected ? 'selected' : null}>
          <FontAwesomeIcon icon={icon} size="2x" />
          <figcaption style={{ opacity: selected ? 1.0 : 0.0 }}>
            {title}
          </figcaption>
        </a>
      </Link>
    </>
  );
};

const navButtons = [
  { title: 'Messes', icon: faBrush, href: '/' },
  { title: 'Settings', icon: faSave, href: '/settings' },
];

export const BottomNav: React.FC<{
  selected: number;
}> = ({ selected }) => {
  const content = navButtons.map((x, i) => (
    <BottomNavItem
      key={x.title}
      icon={x.icon}
      href={x.href}
      selected={selected === i}
      title={x.title}
    />
  ));

  return (
    <>
      <style jsx>{`
        nav {
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          align-items: center;

          background-color: #fff;
          border-radius: var(--border-radius);
        }
      `}</style>
      <nav>{content}</nav>
    </>
  );
};
