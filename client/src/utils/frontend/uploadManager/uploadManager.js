// import { aesKeyGenerate, aesEncryptFile, aesDecryptFile, str2ab, ab2str } from './crypto';

export const readableSize = (size) => {
  if ( size > 1000000000 ){
    return `${( size / 1000000000 ).toFixed(2)} GB`
  }
  if ( size > 1000000 ){
    return `${( size / 1000000 ).toFixed(2)} MB`
  }
  if ( size > 1000 ) {
    return `${( size / 1000 ).toFixed(2)} KB`
  }
  return `${ size } B`;
}

const convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
    resolve(reader.result);
  };
  reader.readAsDataURL(blob);
});

const convertBase64ToBuffer = (base64) => new Promise( async (resolve, reject) => {
  const fetchedData = await fetch(base64);
  const blob = await fetchedData.blob();
  const buffer = await blob.arrayBuffer()
  resolve(buffer)
})

export const fileSlicer = async ( blob, chunksSize= 128000 ) => {
  const chunks = Math.ceil(blob.size / chunksSize);
  const slicedFile= [];
  for( let i= 0; i < chunks; i++ ) {
    const slicedBase64 = await convertBlobToBase64(blob.slice(chunksSize * i, (( i + 1 ) * chunksSize)));
    slicedFile[i] = slicedBase64;
  }
  return slicedFile
};

export const fileUnifier = ( dataArr, metadata ) => new Promise ( async ( resolve, reject ) => {
  try {
    console.log(dataArr, metadata)
    const arrayBufferArray = [];
    for( let i = 0; i < dataArr.length; i++ ) {
      const buffer = await convertBase64ToBuffer(dataArr[i]);
      arrayBufferArray[i] = buffer;
    }
    const blob = new Blob(arrayBufferArray, { type: metadata.type })
    resolve(blob);
  } catch(err) {
    console.error(`Error in fileUnifier`,err);
    reject()
  }
})


export const generateFileMetaData = ( fileData, size, chunks ) => {
  const getFormat = ( filename ) => {
    const reDot = /[.][a-z0-9]*/gi;
    const array = [ ...filename.matchAll(reDot) ];
    return array.length === 0 ? '' :  array[array.length - 1].toString();
  }

  return ({
    name: fileData.name,
    format: getFormat(fileData.name),
    readableSize: readableSize(size),
    size,
    chunks,
    type: fileData.type
  })
}

export const fileReader = ( file ) => new Promise ( async (resolve, reject) => {
  const reader = new FileReader();
  reader.onload = async _ => {
    const blob = new Blob([ reader.result ], { type: file.type });
    const slicedFile = await fileSlicer(blob);

    resolve({
      dataArr: slicedFile,
      metadata: generateFileMetaData( file, reader.result.byteLength, slicedFile.length )
    });
  };
  reader.readAsArrayBuffer(file);
})