function(instance, properties, context) {

 const loadAllBubbleList = function(list){
   if(!list) return [];
   if(typeof list.get !== "function") return [];
   if(typeof list.length !== "function") return [];
   return list.get(0, list.length());
};
    
   let listBubbleObject = loadAllBubbleList(properties.data_source)
    
    for(let i=0; i < listBubbleObject.length; i++) {
        let listObjectLatitudeField = listBubbleObject[i].get(properties.latitude);
        let listOfLatitudes = loadAllBubbleList(listObjectLatitudeField);
        
        let listObjectLogintudeField = listBubbleObject[i].get(properties.longitude)
        let listOfLongitudes = loadAllBubbleList(listObjectLogintudeField);

        let latLong = [];
        for(let pos = 0; pos < listOfLatitudes.length; pos++) {
         latLong.push([listOfLatitudes[pos],listOfLongitudes[pos]]);            
     }
           
         //let coordinates = [];       
      
          //  for(let i = 0; i < latLong.length; i++){       
           // let aux = latLong[i][0];
             
           // latLong[i][0] = latLong[i][1];
           // latLong[i][1] = aux;
        // } 
           instance.data[`${properties.polygon_class_name}${i+1}`]  = L.polygon(latLong).addTo(instance.data.mymap);
    }
    

}