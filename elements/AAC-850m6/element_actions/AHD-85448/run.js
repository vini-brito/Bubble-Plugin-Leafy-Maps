function(instance, properties, context) {


    //Load any data 
  
  
    const latlng = {
        lat: 50.779074512,
        lng: 6.1116600036
    }

    instance.data.USER_LOCATION = latlng;
    //Do the operation
  
    const userMark = new L.marker(latlng);

    userMark.addTo(instance.data.mymap);

    instance.data.mymap.setView(latlng, 15);

  
  }