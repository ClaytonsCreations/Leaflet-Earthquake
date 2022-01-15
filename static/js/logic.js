var mymap = L.map('map', {
  center: [47.258, -122.465],
  zoom: 3,
});


var satellite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

// var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(mymap);




var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl).then(function (data){
  L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      var radiusSize,
      mag = feature.properties.mag;
        if (mag > 4.5) radiusSize = 10;
        else if ( mag > 2.5) radiusSize = 6;
        else if (mag > 1) radiusSize = 4;
        else radiusSize = 2;
      
      var depthColor,
      depth = feature.geometry.coordinates[2];
        if (depth >= 90) depthColor = "DarkRed";
        else if (depth >= 70) depthColor = "OrangeRed";
        else if (depth >= 50) depthColor = "orange"
        else if (depth >= 30) depthColor = 'GoldenRod'
        else if (depth >= 10) depthColor = 'Yellow'
        else depthColor = "Green";
  var marker = L.circleMarker(latlng, {radius: radiusSize, color: depthColor});
marker.bindPopup("Location: " + feature.properties.place + "<br>Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + "<br><a href =" + feature.properties.url +">More info</a>");
return marker;
    }
  }).addTo(mymap);
});

var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var colors = [
        "Green",
        "Yellow",
        "GoldenRod",
        "Orange",
        "OrangeRed",
        "DarkRed"];
    var labels = [];

    var legendInfo = "<h4>Earthquake Depth<h4>" + 
        "<div class=\"labels\">" +
            "<div class=\"depth6\">90+</div>" +
            "<div class=\"depth5\">70-90</div>" +
            "<div class=\"depth4\">50-70</div>" +
            "<div class=\"depth3\">30-50</div>" +
            "<div class=\"depth2\">10-30</div>" +
            "<div class=\"depth1\"><10</div>" +
        "</div>";

    div.innerHTML = legendInfo;

    colors.forEach(function(color) {
        labels.push("<li style=\"background-color: " + color + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
};
// Append label to the map
legend.addTo(mymap);
