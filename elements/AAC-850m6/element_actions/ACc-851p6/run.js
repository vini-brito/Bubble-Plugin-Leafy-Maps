function(instance, properties, context) {


    if (typeof instance.data[`${properties.target_element}`] !== "undefined") {

        instance.data[`${properties.target_element}`].remove()


    }

}