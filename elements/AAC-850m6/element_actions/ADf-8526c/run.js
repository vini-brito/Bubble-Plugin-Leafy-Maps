function(instance, properties, context) {
    let push_polygon_list_state = instance.data.pushPolygonListState;
    let array = JSON.parse(properties.json);
    
    array.forEach((element)=>{
        let style = {
            stroke: properties.draw_stroke, 
            color: properties.stroke_color, 
            weight: properties.stroke_weight, 
            opacity: properties.stroke_opacity, 
            lineCap: properties.line_cap, 
            lineJoin: properties.line_join,
            fill: properties.polygon_fill || true, 
            fillColor: properties.fill_color,
            fillOpacity: properties.fill_opacity || 0.5
        };
        push_polygon_list_state( L.geoJSON(element, { style: style}).addTo(instance.data.mymap));
    });
}