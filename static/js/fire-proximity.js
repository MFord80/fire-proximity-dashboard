// OSM tile layer
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Toner lite tile layer
var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});

// Topographic tile layer
var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Icon variables
var clientIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
  iconAnchor: [24,81]
});

var schoolIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconAnchor: [12,40]
});
var hospitalIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
  iconAnchor: [12,40]
});
var agedCareIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconAnchor: [12,40]
});

// Nested Overlay layers
// School layer
$.getJSON("/schools", (function(response) {
  features = response.features;
  const schoolMarkers =[]
  for (let i = 0; i < features.length; i++) {
    let location = features[i].geometry;
    if(location){
      schoolMarkers.push(L.marker([location.coordinates[1], location.coordinates[0]], {icon: schoolIcon}));
    }
  }
// Hospital layer
$.getJSON("/hospitals", (function(response) {
  features = response.features;
  const hospitalMarkers =[]
  for (let i = 0; i < features.length; i++) {
    let location = features[i].geometry;
    if(location){
      hospitalMarkers.push(L.marker([location.coordinates[1], location.coordinates[0]], {icon: hospitalIcon}));
    }
  }
// Aged Care Facility layer
d3.csv("/agedcare").then(function(response) {
  features = response
  const agedCareMarkers =[]
  for (let i = 0; i < features.length; i++) {
    let location = features[i];
    if(location){
      agedCareMarkers.push(L.marker([location.Latitude, location.Longitude], {icon: agedCareIcon}));
    }
  }
// Fire hotspots layer
$.getJSON("/hotspots", (function(response) {
  features = response
  hotspotCircles = []
    for (let i = 0; i < Object.keys(features).length; i++) {
      if (features[String(i)].temperature < 330) {
        heat = "#ffcc00"
      } else if (features[String(i)].temperature < 360) {
        heat = "#e65c00"
      } else {
        heat = "#cc0000"
      };
      let location = features[String(i)].coordinates;
      if(location){
        hotspotCircles.push(L.circle([location[0], location[1]], {
          color: heat,
          opacity: 0,
          fillColor: heat,
          fillOpacity: 0.5,
          radius: 200 
      }))
    }
  }
// // Aged Care Facility layer
// d3.csv("/agedcare").then(function(response) {
//   features = response
//   const agedCareMarkers =[]
//   for (let i = 0; i < features.length; i++) {
//     let location = features[i];
//     if(location){
//       agedCareMarkers.push(L.marker([location.Latitude, location.Longitude], {icon: agedCareIcon}));
//     }
//   }
      // Layer group variables
      let hotspots = L.layerGroup(hotspotCircles)
      let schools = L.layerGroup(schoolMarkers)
      let hospitals = L.layerGroup(hospitalMarkers)
      let agedCare = L.layerGroup(agedCareMarkers)

      // Layer variables
      var baseMap = {
        "Streetmap": osm,
        "Toner": Stamen_TonerLite,
        "Topographic": OpenTopoMap
      };
        
      var overlayMaps = {
        "Hotspots": hotspots,
        "Schools": schools,
        "Hospitals": hospitals,
        "Aged Care Facilities": agedCare
      };
      
      // Map variable
      var Map = L.map("map", {
        center: [-24.76, 121.14],
        zoom: 5.5,
        zoomSnap: 0.5,
        layers: [osm, hotspots]
      });

      // Functions for view selection radio buttons
      let stateSelect = d3.select("#btnradio1");
      let metroSelect = d3.select("#btnradio2");
      let incidentSelect = d3.select("#btnradio3");

      stateSelect.on("click", function() {
        Map.setView([-24.76, 121.14], 5.5);
      });
      metroSelect.on("click", function() {
        Map.setView([-32.12, 116.13], 10);
      });
      incidentSelect.on("click", function() {
        Map.setView([-31.95, 116.1], 13);  
      });
      
      // Layer control
      L.control.layers(baseMap, overlayMaps, {
        collapsed: false
      }).addTo(Map);  
      }));
    });
  }));
}));







