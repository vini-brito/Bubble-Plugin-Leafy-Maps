function(instance, properties, context) {

    const markerIdentifier = (element) => {

        return element.includes(properties.unique_name_to_erase)

    };
    
    let instanceKeys = Object.keys(instance.data);

    let foundMarkers = instanceKeys.filter(markerIdentifier);

	console.log(foundMarkers);
    let markersCount = foundMarkers.length;

    for (i = 0; i < markersCount; i++) {
       instance.data[`${properties.unique_name_to_erase}${i+1}`].remove();
    }

}