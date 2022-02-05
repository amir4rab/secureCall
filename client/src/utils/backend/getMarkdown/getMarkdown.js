import fs from 'fs';
import path from 'path';

import { remark } from 'remark'
import html from 'remark-html'

const markdownsDirectory = path.join(process.cwd(), 'markdown');

export const getMarkdown = async ( fileName, subDir= null ) => {
  let markdown = null;
  try {
    markdown = subDir === null ? 
    fs.readFileSync(`${markdownsDirectory}/${fileName}.md`, 'utf8') : 
    fs.readFileSync(`${markdownsDirectory}/${subDir}/${fileName}.md`, 'utf8');
  } catch {
    return ({
      status: 'error',
      errorCode: 'no such file has been founded!'
    })
  }
  try {
    const result = remark().use(html).processSync(markdown)
    return ({
      status: `successful`,
      name: fileName,
      html: result.toString()
    })
  } catch {
    return ({
      status: `error`,
      errorCode: 'something went wrong in parsing!'
    })
  }
};

export default getMarkdown;