import { useState, useEffect, useCallback, useRef } from 'react';

import classes from './starBackground.module.scss';

import { isMobile } from 'react-device-detect';

function StarBackground() {
  const svgRef = useRef();
  const [ stars, setStars ] = useState([]);

  const initStars = useCallback(( amount ) => {
    const { width, height } = svgRef.current.getBoundingClientRect()
    const results = [];
    for( let i = 0 ; i < amount ; i++ ) {
      const randomNum = Math.random();
      const star = {
        key: randomNum * 1000000,
        cx: Math.random() * width,
        cy: Math.random() * height,
        r: randomNum * 7.5,
        visible: randomNum * 2 > 1 ? true : false,
      }
      results.push(star)
    }
    setStars(results);
  }, []);


  const updateStars = useCallback( _ => {
    const { width, height } = svgRef.current.getBoundingClientRect();
    const newSars = stars.map( star => {
      if ( Math.random() * 2 > 1 ) return star;
      
      if ( star.visible ) { // hiding star if it was visible
        star.visible = false;
        return star;
        // return ({
        //   key: star.key,
        //   cx: star.cx,
        //   cy: star.cy,
        //   visible: false
        // })
      } else { // getting star new position and making it visible
        // star.cx = Math.random() * width;
        // star.cy = Math.random() * height;
        // star.r = Math.random() * 7.5;
        // star.visible = true;
        // return star;
        return ({
          key: star.key,
          cx: Math.random() * width,
          cy: Math.random() * height,
          r: Math.random() * 7.5,
          visible: true
        })
      }
    })
    setStars(newSars);
  }, [ stars ]);

  useEffect( _ => {
    console.log(isMobile);
    initStars(50);
  },[ initStars,  ])

  useEffect( _ => {
    const timeout = setTimeout(updateStars, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [ updateStars ])

  // const addStar

  return (
    <div className={ classes.starBackground }>
      <svg ref={ svgRef } className={ classes.svg } fill="none" xmlns="http://www.w3.org/2000/svg">
        {
          stars.map( item => (
            <circle key={ item.key } className={[ classes.star, item.visible ? classes.visible : classes.hidden ].join(' ')} r={ item.r } cx={ item.cx } cy={ item.cy }/>
          ))
        }
      </svg>
    </div>
  )
}

export default StarBackground
