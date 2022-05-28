function(instance, properties, context) {


  let isPointInsideCircle = window.geolib.isPointWithinRadius(
        {latitude: properties.point_to_be_checked_latitude, longitude: properties.point_to_be_checked_longitude},
        {latitude: properties.circle_center_latitude, longitude: properties.circle_center_longitude},
        properties.circle_radius
    );

    instance.publishState("point_inside_circle", isPointInsideCircle);
    instance.triggerEvent("point_inside_circle_radius_checked");
    
    
    }