export const stateNameToPosition = (state, size= [0,0]) => {
  let device = 'mobile'
  if ( typeof window !== 'undefined' ) {
    device = size[0] > 1200 ? 'desktop' : 'mobile';
  }

  const mobileElementWidth = `calc( -100vw + 4rem )`;
  const desktopElementHeight = `-80vh`;

  switch (state) {
    case 'overview': {
      return device === 'desktop' ? `translate(0, calc( ${desktopElementHeight} * 0 ))` : `translate( calc( ${mobileElementWidth} * 0 ), 0)`;
    }
    case 'upload': {
      return device === 'desktop' ? `translate(0, calc( ${desktopElementHeight} * 1 ))` : `translate( calc( ${mobileElementWidth} * 1 ), 0)`;
    }
    case 'download': {
      return device === 'desktop' ? `translate(0, calc( ${desktopElementHeight} * 2 ))` : `translate( calc( ${mobileElementWidth} * 2 ), 0)`;
    }
  }
};

export const addToArrayItem = ( newItem, setFunction ) => {
  setFunction( pervItems => [ ...pervItems, newItem ]);
};

export const removeItemFromArray = ( removedItemId, setFunction ) => {
  setFunction( pervItems => pervItems.filter( item => item.id !== removedItemId ));
};

export const updateItemPercentage = ( id, currentChunk, totalChunks, setFunction ) => {
  const percentage = +((( currentChunk + 1 ) / totalChunks ) * 100).toFixed(0);
  setFunction( pervItems => pervItems.map( item => {
    if( item.id === id ) {
      const newItem = {
        ...item,
        percentage: percentage
      }
      return newItem;
    } 
    return item;
  }));
};

export const updateItemState = ( id, state, setFunction ) => {
  setFunction( pervItems => pervItems.map( item => {
    if( item.id === id ) {
      const newItem = {
        ...item,
        state: state
      }
      console.log(newItem);
      return newItem
    } 
    return item;
  }));
};

export const appendChunk = ( newChunk, setFunction ) => new Promise((resolve) => {
  setFunction( currentDataArr => {
    const newDataArr = [ ...currentDataArr, newChunk ];
    resolve(newDataArr);
    return newDataArr;
  });
});

export const appendToMap = ( newItemKey, newItemValue, setFunction ) => {
  setFunction( oldMap => {
    const newMap = new Map(oldMap);
    newMap.set(newItemKey, newItemValue);
    return newMap;
  })
};

export const removeFromMap = ( itemKey, setFunction ) => {
  setFunction( oldMap => {
    const newMap = new Map(oldMap);
    newMap.delete(itemKey);
    return newMap;
  })
};