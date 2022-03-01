function(instance, properties, context) {
	let deleteVertex = instance.data.deleteVertex;
    let deleteAllVertex = instance.data.deleteAllVertex;
    
    if(properties.all){
    	deleteAllVertex();
    }else{
        deleteVertex();   
    }
}