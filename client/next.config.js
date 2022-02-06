const nextTranslate = require('next-translate')
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: true,
})
// const optimizedImages = require('next-optimized-images');


// module.exports = nextTranslate({
//   reactStrictMode: true,
// })

module.exports = withPlugins([
  [ 
    nextTranslate(), withBundleAnalyzer()
    // [
    //   optimizedImages, 
    //   {
        
    //   }
    // ]
  ],
  {
    reactStrictMode: true,
  }
])
