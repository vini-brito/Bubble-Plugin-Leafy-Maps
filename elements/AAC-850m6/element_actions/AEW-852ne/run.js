function(instance, properties, context) {


    if (properties.unique_name) {

        //cleanses all digits and dots, so the only numbers are the ones placed by my function
        var namePurifiedFromNumbers = properties.unique_name.replace(/[0-9]|\./g, '');

    }

    if (properties.clusterize_markers && !instance.data.isMapboxGl) {
        //place this in instance data whenever I get to erase it
        let options = {

            zoomToBoundsOnClick: true,
            showCoverageOnHover: true,
            spiderfyOnMaxZoom: false,
            disableClusteringAtZoom: properties.max_zoom,

        };

        instance.data[`markerCluster${properties.unique_name}`] = L.markerClusterGroup(options).on('clusterclick', clusterClicked);

    } else if (properties.clusterize_markers && instance.data.isMapboxGl) {
        //placeholder for future MapboxGL clusters



    }



    // publishes the unique name of the marker when it's clicked and triggers the 'marker clicked workflow'
    function markerClicked(e) {

        // gets all numbers placed by my function, join them into a single string then convert to an actual number type
        let numberOfThisIndex = Number(e.sourceTarget.options.listedMarkerUniqueName.match(/[0-9]/g).join(""));


        instance.publishState("marker_clicked_id", e.sourceTarget.options.listedMarkerUniqueName);
        instance.publishState("marker_clicked_index", numberOfThisIndex);

        instance.triggerEvent("marker_clicked");

    }

    function markerHovered(e) {

        // gets all numbers placed by my function, join them into a single string then convert to an actual number type
        let numberOfThisIndex = Number(e.sourceTarget.options.listedMarkerUniqueName.match(/[0-9]/g).join(""));

        instance.publishState("marker_hovered_id", e.sourceTarget.options.listedMarkerUniqueName);
        instance.publishState("marker_hovered_index", numberOfThisIndex);

        instance.triggerEvent("marker_hovered");

    }


    function markerUnHovered(e) {

        // gets all numbers placed by my function, join them into a single string then convert to an actual number type
        let numberOfThisIndex = Number(e.sourceTarget.options.listedMarkerUniqueName.match(/[0-9]/g).join(""));

        instance.publishState("marker_unhovered_id", e.sourceTarget.options.listedMarkerUniqueName);
        instance.publishState("marker_unhovered_index", numberOfThisIndex);

        instance.triggerEvent("marker_unhovered");

    }


    function clusterClicked(e) {

        let nameOfMarkersInsideCluster = e.layer.getAllChildMarkers().map(markerObj => markerObj.options.listedMarkerUniqueName);


        instance.publishState("cluster_clicked_marker_ids", nameOfMarkersInsideCluster);

        instance.triggerEvent("cluster_clicked");

    }



    // this returns an array holding the list of texts (strings), booleans (yes/no) and integers (decimals and numbers)
    const getList = (thingWithList, startPosition, finishPosition) => {
        let returnedList = thingWithList.get(startPosition, finishPosition);
        return returnedList;
    }

    let latitudes = getList(properties[`list_of_latitudes`], 0, properties[`list_of_latitudes`].length());
    let longitudes = getList(properties[`list_of_longitudes`], 0, properties[`list_of_longitudes`].length());

    if (typeof properties[`list_of_popup_texts`] !== "undefined" && properties[`list_of_popup_texts`] !== null) {

        var popupTexts = getList(properties[`list_of_popup_texts`], 0, properties[`list_of_popup_texts`].length());

    }

    const whichMarker = (chosenStyle) => {

        if (chosenStyle === "Blue") {
            return "//dd7tel2830j4w.cloudfront.net/f1564171493719x438702278353580350/blue_marker.png";
        } else if (chosenStyle === "Yellow") {
            return "//dd7tel2830j4w.cloudfront.net/f1564170374547x229722995590253600/yellow_marker.png";
        } else if (chosenStyle === "Green") {
            return "//dd7tel2830j4w.cloudfront.net/f1564170384003x782559689703375100/green_marker.png";
        } else if (chosenStyle === "Red") {
            return "//dd7tel2830j4w.cloudfront.net/f1564170393314x384017959683047300/red_marker.png";
        } else if (chosenStyle === "Brown") {
            return "//dd7tel2830j4w.cloudfront.net/f1564170365919x415802668829707840/brown_marker.png";
        } else if (chosenStyle === "White") {
            return "//dd7tel2830j4w.cloudfront.net/f1564178688812x132572725832933660/white_marker.png";
        } else if (chosenStyle === "Black") {
            return "//dd7tel2830j4w.cloudfront.net/f1564170401815x674587151186880900/black_marker.png";
        }

    };



    const addEachMarker = (currentValue, index) => {


        if (properties.popup_on_click && properties.use_custom_icon) {

            let myIcon = L.icon({
                iconUrl: `https:${properties.custom_icon_url}`,
                iconSize: [64, 64], // size of the icon
                shadowSize: [50, 64], // size of the shadow
                iconAnchor: [32, 64], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor: [0, -64]   // point from which the popup should open relative to the iconAnchor

            });

            if (properties.clusterize_markers) {

                instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data[`markerCluster${properties.unique_name}`]).bindPopup(popupTexts[index]).on('click', markerClicked).on('mouseover', markerHovered).on('mouseout', markerUnHovered);


            } else {

                instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data.mymap).bindPopup(popupTexts[index]).on('click', markerClicked).on('mouseover', markerHovered).on('mouseout', markerUnHovered);

            }

        } else if (properties.popup_on_click && !properties.use_custom_icon) {

            let myIcon = L.icon({
                iconUrl: `https:${whichMarker(properties.marker_style)}`,
                shadowUrl: "https://dd7tel2830j4w.cloudfront.net/f1564167608320x554071841235934900/marker-shadow.png",
                iconSize: [25, 40], // size of the icon
                shadowSize: [41, 41], // size of the shadow
                iconAnchor: [12, 39], // point of the icon which will correspond to marker's location
                shadowAnchor: [13, 40],  // the same for the shadow
                popupAnchor: [0, -30] // point from which the popup should open relative to the iconAnchor
            });

            if (properties.clusterize_markers) {

                instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data[`markerCluster${properties.unique_name}`]).bindPopup(popupTexts[index]).on('click', markerClicked).on('mouseover', markerHovered).on('mouseout', markerUnHovered);

            } else {

                instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data.mymap).bindPopup(popupTexts[index]).on('click', markerClicked).on('mouseover', markerHovered).on('mouseout', markerUnHovered);

            }

        } else if (!properties.popup_on_click && properties.use_custom_icon) {

            let myIcon = L.icon({
                iconUrl: `https:${properties.custom_icon_url}`,
                iconSize: [64, 64], // size of the icon
                shadowSize: [50, 64], // size of the shadow
                iconAnchor: [32, 64], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor: [0, -64]   // point from which the popup should open relative to the iconAnchor

            });

            if (properties.clusterize_markers) {

                instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data[`markerCluster${properties.unique_name}`]).on('click', markerClicked).on('mouseover', markerHovered).on('mouseout', markerUnHovered);

            } else {

                instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data.mymap).on('click', markerClicked).on('mouseover', markerHovered).on('mouseout', markerUnHovered);

            }

        } else if (!properties.popup_on_click && !properties.use_custom_icon) {

            let myIcon = L.icon({
                iconUrl: `https:${whichMarker(properties.marker_style)}`,
                shadowUrl: "https://dd7tel2830j4w.cloudfront.net/f1564167608320x554071841235934900/marker-shadow.png",
                iconSize: [25, 40], // size of the icon
                shadowSize: [41, 41], // size of the shadow
                iconAnchor: [12, 39], // point of the icon which will correspond to marker's location
                shadowAnchor: [13, 40],  // the same for the shadow
                popupAnchor: [0, -30] // point from which the popup should open relative to the iconAnchor
            });

            if (properties.clusterize_markers) {

                instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data[`markerCluster${properties.unique_name}`]).on('click', markerClicked).on('mouseover', markerHovered).on('mouseout', markerUnHovered);

            } else {

                instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data.mymap).on('click', markerClicked).on('mouseover', markerHovered).on('mouseout', markerUnHovered);

            }

        }

    };


    latitudes.forEach(addEachMarker);




    if (properties.clusterize_markers) {


        var sheetForClusterStyle = document.createElement('style');
        sheetForClusterStyle.innerHTML =
            `.marker-cluster-small {
                background-color: ${properties.small_cluster_color_out} !important;
                }
            .marker-cluster-small div {
                background-color: ${properties.small_cluster_color_in} !important;
                }
            
            .marker-cluster-medium {
                background-color: ${properties.medium_cluster_color_out} !important;
                }
            .marker-cluster-medium div {
                background-color: ${properties.medium_cluster_color_in} !important;
                }
            
            .marker-cluster-large {
                background-color: ${properties.large_cluster_color_out} !important;
                }
            .marker-cluster-large div {
                background-color: ${properties.large_cluster_color_in} !important;
                }
            
            .marker-cluster div {
            
                font: ${properties.font_size}px "${properties.font_name}", Arial, Helvetica, sans-serif !important;
                color: ${properties.font_color} !important;
            
                }`;

        document.head.appendChild(sheetForClusterStyle);


        instance.data[`markerCluster${properties.unique_name}`].addTo(instance.data.mymap);
    }


}