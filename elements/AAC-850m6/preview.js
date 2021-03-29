function(instance, properties) {
    
    let box = $(`<div></div>`);    

    instance.canvas.append(box);
    box.css("height", properties.bubble.height)
    box.css("width", properties.bubble.width)
    box.css("background-image", "url(https://dd7tel2830j4w.cloudfront.net/f1564192295493x883459422171276200/Kazam_screenshot_00000.png)")
    box.css("background-repeat", "no-repeat")
    box.css("background-position", "center")
    
}