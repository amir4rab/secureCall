import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import classes from './help.module.scss';

import { IoMenu, IoClose } from 'react-icons/io5';

const AuthButton = () => {
  const session = useSession();

  return (
    <>
      {
        session.status === 'loading' ? <Link href='/'>Loading...</Link> : null
      }
      {
        session.status === 'authenticated' ? <Link href='/panel'>Panel</Link> : null
      }
      {
        session.status === 'unauthenticated' ? <Link href='/'>Signup</Link> : null
      }
    </>
  )
}


function HelpComponent({ dataArr }) {
  const router = useRouter();
  const [ linksState, setLinksState ] = useState(false);

  const goToLink = (id) => {
    setLinksState(false);
    router.push(router.pathname + `#${id}`);
  };

  return (
    <div className={ classes.help }>
      <header className={ classes.header } aria-label='in-page-nav'>
        <button className={[ classes.menuToggle, linksState ? classes.active : classes.inactive ].join(' ')} onClick={ _ => setLinksState(!linksState) }>
          <IoMenu className={ classes.inactiveIcon } />
          <IoClose className={ classes.activeIcon } />
        </button>
        <h1 className={ classes.mobileTitle }>Help</h1>
        <div className={[ classes.links, linksState ? classes.open : classes.close ].join(' ')}>
          <p className={ classes.subtitle }>Topics</p>
          {
            dataArr.map( item => (
              <button onClick={ _ => goToLink(item.name) } key={item.name + 'link'} >{item.displayName}</button>
            )) 
          }
          <p className={ classes.subtitle }>Links</p>
          <Link href='/'>Home</Link>
          <AuthButton />
        </div>
      </header>
      <main>
        <div className={ classes.desktopLinks }>
          <h1 className={ classes.desktopTitle }>Help</h1>
          <p className={ classes.subtitle }>Topics</p>
          {
            dataArr.map( item => (
              <button onClick={ _ => goToLink(item.name) } key={item.name + 'desktopLink'} >{item.displayName}</button>
            )) 
          }
          <p className={ classes.subtitle }>Links</p>
          <Link href='/'>Home</Link>
          <AuthButton />
        </div>
        <article className={ classes.main }>
          { 
            dataArr.map( item => (
              <article className={ classes.article } id={ item.name } dangerouslySetInnerHTML={{ __html: item.html }} key={item.name} />
            )) 
          }
        </article>
      </main>
    </div>
  );
}

export default HelpComponent;
