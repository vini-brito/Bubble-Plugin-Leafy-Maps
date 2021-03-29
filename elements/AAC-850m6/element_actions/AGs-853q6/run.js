function(instance, properties, context) {


    //Load any data 
  
  
  
    //Do the operation
    const latlng = {
      lat: 42,
      lng: 14
    };
      // console.log(instance.data.mymap);

      const newIcon = L.divIcon({className: 'icon--div'})

      const customPopup = new L.popup({
        className: 'nametest',
        offset: L.point(0,-5)
      }).setContent(`<div>
      <div class="img--container" style="background-image: url(https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Cannery_District_Pizza_Campania_Exterior.jpg/800px-Cannery_District_Pizza_Campania_Exterior.jpg);
        height: 125px; background-size: cover; background-position: center; border-top-left-radius: 12px;border-top-right-radius: 12px;">  

      
      </div>  
      <div style="padding: 8px; text-align: center;">
      <p>Pizza Campania</p>
      <p>Lorem ipsum lorem</p>
        </div>
      </div>`)
      .setLatLng(latlng);

      const marker = new L.marker(latlng, {icon: newIcon}).bindPopup(customPopup).openPopup();
      marker.on('mouseover', function(e) {
        this.openPopup();
        console.log('hovered', e);
      });
      marker.addTo(instance.data.mymap);
      instance.data.mymap.setZoom(6);
      instance.data.mymap.panTo(latlng);
    
  }