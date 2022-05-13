function(instance, properties, context) {

    
let mapCenterLatLong = instance.data.mymap.getCenter();
        
    
instance.publishState("map_center_latitude", mapCenterLatLong.lat.toFixed(6))
instance.publishState("map_center_longitude", mapCenterLatLong.lng.toFixed(6))
    
    
instance.triggerEvent("map_center_attained")



}