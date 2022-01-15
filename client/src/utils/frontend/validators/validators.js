import { validate as uuidValidator } from 'uuid';

export const validateSecret = ( input, length = 16 ) => {
  if( input.length !== length ) return false;
  const secretRegex = /^[a-z0-9]+$/;
  return secretRegex.test(input)
}

export const validateId = ( input ) => {
  return uuidValidator(input) 
}

export const validateQuery = ({ query, maxLength= null, items= null }) => {
  const queryKeys = Object.keys(query);
  if ( maxLength !== null ) if ( queryKeys.length > maxLength ) {
    return false;
  }

  if ( items !== null ) {
    let queryItemsAreValid = true;
    items.every( item => {
      let queryWasIncluded = false;
      queryKeys.every( queryItem => {
        if( item === queryItem ) {
          queryWasIncluded = true;
          return false;
        };
        return true;
      })
      if ( !queryWasIncluded ) {
        console.log(`${item} wasn't included in query!`);
        queryItemsAreValid = false;
        return false
      }
      return true;
    });

    return queryItemsAreValid;
  } 

  if ( !validateId(query.id) ) {
    return false;
  }

  if ( !validateSecret(query.secret) ) {
    return false;
  }

  return true;
}

const validator = {
  validateSecret,
  validateId
};
export default validator;