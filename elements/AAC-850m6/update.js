function(instance, properties, context) {
    const now = Date.now();
	// console.log(properties);
    const { name_field, path_field, location_field, icon_field } = properties;
    if(properties.load_ambulance_routes && name_field && path_field && location_field && icon_field ) {

        function toRadian(degree) {
            return degree*Math.PI/180;
        }

        function getDistance(origin, destination) {
            // return distance in meters
            var lon1 = toRadian(origin[1]),
                lat1 = toRadian(origin[0]),
                lon2 = toRadian(destination[1]),
                lat2 = toRadian(destination[0]);
        
            var deltaLat = lat2 - lat1;
            var deltaLon = lon2 - lon1;
        
            var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
            var c = 2 * Math.asin(Math.sqrt(a));
            var EARTH_RADIUS = 6371;
            return c * EARTH_RADIUS * 1000;
        }



        if (instance.data.updateCleanup) instance.data.updateCleanup();
        // console.log('test');
        if (instance.data.ambulancesToTrack === undefined) instance.data.ambulancesToTrack = [];
        // console.log(properties);

        const source  = properties.emergency_table;
        // const listedProperties = source.get(0, 1)[0].listProperties();
        // const amb_list = source.get(0, source.length());
        const uniqueAmbulances = [];
        const ambulanceNames = [];

        // amb_list.for
        source.get(source.length() - 2, source.length()).forEach((ambulance) => {
            const unique_name = ambulance.get(name_field);
            const ambulance_path = JSON.parse(ambulance.get(path_field));
            const ambulance_location = {
                lat: Number(ambulance.get(location_field).replace(/(.*?)lat: (.*?),(.*)/gm, '$2')),
                lng: Number( ambulance.get(location_field).replace(/(.*?)lng: (.*?)}/gm, '$2'))
            };
            const ambulance_icon = ambulance.get(icon_field);
            const created_time = ambulance.get('Created Date').getTime();
            // console.log(ambulance.get('Created Date').getTime());

            const renderOrNot = true;

            if (ambulanceNames.indexOf(unique_name) === -1) {
                if(renderOrNot) ambulanceNames.push(unique_name);
                if(renderOrNot) uniqueAmbulances.push({
                    name: unique_name,
                    path: ambulance_path,
                    location: ambulance_location,
                    icon: ambulance_icon,
                    created: created_time
                });
            } else {
                const index = ambulanceNames.indexOf(unique_name);
                if (uniqueAmbulances[index].created < created_time) {
                    uniqueAmbulances[index] = {
                        name: unique_name,
                        path: ambulance_path.path,
                        location: ambulance_location,
                        icon: ambulance_icon,
                        created: created_time
                    }
                }
            }

            // console.log(unique_name,
            //     ambulance_path,
            //     ambulance_location,
            //     ambulance_icon);
        });

        

        const ambulanceMarker = uniqueAmbulances.map((amb) => {

            const icon = L.icon({
                iconUrl: amb.icon,
                iconSize:     [32, 64], // size of the icon
                iconAnchor:   [16, 32], // point of the icon which will correspond to marker's location})
            });
            const marker = new L.marker(amb.location, {icon});

            
        if (instance.data.USER_LOCATION) {
            const distance = getDistance([instance.data.USER_LOCATION.lat, instance.data.USER_LOCATION.lng], [amb.location.lat, amb.location.lng]);
            console.log(`distance of ${amb.name} ambulance is ${distance}`);

            instance.publishState('ambulance_is_close', distance < 500);
        }

            marker.addTo(instance.data.mymap);
            const polyline = L.polyline(amb.path, {color: 'red'});

            polyline.addTo(instance.data.mymap);

            return {marker, polyline};
        });

        instance.data.updateCleanup = () => {
            ambulanceMarker.forEach(el => {
                el.marker.removeFrom(instance.data.mymap);
                el.polyline.removeFrom(instance.data.mymap);
            });
        }


        // console.log(listedProperties, amb_list);
    }
}