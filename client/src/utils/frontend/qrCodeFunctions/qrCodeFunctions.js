export const copyToClipboard = async (value) => {
  try {
    const data = await fetch(value);
    const dataBlob = await data.blob();
    const clipboardData = [ new ClipboardItem({ [dataBlob.type]: dataBlob }) ];
    navigator.clipboard.write(clipboardData)
    return true;
  } catch(err) {
    console.error('Copying to Clipboard has been failed!', err);
    return false;
  }
}

export const webShare =  ( value, fileName ) => new Promise( async ( resolve, reject ) => {
  if (navigator.canShare && navigator.canShare({ file: blob })) {
    const fetchedData = await fetch(value);
    const blob = await fetchedData.blob();

    const file = new File([blob], `${fileName}.png`, { type: "image/png" });
    const filesArray = [file];

    navigator.share({
      files: filesArray
    })
    .then( _ => resolve(true))
    .catch( _ => resolve(false));
  } else {
    resolve(false)
  }
});

export const checkAvailability = () => {
  let share = false;
  let copy = false;
  try {
    if ( navigator.canShare ) share = true;
  } catch(err) { console.error(err) };
  try {
    if ( typeof ClipboardItem !== 'undefined' ) copy = true;
  } catch(err) { console.error(err) };
  return({
    share, copy
  })
};