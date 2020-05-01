const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
   fixBabelImports('antd', {
     libraryDirectory: 'es',
     style: true,
   }),
   addLessLoader({
       lessOptions: {
           javascriptEnabled: true,
           modifyVars: {
               // see: https://ant.design/docs/react/customize-theme
               '@primary-color': 'rgba(46, 97, 141, 1)',           // primary color for all components
               '@link-color': '@primary-color',                     // link color
               '@success-color': '#5cb85c',                         // success state color
               '@warning-color': '#f0ad4e',                         // warning state color
               '@error-color': 'darken(#d9534f, 10%)',              // error state color
               '@font-size-base': '14px',                           // major text font size
               '@heading-color': 'rgba(0,0,0,0.85)',                // heading text color
               '@text-color': 'rgba(0, 0, 0, 1.0)',                 // major text color
               '@text-color-secondary': 'rgba(0, 0, 0. 0.45)',      // secondary text color
               '@disabled-color': 'rgba(0, 0, 0, 0.25)',            // disable state color
               '@border-radius-base': '4px',                        // major border radius
               '@border-color-base': '#d9d9d9',                     // major border color
               '@box-shadow-base': '9 2px 8px rgba(0, 0, 0, 0.15)'  // major shadow for layers
           }
       }
   })
);