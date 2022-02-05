import fs from 'fs';
import path from 'path';

const jsonDirectory = path.join(process.cwd(), 'json');

export const getJson = async ( fileName, subDir= null ) => {
  let json = null;
  try {
    json = subDir === null ? 
    fs.readFileSync(`${jsonDirectory}/${fileName}.json`, 'utf8') : 
    fs.readFileSync(`${jsonDirectory}/${subDir}/${fileName}.json`, 'utf8');
  } catch(err) {
    return ({
      status: 'error',
      errorCode: 'no such file has been founded!'
    })
  }
  try {
    return ({
      status: `successful`,
      name: fileName,
      json: JSON.parse(json.toString())
    })
  } catch {
    return ({
      status: `error`,
      errorCode: 'something went wrong in parsing!'
    })
  }
};

export default getJson;