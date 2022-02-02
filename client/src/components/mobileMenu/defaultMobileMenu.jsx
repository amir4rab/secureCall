import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { IoHome, IoPerson } from 'react-icons/io5';

import MobileMenuBase from './mobileMenuBase';

const DefaultMobileMenu = () => {
  const [ dataArr, setDataArr ] = useState([]);
  const router = useRouter();
  const session = useSession();
  
  useEffect( _ => {
    const returnedArr = [];
    if ( session.status === 'authenticated' ) {
      returnedArr.push({
        key: 'toPanel',
        event: _ => router.push('/panel'),
        img: <IoPerson />,
        i18Key: 'toPanel'
      })
    } else {
      returnedArr.push({
        key: 'singUp',
        event: _ => router.push('/auth'),
        img: <IoPerson />,
        i18Key: 'signUp'
      })
    }
    returnedArr.push({
      key: 'toHome',
      event: _ => router.push('/'),
      img: <IoHome />,
      i18Key: 'home'
    });
    setDataArr(returnedArr);
  }, [ router, session ]);

  return (<MobileMenuBase dataArr={ dataArr }/>);
}

export default DefaultMobileMenu;
