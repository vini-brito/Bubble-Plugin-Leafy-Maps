function(instance, properties, context) {

	instance.canvas.attr("id", "mapid");   // writes to the jquery object property called "id", assigning a value of "mapid"

	instance.data.mymap = L.map('mapid').setView([properties.initial_view_latitude, properties.initial_view_longitude], properties.zoom_level);

	if (properties.tile_provider === "Mapbox") {

		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>',
			maxZoom: 20,
			id: `mapbox.${properties.mapbox_tile}`,
			accessToken: context.keys["Mapbox access token"]
		}).addTo(instance.data.mymap);

	}

	if (properties.tile_provider === "Stadia") {

		const chosenStadiaTile = (descriptionOnDropDownStadia) => {

			if (descriptionOnDropDownStadia === "Alidade Smooth") {
				return "alidade_smooth";
			}

			else if (descriptionOnDropDownStadia === "Alidade Smooth Dark") {
				return "alidade_smooth_dark";
			}

			else if (descriptionOnDropDownStadia === "Outdoors") {
				return "outdoors";
			}

			else if (descriptionOnDropDownStadia === "OSM Bright") {
				return "osm_bright";
			}

		}

		L.tileLayer('https://tiles.stadiamaps.com/tiles/{op}/{z}/{x}/{y}{r}.png', {
			maxZoom: 20,
			op: chosenStadiaTile(properties.stadia_tile),
			attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>',
		}).addTo(instance.data.mymap);

	}

	const userLocated = (e) => {

		// publishes the data passed by the locate event to the Element states.

		instance.publishState("user_latitude", e.latlng.lat)
		instance.publishState("user_longitude", e.latlng.lng)
		instance.publishState("user_bounds_northeast_latitude", e.bounds._northEast.lat)
		instance.publishState("user_bounds_northeast_longitude", e.bounds._northEast.lng)
		instance.publishState("user_bounds_southwest_latitude", e.bounds._southWest.lat)
		instance.publishState("user_bounds_southwest_longitude", e.bounds._southWest.lng)
		instance.publishState("accuracy", e.accuracy)
		instance.publishState("altitude", e.altitude)
		instance.publishState("altitude_accuracy", e.altitudeAccuracy)
		instance.publishState("heading", e.heading)
		instance.publishState("speed", e.speed)
		instance.publishState("timestamp", e.timestamp)
        instance.publishState("speed_kph", e.speed * 3.6)
        instance.publishState("speed_mph", e.speed * 2.2369)

		// trigger the Bubble event so the app maker can know everything was published and he/she can do some workflow based on this.
		instance.triggerEvent("location_found");

	}

	const onLocationError = (e) => {
		instance.triggerEvent("location_error");
	}


	instance.data.mymap.on("locationfound", userLocated);
	instance.data.mymap.on('locationerror', onLocationError);
    
    
    // publishes map center coordinates to element states
    instance.data.mymap.on("moveend", function () {
        instance.publishState("map_center_latitude", this.getCenter().lat);
        instance.publishState("map_center_longitude", this.getCenter().lng);
	});
    
    // show the compass
    if (properties.show_compass) {
        
        // vini, see this fiddle - https://jsfiddle.net/pork1977/bfwx46ov/1/
        
        // I created it and if you use the Leafy map Heading value which becomes available after the track user action runs
        // then the needle should point to the heading value (which is degrees always from north)
        // no idea where to start though, it will be my next little thing to add I suspect
        
        // when this line changes, the value from 100 to whatever then the needle moves:
        //   $('input').attr('value', 100);
        
    }
    
    
    
    
    
    
    
    
    
    
    

}