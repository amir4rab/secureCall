const nextTranslate = require('next-translate')
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');


// module.exports = nextTranslate({
//   reactStrictMode: true,
// })

module.exports = withPlugins([
  [ 
    nextTranslate(),
    [
      optimizedImages, 
      {
        
      }
    ]
  ],
  {
    reactStrictMode: true,
  }
])
