function(instance, properties, context) {


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


let listOfLatitudes = listLoader(properties.list_of_latitudes, properties.list_of_latitudes.length());
let listOfLongitudes = listLoader(properties.list_of_longitudes, properties.list_of_longitudes.length());

// this structures the coordinates arrays into a way that Leaflet understands.
const readListsAndPush = (element, index, array) => {
 
   latLngs.push( [listOfLatitudes[index], listOfLongitudes[index] ]) ; 
    
}

listOfLatitudes.forEach(readListsAndPush)



let optionsObject = {
    stroke: properties.draw_stroke, // use stroke or not   
    color: properties.stroke_color, // stroke color  
    weight: properties.stroke_weight, // stroke width in pixels, default is 3
    opacity: properties.stroke_opacity, // default is 1.0
    lineCap: properties.line_cap, // default is "round"
    lineJoin: properties.line_join, // default is "round"
    fill: properties.polygon_fill, // enable or disable filling
    fillColor: properties.fill_color, // color string
    fillOpacity: properties.fill_opacity // default is 0.2
}

instance.data[`${properties.polygon_name}`] = L.polygon(latLngs, optionsObject).addTo(instance.data.mymap);




// zoom the map to the polygon

if (properties.zoom_map_to_this_polygon) {
    
instance.data.mymap.fitBounds(instance.data[`${properties.polygon_name}`].getBounds());
    
	}
    
}    