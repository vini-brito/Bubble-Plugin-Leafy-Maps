function(instance, properties, context) {
  
    
const isItOne = (overlayName) => {
 
    let oneStrings = ["Clouds","Precipitation","Sea level pressure","Wind speed","Temperature"];
    return oneStrings.includes(overlayName) 
    
}
    
let isItApiOne = isItOne(properties.overlay_name);    
    
    
    
    
    
    
if (properties.openweathermap_tile || (properties.overlay_name && isItApiOne === false))  {  
    
    

const chosenOwmTile = (descriptionOnDropDown, overlayName) => {
    
   if (overlayName) {
       
        if (overlayName === "Convective precipitation (mm)")  {
        return "PAC0";    
    }
    
   else if (overlayName === "Precipitation intensity (mm/s)")  {
        return "PR0";    
    }
    
   else if (overlayName === "Accumulated precipitation (mm)")  {
        return "PA0";    
    }
    
   else if (overlayName === "Accumulated precipitation - rain (mm)")  {
        return "PAR0";    
    }
    
   else if (overlayName === "Accumulated precipitation - snow (m)")  {
        return "PAS0";    
    }
    
   else if (overlayName === "Depth of snow (m)")  {
        return "SD0";    
    }  
    
   else if (overlayName === "Wind speed at an altitude of 10 meters (m/s)")  {
        return "WS10";    
    }
    
   else if (overlayName === "Joint display of speed wind (color) and wind direction (arrows) received by U and V components (m/s)")  {
        return "WND";    
    }
    
   else if (overlayName === "Atmospheric pressure on mean sea level (hPa)")  {
        return "APM";    
    }
    
   else if (overlayName === "Air temperature at a height of 2 meters (°C)")  {
        return "TA2";    
    }
    
   else if (overlayName === "Temperature of a dew point (°C)")  {
        return "TD2";    
    }
    
   else if (overlayName === "Soil temperature 0-10 сm (K)")  {
        return "TS0";    
    }
    
   else if (overlayName === "Soil temperature >10 сm (K)")  {
        return "TS10";    
    }
    
   else if (overlayName === "Relative humidity (%)")  {
        return "HRD0";    
    }
    
   else if (overlayName === "Cloudiness (%)")  {
        return "CL";    
    }
       
   } else if (descriptionOnDropDown === "Convective precipitation (mm)")  {
        return "PAC0";    
    }
    
   else if (descriptionOnDropDown === "Precipitation intensity (mm/s)")  {
        return "PR0";    
    }
    
   else if (descriptionOnDropDown === "Accumulated precipitation (mm)")  {
        return "PA0";    
    }
    
   else if (descriptionOnDropDown === "Accumulated precipitation - rain (mm)")  {
        return "PAR0";    
    }
    
   else if (descriptionOnDropDown === "Accumulated precipitation - snow (m)")  {
        return "PAS0";    
    }
    
   else if (descriptionOnDropDown === "Depth of snow (m)")  {
        return "SD0";    
    }  
    
   else if (descriptionOnDropDown === "Wind speed at an altitude of 10 meters (m/s)")  {
        return "WS10";    
    }
    
   else if (descriptionOnDropDown === "Joint display of speed wind (color) and wind direction (arrows) received by U and V components (m/s)")  {
        return "WND";    
    }
    
   else if (descriptionOnDropDown === "Atmospheric pressure on mean sea level (hPa)")  {
        return "APM";    
    }
    
   else if (descriptionOnDropDown === "Air temperature at a height of 2 meters (°C)")  {
        return "TA2";    
    }
    
   else if (descriptionOnDropDown === "Temperature of a dew point (°C)")  {
        return "TD2";    
    }
    
   else if (descriptionOnDropDown === "Soil temperature 0-10 сm (K)")  {
        return "TS0";    
    }
    
   else if (descriptionOnDropDown === "Soil temperature >10 сm (K)")  {
        return "TS10";    
    }
    
   else if (descriptionOnDropDown === "Relative humidity (%)")  {
        return "HRD0";    
    }
    
   else if (descriptionOnDropDown === "Cloudiness (%)")  {
        return "CL";    
    }   
  
}
    

let reqLayer = chosenOwmTile(properties.openweathermap_tile, properties.overlay_name);    
    
instance.data[`${properties.unique_name_for_this_overlay}`] = L.tileLayer('http://maps.openweathermap.org/maps/2.0/weather/{op}/{z}/{x}/{y}?date={date_requested}&appid={api_key}', {
    attribution: '&copy; <a href="https://openweathermap.org">Openweather</a>',
    maxZoom: 20,
    op: reqLayer,
    date_requested: Math.floor(properties.requested_date / 1000),
    api_key: context.keys["Openweathermap API key"],
    
}).addTo(instance.data.mymap);   

} else if (properties.openweather_tile || (properties.overlay_name && isItApiOne === true)) {
    
    const chosenOwmTile = (descriptionOnDropDown, overlayName) => { 
    
   if (descriptionOnDropDown === "Clouds" || overlayName === "Clouds")  {
        return "clouds_new";    
    }
    
   else if (descriptionOnDropDown === "Precipitation" || overlayName === "Precipitation")  {
        return "precipitation_new";    
    }
    
   else if (descriptionOnDropDown === "Sea level pressure" || overlayName === "Sea level pressure")  {
        return "pressure_new";    
    }
    
   else if (descriptionOnDropDown === "Wind speed" || overlayName === "Wind speed")  {
        return "wind_new";    
    }
    
   else if (descriptionOnDropDown === "Temperature" || overlayName === "Temperature")  {
        return "temp_new";    
    }
  
}
    
let reqLayer = chosenOwmTile(properties.openweathermap_tile, properties.overlay_name);   
    
instance.data[`${properties.unique_name_for_this_overlay}`] = L.tileLayer('https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={api_key}', {
    attribution: '&copy; <a href="https://openweathermap.org">Openweather</a>',
    maxZoom: 20,
    layer: reqLayer,
    api_key: context.keys["Openweathermap API key"],
    
}).addTo(instance.data.mymap); 
    
    
    
    
    
    
    
    
}
    
    
    
    
    
    
    
    
    
}