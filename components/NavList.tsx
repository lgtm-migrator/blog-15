import React, { useRef } from 'react';
import styled from 'styled-components';
import isAbsoluteUrl from 'is-absolute-url';
import { useTransition, animated } from 'react-spring';
import Link from '~/components/LinkWithData';
import useOnClickOutside from '~/lib/useOnClickOutside';

const NavLinks = [
  {
    name: 'Home',
    slug: '/',
  },
  {
    name: 'GitHub',
    slug: 'https://github.com/mcansh',
  },
  {
    name: 'Twitter',
    slug: 'https://twitter.com/loganmcansh',
  },
  {
    name: 'Instagram',
    slug: 'https://instagram.com/loganmcansh',
  },
  {
    name: 'Email',
    slug: 'mailto:logan@mcan.sh',
  },
  {
    name: 'Changelog',
    slug: `${process.env.GITHUB_URL}/releases`,
  },
];

const NavStyles = styled.ul`
  height: 100vh;
  max-width: 40rem;
  width: 95%;
  position: fixed;
  background: black;
  top: 0;
  left: 0;
  z-index: 3;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0.4rem 0 1.5rem 0.3rem rgba(0, 0, 0, 0.4);
  will-change: transform;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  li {
    margin: 1rem 0;
    color: white;

    a {
      color: currentcolor;
      text-decoration: none;
      font-size: 3rem;
      &:hover {
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
`;

const AnimatedNavStyles = animated(NavStyles);

const NavList = ({
  navOpen,
  closeNav,
}: {
  navOpen: boolean;
  closeNav: () => void;
}) => {
  const tranitions = useTransition(navOpen, null, {
    from: { transform: 'translate3d(-100%, 0, 0)' },
    enter: { transform: 'translate3d(0, 0, 0)' },
    leave: { transform: 'translate3d(-100%, 0, 0)' },
    reset: true,
    unique: true,
  });

  const ref = useRef(null);
  // Call hook passing in the ref and a function to call on outside click
  useOnClickOutside(ref, () => closeNav());

  return tranitions.map(({ item, key, props }) => {
    return (
      item && (
        <AnimatedNavStyles key={key} style={props} ref={ref}>
          {NavLinks.map(({ name, slug }) => {
            const isExternal = isAbsoluteUrl(slug);
            return (
              <li key={name}>
                <Link href={slug} prefetch={!isExternal}>
                  <a
                    rel={isExternal ? 'noopener external nofollow' : ''}
                    target={isExternal ? '_blank' : ''}
                  >
                    {name}
                  </a>
                </Link>
              </li>
            );
          })}
        </AnimatedNavStyles>
      )
    );
  });
};

export default NavList;
