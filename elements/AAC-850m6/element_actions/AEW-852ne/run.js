function(instance, properties, context) {


    if (properties.unique_name) {

        //cleanses all digits and dots, so the only numbers are the ones placed by my function
        var namePurifiedFromNumbers = properties.unique_name.replace(/[0-9]|\./g, '');

    }

    // publishes the unique name of the marker when it's clicked and triggers the 'marker clicked workflow'
    // if the unique marker name is not set then the 'marker clicked workflow' isn't triggered
    function markerClicked(e) {

        if (properties.unique_name) {

            // gets all numbers placed by my function, join them into a single string then convert to an actual number type
            let numberOfThisIndex = Number(e.sourceTarget.options.listedMarkerUniqueName.match(/[0-9]/g).join(""));


            instance.publishState("marker_clicked_id", e.sourceTarget.options.listedMarkerUniqueName);
            instance.publishState("marker_clicked_index", numberOfThisIndex);

            instance.triggerEvent("marker_clicked");
        }
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
                shadowUrl: `https:${properties.custom_icon_shadow_url}`,
            });
            console.log(myIcon)

            instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data.mymap).bindPopup(popupTexts[index]).on('click', markerClicked).addTo(instance.data.mymap);

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

            instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data.mymap).bindPopup(popupTexts[index]).on('click', markerClicked).addTo(instance.data.mymap);

        } else if (!properties.popup_on_click && properties.use_custom_icon) {

            let myIcon = L.icon({
                iconUrl: `https:${properties.custom_icon_url}`,
                shadowUrl: `https:${properties.custom_icon_shadow_url}`,
            });

            instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data.mymap).on('click', markerClicked).addTo(instance.data.mymap);

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

            instance.data[`${namePurifiedFromNumbers}${index + 1}`] = L.marker([latitudes[index], longitudes[index]], { icon: myIcon, listedMarkerUniqueName: `${namePurifiedFromNumbers}${index + 1}` }).addTo(instance.data.mymap).on('click', markerClicked).addTo(instance.data.mymap);

        }

    };


    latitudes.forEach(addEachMarker);








}