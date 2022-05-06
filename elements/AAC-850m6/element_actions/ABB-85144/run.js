function(instance, properties, context) {

// fit
instance.data.mymap.fitBounds(instance.data[`${properties.zoomed_element_name}`].getBounds());



}