function(instance, properties, context) {   
	const DRAW = createDrawingInstance(instance, properties, instance.data.mymap, instance.data.DISTANCE_PANEL);
	const styleOptions = {
		stroke: properties.draw_stroke, 
		color: properties.stroke_color,
		weight: properties.stroke_weight, 
		opacity: properties.stroke_opacity, 
		lineCap: properties.line_cap, 
		lineJoin: properties.line_join, 
		fill: properties.polygon_fill,
		fillColor: properties.fill_color, 
		fillOpacity: properties.fill_opacity
	}
	
	let listOfZones = loadAllBubbleList(properties.list_of_zones);
	let parsedJSON;
	
	try{
		parsedJSON = JSON.parse(properties.json);
	}catch{
		context.reportDebugger("Invalid json format!");
		return;
	}

	let lastIndex = "";
	if(isGeoJSON(parsedJSON)){
		let geoJSON = parsedJSON;
		let coordinates = geoJSON.geometry.coordinates[0];
		instance.data[`${properties.polygon_name || "polygon"}`] = drawPolygon(coordinates);
	}else if(isArrayOfGeoJSONs(parsedJSON)){
		let arrayOfGeoJSONs = parsedJSON;
		for(let i = 0; i < arrayOfGeoJSONs.length; i++){
			lastIndex = "_" + (i+1);
			let coordinates = arrayOfGeoJSONs[i].geometry.coordinates[0];
			let polygon = drawPolygon(coordinates);
			let polygonId = `${properties.polygon_name || "polygon"}_${(i+1)}`
			
			polygon.zone = listOfZones[i] || "";
			instance.data[polygonId] = polygon; 
		}
	}else if(isMatrixOfCoordinates(parsedJSON)){
		let matrixOfCorrdinates = parsedJSON;
		for(let i = 0; i < matrixOfCorrdinates.length; i++){
			lastIndex = "_" + (i+1);
			let coordinates = matrixOfCorrdinates[i];
			let polygon = drawPolygon(coordinates);
			let polygonId = `${properties.polygon_name || "polygon"}_${(i+1)}`
			
			polygon.zone = listOfZones[i] || "";
			instance.data[polygonId] = polygon; 
		}
	}else{
		context.reportDebugger("Format not supported!");
		return;
	}

	if (properties.zoom_map_to_this_polygon) {
		instance.data.mymap.fitBounds(instance.data[`${properties.polygon_name || "polygon"}${lastIndex}`].getBounds());
	} 


	//Functions
	function drawPolygon(coordinates){
		let revertedCoordinates = revertCoodinates(coordinates);
		return DRAW.drawPolygon({coordinates: revertedCoordinates, showArea: properties.show_footage, showLineDistance: properties.show_footage, showDistance : properties.show_footage, style: styleOptions}).bringToBack();
	}
	function swapArrayItem(array, i, j){
		let arrayClone = JSON.parse(JSON.stringify(array));
		let aux = arrayClone[i];
		arrayClone[i] = array[j];
		arrayClone[j] = aux;
		return arrayClone;
	}
	function revertCoodinates(arrayOfCoordinates){
		let arrayOfCoordinatesClone = JSON.parse(JSON.stringify(arrayOfCoordinates));
		for(let i = 0; i < arrayOfCoordinatesClone.length; i++){
			let coordinate = arrayOfCoordinatesClone[i];
			arrayOfCoordinatesClone[i] = swapArrayItem(coordinate, 0, 1);
		}
		return arrayOfCoordinatesClone;
	}

	//Test functions
	function isGeoJSON(field){
		return isObject(field) && hasGeometryCoordinates(field) && isMatrixOfCoordinates(field.geometry.coordinates);
	}
	function isArrayOfGeoJSONs(field){
		return isArray(field) && isGeoJSON(field[0]);
	}
	function isMatrixOfCoordinates(fields){
		return isArray(fields) && isArray(fields[0]) && isCoordinates(fields[0][0]);
	}
	//Test aux functions
	function hasGeometryCoordinates(field){
		return !!field && !!field.geometry && !!field.geometry.coordinates;
	}
	function isCoordinates(field){
		return isArray(field) && isNumber(field[0]) && isNumber(field[1]);
	}
	function isObject(field){
		return field && typeof field === "object" && !isArray(field);
	}
	function isArray(field){
		return Array.isArray(field || {});
	}
	function isNumber(field){
		return field && typeof field === "number";
	}
}