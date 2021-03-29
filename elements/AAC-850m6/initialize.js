
function(instance, context) {
    instance.data.polygons_list = [];
    instance.data.style = {};
    instance.data.draw_city = false;
    
    const pushPolygonListState = (element)=>{
        instance.data.polygons_list.push(element.toGeoJSON());
        instance.publishState("polygons_list", JSON.stringify(instance.data.polygons_list));
    };
  
  
    const drawPolygon = function(latLongs){
        let polygon = L.polygon(latLongs, {
            stroke: instance.data.style.draw_stroke       || true, 
            color:  instance.data.style.stroke_color      || 'black', 
            weight: instance.data.style.stroke_weight     || 1, 
            opacity: instance.data.style.stroke_opacity   || 1, 
            lineCap: instance.data.style.line_cap         || 'butt', 
            lineJoin: instance.data.style.line_join       || 'round',
            fill:      instance.data.style.polygon_fill   || true, 
            fillColor: instance.data.style.fill_color     || 'black',
            fillOpacity: instance.data.style.fill_opacity || 0.5
        });
        
        pushPolygonListState(polygon);
        return polygon.addTo(instance.data.mymap);
    }
    
    const drawCircle = function(circleCenter, radius, opacity){
        let circle = L.circle(circleCenter, radius, {
            color: 'black',
            interactive: false,
            opacity: opacity || 1
        });
        return circle.addTo(instance.data.mymap);
    }   
    
    const distanceToText = (distance, exponent)=>{
        const meterToKilometer = instance.data.meterToKilometer;
        let convertedDistance = meterToKilometer(distance, exponent);
        let textDistance = (convertedDistance > 1) ? convertedDistance + 'km' : distance.toFixed(2) + 'm';
        textDistance += (exponent==2) ? '²' : '';
        return textDistance;
    };
    
  
    const meterToKilometer = (meter, exponent) => {
        if(typeof meter != 'number') return;
        return ((meter || 0)/Math.pow(1e3, exponent || 1)).toFixed(2);
    };
  
    const drawLine = (latLongs)=>{
        let line = L.polyline(latLongs, {
            interactive: true,
            stroke:   instance.data.style.draw_stroke    || true, 
            color:    instance.data.style.stroke_color   || 'black', 
            weight:   instance.data.style.stroke_weight  || 2, 
            opacity:  instance.data.style.stroke_opacity || 1, 
            lineCap:  instance.data.style.line_cap       || 'butt', 
            lineJoin: instance.data.style.line_join      || 'round'
        });                
  
        let distancePanel = instance.data.distancePanel;
        let mymap = instance.data.mymap;
  
        line.on('mouseover', event => {
            if(!instance.data.style.show_distance){
              return;
            }
            
            distancePanel.css('display', 'block');
            let target = event.target;
            target.setStyle({
                stroke: true,  
                weight: (instance.data.style.stroke_weight || 2) + 3, 
                opacity: 1
            });
            
            distancePanel.html(`
        Line distance: ${distanceToText(target.lineDistance)}
        <br> Total distance: ${distanceToText(target.totalDistance.value)} 
        <br> Total distance until line end: ${distanceToText(target.totalLineDistance)}
      `);
        });
  
        line.on('mouseout', event => {
            if(!instance.data.style.show_distance){
              return;
            }
            if(!instance.data.drawing){
              distancePanel.css('display', 'none');   
            }
            
            
            let target = event.target;
            target.setStyle({
                interactive: true,
                stroke: instance.data.style.draw_stroke || true, 
                weight: instance.data.style.stroke_weight || 2, 
                opacity: instance.data.style.stroke_opacity || 1
            });
  
            distancePanel.html(`Total distance: ${distanceToText(target.totalDistance.value)}`);
        });
  
        return line.addTo(instance.data.mymap);
    }
     
    instance.data.drawLine = drawLine;
    instance.data.drawCircle = drawCircle;
    instance.data.drawPolygon = drawPolygon;
    instance.data.distanceToText = distanceToText;
    instance.data.meterToKilometer = meterToKilometer;
    instance.data.pushPolygonListState = pushPolygonListState;
  
  
  
  
    
  
  
      
  }