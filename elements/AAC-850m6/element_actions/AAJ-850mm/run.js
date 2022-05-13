function(instance, properties, context) {
    // console.log(navigator.userAgent); 
    const MAC_DETECTOR = new RegExp(/Macintosh/);
    const IS_MAC = MAC_DETECTOR.test(navigator.userAgent);
    instance.data.DRAW_TOGGLE = false;

    let CITY_AREAS = [];
    // let CITY_NAMES = [];
    // console.log('is mac: ' + IS_MAC);

    instance.data.SAVED_POLYLINE = [];


    const mapid = properties.unique_map_name
    instance.canvas.empty()
    instance.canvas.attr("id", mapid);   // writes to the jquery object a property called "id", assigning a value of "mapid"

    const { tp_color, tp_bg, border_color, border_radius } = properties;
    if (instance.data.custom_style) [...document.getElementsByTagName('style')].forEach(el => el.innerHTML === instance.data.custom_style ? el.remove : null)
    instance.data.custom_style = document.createElement('style');

    const TOOLTIP_CLASS = mapid + 'tool';
    instance.data.custom_style.innerHTML = `
        .${TOOLTIP_CLASS} {
          color: ${tp_color};
          background-color: ${tp_bg};
          border-radius: ${border_radius}px;
          border: 1px solid ${border_color};
        }
        .${TOOLTIP_CLASS}::before {
          border-color: transparent;
        }
  
        .${TOOLTIP_CLASS}::after {
          border-color: transparent;
        }
      `
    document.head.insertAdjacentElement('beforeend', instance.data.custom_style);
    let mymap = L.map(mapid).setView([properties.initial_view_latitude, properties.initial_view_longitude], properties.zoom_level);
    instance.data.mymap = mymap;

    if (properties.tile_provider === "Mapbox") {
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>',
            tileSize: 512,
            maxZoom: 20,
            zoomOffset: -1,
            id: `mapbox/${properties.mapbox_tile}`,
            accessToken: context.keys["Mapbox access token"]
        }).addTo(instance.data.mymap);
    }

    if (properties.tile_provider === "Stadia") {

        //here I replace all spaces with underline "_" and transforms all characters to lowercase in order to match the
        //Stadia enumerable attribute
        const chosenStadiaTile = (descriptionOnDropDownStadia) => descriptionOnDropDownStadia.toLowerCase().replace(/ /g, '_')

        // const chosenStadiaTile = (descriptionOnDropDownStadia) => { 

        //     if (descriptionOnDropDownStadia === "Alidade Smooth")  {
        //         return "alidade_smooth";
        //     }

        //     else if (descriptionOnDropDownStadia === "Alidade Smooth Dark")  {
        //         return "alidade_smooth_dark";
        //     }

        //     else if (descriptionOnDropDownStadia === "Outdoors")  {
        //         return "outdoors";
        //     }

        //     else if (descriptionOnDropDownStadia === "OSM Bright")  {
        //         return "osm_bright";
        //     }
        // }

        L.tileLayer('https://tiles.stadiamaps.com/tiles/{op}/{z}/{x}/{y}{r}.png', {
            maxZoom: 20,
            op: chosenStadiaTile(properties.stadia_tile),
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>',
        }).addTo(instance.data.mymap);



    }

    if (properties.tile_provider === "Here") {
        const scheme = properties.here_tile.replace(/ /g, '.');
        L.tileLayer(`https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/${scheme}/{z}/{x}/{y}/512/png8?apiKey=${context.keys[`Here access token`]}&ppi=320`, {
            attribution: '&copy; <a href="https://developer.here.com/documentation/map-tile/dev_guide/topics/resource-base-maptile.html">Here maps</a>',
        }).addTo(instance.data.mymap);
        // instance.data.actions.loadMap();
    }


    if (properties.tile_provider === "MapTiler") {

        let tileName = properties.maptiler_tile.toLowerCase().trim();

        var gl = L.mapboxGL({
            attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
            style: `https://api.maptiler.com/maps/${tileName}/style.json?key=${context.keys[`Maptiler access token`]}`
        }).addTo(instance.data.mymap);

        if (properties.display_maptiler_logo === true) {

            let holderDiv = document.createElement("div");

            holderDiv.innerHTML = `<a href="https://www.maptiler.com" style="position:absolute; left:10px; bottom:10px; z-index:999;">
            <img src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo">
            </a>`;

            let mapElement = document.getElementById(mapid);
            mapElement.appendChild(holderDiv);
            

        }


    }

    const userLocated = (e) => {

        // publishes the data passed by the locate event to the Element states.

        instance.publishState("user_latitude", e.latlng.lat)
        instance.publishState("user_longitude", e.latlng.lng)
        instance.publishState("user_bounds_northeast_latitude", e.bounds._northEast.lat)
        instance.publishState("user_bounds_northeast_longitude", e.bounds._northEast.lng)
        instance.publishState("user_bounds_southwest_latitude", e.bounds._southWest.lat)
        instance.publishState("user_bounds_southwest_longitude", e.bounds._southWest.lng)
        instance.publishState("accuracy", e.accuracy)
        instance.publishState("altitude", e.altitude)
        instance.publishState("altitude_accuracy", e.altitudeAccuracy)
        instance.publishState("heading", e.heading)
        instance.publishState("speed", e.speed)
        instance.publishState("timestamp", e.timestamp)

        // trigger the Bubble event so the app maker can know everything was published and he/she can do some workflow based on this.
        instance.triggerEvent("location_found")

    }

    const onLocationError = (e) => {
        instance.triggerEvent("location_error")
    }


    instance.data.mymap.on("locationfound", userLocated)
    instance.data.mymap.on('locationerror', onLocationError);


    if (properties.enable_drawing) {
        setDrawingControls(instance, instance.data.mymap, instance.data.style);
    } else {

        instance.data.mode = "default";

    }


    //HERE API UPGRADE CODE
    const extractAjaxResponse = (res) => {
        let coordinates = null

        if (res.response) {
            coordinates = { ...res.response.view[0].result[0].location.displayPosition }
        }
        if (res.items) {
            coordinates = {
                latitude: res.items[0].position.lat,
                longitude: res.items[0].position.lng
            }
        }

        return coordinates
    }




    const generateInputDOM = (options) => {
        const parentNode = L.DomUtil.create('div', `leafy--${options.class}--inner--div`)
        const input = L.DomUtil.create('input', `leafy--${options.class}--input`)
        if (options.class === 'address') {
            input.setAttribute('placeholder', options.placeholder)
            input.setAttribute('type', options.type)
            input.addEventListener('input', options.onChangeHandler)
            parentNode.appendChild(input)
            //suggestions
            const resultsDiv = L.DomUtil.create('div', 'leafy--address--results--div')
            parentNode.appendChild(resultsDiv)
        }
        return parentNode
    }

    const optionsDOMcomponent = () => {
        const parentNode = L.DomUtil.create('div', 'leafy--route--properties')

        const routeDelta = L.DomUtil.create('input', 'leafy--limit--input')
        routeDelta.setAttribute('type', 'number')
        // const markerDelta = routeDelta.cloneNode()
        routeDelta.setAttribute('placeholder', 'Route range (in KM)')
        // markerDelta.setAttribute('placeholder', 'New marker range (in KM)')



        parentNode.appendChild(routeDelta)
        // parentNode.appendChild(markerDelta)

        return parentNode
    }

    const colorInputDOM = () => {
        const colorElement = L.DomUtil.create('div', 'leafy--address--inner--div leafy--color--div')
        const colorInput = L.DomUtil.create('input', 'leafy--color--input')
        const colorLabel = L.DomUtil.create('p', 'leafy--color--label')
        colorLabel.innerHTML = 'Route color'
        colorInput.setAttribute('type', 'color')
        colorInput.setAttribute('value', '#55AAFF')
        colorElement.appendChild(colorLabel)
        colorElement.appendChild(colorInput)
        return colorElement
    }

    const countrySelectorDOM = () => {
        const selectorDiv = L.DomUtil.create('div', 'leafy--address--select--div')
        const countrySelect = L.DomUtil.create('select', 'leafy--select--country')
        countrySelect.setAttribute('value', '')

        const centerOnThisCountry = (event) => {
            if (event.target.value.length === 3) {
                instance.data.state.countryCode = event.target.value
                const provided_country = countryProvider.getNameFromCode(event.target.value)
                instance.data.state.country = provided_country
                instance.data.routingMachine.getHereGeocode({ country: provided_country }, (res) => {
                    if (res.Response.View) {
                        const { Latitude, Longitude } = res.Response.View[0].Result[0].Location.DisplayPosition
                        instance.data.map.panTo([Latitude, Longitude])
                    }
                })

            }
        }
        countrySelect.addEventListener('input', centerOnThisCountry)

        const [countryList, countryCodes] = [countryProvider.getNames(), countryProvider.getCodes()]

        countryList.forEach((country, index) => {
            const countryOption = L.DomUtil.create('option', 'leafy--country--option')
            countryOption.innerHTML = country
            countryOption.setAttribute('value', countryCodes[index])
            countrySelect.appendChild(countryOption)
        })
        countrySelect.setAttribute('disabled', true)

        selectorDiv.appendChild(countrySelect)

        const checkBox = L.DomUtil.create('input', 'leafy--checkbox')
        checkBox.setAttribute('type', 'checkbox')
        const toggleCountryFunctionality = (event) => {
            instance.data.state.filterCountry = !instance.data.state.filterCountry
            event.target.parentElement.firstChild.disabled = !event.target.parentElement.firstChild.disabled
        }
        checkBox.addEventListener('click', toggleCountryFunctionality)

        selectorDiv.appendChild(checkBox)

        return selectorDiv
    }

    const generateInputWithLabelDOM = (options) => {
        const newElement = L.DomUtil.create('div', `leafy--address--inner--div leafy--${options.class}--div`)
        const newLabel = L.DomUtil.create('p', `leafy--${options.class}--label`)
        newLabel.innerHTML = options.label
        newElement.appendChild(newLabel)
        const nameInput = L.DomUtil.create('input', `leafy--route--${options.class}`)
        nameInput.setAttribute('type', options.type)
        newElement.appendChild(nameInput)

        return newElement
    }

    class LeafyHereRouterMachine {
        //   routeList = []
        //   routeInfo = []
        //   markerReference = []
        //   changeRoute = false
        //   keys = {
        //     apiKey: context.keys[`Here access token`]
        //   }
        //   targetRoute = ''
        //   deleteMarker = false


        constructor() {
            this.routeList = []
            this.routeInfo = []
            this.markerReference = []
            this.changeRoute = false
            this.keys = {
                apiKey: context.keys[`Here access token`]
            }
            this.targetRoute = ''
            this.deleteMarker = false

            instance.data.map.on('click', (event) => {

                //CHANGE MARKER ON CLICK
                if (this.changeRoute) {
                    this.updateRoute(event.latlng)
                    this.changeRoute = false
                }
                //DELETE MARKER ON CLICK
                if (this.deleteMarker) {
                    this.removeClosestMarker(event.latlng)
                    this.deleteMarker = false
                }
            })
        }

        removeClosestMarker(latlng) {

            this.routeInfo.forEach((route) => {
                if (route.name === this.targetRoute) {
                    let selectedIndex = -1
                    let distance = 9999999999999
                    const baseLat = route.baseParams.map((marker) => marker.latitude)
                    const baseLng = route.baseParams.map((marker) => marker.longitude)
                    // if (route.params.length )
                    let showBase = route.params.length !== 3
                    route.params.forEach((marker, markerIndex) => {
                        const notBaseMarker = baseLat.indexOf(marker.latitude) === -1 || baseLng.indexOf(marker.longitude) === -1
                        // console.log(notBaseMarker)
                        if (markerIndex !== 0 && markerIndex !== route.params.length - 1 && notBaseMarker) {

                            const distanceFromPoint = Math.pow((Math.pow(marker.latitude - latlng.lat, 2) + Math.pow(marker.longitude - latlng.lng, 2)), 0.5)
                            if (distanceFromPoint < distance) {
                                distance = distanceFromPoint
                                selectedIndex = markerIndex
                            }
                        }
                    })

                    if (selectedIndex !== -1) {
                        route.params.splice(selectedIndex, 1)
                        getThisRoute(route.params, route, route, true, true, showBase)
                    }
                }
            })
        }

        getHereGeocode(params, callback) {
            let myURL = (params.locationid || params.country) ? 'https://geocoder.ls.hereapi.com/6.2/geocode.json' : 'https://geocode.search.hereapi.com/v1/geocode'
            $.ajax({
                url: myURL,
                type: 'GET',
                data: {
                    apiKey: context.keys[`Here access token`],
                    ...params
                },
                success: (res) => callback(res),
                error: (err) => console.error(err)
            })
        }

        getHereGeocodeFromTwoParams(originParams, destinyParams, options) {
            const markers = []
            this.getHereGeocode(originParams,
                (res) => {
                    const firstCoord = extractAjaxResponse(res)
                    if (firstCoord) {
                        markers.push(firstCoord)
                        this.getHereGeocode(destinyParams,
                            (response) => {
                                const secondCoord = extractAjaxResponse(response)
                                if (secondCoord) {
                                    markers.push(secondCoord)
                                    getThisRoute(markers, options)
                                }
                            })
                    }
                })
        }

        addMarkerOnClick(name) {
            this.targetRoute = name
            this.changeRoute = true

        }

        removeMarkerOnClick(name) {
            this.targetRoute = name
            this.deleteMarker = true
        }

        addRoute(latlng, options, params, info, showRoute, showBase = true) {

            //look for any route with the same name
            let routeIndex = -1
            this.routeInfo.forEach((element, index) => {
                if (element.name === options.name)
                    routeIndex = index
                // console.log(index, 'indexed')
            })



            if (routeIndex === -1) {
                const routeMarkers = params.map((element) => {
                    const marker = L.marker([element.latitude, element.longitude])
                    return marker
                })
                const polyline = L.polyline(latlng, { color: options.color })

                if (showRoute) {
                    polyline.addTo(instance.data.map)
                    routeMarkers.forEach((marker, index) => {
                        if (index === 0 || index === routeMarkers.length - 1) marker.bindTooltip(index === 0 ? 'Origin' : 'Destination', { permanent: true, className: TOOLTIP_CLASS, offset: [0, 0] });
                        marker.addTo(instance.data.map)
                    })
                }
                // console.log(params, 'first params')
                this.routeInfo.push({
                    name: options.name,
                    polyline: latlng,
                    color: options.color,
                    baseColor: options.baseColor,
                    params: params,
                    baseParams: params,
                    baseInstance: L.polyline(latlng, { color: options.baseColor, weight: 10, opacity: 0.8 }),
                    instance: polyline,
                    markerInstance: routeMarkers,
                    deltaRoute: options.deltaRoute * 1000,
                    base: info,
                    actual: info,
                    restrictions: options.restrictions
                })

                this.markerReference.push(routeMarkers)
                this.routeList.push(polyline)
                instance.data.map.fitBounds(polyline.getBounds())

            } else {

                this.routeInfo[routeIndex].baseInstance.removeFrom(instance.data.map)
                let itsEqual = true
                // console.log(params, this.routeInfo[routeIndex], 'comparison', options)
                this.routeInfo[routeIndex].baseParams.forEach((element, elIndex) => {
                    const elReference = params[elIndex]
                    if (elReference === undefined) {
                        itsEqual = false
                    } else if (element.latitude !== elReference.latitude || element.longitude !== elReference.longitude) {
                        itsEqual = false
                    }
                })

                if (showBase && !itsEqual) {
                    this.routeInfo[routeIndex].baseInstance.addTo(instance.data.map)
                }

                this.routeInfo[routeIndex].instance.removeFrom(instance.data.map)
                this.routeInfo[routeIndex].markerInstance.forEach((element) => element.removeFrom(instance.data.map))

                const updatedMarkers = []
                params.forEach((element, index) => {
                    const marker = L.marker([element.latitude, element.longitude])
                    if (index === 0 || index === routeMarkers.length - 1) marker.bindTooltip(index === 0 ? 'Origin' : 'Destination', { permanent: true, className: TOOLTIP_CLASS, offset: [0, 0] });
                    marker.addTo(instance.data.map)
                    updatedMarkers.push(marker)
                })

                const updatedPolyline = L.polyline(latlng, { color: options.color }).addTo(instance.data.map)

                this.routeInfo[routeIndex] = {
                    ...this.routeInfo[routeIndex],
                    polyline: latlng,
                    color: options.color,
                    params: params,
                    instance: updatedPolyline,
                    markerInstance: updatedMarkers,
                    actual: info
                }

                instance.data.map.fitBounds(updatedPolyline.getBounds())

            }

            instance.data.routed = [...this.routeInfo];

        }

        calculateRoute(options, callback) {

            const waypointsInfo = {}

            options.forEach((element, index) => {
                if (Array.isArray(element)) {
                    waypointsInfo[`waypoint${index}`] = `geo!${element.join(',')}`
                } else {
                    waypointsInfo[`waypoint${index}`] = `geo!${element.latitude},${element.longitude}`
                }
            })

            $.ajax({
                url: 'https://route.ls.hereapi.com/routing/7.2/calculateroute.json',
                dataType: 'jsonp',
                jsonp: 'jsoncallback',
                data: {
                    apiKey: context.keys[`Here access token`],
                    ...waypointsInfo,
                    routeAttributes: 'waypoints,summary,legs,shape',
                    mode: 'fastest;car'

                },
                success: (res) => {
                    callback(res)
                },
                error: (err) => {
                    // console.log(err, 'error inside class')
                    instance.triggerEvent('no_route_was_found')
                }
            })
        }

        getRouteFromAction(options) {

        }

        updateRoute(latlng, options = false) {
            // console.log(latlng, options)
            let routeIndex = -1
            this.routeInfo.forEach((element, index) => {
                if (element.name === this.targetRoute) {
                    routeIndex = index
                }
            })

            if (routeIndex !== -1 && !options) {
                const routeElement = this.routeInfo[routeIndex]

                $.ajax({
                    url: 'https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json',
                    dataType: 'jsonp',
                    jsonp: 'jsoncallback',
                    data: {
                        apiKey: context.keys[`Here access token`],
                        mode: 'retrieveAddresses',
                        prox: `${latlng.lat.toFixed(4)},${latlng.lng.toFixed(4)}`
                    },
                    success: (res) => {
                        if (res.Response.View[0]) {
                            const nextRef = res.Response.View[0].Result[0].Location.DisplayPosition

                            const lastRouteInfo = this.routeInfo[routeIndex]
                            let sendTheseParams = []
                            this.routeList = this.routeList.splice(routeIndex, 1)

                            if (lastRouteInfo.params.length === 2) {
                                sendTheseParams = [...lastRouteInfo.params]
                                sendTheseParams.splice(1, 0, {
                                    latitude: nextRef.Latitude,
                                    longitude: nextRef.Longitude
                                })
                                // lastRouteInfo.params.splice(1, 0, {
                                //     latitude: nextRef.Latitude,
                                //     longitude: nextRef.Longitude
                                // }) 
                            } else {

                                const copied = [...lastRouteInfo.params]
                                const [init, end] = [copied.shift(), copied.pop()]
                                copied.push({
                                    latitude: nextRef.Latitude,
                                    longitude: nextRef.Longitude
                                })

                                let distances = []

                                copied.forEach((el) => {
                                    const distance = Math.pow((Math.pow((el.latitude - init.latitude), 2) +
                                        Math.pow((el.longitude - init.longitude), 2)), 0.5)
                                    distances.push({
                                        data: el,
                                        distance: distance
                                    })
                                })

                                distances.sort((a, b) => (a.distance > b.distance) ? 1 : -1)

                                const newBody = []
                                newBody.push(init)
                                distances.forEach((e) => newBody.push(e.data))
                                newBody.push(end)
                                // console.log(lastRouteInfo.params)
                                const removeDuplicate = [...new Set([...newBody.map((el) => `${el.longitude},${el.latitude}`)])]
                                const removedDup = removeDuplicate.map(element => {
                                    const [lng, lat] = [...element.split(',')]
                                    return {
                                        latitude: parseFloat(lat),
                                        longitude: parseFloat(lng)
                                    }
                                })
                                sendTheseParams = removedDup
                            }

                            getThisRoute(sendTheseParams, {
                                ...lastRouteInfo
                            }, routeElement, true)
                        } else {
                            instance.triggerEvent('no_route_was_found')
                        }

                    },
                    error: (err) => {
                        // console.log(err)
                        instance.triggerEvent('no_route_was_found')
                    }

                })

            } else if (options) {
                // console.log(options)
            }
            // }
        }

        showRoute(options) {
            // console.log(options, 'classy show', this.routeInfo)
            this.routeInfo.forEach((route) => {
                // console.log(route.name === options.route_name, route.name, options.route_name)
                if (route.name === options.route_name) {
                    route.instance.addTo(instance.data.map)
                    route.markerInstance.forEach((marker) => marker.addTo(instance.data.map))
                    if (options.zoom_to_route) {
                        instance.data.map.fitBounds(route.instance.getBounds())
                    }
                }
            })

        }

        hideRoute(options) {
            // console.log(options, 'classy hide', this.routeInfo)
            this.routeInfo.forEach((route) => {
                if (route.name === options.route_name) {
                    route.instance.removeFrom(instance.data.map)
                    route.markerInstance.forEach((marker) => marker.removeFrom(instance.data.map))
                }
            })
        }

        showOnly(options) {
            this.routeInfo.forEach((route) => {
                if (route.name !== options.route_name) {
                    route.instance.removeFrom(instance.data.map)
                    route.markerInstance.forEach((marker) => marker.removeFrom(instance.data.map))
                } else {
                    route.instance.addTo(instance.data.map)
                    route.markerInstance.forEach((marker) => marker.addTo(instance.data.map))
                    instance.data.map.fitBounds(route.instance.getBounds())
                }
            })

            this.showRouteSummary(options)
        }

        publishThisRoute(route, triggerName) {
            // console.log(route, route.restrictions)
            const latList = route.params.map(element => element.latitude)
            const lngList = route.params.map(element => element.longitude)

            const baseLat = route.baseParams.map(element => element.latitude)
            const baseLng = route.baseParams.map(element => element.longitude)
            //sync
            instance.publishState('here_route_latitude', latList)
            instance.publishState('here_route_longitude', lngList)

            instance.publishState('here_route_base_latitude', baseLat)
            instance.publishState('here_route_base_longitude', baseLng)



            // baseParams

            const origin = {
                lat: latList.shift(),
                lng: lngList.shift()
            }

            const destination = {
                lat: latList.pop(),
                lng: lngList.pop()
            }

            const extractAddress = (response) => {
                let res = null
                if (response.Response.View[0]) {
                    res = response.Response.View[0].Result[0].Location.Address.Label
                    // console.log(res, response, 'done')

                }
                return res
            }



            this.retrieveAddressFromCoordinates(origin, (response) => {
                const address = extractAddress(response)
                instance.publishState('here_route_origin_address', address)
                this.retrieveAddressFromCoordinates(destination, (resp) => {
                    const des = extractAddress(resp)

                    const betterFlags = route.actual.flags.map((flag) => flag.replace(/([A-Z])/g, ' $1').toLowerCase())
                    const restrictions = []
                    for (let key in route.restrictions) {
                        restrictions.push(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${route.restrictions[key]}`)
                    }

                    const workedSummary = route.actual.text.replace('<span class="length">', '[b]').replace('</span>', '[/b]').replace('<span class="time">', '[b]').replace('</span>', '[/b]')
                    instance.publishState('here_route_destination_address', des)
                    instance.publishState('here_route_name', route.name)
                    instance.publishState('here_route_distance', route.actual.distance)
                    instance.publishState('here_route_traffic_time', route.actual.trafficTime)
                    instance.publishState('here_route_flags', betterFlags)
                    instance.publishState('here_route_summary_text', workedSummary)
                    instance.publishState('here_route_base_time', route.actual.baseTime)
                    instance.publishState('here_route_travel_time', route.actual.travelTime)

                    instance.publishState('here_route_distance_limit', route.deltaRoute === 99999999000 ? 0 : route.deltaRoute / 1000)


                    instance.publishState('here_route_base_color', route.baseColor)
                    instance.publishState('here_route_color', route.color)

                    // console.log(restrictions)

                    instance.publishState('here_route_restrictions', restrictions)

                    let middleAddresses = []
                    latList.forEach((lat, index) => {
                        this.retrieveAddressFromCoordinates({ lat, lng: lngList[index] }, (secres) => {
                            middleAddresses.push(extractAddress(secres))
                            // console.log(middleAddresses)
                            if (index === latList.length - 1) {
                                instance.publishState('here_route_marker_addresses', middleAddresses)
                                instance.triggerEvent(triggerName)
                            }
                        })

                    })



                })
            })

        }

        removeMarkerByIndex(options) {

            this.routeInfo.forEach((route) => {
                if (route.name === options.route_name) {
                    if (route.params.length > 2 && options.marker < (route.params.length - 1)) {
                        route.params.splice(options.marker, 1)
                        //checkmark
                        getThisRoute(route.params, route, route, true)
                    }
                }
            })
        }

        exportRoute(options) {
            this.routeInfo.forEach((route) => {
                if (route.name === options.route_name) {
                    // console.log(route)
                    this.publishThisRoute(route, 'route_exported')
                }
            })
        }

        retrieveAddressFromCoordinates(latlng, callback) {

            $.ajax({
                url: 'https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json',
                dataType: 'jsonp',
                jsonp: 'jsoncallback',
                data: {
                    apiKey: context.keys[`Here access token`],
                    mode: 'retrieveAddresses',
                    prox: `${latlng.lat.toFixed(4)},${latlng.lng.toFixed(4)}`
                },
                success: callback,
                error: (err) => console.log(err)
            })
        }

        showRouteSummary(options) {
            this.routeInfo.forEach((route) => {
                if (route.name === options.route_name) {
                    this.publishThisRoute(route, 'route_selected')
                }
            })
        }

        addWfRouteMarker(options) {
            this.targetRoute = options.route_name
            this.changeRoute = false
            const latlng = {
                lat: options.latitude,
                lng: options.longitude
            }
            this.updateRoute(latlng)
        }

        loadRoutesFromTable(options) {
            // console.log(options)

            const source = options.table_source
            const latLongList = []


            source.get(0, source.length()).forEach((element) => {

                //ROUTE PARAMS
                const parameters = []
                const latsrc = element.get(options.latitude_field)
                const lngsrc = element.get(options.longitude_field)
                latsrc.get(0, latsrc.length()).forEach((lat) => parameters.push({ latitude: lat }))
                lngsrc.get(0, lngsrc.length()).forEach((lng, index) => parameters[index].longitude = lng)
                const restrict = element.get(options.route_restriction_field)
                const routeRestrictions = {}
                restrict.get(0, restrict.length()).forEach((el) => {
                    const [key, value] = [...el.split(':')]
                    const t = key.replace(/( [a-z])/g, function (group, match) {
                        const workedMatch = match.toUpperCase().trim()
                        return workedMatch
                    })
                    routeRestrictions[t] = value.trim()
                    //   console.log(key, value, t)
                })
                // console.log(routeRestrictions, 'loading from table')
                //ROUTE CONFIGURATION
                const routeOpt = {
                    name: element.get(options.name_field),
                    color: element.get(options.color_field),
                    baseColor: element.get(options.base_color_field),
                    deltaRoute: element.get(options.distance_limit_field),
                    restrictions: routeRestrictions
                }

                // console.log(routeRestrictions)

                // console.log(routeOpt)
                getThisRoute(parameters, routeOpt, {}, false, options.show_all_routes)
            })

        }

        updateBaseRoute(options) {
            this.routeInfo.forEach((route, index) => {

                if (route.name === options.route_name) {

                    const newRoute = { ...route }
                    newRoute.instance = L.polyline(route.polyline, { color: route.color }).addTo(instance.data.map)
                    newRoute.baseInstance = L.polyline(route.polyline, { color: route.baseColor, weight: 10, opacity: 0.8 })
                    newRoute.base = route.actual
                    newRoute.baseParams = route.params
                    route.instance.removeFrom(instance.data.map)
                    route.baseInstance.removeFrom(instance.data.map)
                    this.routeInfo[index] = newRoute
                }
            })
        }

        clearRoutes() {
            this.routeInfo.forEach((route) => {
                route.instance.removeFrom(instance.data.map)
                route.markerInstance.forEach((element) => element.removeFrom(instance.data.map))
            })
            this.routeList = []
            this.routeInfo = []
            this.markerReference = []
        }
    }



    instance.data.state = {
        country: [0, 0],
        countryCode: '',
        state: '',
        city: '',
        label: '',
        ruckControl: false,
        addresses: [],
        filterCountry: false
    }

    instance.data.platform = null;
    instance.data.here = {
        platform: null,
        router: null,
        geoservice: null,
        routeInitialized: false
    }
    instance.data.markers = []

    const getThisRoute = (params, options, info, update = false, showRoute = true, showBase = true) => {

        const waypointsInfo = {}

        params.forEach((element, index) => {
            if (Array.isArray(element)) {
                waypointsInfo[`waypoint${index}`] = `geo!${element.join(',')}`
            } else {
                waypointsInfo[`waypoint${index}`] = `geo!${element.latitude},${element.longitude}`
            }
        })
        // console.log(waypointsInfo, options.restrictions, 'restrictions')
        $.ajax({
            url: 'https://route.ls.hereapi.com/routing/7.2/calculateroute.json',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            data: {
                apiKey: context.keys[`Here access token`],
                ...waypointsInfo,
                routeAttributes: 'waypoints,summary,legs,shape',
                mode: 'fastest;truck',
                ...options.restrictions
            },
            success: (res) => {
                // console.log(res, res.response)
                if (res.response) {
                    const newShape = res.response.route[0].shape.map((element) => [...element.split(',')])

                    if (!update) {
                        instance.data.routingMachine.addRoute(newShape, options, params, res.response.route[0].summary, showRoute)
                    } else {

                        const diff = res.response.route[0].summary.distance - info.base.distance
                        // console.log(diff, info.deltaRoute, params)
                        if (info.deltaRoute) {

                            if (diff < info.deltaRoute) {
                                instance.data.routingMachine.addRoute(newShape, options, params, res.response.route[0].summary, showRoute, showBase)
                            } else {
                                instance.triggerEvent('route_limit_exceeded')
                            }

                        } else {
                            instance.data.routingMachine.addRoute(newShape, options, params, res.response.route[0].summary, showRoute, showBase)
                        }
                    }
                } else {
                    instance.triggerEvent('no_route_was_found')
                }
            },
            error: (err) => {

            }
        })


    }


    instance.data.selectedAddresses = []
    instance.data.id = `leafy-up-${Math.floor(Math.random() * 99)}${Math.floor(Math.random() * 99)}`
    const truckRouteID = `${instance.data.id}-truck`

    instance.data.util = {
        addControl: (options) => {

            const hideMyForm = 'leafy--form--hide'

            if (L.Control.TruckRoute === undefined) {
                L.Control.TruckRoute = L.Control.extend({
                    onAdd: function (map) {
                        //main form element
                        let el = L.DomUtil.create('div',
                            `leafy--add--route`)

                        el.setAttribute('id', truckRouteID)

                        const showResultFactory = (parent, results) => {

                            //cleanup
                            const cleanThisContainer = () => {
                                if (parent.lastChild) {
                                    if (instance.data.selectedAddresses.length > 0) {
                                        let groupToRemove = -1
                                        instance.data.selectedAddresses.forEach((group, groupIndex) => {
                                            if (group.length > 0) {
                                                group.forEach(element => {
                                                    if (element.label === parent.lastChild.innerHTML) {
                                                        groupToRemove = groupIndex
                                                    }
                                                })
                                            }
                                        })

                                        if (groupToRemove !== -1) {
                                            instance.data.selectedAddresses.splice(groupToRemove, 1)
                                        }
                                    }

                                    while (parent.lastChild) {
                                        parent.removeChild(parent.lastChild)
                                    }

                                }
                            }
                            cleanThisContainer()

                            instance.data.selectedAddresses.push(results)

                            const suggestionConstructor = (element) => {
                                const child = document.createElement('p')
                                child.classList.add('leafy--route--result')
                                child.setAttribute('id', element.locationId)

                                child.innerHTML = element.label
                                const savedElem = { ...element }

                                child.addEventListener('click', function (event) {
                                    const inputReference = event.originalTarget.parentElement.parentElement.getElementsByClassName('leafy--address--input')[0]
                                    const splitted = [...event.originalTarget.innerHTML.split(',')]
                                    const countryRemoved = splitted.shift()
                                    const code = countryProvider.getCodeFromName(countryRemoved)

                                    instance.data.state.country = countryRemoved
                                    instance.data.state.countryCode = code
                                    inputReference.value = event.originalTarget.innerHTML
                                    instance.data.state.addresses.push(savedElem)
                                    cleanThisContainer()
                                })
                                return child
                            }

                            results.forEach(element => {
                                parent.appendChild(suggestionConstructor(element))
                            })
                            if (parent.lastChild === undefined) {

                            }
                        }

                        const formFactory = (active) => {

                            const onChangeHandler = (e) => {
                                let autoSuggestFilter = {}

                                if (instance.data.state.filterCountry) {
                                    autoSuggestFilter.country = instance.data.state.countryCode
                                }
                                if (e.target.value.length > 1) {
                                    $.ajax({
                                        url: 'https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json',
                                        type: 'GET',
                                        dataType: 'jsonp',
                                        jsonp: 'jsoncallback',
                                        data: {
                                            apiKey: context.keys[`Here access token`],
                                            ...autoSuggestFilter,
                                            language: 'en',
                                            query: e.target.value,
                                            maxresults: 8,
                                            result_types: 'address'
                                        },
                                        success: (res) => {

                                            if (res.suggestions) {
                                                const suggestionsArray = [...res.suggestions]

                                                showResultFactory(e.originalTarget.parentElement.getElementsByClassName('leafy--address--results--div')[0], suggestionsArray)
                                            }

                                        },
                                        error: (err) => {

                                        }
                                    })
                                }

                            }

                            const innerMainform = []

                            const mainForm = L.DomUtil.create('div', `leafy--route--form ${active ? '' : hideMyForm}`)

                            const inputDiv = L.DomUtil.create('div', 'leafy--address--input--div')

                            const generatedSelectorDIV = countrySelectorDOM()

                            inputDiv.appendChild(generatedSelectorDIV)

                            const firstInput = generateInputDOM({
                                class: 'address',
                                type: 'text',
                                placeholder: 'Origin address',
                                onChangeHandler
                            })

                            inputDiv.appendChild(firstInput)

                            const secondInput = generateInputDOM({
                                class: 'address',
                                type: 'text',
                                placeholder: 'Destination address',
                                onChangeHandler
                            })

                            inputDiv.appendChild(secondInput)

                            const deltaOptions = optionsDOMcomponent()

                            inputDiv.appendChild(deltaOptions)


                            //color input
                            const colorInput = colorInputDOM()

                            inputDiv.appendChild(colorInput)

                            const nameInput = generateInputWithLabelDOM({
                                label: 'Route unique name',
                                class: 'name',
                                type: 'text'
                            })



                            inputDiv.appendChild(nameInput)

                            //route range




                            innerMainform.push(inputDiv)

                            const buttonDiv = L.DomUtil.create('div', 'leafy--button--container')
                            const getRouteButton = L.DomUtil.create('button', 'leafy--get--button leafy--button')
                            const goBackButton = L.DomUtil.create('button', 'leafy--back--button leafy--button');

                            getRouteButton.innerHTML = 'Get new route'

                            goBackButton.innerHTML = 'Go back'



                            const getRouteFromUI = event => {

                                const ref = [...event.originalTarget.parentElement.parentElement.getElementsByClassName('leafy--address--input')]

                                const colorRef = event.originalTarget.parentElement.parentElement.getElementsByClassName('leafy--color--input')

                                const routeName = event.originalTarget.parentElement.parentElement.getElementsByClassName('leafy--route--name')
                                const routeFilteredName = routeName[0].value || `${Date.now()}`
                                const color = colorRef[0].value
                                const results = []

                                const routeProperties = [...document.getElementsByClassName('leafy--route--properties')[0].getElementsByTagName('input')].map((element) => element.value)

                                const [extractedDeltaRoute, extractedDeltaMarker] = routeProperties




                                ref.forEach(element => {
                                    if (element.value.length > 0) {
                                        results.push(element.value)

                                    }
                                })
                                if (results.length > 1) {

                                    const params = {
                                        origin: results[0],
                                        originId: '',
                                        destination: results[1],
                                        destinationId: ''
                                    }


                                    if (instance.data.state.addresses.length > 0) {
                                        instance.data.state.addresses.forEach(element => {
                                            if (params.origin === element.label) {
                                                params.originId = element.locationId
                                            }
                                            if (params.destination === element.label) {
                                                params.destinationId = element.locationId
                                            }
                                        })
                                    }

                                    let originParams = {
                                    }
                                    let destinyParams = {
                                    }

                                    if (params.originId.length > 0) {

                                        originParams = {
                                            locationid: params.originId,
                                            jsonattributes: 1,
                                            gen: 9
                                        }
                                    } else {
                                        originParams.q = params.origin
                                    }
                                    if (params.destinationId.length > 0) {
                                        destinyParams = {
                                            locationid: params.destinationId,
                                            jsonattributes: 1,
                                            gen: 9
                                        }
                                    } else {
                                        destinyParams.q = params.destination
                                    }

                                    instance.data.routingMachine.getHereGeocodeFromTwoParams(originParams, destinyParams, {
                                        color: color,
                                        name: routeFilteredName,
                                        deltaRoute: parseFloat(extractedDeltaRoute)
                                    })

                                    instance.data.state.addresses = []

                                }
                            }

                            getRouteButton.addEventListener('click', getRouteFromUI)

                            goBackButton.addEventListener('click', event => {
                                instance.data.state.truckControl = false
                                event.originalTarget.parentElement.parentElement.remove()
                            })



                            buttonDiv.appendChild(goBackButton)
                            buttonDiv.appendChild(getRouteButton)

                            innerMainform.push(buttonDiv)
                            innerMainform.forEach(element => mainForm.appendChild(element))


                            return { mainForm, innerMainform }
                        }


                        const buttonContainer = L.DomUtil.create('div', 'leafy--control--icon')
                        const button = L.DomUtil.create('span', 'leafy--icon--span leafy--get--route')
                        button.innerHTML = '🚚'
                        buttonContainer.appendChild(button)
                        const { mainForm } = formFactory()

                        buttonContainer.addEventListener('click', event => {
                            instance.data.state.truckControl = !instance.data.state.truckControl

                            //add the form
                            if (instance.data.state.truckControl) {
                                updatedMainForm = formFactory(true)
                                document.getElementById(truckRouteID).appendChild(updatedMainForm.mainForm)
                            } else {
                                document.getElementById(truckRouteID).getElementsByClassName('leafy--route--form')[0].remove()
                                //remove the form
                                // event.originalTarget.nextSibling.classList.add(hideMyForm)
                            }
                        })


                        el.appendChild(buttonContainer)
                        if (instance.data.state.truckControl) {
                            el.appendChild(mainForm)
                        }


                        return el
                    }
                })

                L.control.customControl = function (options) {
                    return new L.Control.TruckRoute(options)
                }

                L.control.customControl({
                    position: 'topleft'
                }).addTo(instance.data.map)
            }


        }
    }

    instance.data.map = null;
    instance.data.initialized = false;
    instance.data.actions = {
        loadMap: () => {
            instance.data.map = instance.data.mymap
            instance.data.routingMachine = new LeafyHereRouterMachine()
        },
        getHereRoute: (options) => {
            // console.log(options)
            const routeOpt = {
                color: options.route_color,
                baseColor: options.base_route_color,
                name: options.route_name,
                deltaRoute: options.distance_limit ? options.distance_limit : 99999999,
                restrictions: {

                }
            }

            if (options.axle_count) routeOpt.restrictions.axleCount = options.axle_count
            if (options.weight_per_axle) routeOpt.restrictions.weightPerAxle = options.weight_per_axle
            if (options.trailer_forbidden) routeOpt.restrictions.trailerForbidden = options.trailer_forbidden

            if (options.shipped_hazardous_goods) routeOpt.restrictions.shippedHazardousGoods = options.shipped_hazardous_goods.replace(/ ([a-z])/g, '$1'.toUpperCase())

            if (options.truck_restriction_penalty) routeOpt.restrictions.truckRestrictionPenalty = options.truck_restriction_penalty
            if (options.tunnel_category) routeOpt.restrictions.tunnelCategory = options.tunnel_category
            if (options.truck_type) routeOpt.restrictions.truckType = options.truck_type.replace(/ ([a-z])/g, '$1'.toUpperCase())
            // console.log(options.truck_type, routeOpt.restrictions.truckType, 'debug')
            if (options.width) routeOpt.restrictions.width = options.width
            if (options.height) routeOpt.restrictions.height = options.height

            if (options.weights_per_axle_single || options.weights_per_axle_tandem) {
                routeOpt.weightsPerAxleGroup = `${options.weights_per_axle_single ? `single:${options.weights_per_axle_single}` : ''}${options.weights_per_axle_tandem ? `;tandem:${options.weights_per_axle_tandem}` : ''}`
            }

            if (!options.use_coordinates) {
                instance.data.routingMachine.getHereGeocodeFromTwoParams({
                    q: options.origin_address
                }, {
                    q: options.destination_address
                }, routeOpt)

            } else {
                // console.log(options)
                const paramsList = []
                options.latitude_list.get(0, options.latitude_list.length()).forEach((element) => {
                    // console.log(element)
                    paramsList.push({
                        latitude: element
                    })
                })

                options.longitude_list.get(0, options.longitude_list.length()).forEach((element, index) => {
                    paramsList[index].longitude = element
                    // console.log(element)
                })



                // console.log(paramsList)
                getThisRoute(paramsList, routeOpt)
            }

        },
        getManualRoute: (options) => {

        },
        addMarkerClick: (options) => {
            const { route_name } = options
            const nameToSend = route_name || `${Date.now()}`
            instance.data.routingMachine.addMarkerOnClick(nameToSend)

        },
        zoomToMap: (options) => {
            let poly = null
            instance.data.routingMachine.routeInfo.forEach((element) => {
                if (element.name === options.route_name) {
                    poly = element.instance
                }
            })
            if (poly) {
                instance.data.map.fitBounds(poly.getBounds())
            } else {
                alert('invalid route name')
            }
        },
        editRoute: (options) => {
            let routeExists = -1

            instance.data.routingMachine.routeInfo.forEach((element, index) => {
                // console.log(element.name, options.route_name, element.name === options.route_name, element.name.length, options.route_name.length)
                if (element.name === options.route_name) {
                    routeExists = index
                    // console.log(routeExists)
                }
            })

            if (routeExists > -1) {
                const thisRef = instance.data.routingMachine.routeInfo[routeExists]

                thisRef.instance.removeFrom(instance.data.map)
                const newPoly = L.polyline(thisRef.polyline, { color: options.color }).addTo(instance.data.map)
                //  const polyline = L.polyline(latlng, {color: options.color}).addTo(instance.data.map)
                instance.data.routingMachine.routeInfo[routeExists] = {
                    ...instance.data.routingMachine.routeInfo[routeExists],
                    color: options.color,
                    deltaRoute: options.distance_limit,
                    instance: newPoly
                }

            } else {
                alert(`there is no route with the name${options.route_name}`)
            }
        },
        getAutocompleteSuggestion: (options) => {
            $.ajax({
                url: 'https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json',
                type: 'GET',
                dataType: 'jsonp',
                jsonp: 'jsoncallback',
                data: {
                    apiKey: context.keys[`Here access token`],
                    language: 'en',
                    query: options.text,
                    maxresults: 8,
                    result_types: 'address'
                },
                success: (res) => {

                    if (res.suggestions.length > 0) {
                        const suggestionsArray = [...res.suggestions]
                        const mapToState = suggestionsArray.map((element) => element.label.replace(/,/g, ' -'))

                        instance.publishState('here_suggestion_state', mapToState)
                        instance.triggerEvent('here_suggestion')
                        // showResultFactory(e.originalTarget.parentElement.getElementsByClassName('leafy--address--results--div')[0], suggestionsArray)
                    } else {
                        instance.publishState('here_suggestion_state', [''])
                        instance.triggerEvent('here_suggestion')
                    }

                },
                error: (err) => {
                    alert(err)
                }
            })
        },
        showRoute: (options) => {
            instance.data.routingMachine.showRoute(options)
        },
        hideRoute: (options) => {
            instance.data.routingMachine.hideRoute(options)
        },
        showOnly: (options) => {
            instance.data.routingMachine.showOnly(options)
        },
        exportRoute: (options) => {
            instance.data.routingMachine.exportRoute(options)
        },
        addWfRouteMarker: (options) => {
            instance.data.routingMachine.addWfRouteMarker(options)
        },
        loadRoutesFromTable: (options) => {
            instance.data.routingMachine.loadRoutesFromTable(options)
        },
        removeMarkerByIndex: (options) => {
            instance.data.routingMachine.removeMarkerByIndex(options)
        },
        removeMarkerOnClick: (options) => {
            instance.data.routingMachine.removeMarkerOnClick(options.route_name)
        },
        showRouteSummary: (options) => {
            instance.data.routingMachine.showRouteSummary(options)
        },
        updateBaseRoute: (options) => {
            instance.data.routingMachine.updateBaseRoute(options)
        }
    }

    instance.data.actions.loadMap();
    if (!properties.mouse_wheel_zoom) {
        instance.data.mymap.scrollWheelZoom.disable();
    }

    //  function mapClicked(e) { 
    //
    //     instance.publishState("map_clicked_latitude", e.latlng.lat)
    //    instance.publishState("map_clicked_longitude", e.latlng.lng)

    //	instance.triggerEvent('map_clicked');

    //} 
    // instance.data.mymap.on('click', mapClicked)



    // Right/ Left Click functionality implemented starting here

    if (properties.mouse_button === "right") {
        instance.data.mymap.on("contextmenu", (ev) => {
            if (instance.data.mode !== "default") return;
            instance.publishState("click_map_coordinates_latitude", ev.latlng.lat)
            instance.publishState("click_map_coordinates_longitude", ev.latlng.lng)
            instance.triggerEvent("map_clicked");
        });

    }

    if (properties.mouse_button === "left") {
        instance.data.mymap.on("click", (ev) => {
            if (instance.data.mode !== "default") return;
            instance.publishState("click_map_coordinates_latitude", ev.latlng.lat)
            instance.publishState("click_map_coordinates_longitude", ev.latlng.lng)
            instance.triggerEvent("map_clicked");
        });
    }




}