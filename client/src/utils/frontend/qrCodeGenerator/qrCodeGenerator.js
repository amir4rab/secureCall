import QRCode from 'qrcode'

const qrCodeSettings = {
  type: 'image/png',
  quality: 1,
  margin: 1, 
  errorCorrectionLevel: 'H',
  width: '512',
  color: {
    light: '#F5F5F5',
    dark: '#1F1F1F'
  }
}

export const qrCodeGenerator = async (input) => {
  try {
    const imageData = await QRCode.toDataURL(
      input, 
      qrCodeSettings
    );
    return imageData;
  } catch (err) {
    console.error(err)
  }
}

export const qrCodeGeneratorToClipboard = ( input, fileName ) => new Promise( async ( resolve, reject ) => {
  try {
    // const canvas = new OffscreenCanvas(512, 512);
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(
      canvas,
      input,
      qrCodeSettings
    );
    // const blob = await canvas.convertToBlob({ type: 'image/png'});
    // const clipboardData = [ new ClipboardItem({ [blob.type]: blob, 'callLabel': fileName }) ]
    // navigator.clipboard.write(clipboardData)

    canvas.toBlob( blob => {
      const clipboardData = [ new ClipboardItem({ [blob.type]: blob, 'callLabel': fileName }) ]
      navigator.clipboard.write(clipboardData)
    }, 'image/png', 1 );
      
    resolve(true)
  } catch(err) {
    reject(err)
  }
})

export default qrCodeGenerator
