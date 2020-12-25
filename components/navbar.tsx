import * as React from 'react';
import { useState } from 'react';

import { useTransition, animated } from 'react-spring';

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
  onClick?: (title: string) => unknown;
}> = ({ selected, title, icon, onClick }) => {
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

        a.selected {
          box-shadow: 5px 5px 10px var(--accent-border-focused-shadow);
        }
      `}</style>
      <a
        className={selected ? 'selected' : null}
        onClick={() => onClick?.(title)}
      >
        <FontAwesomeIcon icon={icon} />
        <figcaption style={{ opacity: selected ? 1.0 : 0.0 }}>
          {title}
        </figcaption>
      </a>
    </>
  );
};

const navButtons = [
  { title: 'Messes', icon: faBrush },
  { title: 'Settings', icon: faSave },
];

export const BottomNav: React.FC<{
  onChange?: (n: number, t: string) => unknown;
}> = ({ onChange }) => {
  const [current, setCurrent] = useState(0);

  const content = navButtons.map((x, i) => (
    <BottomNavItem
      key={x.title}
      icon={x.icon}
      selected={i === current}
      title={x.title}
      onClick={() => {
        setCurrent(i);
        onChange?.(i, x.title);
      }}
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
