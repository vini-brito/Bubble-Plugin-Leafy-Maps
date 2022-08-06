function(instance, properties, context) {

    const markerIdentifier = (element) => {

        return element.includes(properties.unique_name_to_erase)

    };

    if (
        typeof instance.data[`markerCluster${properties.unique_name_to_erase}`] !== "undefined" &&
        instance.data[`markerCluster${properties.unique_name_to_erase}`] !== null
    ) {

        instance.data[`markerCluster${properties.unique_name_to_erase}`].remove()
        
        delete instance.data[`markerCluster${properties.unique_name_to_erase}`]

    }

    let instanceKeys = Object.keys(instance.data);


    let foundMarkers = instanceKeys.filter(markerIdentifier);


    let markersCount = foundMarkers.length;


    console.log(foundMarkers)

    for (i = 0; i < markersCount; i++) {

        instance.data[`${properties.unique_name_to_erase}${i + 1}`].remove()

    }



}