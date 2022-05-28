function(instance, properties, context) {


  let optionsObject = {

    stroke: properties.draw_stroke, // use stroke or not
    color: properties.stroke_color, // stroke color
    weight: properties.stroke_weight, // stroke width in pixels, default is 3
    opacity: properties.stroke_opacity, // default is 1.0
    fill: properties.circle_fill, // enable or disable filling
    fillColor: properties.fill_color, // color string
    fillOpacity: properties.fill_opacity, // default is 0.2
    radius: properties.radius, // number, in meters
    
  }

  instance.data[`${properties.circle_name}`] = L.circle(instance.data.mymap.getCenter(), optionsObject).addTo(instance.data.mymap);


  // zoom the map to the polygon

  instance.data.mymap.fitBounds(instance.data[`${properties.circle_name}`].getBounds());



  instance.data.mymap.on('move', function (e) {

    instance.data[`${properties.circle_name}`].setLatLng(instance.data.mymap.getCenter());

  });



}