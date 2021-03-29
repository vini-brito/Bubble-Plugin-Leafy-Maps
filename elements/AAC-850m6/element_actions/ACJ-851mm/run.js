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
		latLngs.push([listOfLatitudes[index], listOfLongitudes[index]]);
	}

	listOfLatitudes.forEach(readListsAndPush)

	// now to create the object in the format Stadia API wants.
	let takeThisStadia = {
		locations: [],
		costing: properties.costing_model,
		directions_options: { "units": properties.units }
	};

	// now to create the objects that each will represent a point of the route and shove into "locations" property
	const createAndPushObj = (element, index, array) => {

		// get last item number in array
		var last = array.length - 1
        var pushMe;

		if (index === last || index === 0) {
			pushMe = {
				lat: element[0],
				lon: element[1],
				type: "break"
			};
		} else {
			pushMe = {
				lat: element[0],
				lon: element[1],
				type: "through"
			};
		}

		takeThisStadia.locations.push(pushMe);

	}

	latLngs.forEach(createAndPushObj);

	// then to stringify it and publish to a state so the user can access this string in the next workflow actions
	instance.publishState("stadia_route_request_body", JSON.stringify(takeThisStadia))

}