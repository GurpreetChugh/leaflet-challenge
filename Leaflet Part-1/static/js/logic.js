//  Fetching the data from the USGS url - "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {
    console.log(data)
    let earthquakeData = data['features']

    let myMap = L.map('map', {
        center: [39.8283, -98.5795],
        zoom: 5
    })

    let street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(myMap);

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

    let magArray = []

    earthquakeData.forEach(element => {
        let lat = element['geometry']['coordinates'][1]
        let lng = element['geometry']['coordinates'][0]
        let depth = element['geometry']['coordinates'][2]
        let magnitude = element['properties']['mag']
        let place = element['properties']['place']
        magArray.push(depth)

        let circle = L.circle([lat, lng], {
            color: 'rgb(217,217,217',
            weight: 1,
            fillColor: getColor(depth),
            fillOpacity: 0.7,
            radius: magnitude * 20000
        }).addTo(myMap);

        circle.bindTooltip(`magnitude: ${magnitude}<br> location: ${place}<br> depth: ${depth} `);             
    });

    // Creating a custom legend control to add legend to the map

    // Getting minimum depth value in the earthquake data to define first interval in the legend
    sortedData = magArray.sort((a, b) => a - b);
    console.log(sortedData[0]);

     
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


})