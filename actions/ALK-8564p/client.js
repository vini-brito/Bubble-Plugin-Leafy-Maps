function(properties, context) {


	window.parent.postMessage({ identify: 'leafyMaps', content: properties.data_to_be_sent }, '*')



}