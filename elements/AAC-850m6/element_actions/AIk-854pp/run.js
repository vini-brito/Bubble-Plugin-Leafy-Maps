function(instance, properties, context) {
    instance.data.isThePointContained = false;
    instance.publishState("point_is_contained_polygon",  false);
    
    
    let map = instance.data.mymap;
    let isPointInsidePolygon = (x, y, poly) => {
        let inside = false;
        
        for (var ii=0;ii<poly.getLatLngs().length;ii++){
            var polyPoints = poly.getLatLngs()[ii];
            for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
                var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
                var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

                var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
        }

        return inside;
    };
    
    for(let id in map._layers){
        let layer = map._layers[id];
        if(!(layer instanceof L.Polygon)) continue;
        
        let polygon = layer; 
        instance.data.isThePointContained = isPointInsidePolygon(properties.point_latitude, properties.point_longitude, polygon);

        if(instance.data.isThePointContained) {           
            instance.publishState("point_is_contained_polygon",  instance.data.isThePointContained);
            instance.publishState("which_zone_is_the_point_contained_in", polygon.zone);
            instance.triggerEvent("user_location_is_inside_area");
            return;
        }
    }
    
    instance.publishState("point_is_contained_polygon",  false);
    instance.publishState("which_zone_is_the_point_contained_in", "");
    instance.triggerEvent("user_location_is_outside_area");
}