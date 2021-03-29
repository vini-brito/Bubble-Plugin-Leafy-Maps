function(instance, properties, context) {

  instance.data[`${properties.circle_name}`].setRadius(properties.new_radius)

  // zoom the map to the polygon

  if (properties.zoom_to_this_circle) {

    instance.data.mymap.fitBounds(instance.data[`${properties.circle_name}`].getBounds());

  }


}
