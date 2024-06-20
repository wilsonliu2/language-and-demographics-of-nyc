// MAP BOUNDS - set bounds so the map has limits for visibility
var southWest = L.latLng(40.477399, -74.25909), // Southwest bound (farther south and west)
  northEast = L.latLng(40.917577, -73.700272), // Northeast bound (farther north and east)
  bounds = L.latLngBounds(southWest, northEast);

// MAP OBJECT
var mymap = L.map("mapid", {
  maxBounds: bounds, // Map automatically bounces back to center
  maxZoom: 18,
  minZoom: 11, // LOWERED minZoom TO SHOW MORE AREA
}).setView([40.65, -73.97], 11);

// BASEMAP
var baseLayer = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/light-v9",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1Ijoic2hlZW5hcCIsImEiOiJja25hdXE3aGcxbGI4MnVxbnFoenhwdGRrIn0.DhFwD-KlRigYLaVwL8ipGA",
  }
).addTo(mymap);

//=========================================================== LANGUAGE LAYERS =================================================================

var languageGroup = new L.featureGroup();

// LANGUAGE GEOJSON
var languageGeoJson = L.geoJson(languageGeoJsonData, {
  style: style,
  onEachFeature: function (feature, layer) {
    var p = feature.properties;
    var cdtanameClean = cleanNeighborhoodName(p.cdtaname);

    var popupContent =
      "<p>" +
      p.Geographic +
      "</p>" +
      "<p>(" +
      cdtanameClean +
      ")</p>" +
      "The predominant non-English spoken language is: <b>" +
      p.Predominant +
      "</b>";

    layer.bindPopup(popupContent);

    // ADD MOUSEOVER
    layer.on("mouseover", function () {
      layer.setStyle({
        fillOpacity: 0.3,
      });
    });
    layer.on("mouseout", function () {
      layer.setStyle({
        fillOpacity: 0.8,
      });
    });
  },
}).addTo(languageGroup);

languageGroup.addTo(mymap);

// LANGUAGE LEGEND
var languageLegend = L.control({
  position: "bottomleft",
});

languageLegend.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Predominant Languages</h4>";
  div.innerHTML +=
    '<i style="background: #fa9993ff"></i><span>Arabic</span><br>';
  div.innerHTML +=
    '<i style="background: #963f92ff"></i><span>Chinese</span><br>';
  div.innerHTML +=
    '<i style="background: #6b5b95"></i><span>French, Haitian Creole, or Cajun</span><br>';
  div.innerHTML +=
    '<i style="background: #91c1fdff"></i><span>German or other West Germanic languages</span><br>';
  div.innerHTML += '<i style="background: #e7298a"></i><span>Korean</span><br>';
  div.innerHTML +=
    '<i style="background: #606060"></i><span>Other and unspecified languages</span><br>';
  div.innerHTML +=
    '<i style="background: #30bfc7ff"></i><span>Other Asian and Pacific Island languages</span><br>';
  div.innerHTML +=
    '<i style="background: #3288bd"></i><span>Other Indo-European languages</span><br>';
  div.innerHTML +=
    '<i style="background: #51eba6ff"></i><span>Russian, Polish, or other Slavic languages</span><br>';
  div.innerHTML +=
    '<i style="background: #41ab5d"></i><span>Spanish</span><br>';
  div.innerHTML +=
    '<i style="background: #eb554dff"></i><span>Tagalog (incl. Filipino)</span><br>';
  div.innerHTML +=
    '<i style="background: #ccb8cbff"></i><span>Vietnamese</span><br>';
  return div;
};

languageLegend.addTo(mymap);

