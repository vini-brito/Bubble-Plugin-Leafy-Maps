function(instance, properties, context) {

let optionsObject = {
    watch: properties.watch,
    setView: properties.view,
    maxZoom: 20,
    timeout: 10000,
    maximumAge: 0,
    enableHighAccuracy: properties.high_accuracy
    
};

instance.data.mymap.locate(optionsObject)

}