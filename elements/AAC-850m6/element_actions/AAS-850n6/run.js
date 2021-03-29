function(instance, properties, context) {

const polylineDecoder = function(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 6);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};

let latLngs = [];


// this returns an array holding the list of whatever bubble holds. In this case a list of numbers.
let getList = (columnXBasicReference, startPosition, finishPosition) => {	
  let returnedList = columnXBasicReference.get(startPosition, finishPosition);
   return returnedList;
	}	

// this is to load data from Bubble's server.
let listLoader = (columnBasicReference, columnLengthFunction) => {
	// grab the column array
	let acquiredListColumn = getList(columnBasicReference, 0, columnLengthFunction); 	
	// return it, whether it's a blank space or the actual list.
	return acquiredListColumn;
}


if (properties.use_encoded_shape_polyline) {
 
  latLngs = polylineDecoder(properties.encoded_shape, 6);
    
} else if (!properties.use_encoded_shape_polyline) {
    
   let listOfLatitudes = listLoader(properties.list_of_latitudes, properties.list_of_latitudes.length());
   let listOfLongitudes = listLoader(properties.list_of_longitudes, properties.list_of_longitudes.length());

   const readListsAndPush = (element, index, array) => {
 
   latLngs.push( [listOfLatitudes[index], listOfLongitudes[index] ]) ; 
    
    }

listOfLatitudes.forEach(readListsAndPush) 
    
}

let optionsObject = {
    
    color: properties.stroke_color, // stroke color  
    weight: properties.stroke_weight, // stroke width in pixels, default is 3
    opacity: properties.stroke_opacity, // default is 1.0
    lineCap: properties.line_cap, // default is "round"
    lineJoin: properties.line_join, // default is "round"

};

instance.data[`${properties.polyline_name}`] = L.polyline(latLngs, optionsObject).addTo(instance.data.mymap);


// zoom the map to the polyline

if (properties.zoom_map_to_this_line) {
    
instance.data.mymap.fitBounds(instance.data[`${properties.polyline_name}`].getBounds());
    
}

}