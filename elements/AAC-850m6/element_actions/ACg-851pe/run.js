function(instance, properties, context) {

let isThePointContained = instance.data[`${properties.container_element}`].getBounds().contains([properties.point_latitude, properties.point_longitude])

instance.publishState("point_is_contained", isThePointContained) 



}