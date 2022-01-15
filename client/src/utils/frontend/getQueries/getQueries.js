export const getQueries = ( path ) => {
  if ( !path.includes('#') ) return null;

  const queriesArr = path.slice(path.indexOf('#') + 1, path.length).split('&');
  const query = {};
  queriesArr.forEach(item => {
    const splicedItem = item.split('=');
    query[splicedItem[0]] = splicedItem[1]
  });
  return query;
};

export default getQueries;