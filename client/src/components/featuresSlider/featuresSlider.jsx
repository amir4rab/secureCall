import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';

import FeatureItem from './featureItem';

import classes from './featureSlider.module.scss';

import { IoLogoGithub, IoVolumeMute, IoShield, IoWarning } from 'react-icons/io5';
import FeatureIndicators from './featureIndicators';

const calcPosition = ( index, activeIndex ) => `translate(-50%,-50%) translateX(${ activeIndex === index ? '-0%' : `${( activeIndex - index) * - 100}%` })`;

function FeaturesSlider({ animate= false, slideTimeout= 5 }) {
  const [ activeIndex, setActiveIndex ] = useState(0);
  const [ clicked, setClicked ] = useState(false);
  const intervalRef = useRef(null);
  const router = useRouter();

  const { t } = useTranslation('about');

  useEffect( _ => {
    if ( !animate ) return;
    if ( clicked ) {
      clearInterval(intervalRef.current);
      setClicked(false);
    } 
    intervalRef.current = setInterval(_ => {
      setActiveIndex( activeIndex => ( activeIndex < 2 || activeIndex === 0 ) ? setActiveIndex( activeIndex + 1 ) : setActiveIndex( 0 ) )
    }, slideTimeout * 1000);
    return () => {
      console.log('cleared')
      clearInterval(intervalRef.current);
    }
  }, [ clicked, slideTimeout, animate ])

  const manualIndexChangeEvent = ( newValue ) => {
    setActiveIndex(newValue);
    setClicked(true);
  }

  return (
    <div className={ classes.featureSlider }>
      <h3 className={ classes.title }>
        Singup and get more from <Link href='/'>Securecall</Link>
      </h3>
      <div className={ classes.sliderBox }>
        <div className={ classes.sliderWrapper }>
          <div className={ classes.featureWrapper } style={{ transform: calcPosition(0, activeIndex) }}>
            <FeatureItem 
              title={ t('e2ee') } 
              text={ t('e2eeText') } 
              icon={ <IoShield /> } 
              activeIndex={ activeIndex }
            />
          </div>
          <div className={ classes.featureWrapper } style={{ transform: calcPosition(1, activeIndex) }}>
            <FeatureItem 
              title={ t('open-source') } 
              // text={ t('open-source-text') } 
              text={ 
                <Trans 
                  i18nKey='about:open-source-text'
                  components={[<a key="link" href="https://github.com/amir4rab/secureCall" target='_blank' rel="noreferrer"/>]}
                /> 
              } 
              icon={ <IoLogoGithub /> }
            />
          </div>
          <div className={ classes.featureWrapper } style={{ transform: calcPosition(2, activeIndex) }}>
            <FeatureItem 
              title={ t('private') } 
              text={ t('privateText') } 
              icon={ <IoVolumeMute /> } 
            />
          </div>
        </div>
        <FeatureIndicators length={ 3 } activeIndex={ activeIndex } selectEvent={ manualIndexChangeEvent } />
      </div>
      <div className={ classes.buttonSection }>
        <button onClick={ _ => router.push('/auth') } className={ classes.buttonDarkL }>
          singup now
        </button>
      </div>
    </div>
  );
};

export default FeaturesSlider;
