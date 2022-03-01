function(instance, properties, context) {
    instance.data.show_distance = properties.show_distance;
    
    properties["stroke"]      = properties["stroke"]      || true;
    properties["color"]       = properties["color"] 	  || 'black';
    properties["weight"]      = properties["weight"]      || 1;
    properties["opacity"]     = properties["opacity"]     || 1;
    properties["lineCap"]     = properties["lineCap"]     || 'butt';
    properties["lineJoin"]    = properties["lineJoin"]    || 'round';
    properties["fill"]        = properties["fill"]        || true;
    properties["fillColor"]   = properties["fillColor"]   || 'black';
    properties["fillOpacity"] = properties["fillOpacity"] || 0.5;
    properties["interactive"] = properties["interactive"] || true;
    
    instance.data.style["polygon"] = properties;
    instance.data.style["circle"] = properties;
    instance.data.style["line"] = properties;
}