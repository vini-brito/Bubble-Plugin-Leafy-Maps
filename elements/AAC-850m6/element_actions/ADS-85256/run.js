function(instance, properties, context) {


let calculatedDistance = instance.data.mymap.distance([properties.lat1, properties.long1], [properties.lat2, properties.long2]);

instance.publishState("calculated_distance", calculatedDistance)

//Returns the distance between two geographical coordinates according to the map's CRS. By default this measures distance in meters


}