function getColor(d) {
  return d == "Arabic"
    ? "#fa9993ff"
    : d == "Chinese"
    ? "#963f92ff"
    : d == "French, Haitian Creole, or Cajun"
    ? "#6b5b95"
    : d == "German or other West Germanic languages"
    ? "#91c1fdff"
    : d == "Korean"
    ? "#e7298a"
    : d == "Other and unspecified languages"
    ? "#606060"
    : d == "Other Asian and Pacific Island languages"
    ? "#30bfc7ff"
    : d == "Other Indo-European languages"
    ? "#3288bd"
    : d == "Russian, Polish, or other Slavic languages"
    ? "#51eba6ff"
    : d == "Spanish"
    ? "#41ab5d"
    : d == "Tagalog (incl. Filipino)"
    ? "#eb554dff"
    : d == "Vietnamese"
    ? "#ccb8cbff"
    : "#606060"; // No Data
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.Predominant),
    weight: 0.5,
    opacity: 1,
    color: "white",
    fillOpacity: 0.8,
  };
}

function cleanNeighborhoodName(name) {
  const firstSpaceIndex = name.indexOf(" ");
  const lastParenIndex = name.lastIndexOf("(");

  return name.substring(firstSpaceIndex + 1, lastParenIndex).trim();
}

// LANGUAGE DROP-DOWN
function updateMap() {
  var selectedLanguage = document.getElementById("languageSelect").value;

  languageGroup.clearLayers();

  var filteredData;
  if (selectedLanguage == "") {
    // Predominant language
    filteredData = languageGeoJsonData.features;
  } else {
    // Filtered
    filteredData = languageGeoJsonData.features.filter(function (feature) {
      return feature.properties.Predominant == selectedLanguage;
    });
  }

  var filteredLanguageGeojson = L.geoJson(filteredData, {
    style: function (feature) {
      return {
        fillColor: getColor(feature.properties.Predominant),
        weight: 0.5,
        opacity: 1,
        color: "white",
        fillOpacity: 0.8,
      };
    },
    onEachFeature: function (feature, layer) {
      var p = feature.properties;
      var cdtanameClean = cleanNeighborhoodName(p.cdtaname);

      var popupContent;
      if (selectedLanguage == "") {
        // Default popup content for predominant language
        popupContent =
          "<p>" +
          p.Geographic +
          "</p>" +
          "<p>(" +
          cdtanameClean +
          ")</p>" +
          "The predominant non-English spoken language is: <b>" +
          p.Predominant +
          "</b>";
      } else {
        // Popup content for selected language
        popupContent =
          "<p>" + p.Geographic + "</p>" + "<p>(" + cdtanameClean + ")</p>";

        switch (selectedLanguage) {
          case "Arabic":
            popupContent +=
              "<p>Number of Arabic speakers: " + p.Arabic + "</p>";
            popupContent +=
              "<p>Percentage of population speaking Arabic who are not fluent English speakers: " +
              p.Arabic_nf +
              "%</p>";
            break;

          case "Chinese":
            popupContent +=
              "<p>Number of Chinese speakers: " + p.Chinese + "</p>";
            popupContent +=
              "<p>Percentage of population speaking Chinese who are not fluent English speakers " +
              p.Chinese_nf +
              "%</p>";
            break;

          case "French, Haitian Creole, or Cajun":
            popupContent +=
              "<p>Number of French, Haitian Creole, or Cajun speakers: " +
              p.French +
              "</p>";
            popupContent +=
              "<p>Percentage of population speaking French, Haitian Creole, or Cajun who are not fluent English speakers: " +
              p.French_nf +
              "%</p>";
            break;

          case "German or other West Germanic languages":
            popupContent +=
              "<p>Number of German or other West Germanic languages speakers: " +
              p.German +
              "</p>";
            popupContent +=
              "<p>Percentage of population speaking German or other West Germanic languages who are not fluent English speakers: " +
              p.German_nf +
              "%</p>";
            break;

          case "Korean":
            popupContent +=
              "<p>Number of Korean speakers: " + p.Korean + "</p>";
            popupContent +=
              "<p>Percentage of population speaking Korean who are not fluent English speakers: " +
              p.Korean_nf +
              "%</p>";
            break;

          case "Other and unspecified languages":
            popupContent +=
              "<p>Number of Other and unspecified languages speakers: " +
              p.Other +
              "</p>";
            popupContent +=
              "<p>Percentage of population speaking Other and unspecified languages who are not fluent English speakers: " +
              p.Other_nf +
              "%</p>";
            break;

          case "Other Asian and Pacific Island languages":
            popupContent +=
              "<p>Number of speakers of Other Asian and Pacific Island languages: " +
              p.Other_Asia +
              "</p>";
            popupContent +=
              "<p>Percentage of population speaking Other Asian and Pacific Island languages who are not fluent English speakers: " +
              p.Other_Asia_nf +
              "%</p>";
            break;

          case "Other Indo-European languages":
            popupContent +=
              "<p>Number of speakers of Other Indo-European languages: " +
              p.Other_Indo +
              "</p>";
            popupContent +=
              "<p>Percentage of population speaking Other Indo-European languages who are not fluent English speakers: " +
              p.Other_Indo_nf +
              "%</p>";
            break;

          case "Russian, Polish, or other Slavic languages":
            popupContent +=
              "<p>Number of Russian, Polish, or other Slavic languages speakers: " +
              p.Russian +
              "</p>";
            popupContent +=
              "<p>Percentage of population speaking Russian, Polish, or other Slavic languages who are not fluent English speakers: " +
              p.Russian_nf +
              "%</p>";
            break;

          case "Spanish":
            popupContent +=
              "<p>Number of Spanish speakers: " + p.Spanish + "</p>";
            popupContent +=
              "<p>Percentage of population speaking Spanish who are not fluent English speakers: " +
              p.Spanish_nf +
              "%</p>";
            break;

          case "Tagalog":
            popupContent +=
              "<p>Number of Tagalog speakers: " + p.Tagalog + "</p>";
            popupContent +=
              "<p>Percentage of population speaking Tagalog who are not fluent English speakers: " +
              p.Tagalog_nf +
              "%</p>";
            break;

          case "Vietnamese":
            popupContent +=
              "<p>Number of Vietnamese speakers: " + p.Vietnamese + "</p>";
            popupContent +=
              "<p>Percentage of population speaking Vietnamese who are not fluent English speakers: " +
              p.Vietnamese_nf +
              "%</p>";
            break;
        }
      }

      layer.bindPopup(popupContent);

      layer.on("mouseover", function () {
        layer.setStyle({
          fillOpacity: 0.3,
        });
      });
      layer.on("mouseout", function () {
        layer.setStyle({
          fillOpacity: 0.8,
        });
      });
    },
  }).addTo(languageGroup);
}

