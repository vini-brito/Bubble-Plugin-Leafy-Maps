function(instance, properties, context) {

    const whichMarker = (chosenStyle) => {

        if (chosenStyle === "Blue") {
            return "//dd7tel2830j4w.cloudfront.net/f1567071044715x223496852841002400/blue_marker.png";
        } else if (chosenStyle === "Yellow") {
            return "//dd7tel2830j4w.cloudfront.net/f1567070983762x973056674738514600/yellow_marker.png";
        } else if (chosenStyle === "Green") {
            return "//dd7tel2830j4w.cloudfront.net/f1567070997768x135506561932380300/green_marker.png";
        } else if (chosenStyle === "Red") {
            return "//dd7tel2830j4w.cloudfront.net/f1567071016539x633328751974089360/red_marker.png";
        } else if (chosenStyle === "Brown") {
            return "//dd7tel2830j4w.cloudfront.net/f1567070967095x108965806592226770/brown_marker.png";
        } else if (chosenStyle === "White") {
            return "//dd7tel2830j4w.cloudfront.net/f1567071057099x762384812835195500/white_marker.png";
        } else if (chosenStyle === "Black") {
            return "//dd7tel2830j4w.cloudfront.net/f1567071031375x378002786517539900/black_marker.png";
        }

    };

    if (properties.use_custom_icon) {

        let myIcon = L.icon({
            iconUrl: `https:${properties.custom_icon_url}`,
            iconSize: [64, 64], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [32, 64], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor: [0, -64]   // point from which the popup should open relative to the iconAnchor
        });

        instance.data[`${properties.marker_name}`].setIcon(myIcon);

    } else if (!properties.use_custom_icon) {

        let myIcon = L.icon({
            iconUrl: `https:${whichMarker(properties.marker_style)}`,
            shadowUrl: "//dd7tel2830j4w.cloudfront.net/f1567070947779x803166556575223700/marker-shadow.png",
            iconSize: [25, 40],     // size of the icon
            shadowSize: [41, 41],   // size of the shadow
            iconAnchor: [12, 39],   // point of the icon which will correspond to marker's location
            shadowAnchor: [13, 40], // the same for the shadow
            popupAnchor: [0, -30]   // point from which the popup should open relative to the iconAnchor
        });

        instance.data[`${properties.marker_name}`].setIcon(myIcon);


    }

}