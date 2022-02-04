import Head from 'next/head';
import { motion } from 'framer-motion';
import Settings from '../../src/components/settings/settings';

import getMarkdown from '../../src/utils/backend/getMarkdown/getMarkdown';
import getJson from '../../src/utils/backend/getJson/getJson';
import jsonToTable from '../../src/utils/backend/jsonToTable/jsonToTable';

function SettingsPage({ data }) {
  return (
    <>
      <Head>
        <title>Settings - Secure Call</title>
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Settings data={ data } />
      </motion.div>
    </>
  )
}

export async function getStaticProps() {
  const troubleshooting = await getMarkdown('troubleshooting');

  const testedBrowsersRaw = await getJson('testedBrowsers');
  const testedBrowsers = jsonToTable(testedBrowsersRaw);
  
  const browserSupportRaw = await getJson('browserSupport');
  const browserSupport = jsonToTable(browserSupportRaw);

  const map = new Map([
    ['browserSupport', 'Browser support'],
    ['testedBrowsers', 'Tested browsers'],
    ['troubleshooting', 'troubleshooting'],
  ]);
  
  const mapFileNamesToDisplayNames = ( dataArr ) => {
    const newDataArr = dataArr.map( element => ({
      ...element,
      displayName: map.get(element.name),
    }))
    return newDataArr;
  };

  const helpDataArr = mapFileNamesToDisplayNames([
    browserSupport,
    testedBrowsers,
    troubleshooting,
  ]);
  
  return {
    props: {
      data: {
        helpData: helpDataArr
      }
    }
  }
}


export default SettingsPage