// LANGUAGE CONTROL - create a dropdown control to select languages and update the map
var LanguageControl = L.Control.extend({
  options: {
    position: "topright",
  },
  onAdd: function (map) {
    var container = L.DomUtil.create("div");

    var select = L.DomUtil.create("select", "", container);
    select.id = "languageSelect";
    select.onchange = updateMap;

    var languages = [
      { value: "", text: "Select Language" },
      { value: "Arabic", text: "Arabic" },
      { value: "Chinese", text: "Chinese" },
      {
        value: "French, Haitian Creole, or Cajun",
        text: "French, Haitian Creole, or Cajun",
      },
      {
        value: "German or other West Germanic languages",
        text: "German or other West Germanic languages",
      },
      { value: "Korean", text: "Korean" },
      {
        value: "Other and unspecified languages",
        text: "Other and unspecified languages",
      },
      {
        value: "Other Asian and Pacific Island languages",
        text: "Other Asian and Pacific Island languages",
      },
      {
        value: "Other Indo-European languages",
        text: "Other Indo-European languages",
      },
      {
        value: "Russian, Polish, or other Slavic languages",
        text: "Russian, Polish, or other Slavic languages",
      },
      { value: "Spanish", text: "Spanish" },
      { value: "Tagalog (incl. Filipino)", text: "Tagalog (incl. Filipino)" },
      { value: "Vietnamese", text: "Vietnamese" },
    ];

    for (var i = 0; i < languages.length; i++) {
      var option = L.DomUtil.create("option", "", select);
      option.value = languages[i].value;
      option.text = languages[i].text;
    }

    return container;
  },
});

mymap.addControl(new LanguageControl());

updateMap();
