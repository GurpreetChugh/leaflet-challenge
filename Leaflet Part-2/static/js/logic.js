
// creating function for circle marker fillcolor based on a given value

function getColor(value) {
    if (value > 18) {
      return 'rgb(177,0,38)';
    } else if (value > 15) {
      return 'rgb(227,26,28)';
    } else if (value > 12) {
        return 'rgb(252,78,42)';
    } else if (value > 9) {
      return 'rgb(253,141,60)';
    } else if (value > 6) {
      return 'rgb(254,178,76)'; 
    } else if (value > 3) {
      return 'rgb(254,217,118)';
    } else {
      return 'rgb(255,255,178)';
    }
  }

// function to create circle marker for earthquake data which returns circle marker layer group

function createMarkerGroup(myData) {

    let circleMarkers = []

    myData.forEach(element => {
        let lat = element['geometry']['coordinates'][1]
        let lng = element['geometry']['coordinates'][0]
        let depth = element['geometry']['coordinates'][2]
        let magnitude = element['properties']['mag']
        let place = element['properties']['place']
        

        let circle = L.circle([lat, lng], {
            color: 'rgb(217,217,217',
            weight: 1,
            fillColor: getColor(depth),
            fillOpacity: 0.7,
            radius: magnitude * 20000
        });

        circle.bindTooltip(`magnitude: ${magnitude}<br> location: ${place}<br> depth: ${depth} `) 
        circleMarkers.push(circle)
    })

    return L.layerGroup(circleMarkers)
}




// Fetching earthquake and tectonic plates data

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {
    console.log(data)
    let earthquakeData = data['features']

    var tectonicPlates = tectonicData['features'];

    // creating techtonic data polylines

    tectonicPolyLines = L.geoJSON(tectonicPlates, {
        style: {
            "color": "#A88905",
            "weight": 5,
            "opacity": 0.7
        }
    })

   // invoking createMarkerGroup function to return earthquake layer group
   let earthquakeMarkers = createMarkerGroup(earthquakeData)

    // defining base tiles

    let googleSatelliteMap = L.tileLayer('https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&hl={language}', {
        attribution: 'Map data &copy;2023 Google',
        subdomains: '0123',
        maxZoom: 22,
        language: 'en'
    });

    let USGS_USTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 20,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
    });

    let street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    
    
    let baseLayer = {
        'Satellite':googleSatelliteMap,
        'USGS Topo': USGS_USTopo,
        'Street': street 
    }; 
    
    let overlayLayer = {
        'Earthquakes' : earthquakeMarkers,
        'Tectonic Plates': tectonicPolyLines
    }

    // initialising map with satellite layer and overlay layers

    let myMap = L.map('map', {
        center: [39.8283, -98.5795],
        zoom: 4, 
        layers: [googleSatelliteMap, earthquakeMarkers, tectonicPolyLines]
    })

    L.control.layers(baseLayer, overlayLayer).addTo(myMap);

    // Creating a custom legend control to add legend to the map

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
 
       var div = L.DomUtil.create('div', 'legend')
 
       let interval = [-3, 3, 6, 9, 12, 15, 18]
      //  labels = [];
 
       // loop through interval and generate a label with a colored square for each interval
       for (let i = 0; i <interval.length; i++) {
         div.innerHTML +=
             '<i style="background:' + getColor(interval[i] + 1) + '"></i> ' +
               interval[i] + (interval[i + 1] ? '&ndash;' + interval[i + 1] + '<br>' : '+');
       }
 
       return div;
     };
 
    legend.addTo(myMap);
     
    });

    


    

     
    



