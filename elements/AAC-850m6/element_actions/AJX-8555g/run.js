function(instance, properties, context) {

    const geocoder = new MapboxGeocoder({
        accessToken: context.keys["Mapbox access token"],
    })

    geocoder.addTo(`#${properties.query_container}`);

    var sheet = document.createElement('style');
    sheet.innerHTML =
        `
        .mapboxgl-ctrl-geocoder {
            min-width: 100%;
            } 
            
            `;
    document.head.appendChild(sheet);

    geocoder.on('result', (e) => {
        instance.publishState("geocoded_longitude_mapbox", e.result.geometry.coordinates[0])
        instance.publishState("geocoded_latitude_mapbox", e.result.geometry.coordinates[1])
        instance.publishState("geocoded_full_name_mapbox", e.result.place_name)
        instance.publishState("geocoded_short_name_mapbox", e.result.text)

        instance.triggerEvent("coordinates_from_address_attained_from_mapbox")

    });
}