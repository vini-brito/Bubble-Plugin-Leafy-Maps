function(instance, properties, context) {


  //Load any data 
  const styled = document.createElement('style');
  styled.innerHTML = `
    .ambulance--icon {
      background-image: url(${properties.ambulance_icon});
      width: 128px;
      height: 128px;
      background-size: cover;
      background-position: center;
    }
  `;
  document.head.insertAdjacentElement('beforeend', styled);


  //Do the operation

    // console.log(L.Routing);
    // const AMBULANCE_ROUTE =  L.Routing.control({
    //   waypoints: [
    //     L.latLng(57.74, 11.94),
    //     L.latLng(57.6792, 11.949)
    //   ]
    // });
    console.log('ambulance',  instance.data.routed);

    const route = instance.data.routed[0];
    const ambulanceIcon = L.icon({
      iconUrl: properties.ambulance_icon,
      iconSize:     [32, 64], // size of the icon
      iconAnchor:   [16, 32], // point of the icon which will correspond to marker's location
    });


    const simulateAmbulanceLocation = (latlng) => {
      //copying the input array to make sure it won't change the original array
      const tempArray = [...latlng];
      const currentLocation = tempArray.shift();
      // const ambulanceMarker
      
      // console.log(currentLocation);
      instance.publishState('ambulance_location', `{lat: ${currentLocation[0]}, lng: ${currentLocation[1]}}`);
      instance.publishState('ambulance_name', properties.ambulance_name);
      instance.publishState('ambulance_icon', properties.ambulance_icon);
      if(tempArray.length) instance.publishState('ambulance_path', JSON.stringify({path: [...latlng]}));
      instance.triggerEvent('ambulance_location');


      const ambulanceMarker = new L.marker({lat: Number(currentLocation[0]), lng: Number(currentLocation[1])}, {icon: ambulanceIcon});

      ambulanceMarker.addTo(instance.data.mymap);

      setTimeout(() => {
        ambulanceMarker.removeFrom(instance.data.mymap);
        if(tempArray.length) {
          simulateAmbulanceLocation(tempArray);
        } else {
          simulateAmbulanceLocation(route.polyline);
        }
      }, 1500);
    }

    simulateAmbulanceLocation(route.polyline);

    

    // fetch(`https://router.project-osrm.org/route/v1/driving/57.74,11.94;57.679,11.949?geometries=geojson&steps=true`)
    // .then(response =>{
    //   console.log(response)
    //   return  response.json();
    // })
    // .then(json => console.log(json));

  //   AMBULANCE_ROUTE.addTo(instance.data.mymap);
  //   const ambulance = L.divIcon({className: 'ambulance--icon'});
  //   // console.log(AMBULANCE_ROUTE, AMBULANCE_ROUTE.prototype);
  // AMBULANCE_ROUTE.on('routeselected', (e) => {
  //     console.log('inside event', e,e.route.coordinates);
  //     const SIMULATE_AMBULANCE =[...e.route.coordinates];

  //     const ambulanceSimulator = (latng) => {
  //       const new_latlng = [...latng];
  //       console.log('test',latng.length );
  //       const current = new_latlng.pop();
  //       const worked = {
  //         lat: Number(current.lat.toFixed(3)),
  //         lng: Number(current.lng.toFixed(3))
  //       }
  //       // console.log('test',  );
  //       const marker = new L.marker(worked, {icon: ambulance});
  //       marker.addTo(instance.data.mymap);

  //       setTimeout(() => {
  //         marker.removeFrom(instance.data.mymap);
  //         ambulanceSimulator(new_latlng);
  //       }, 500);      

  //     }
  //     ambulanceSimulator(SIMULATE_AMBULANCE);
  // } );
  

  //   const test = () => {
  //     if(AMBULANCE_ROUTE.selectedRoute === undefined) {
  //       setTimeout(() => {
  //         test();
  //       }, 15);
  //     } else {
  //         console.log(AMBULANCE_ROUTE.selectedRoute);
  //     }
  //   }
  //   test();
}