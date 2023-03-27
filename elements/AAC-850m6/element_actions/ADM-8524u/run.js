function(instance, properties, context) {

let zoomPanOptions = {

    duration: properties.duration,
    easeLinearity: properties.easeLinearity,

};

instance.data.mymap.flyTo([properties.latitude, properties.longitude], properties.zoom, zoomPanOptions)

}