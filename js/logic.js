// Function to determine marker size based on earthquake magnitude
function markerSize(feature) {
    return (feature.properties.mag) * 2;
}

// Function to determine marker color based on earthquake magnitide "#dfedbe",
var colors = ["#c6ffdd", "#eede9f", "#ecc089", "#eda287", "#f7797d"]

function circleColor(feature) {
    var mag = feature.properties.mag;

    if (mag < 5) {
        return colors[0]
    }
    else if (mag < 6) {
        return colors[1]
    }
    else if (mag < 7) {
        return colors[2]
    }
    else if (mag < 8) {
        return colors[3]
    }
    else {
        return colors[4]
    }
}
// console.log(fillColor)

// // Define variables for base layers
// var attribution = "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>";

// //   // Create an overlay object
// //   var overlayMaps = {
// //     Earthquakes: quakes,
// //     TectonicPlates: tectonicPlates
// //   };
// var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: attribution,
//     maxZoom: 18,
//     id: "mapbox.lite",
//     accessToken: API_KEY
// });

// // Create the tile layer that will be the background of our map
// var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: attribution,
//     maxZoom: 18,
//     id: "mapbox.satellite",
//     accessToken: API_KEY
// });

// var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: attribution,
//     maxZoom: 18,
//     id: "mapbox.outdoors",
//     accessToken: API_KEY
// });

// // Create baseMaps object
// var baseMaps = {
//     "Grayscale": lightMap,
//     "Satellite": satelliteMap,
//     "Outdoors": outdoorsMap
// };



// Store API endpoint as queryURL
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

var platesPath = "GeoJSON/PB2002_boundaries.json";

// Perform a GET request to the query URL
d3.json(queryURL, function(data) {
    d3.json(platesPath, function(platesData) {

        // spot check
        console.log(data)

        //Earthquake layer
        var earthquakes = L.geoJSON(data, {

            // Create circle markers
            pointToLayer: function (feature, latlng) {
                var geojsonMarkerOptions = {
                    radius: markerSize(feature),
                    fillColor: circleColor(feature),
                    color: "#000", 
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 1
                };
                return L.circleMarker(latlng, geojsonMarkerOptions);
            },

            // Create popups
            onEachFeature: function (feature, layer) {
                return layer.bindPopup(`<strong>Place: </strong> ${feature.properties.place}<br><strong>Magnitude: </strong>${feature.properties.mag}`);
            }
        });

        
        
        // Define variables for base layers
        var attribution = "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>";
        
        //   // Create an overlay object
        //   var overlayMaps = {
        //     Earthquakes: quakes,
        //     TectonicPlates: tectonicPlates
        //   };
        var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: attribution,
            maxZoom: 18,
            id: "mapbox.lite",
            accessToken: API_KEY
        });
        
        // Create the tile layer that will be the background of our map
        var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: attribution,
            maxZoom: 18,
            id: "mapbox.satellite",
            accessToken: API_KEY
        });
        
        var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: attribution,
            maxZoom: 18,
            id: "mapbox.outdoors",
            accessToken: API_KEY
        });
        
        // Create baseMaps object
        var baseMaps = {
            "Grayscale": lightMap,
            "Satellite": satelliteMap,
            "Outdoors": outdoorsMap
        };

        // Tectonic plates layer
        var platesStyle = {
            "color": "#ff7800",
            "weight": 2,
            "opacity": 1,
            "fillOpacity": 0
        };

        var plates = L.geoJSON(platesData, {
            style: platesStyle
        });

        // Create an overlay object
        var overlayMaps = {
            "Fault lines": plates,
            "Earthquakes": earthquakes,
            "Map Styles": baseMaps 
        };

        // create the map
        // var myMap = L.map("map-id", {
        //     center: [37.09, -95.71],
        //     zoom: 2,
        //     layers: [lightMap, outdoorsMap, satelliteMap]
        // });

        // Define a map object
        var myMap = L.map("map-id", {
            center: [37.09, -95.71],
            zoom: 2.25,
            layers: [satelliteMap, plates, earthquakes]
        });

        // Add the control layer to the map
        // DOESN'T LIKE THIS LINE!
        L.control.layers(baseMaps, overlayMaps).addTo(myMap);

        // Set up legend
        var legend = L.control({position: "bottomright"});
        legend.onAdd = function() {
            var div = L.DomUtil.create("div", "info legend")
            var limits = ["4.5-5", "5-6", "6-7", "7-8", "8+" ]
            var labelsColor = [];
            var labelsText = [];

            // Add min and max
            limits.forEach(function(limit, index){
                labelsColor.push(`<li style="background-color: ${colors[index]};"></li>`);
                labelsText.push(`<span class="legend-label">${limits[index]}</span>`)
            });

            var labelsColorHtml = "<ul>" + labelsColor.join("") + "</ul>";
            var labelsTextHtml = `<div id="labels-text">${labelsText.join("<br>")}</div>;`

            var legendInfo = "<h4>Earthquake<br>Magnitude</h4>" +
                "<div class=\"labels\">" + labelsColorHtml + labelsTextHtml
                "</div>";
            div.innerHTML = legendInfo;

            return div;
        };

        // Add legend to map
        legend.addTo(myMap);

    });
});