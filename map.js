//=========================================================== MAP SETUP =================================================================
var maps = {};

// MAP BOUNDS - set bounds so the map has limits for visibility
var southWest = L.latLng(40.477399, -74.25909), // Southwest bound (farther south and west)
  northEast = L.latLng(40.917577, -73.700272), // Northeast bound (farther north and east)
  bounds = L.latLngBounds(southWest, northEast);

// MAP OBJECT
maps["demographicLanguageMap"] = L.map("demographicLanguageMap", {
  maxBounds: bounds, // Map automatically bounces back to center
  maxZoom: 18,
  minZoom: 11,
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
).addTo(maps["demographicLanguageMap"]);

//=========================================================== VARIABLES =================================================================

var selectedLayer = "language";
var languageControl;
var mymap = maps["demographicLanguageMap"];

//=========================================================== LANGUAGE =================================================================

// Create a FeatureGroup for language layers
var languageGroup = new L.featureGroup().addTo(mymap);

// Predominant language legend
var languageLegend = L.control({
  position: "bottomleft",
});

languageLegend.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");

  // Color boxes and labels for each language
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

// Function to get color based on predominant language
function getColorBasedOnLanguageLegend(language) {
  return language == "Arabic"
    ? "#fa9993ff"
    : language == "Chinese"
    ? "#963f92ff"
    : language == "French, Haitian Creole, or Cajun"
    ? "#6b5b95"
    : language == "German or other West Germanic languages"
    ? "#91c1fdff"
    : language == "Korean"
    ? "#e7298a"
    : language == "Other and unspecified languages"
    ? "#606060"
    : language == "Other Asian and Pacific Island languages"
    ? "#30bfc7ff"
    : language == "Other Indo-European languages"
    ? "#3288bd"
    : language == "Russian, Polish, or other Slavic languages"
    ? "#51eba6ff"
    : language == "Spanish"
    ? "#41ab5d"
    : language == "Tagalog (incl. Filipino)"
    ? "#eb554dff"
    : language == "Vietnamese"
    ? "#ccb8cbff"
    : "#606060";
}

// Function to get color based on the number of speakers of a selected language
function colorScaleNumbersForLanguage(value) {
  return value > 1000
    ? "#00441b"
    : value > 800
    ? "#006d2c"
    : value > 600
    ? "#238b45"
    : value > 400
    ? "#41ae76"
    : value > 200
    ? "#66c2a4"
    : value > 0
    ? "#99d8c9"
    : "#606060";
}

// Function to format neighborhood names
function formatNeighborhoodName(name) {
  const firstSpaceIndex = name.indexOf(" ");
  const lastParenIndex = name.lastIndexOf("(");

  return name.substring(firstSpaceIndex + 1, lastParenIndex).trim();
}

// Function to update map based on selected language from the dropdown
function updateMap() {
  // Get selected language from the dropdown
  var selectedLanguage = document.getElementById("languageSelect").value;

  // Clear existing layer
  languageGroup.clearLayers();

  // Add new layer based on the selected language
  var selectedLanguageGeojson = L.geoJson(languageGeoJsonData, {
    style: function (feature) {
      var style;
      if (selectedLanguage == "") {
        // Default style for predominant language (if no language is selected)
        style = {
          fillColor: getColorBasedOnLanguageLegend(
            feature.properties.Predominant
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      } else {
        var numberOfSpeakers = 0;
        switch (selectedLanguage) {
          case "Arabic":
            numberOfSpeakers = feature.properties.Arabic;
            break;
          case "Chinese":
            numberOfSpeakers = feature.properties.Chinese;
            break;
          case "French, Haitian Creole, or Cajun":
            numberOfSpeakers = feature.properties.French;
            break;
          case "German or other West Germanic languages":
            numberOfSpeakers = feature.properties.German;
            break;
          case "Korean":
            numberOfSpeakers = feature.properties.Korean;
            break;
          case "Other and unspecified languages":
            numberOfSpeakers = feature.properties.Other;
            break;
          case "Other Asian and Pacific Island languages":
            numberOfSpeakers = feature.properties.Other_Asia;
            break;
          case "Other Indo-European languages":
            numberOfSpeakers = feature.properties.Other_Indo;
            break;
          case "Russian, Polish, or other Slavic languages":
            numberOfSpeakers = feature.properties.Russian;
            break;
          case "Spanish":
            numberOfSpeakers = feature.properties.Spanish;
            break;
          case "Tagalog (incl. Filipino)":
            numberOfSpeakers = feature.properties.Tagalog;
            break;
          case "Vietnamese":
            numberOfSpeakers = feature.properties.Vietnamese;
            break;
        }
        style = {
          fillColor: colorScaleNumbersForLanguage(numberOfSpeakers),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      }
      return style;
    },

    // Adding a popup for each features
    onEachFeature: function (feature, layer) {
      var p = feature.properties;
      var cdtanameClean = formatNeighborhoodName(p.cdtaname);

      var popupContent;
      if (selectedLanguage == "") {
        // Default popup content for predominant language
        popupContent =
          "<h3>" + p.Geographic + "</h3>" + "<h5>(" + cdtanameClean + ")</h5>";

        if (p.Estimate == "no data") {
          popupContent += `No data avavailable for this Census Tract`;
        } else {
          popupContent +=
            "Approximately " +
            p.population +
            " people live in " +
            p.Total_pop +
            ", and around " +
            (p.Speak_anot * 100).toFixed(1) +
            "% of these residents speak a language other than English." +
            "The predominant non-English spoken language is: <b>" +
            p.Predominant +
            "</b>";
        }
      } else {
        // Popup content for selected language
        popupContent =
          "<h3>" + p.Geographic + "</h3>" + "<h5>(" + cdtanameClean + ")</h5>";

        if (p.Estimate == "no data") {
          popupContent += `No data avavailable for this Census Tract`;
        } else {
          switch (selectedLanguage) {
            case "Arabic":
              popupContent += `<p>Number of Arabic speakers: <b>${
                p.Arabic
              }</b></p>
              <p>Percentage of population speaking Arabic who are not fluent English speakers: <b>${(
                p.Arabic_nf * 100
              ).toFixed(1)}%
              </b></p>`;
              break;

            case "Chinese":
              popupContent += `<p>Number of Chinese speakers: <b>${
                p.Chinese
              }</b></p>
                <p>Percentage of population speaking Chinese who are not fluent English speakers: <b>${(
                  p.Chinese_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "French, Haitian Creole, or Cajun":
              popupContent += `<p>Number of French, Haitian Creole, or Cajun speakers: <b>${
                p.French
              }</b></p>
                <p>Percentage of population speaking French, Haitian Creole, or Cajun who are not fluent English speakers: <b>${(
                  p.French_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "German or other West Germanic languages":
              popupContent += `<p>Number of German or other West Germanic languages speakers: <b>${
                p.German
              }</b></p>
                <p>Percentage of population speaking German or other West Germanic languages who are not fluent English speakers: <b>${(
                  p.German_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Korean":
              popupContent += `<p>Number of Korean speakers: <b>${
                p.Korean
              }</b></p>
                <p>Percentage of population speaking Korean who are not fluent English speakers: <b>${(
                  p.Korean_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Other and unspecified languages":
              popupContent += `<p>Number of Other and unspecified languages speakers: <b>${
                p.Other
              }</b></p>
                <p>Percentage of population speaking Other and unspecified languages who are not fluent English speakers: <b>${(
                  p.Other_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Other Asian and Pacific Island languages":
              popupContent += `<p>Number of speakers of Other Asian and Pacific Island languages: <b>${
                p.Other_Asia
              }</b></p>
                <p>Percentage of population speaking Other Asian and Pacific Island languages who are not fluent English speakers: <b>${(
                  p.Other_Asia_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Other Indo-European languages":
              popupContent += `<p>Number of speakers of Other Indo-European languages: <b>${
                p.Other_Indo
              }</b></p>
                <p>Percentage of population speaking Other Indo-European languages who are not fluent English speakers: <b>${(
                  p.Other_Indo_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Russian, Polish, or other Slavic languages":
              popupContent += `<p>Number of Russian, Polish, or other Slavic languages speakers: <b>${
                p.Russian
              }</b></p>
                <p>Percentage of population speaking Russian, Polish, or other Slavic languages who are not fluent English speakers: <b>${(
                  p.Russian_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Spanish":
              popupContent += `<p>Number of Spanish speakers: <b>${
                p.Spanish
              }</b></p>
                <p>Percentage of population speaking Spanish who are not fluent English speakers: <b>${(
                  p.Spanish_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Tagalog (incl. Filipino)":
              popupContent += `<p>Number of Tagalog speakers: <b>${
                p.Tagalog
              }</b></p>
                <p>Percentage of population speaking Tagalog who are not fluent English speakers: <b>${(
                  p.Tagalog_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;

            case "Vietnamese":
              popupContent += `<p>Number of Vietnamese speakers: <b>${
                p.Vietnamese
              }</b></p>
                <p>Percentage of population speaking Vietnamese who are not fluent English speakers: <b>${(
                  p.Vietnamese_nf * 100
                ).toFixed(1)}%</b></p>`;
              break;
          }
        }
      }

      layer.bindPopup(popupContent);

      // Change style base on mouse events
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

  // Update the legend based on the selected layer and language
  selectedLayer = "language";
  updateLegend(selectedLayer, selectedLanguage);
}

//=========================================================== LANGUAGE DROPDOWN =================================================================

var LanguageControl = L.Control.extend({
  // Position
  options: {
    position: "topright",
  },

  onAdd: function (map) {
    var container = L.DomUtil.create("div");

    var select = L.DomUtil.create("select", "", container);
    // ID = languageSelect
    select.id = "languageSelect";
    select.onchange = updateMap;

    // Define languages for dropdown
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

    // Populate dropdown
    for (var i = 0; i < languages.length; i++) {
      var option = L.DomUtil.create("option", "", select);
      option.value = languages[i].value;
      option.text = languages[i].text;
    }

    return container;
  },
});

function addLanguageControl() {
  if (!languageControl) {
    languageControl = new LanguageControl();
    mymap.addControl(languageControl);
  }
}

function removeLanguageControl() {
  if (languageControl) {
    mymap.removeControl(languageControl);
    languageControl = null;
  }
}

//=========================================================== DEMOGRAPHICS =================================================================

// Create a GeoJSON layer for demographic data
demographicGeoJson = L.geoJson(languageGeoJsonData, {
  style: function (feature) {
    var style;
    style = {
      fillColor: getColorScaleForDemographics(feature.properties.Total_pop),
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
    return style;
  },

  onEachFeature: function (feature, layer) {
    // Unique identifier to ensure each pie chart is rendered in the correct popup
    var p = feature.properties;
    var id = p.FID;
    var cdtanameClean = formatNeighborhoodName(p.cdtaname);

    // Create popup content with demographic details
    var popUpContent =
      "<h3>" + p.Geographic + "</h3>" + "<h5>(" + cdtanameClean + ")</h5>";

    if (p.Estimate == "no data") {
      popUpContent += `No data available for this Census Tract`;
    } else {
      // Text section
      popUpContent += `
        <p>Approximately <b>${
          p.Total_pop
        }</b> people live in this census tract.</p>
        <p><b>${(p.Male_Pct * 100).toFixed(1)}%</b> (${
        p.Male
      }) of the population are male and <b>${(p.Female_Pct * 100).toFixed(
        1
      )}%</b> (${p.Female}) of the population are female</p>
        <p>The median age is <b>${p.Median_age}</b>.</p>`;

      // Pie chart section
      // Use JSON.stringify to turn the properties object into a string so it can be passed into updatePieChart function
      popUpContent += `
        <button onclick='updatePieChart(${id}, "gender", ${JSON.stringify(
        p
      )})'>Gender Distribution</button>

       <button onclick='updatePieChart(${id}, "age", ${JSON.stringify(
        p
      )})'>Age Distribution</button>
      
       <button onclick='updateBarPlotForRace(${id}, ${JSON.stringify(
        p
      )})'>Race Distribution</button>

        <div id="chart-container-${id}"></div>
      `;
    }

    layer.bindPopup(popUpContent);

    // Event listener to create a pie chart when popup is opened
    layer.on("popupopen", function () {
      // Show gender pie chart by default
      updatePieChart(id, "gender", p);
    });
  },
});

// Function for demographic data to get color based on population
function getColorScaleForDemographics(population) {
  return population > 10000
    ? "#00441b"
    : population > 7500
    ? "#006d2c"
    : population > 5000
    ? "#238b45"
    : population > 2500
    ? "#41ae76"
    : population > 1000
    ? "#66c2a4"
    : population > 500
    ? "#99d8c9"
    : population > 0
    ? "#ccece6"
    : "#606060";
}

// Function for demographic data to create a pie chart
function createPieChartForDemographic(id, data) {
  // Clear any existing element from the container
  d3.select(id).selectAll("*").remove();

  var width = 150,
    height = 150,
    radius = Math.min(width, height) / 2;

  var color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.label))
    .range(d3.schemeCategory10);

  var pie = d3.pie().value((d) => d.value);

  var arc = d3
    .arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  var svg = d3
    .select(id)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var g = svg
    .selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  g.append("path")
    .attr("d", arc)
    .style("fill", (d) => color(d.data.label));

  g.append("text")
    .attr("transform", (d) => "translate(" + arc.centroid(d) + ")")
    .attr("dy", "0.35em")
    .style("text-anchor", "middle")
    .text((d) => d.data.label);

  g.append("text")
    .attr("transform", (d) => "translate(" + arc.centroid(d) + ")")
    .attr("dy", "1.35em")
    .style("text-anchor", "middle")
    .text(
      (d) =>
        Math.round((d.data.value / d3.sum(data, (d) => d.value)) * 100) + "%"
    );
}

// Create pie chart based on selected type (gender or age)
function updatePieChart(id, type, properties) {
  var pieData = [];

  if (type === "gender") {
    pieData = [
      { label: "Male", value: properties.Male },
      { label: "Female", value: properties.Female },
    ];
  } else if (type === "age") {
    pieData = [
      { label: "Under 5", value: properties.Under_5 },
      { label: "Under 18", value: properties.Under_18 },
      { label: "18 and over", value: properties["18_plus"] },
      { label: "65 and over", value: properties["65_plus"] },
    ];
  }

  createPieChartForDemographic(`#chart-container-${id}`, pieData);
}

// Create bar plot base on race data
function createBarPlotForDemographics(id, data) {
  // Remove any existing barplot from the container
  d3.select(id).selectAll("*").remove();

  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 20, bottom: 50, left: 40 },
    width = 350 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select(id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // sort data
  data.sort(function (b, a) {
    return a.value - b.value;
  });

  // X axis
  var x = d3
    .scaleBand()
    .range([0, width])
    .domain(
      data.map(function (d) {
        return d.label;
      })
    )
    .padding(0.2);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear().domain([0, 1000]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Bars
  svg
    .selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.label);
    })
    .attr("y", function (d) {
      return y(d.value);
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
      return height - y(d.value);
    })
    .attr("fill", "#69b3a2");
}

// Update bar plot value base on race data
function updateBarPlotForRace(id, properties) {
  var barData = [
    { label: "Arabic", value: parseInt(properties.Arabic) },
    { label: "Chinese", value: parseInt(properties.Chinese) },
    {
      label: "French, Haitian Creole, or Cajun",
      value: parseInt(properties.French),
    },
    {
      label: "German or other West Germanic languages",
      value: parseInt(properties.German),
    },
    { label: "Korean", value: parseInt(properties.Korean) },
    {
      label: "Other and unspecified languages",
      value: parseInt(properties.Other),
    },
    {
      label: "Other Asian and Pacific Island languages",
      value: parseInt(properties.Other_Asia),
    },
    {
      label: "Other Indo-European languages",
      value: parseInt(properties.Other_Indo),
    },
    {
      label: "Russian, Polish, or other Slavic languages",
      value: parseInt(properties.Russian),
    },
    { label: "Spanish", value: parseInt(properties.Spanish) },
    { label: "Tagalog (incl. Filipino)", value: parseInt(properties.Tagalog) },
    { label: "Vietnamese", value: parseInt(properties.Vietnamese) },
  ];

  createBarPlotForDemographics(`#chart-container-${id}`, barData);
}

//=========================================================== LEGEND =================================================================

// Function to update the legend based on the selected layer and language
function updateLegend(selectedLayer, selectedLanguage) {
  var legendContent = "<h4>Legend</h4>";

  if (selectedLayer == "language") {
    if (selectedLanguage == "") {
      legendContent += "<h4>Predominant Languages</h4>";
      legendContent +=
        '<i style="background: #fa9993ff"></i><span>Arabic</span><br>';
      legendContent +=
        '<i style="background: #963f92ff"></i><span>Chinese</span><br>';
      legendContent +=
        '<i style="background: #6b5b95"></i><span>French, Haitian Creole, or Cajun</span><br>';
      legendContent +=
        '<i style="background: #91c1fdff"></i><span>German or other West Germanic languages</span><br>';
      legendContent +=
        '<i style="background: #e7298a"></i><span>Korean</span><br>';
      legendContent +=
        '<i style="background: #606060"></i><span>Other and unspecified languages</span><br>';
      legendContent +=
        '<i style="background: #30bfc7ff"></i><span>Other Asian and Pacific Island languages</span><br>';
      legendContent +=
        '<i style="background: #3288bd"></i><span>Other Indo-European languages</span><br>';
      legendContent +=
        '<i style="background: #51eba6ff"></i><span>Russian, Polish, or other Slavic languages</span><br>';
      legendContent +=
        '<i style="background: #41ab5d"></i><span>Spanish</span><br>';
      legendContent +=
        '<i style="background: #eb554dff"></i><span>Tagalog (incl. Filipino)</span><br>';
      legendContent +=
        '<i style="background: #ccb8cbff"></i><span>Vietnamese</span><br>';
    } else {
      legendContent += "<h4>Language</h4>";
      legendContent +=
        '<i style="background: #00441b"></i><span>> 1000</span><br>';
      legendContent +=
        '<i style="background: #006d2c"></i><span>800 - 1000</span><br>';
      legendContent +=
        '<i style="background: #238b45"></i><span>600 - 800</span><br>';
      legendContent +=
        '<i style="background: #41ae76"></i><span>400 - 600</span><br>';
      legendContent +=
        '<i style="background: #66c2a4"></i><span>200 - 400</span><br>';
      legendContent +=
        '<i style="background: #99d8c9"></i><span>1 - 200</span><br>';
      legendContent += '<i style="background: #ccece6"></i><span>0</span><br>';
    }
  } else if ((selectedLayer = "demographics")) {
    legendContent += "<h4>Population Density</h4>";
    legendContent +=
      '<i style="background: #00441b"></i><span>> 10000</span><br>';
    legendContent +=
      '<i style="background: #006d2c"></i><span>7500 - 10000</span><br>';
    legendContent +=
      '<i style="background: #238b45"></i><span>5000 - 7500</span><br>';
    legendContent +=
      '<i style="background: #41ae76"></i><span>2500 - 5000</span><br>';
    legendContent +=
      '<i style="background: #66c2a4"></i><span>1000 - 2500</span><br>';
    legendContent +=
      '<i style="background: #99d8c9"></i><span>500 - 1000</span><br>';
    legendContent +=
      '<i style="background: #ccece6"></i><span>1 - 500</span><br>';
    legendContent += '<i style="background: #606060"></i><span>0</span><br>';
  }

  document.querySelector(".legend").innerHTML = legendContent;
}

// Event listener for baselayer change to update the legend
mymap.on("baselayerchange", function (e) {
  if (e.name === "Language Data") {
    selectedLayer = "language";
    selectedLanguage = "";
    addLanguageControl();
    updateLegend(
      selectedLayer,
      document.getElementById("languageSelect").value
    );
    updateMap();
  } else if (e.name === "Demographic Data") {
    selectedLayer = "demographics";
    removeLanguageControl();
    updateLegend(selectedLayer, "");
  }
});

updateLegend(selectedLayer, "");

//=========================================================== LAYERS CONTROL =================================================================

var baseLayers = {
  "Language Data": languageGroup,
  "Demographic Data": demographicGeoJson,
};

L.control.layers(baseLayers, null, { collapsed: false }).addTo(mymap);

addLanguageControl();

updateMap();

//=========================================================== Health Risk Behaviors Map =================================================================

maps["healthRiskBehaviorsMap"] = L.map("healthRiskBehaviorsMap", {
  maxBounds: bounds,
  maxZoom: 18,
  minZoom: 11,
}).setView([40.65, -73.97], 11);

var baseLayer2 = L.tileLayer(
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
).addTo(maps["healthRiskBehaviorsMap"]);

var healthRiskLayers = {
  uninsured: L.geoJson(null, {
    style: healthRiskStyle(
      "Lack of health insurance crude prevalence (%)",
      getColorForUninsured
    ),
  }),
  frequentDrinkers: L.geoJson(null, {
    style: healthRiskStyle(
      "Binge drinking crude prevalence (%)",
      getColorForFrequentDrinkers
    ),
  }),
  currentSmokers: L.geoJson(null, {
    style: healthRiskStyle(
      "Current smoking crude prevalence (%)",
      getColorForCurrentSmokers
    ),
  }),
  sedentaryLifestyle: L.geoJson(null, {
    style: healthRiskStyle(
      "Physical inactivity crude prevalence (%)",
      getColorForSedentaryLifestyle
    ),
  }),
  sleepLessThan7Hours: L.geoJson(null, {
    style: healthRiskStyle(
      "Sleep <7 hours crude prevalence (%)",
      getColorForSleepLessThan7Hours
    ),
  }),
};

function healthRiskStyle(propertyName, colorFunction) {
  return function (feature) {
    return {
      fillColor: colorFunction(feature.properties[propertyName]),
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
  };
}

// TEMPORARY WILL CHANGE LATER
function getColorForUninsured(percent) {
  return percent > 35.8
    ? "#034e7b"
    : percent > 28.3
    ? "#0570b0"
    : percent > 23.4
    ? "#3690c0"
    : percent > 19.1
    ? "#74a9cf"
    : percent > 15.6
    ? "#a6bddb"
    : percent > 12.8
    ? "#d0d1e6"
    : percent > 9.8
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

// TEMPORARY WILL CHANGE LATER
function getColorForFrequentDrinkers(percent) {
  return percent > 35.8
    ? "#034e7b"
    : percent > 28.3
    ? "#0570b0"
    : percent > 23.4
    ? "#3690c0"
    : percent > 19.1
    ? "#74a9cf"
    : percent > 15.6
    ? "#a6bddb"
    : percent > 12.8
    ? "#d0d1e6"
    : percent > 9.8
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

// TEMPORARY WILL CHANGE LATER
function getColorForCurrentSmokers(percent) {
  return percent > 35.8
    ? "#034e7b"
    : percent > 28.3
    ? "#0570b0"
    : percent > 23.4
    ? "#3690c0"
    : percent > 19.1
    ? "#74a9cf"
    : percent > 15.6
    ? "#a6bddb"
    : percent > 12.8
    ? "#d0d1e6"
    : percent > 9.8
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

// TEMPORARY WILL CHANGE LATER
function getColorForSedentaryLifestyle(percent) {
  return percent > 35.8
    ? "#034e7b"
    : percent > 28.3
    ? "#0570b0"
    : percent > 23.4
    ? "#3690c0"
    : percent > 19.1
    ? "#74a9cf"
    : percent > 15.6
    ? "#a6bddb"
    : percent > 12.8
    ? "#d0d1e6"
    : percent > 9.8
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

// TEMPORARY WILL CHANGE LATER
function getColorForSleepLessThan7Hours(percent) {
  return percent > 35.8
    ? "#034e7b"
    : percent > 28.3
    ? "#0570b0"
    : percent > 23.4
    ? "#3690c0"
    : percent > 19.1
    ? "#74a9cf"
    : percent > 15.6
    ? "#a6bddb"
    : percent > 12.8
    ? "#d0d1e6"
    : percent > 9.8
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function addHealthRiskData(data) {
  data.features.forEach(function (feature) {
    var p = feature.properties;

    var uninsuredPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Uninsured: ${p["Lack of health insurance crude prevalence (%)"]}%
    `;

    var frequentDrinkersPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Frequent Drinkers: ${p["Binge drinking crude prevalence (%)"]}%
    `;

    var currentSmokersPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Current Smokers: ${p["Current smoking crude prevalence (%)"]}%
    `;

    var sedentaryLifestylePopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Sedentary Lifestyle: ${p["Physical inactivity crude prevalence (%)"]}%
    `;

    var sleepLessThan7HoursPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Sleep < 7 Hours: ${p["Sleep <7 hours crude prevalence (%)"]}%
    `;

    var uninsuredLayer = L.geoJson(feature, {
      style: healthRiskStyle(
        "Lack of health insurance crude prevalence (%)",
        getColorForUninsured
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(uninsuredPopup);
      },
    });
    healthRiskLayers.uninsured.addLayer(uninsuredLayer);

    var frequentDrinkersLayer = L.geoJson(feature, {
      style: healthRiskStyle(
        "Binge drinking crude prevalence (%)",
        getColorForFrequentDrinkers
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(frequentDrinkersPopup);
      },
    });
    healthRiskLayers.frequentDrinkers.addLayer(frequentDrinkersLayer);

    var currentSmokersLayer = L.geoJson(feature, {
      style: healthRiskStyle(
        "Current smoking crude prevalence (%)",
        getColorForCurrentSmokers
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(currentSmokersPopup);
      },
    });
    healthRiskLayers.currentSmokers.addLayer(currentSmokersLayer);

    var sedentaryLifestyleLayer = L.geoJson(feature, {
      style: healthRiskStyle(
        "Physical inactivity crude prevalence (%)",
        getColorForSedentaryLifestyle
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(sedentaryLifestylePopup);
      },
    });
    healthRiskLayers.sedentaryLifestyle.addLayer(sedentaryLifestyleLayer);

    var sleepLessThan7HoursLayer = L.geoJson(feature, {
      style: healthRiskStyle(
        "Sleep <7 hours crude prevalence (%)",
        getColorForSleepLessThan7Hours
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(sleepLessThan7HoursPopup);
      },
    });
    healthRiskLayers.sleepLessThan7Hours.addLayer(sleepLessThan7HoursLayer);
  });
}

addHealthRiskData(healthDataGeojson);

var baseLayers = {
  Uninsured: healthRiskLayers.uninsured,
  "Frequent Drinkers": healthRiskLayers.frequentDrinkers,
  "Current Smokers": healthRiskLayers.currentSmokers,
  "Sedentary Lifestyle": healthRiskLayers.sedentaryLifestyle,
  "Sleep < 7 Hours": healthRiskLayers.sleepLessThan7Hours,
};

L.control
  .layers(baseLayers, null, { collapsed: false })
  .addTo(maps["healthRiskBehaviorsMap"]);

// HEALTH RISK LEGEND CONTROL
var healthRisklegend = L.control({ position: "bottomleft" });

healthRisklegend.onAdd = function () {
  var div = L.DomUtil.create("div", "healthRiskLegend");
  div.innerHTML = `
    <h4>Percent Uninsured</h4>
    <i style="background: #034e7b"></i><span>35.8% - above</span><br>
    <i style="background: #0570b0"></i><span>28.3% - 35.8%</span><br>
    <i style="background: #3690c0"></i><span>23.4% - 28.3%</span><br>
    <i style="background: #74a9cf"></i><span>19.1% - 23.4%</span><br>
    <i style="background: #a6bddb"></i><span>15.6% - 19.1%</span><br>
    <i style="background: #d0d1e6"></i><span>12.8% - 15.6%</span><br>
    <i style="background: #f1eef6"></i><span>9.8% - 12.8%</span><br>
    <i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>
    <i style="background: #606060"></i><span>No Data</span><br>
  `;
  return div;
};

healthRisklegend.addTo(maps["healthRiskBehaviorsMap"]);

function updateLegendForHealthRisk(layerName) {
  var legendContent = "";
  switch (layerName) {
    case "Uninsured":
      legendContent = `
        <h4>Percent Uninsured</h4>
        <i style="background: #034e7b"></i><span>35.8% - above</span><br>
        <i style="background: #0570b0"></i><span>28.3% - 35.8%</span><br>
        <i style="background: #3690c0"></i><span>23.4% - 28.3%</span><br>
        <i style="background: #74a9cf"></i><span>19.1% - 23.4%</span><br>
        <i style="background: #a6bddb"></i><span>15.6% - 19.1%</span><br>
        <i style="background: #d0d1e6"></i><span>12.8% - 15.6%</span><br>
        <i style="background: #f1eef6"></i><span>9.8% - 12.8%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Frequent Drinkers":
      legendContent = `
        <h4>Percent Frequent Drinkers</h4>
        <i style="background: #034e7b"></i><span>35.8% - above</span><br>
        <i style="background: #0570b0"></i><span>28.3% - 35.8%</span><br>
        <i style="background: #3690c0"></i><span>23.4% - 28.3%</span><br>
        <i style="background: #74a9cf"></i><span>19.1% - 23.4%</span><br>
        <i style="background: #a6bddb"></i><span>15.6% - 19.1%</span><br>
        <i style="background: #d0d1e6"></i><span>12.8% - 15.6%</span><br>
        <i style="background: #f1eef6"></i><span>9.8% - 12.8%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Current Smokers":
      legendContent = `
        <h4>Percent Current Smokers</h4>
        <i style="background: #034e7b"></i><span>35.8% - above</span><br>
        <i style="background: #0570b0"></i><span>28.3% - 35.8%</span><br>
        <i style="background: #3690c0"></i><span>23.4% - 28.3%</span><br>
        <i style="background: #74a9cf"></i><span>19.1% - 23.4%</span><br>
        <i style="background: #a6bddb"></i><span>15.6% - 19.1%</span><br>
        <i style="background: #d0d1e6"></i><span>12.8% - 15.6%</span><br>
        <i style="background: #f1eef6"></i><span>9.8% - 12.8%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Sedentary Lifestyle":
      legendContent = `
        <h4>Percent Sedentary Lifestyle</h4>
        <i style="background: #034e7b"></i><span>35.8% - above</span><br>
        <i style="background: #0570b0"></i><span>28.3% - 35.8%</span><br>
        <i style="background: #3690c0"></i><span>23.4% - 28.3%</span><br>
        <i style="background: #74a9cf"></i><span>19.1% - 23.4%</span><br>
        <i style="background: #a6bddb"></i><span>15.6% - 19.1%</span><br>
        <i style="background: #d0d1e6"></i><span>12.8% - 15.6%</span><br>
        <i style="background: #f1eef6"></i><span>9.8% - 12.8%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Sleep < 7 Hours":
      legendContent = `
        <h4>Percent Sleeping Less Than 7 Hours</h4>
        <i style="background: #034e7b"></i><span>35.8% - above</span><br>
        <i style="background: #0570b0"></i><span>28.3% - 35.8%</span><br>
        <i style="background: #3690c0"></i><span>23.4% - 28.3%</span><br>
        <i style="background: #74a9cf"></i><span>19.1% - 23.4%</span><br>
        <i style="background: #a6bddb"></i><span>15.6% - 19.1%</span><br>
        <i style="background: #d0d1e6"></i><span>12.8% - 15.6%</span><br>
        <i style="background: #f1eef6"></i><span>9.8% - 12.8%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
  }
  document.querySelector(".healthRiskLegend").innerHTML = legendContent;
}

maps["healthRiskBehaviorsMap"].on("baselayerchange", function (e) {
  updateLegendForHealthRisk(e.name);
});

// Set uninsured layer as the default
updateLegendForHealthRisk("Uninsured");
healthRiskLayers.uninsured.addTo(maps["healthRiskBehaviorsMap"]);

//=========================================================== Health Outcomes Map =================================================================

maps["healthOutcomesMap"] = L.map("healthOutcomesMap", {
  maxBounds: bounds,
  maxZoom: 18,
  minZoom: 11,
}).setView([40.65, -73.97], 11);

var baseLayer3 = L.tileLayer(
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
).addTo(maps["healthOutcomesMap"]);

var healthOutcomesLayers = {
  currentAsthma: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Current asthma crude prevalence (%)",
      getColorForCurrentAsthma
    ),
  }),
  highBlood: L.geoJson(null, {
    style: healthOutcomesStyle(
      "High blood pressure crude prevalence (%)",
      getColorForHighBlood
    ),
  }),
  cancerAdults: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Cancer (except skin) crude prevalence (%)",
      getColorForCurrentSmokers
    ),
  }),
  highCholesterol: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Cholesterol screening crude prevalence (%)",
      getColorForCancerAdults
    ),
  }),
  kidneyDisease: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Chronic kidney disease crude prevalence (%)",
      getColorForHighCholesterol
    ),
  }),
  pulmonaryDisease: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Arthritis crude prevalence (%)",
      getColorForPulmonaryDisease
    ),
  }),
  heartDisease: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Coronary heart disease crude prevalence (%)",
      getColorForHeartDisease
    ),
  }),
  diabetes: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Diabetes crude prevalence (%)",
      getColorForDiabetes
    ),
  }),
  obesity: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Obesity crude prevalence (%)",
      getColorForObesity
    ),
  }),
  stroke: L.geoJson(null, {
    style: healthOutcomesStyle(
      "Stroke crude prevalence (%)",
      getColorForStroke
    ),
  }),
};

function healthOutcomesStyle(propertyName, colorFunction) {
  return function (feature) {
    return {
      fillColor: colorFunction(feature.properties[propertyName]),
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
  };
}

// ALL COLOR FUNCTIONS ARE TEMPORARY WILL CHANGE LATER
function getColorForCurrentAsthma(percent) {
  return percent > 35.8
    ? "#034e7b"
    : percent > 28.3
    ? "#0570b0"
    : percent > 23.4
    ? "#3690c0"
    : percent > 19.1
    ? "#74a9cf"
    : percent > 15.6
    ? "#a6bddb"
    : percent > 12.8
    ? "#d0d1e6"
    : percent > 9.8
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function getColorForHighBlood(percent) {
  return percent > 35.8
    ? "#034e7b"
    : percent > 28.3
    ? "#0570b0"
    : percent > 23.4
    ? "#3690c0"
    : percent > 19.1
    ? "#74a9cf"
    : percent > 15.6
    ? "#a6bddb"
    : percent > 12.8
    ? "#d0d1e6"
    : percent > 9.8
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function getColorForCancerAdults(percent) {
  return percent > 35.8
    ? "#034e7b"
    : percent > 28.3
    ? "#0570b0"
    : percent > 23.4
    ? "#3690c0"
    : percent > 19.1
    ? "#74a9cf"
    : percent > 15.6
    ? "#a6bddb"
    : percent > 12.8
    ? "#d0d1e6"
    : percent > 9.8
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function getColorForHighCholesterol(percent) {
  return percent > 35.8
    ? "#034e7b"
    : percent > 28.3
    ? "#0570b0"
    : percent > 23.4
    ? "#3690c0"
    : percent > 19.1
    ? "#74a9cf"
    : percent > 15.6
    ? "#a6bddb"
    : percent > 12.8
    ? "#d0d1e6"
    : percent > 9.8
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function getColorForKidneyDisease(percent) {
  return percent > 35.8
    ? "#034e7b"
    : percent > 28.3
    ? "#0570b0"
    : percent > 23.4
    ? "#3690c0"
    : percent > 19.1
    ? "#74a9cf"
    : percent > 15.6
    ? "#a6bddb"
    : percent > 12.8
    ? "#d0d1e6"
    : percent > 9.8
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function getColorForPulmonaryDisease(percent) {
  return percent > 35.8
    ? "#034e7b"
    : percent > 28.3
    ? "#0570b0"
    : percent > 23.4
    ? "#3690c0"
    : percent > 19.1
    ? "#74a9cf"
    : percent > 15.6
    ? "#a6bddb"
    : percent > 12.8
    ? "#d0d1e6"
    : percent > 9.8
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function getColorForHeartDisease(percent) {
  return percent > 35.8
    ? "#034e7b"
    : percent > 28.3
    ? "#0570b0"
    : percent > 23.4
    ? "#3690c0"
    : percent > 19.1
    ? "#74a9cf"
    : percent > 15.6
    ? "#a6bddb"
    : percent > 12.8
    ? "#d0d1e6"
    : percent > 9.8
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function getColorForDiabetes(percent) {
  return percent > 35.8
    ? "#034e7b"
    : percent > 28.3
    ? "#0570b0"
    : percent > 23.4
    ? "#3690c0"
    : percent > 19.1
    ? "#74a9cf"
    : percent > 15.6
    ? "#a6bddb"
    : percent > 12.8
    ? "#d0d1e6"
    : percent > 9.8
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function getColorForObesity(percent) {
  return percent > 35.8
    ? "#034e7b"
    : percent > 28.3
    ? "#0570b0"
    : percent > 23.4
    ? "#3690c0"
    : percent > 19.1
    ? "#74a9cf"
    : percent > 15.6
    ? "#a6bddb"
    : percent > 12.8
    ? "#d0d1e6"
    : percent > 9.8
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function getColorForStroke(percent) {
  return percent > 35.8
    ? "#034e7b"
    : percent > 28.3
    ? "#0570b0"
    : percent > 23.4
    ? "#3690c0"
    : percent > 19.1
    ? "#74a9cf"
    : percent > 15.6
    ? "#a6bddb"
    : percent > 12.8
    ? "#d0d1e6"
    : percent > 9.8
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function addHealthOutcomesData(data) {
  data.features.forEach(function (feature) {
    var p = feature.properties;

    var currentAsthmaPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Current Asthma: ${p["Current asthma crude prevalence (%)"]}%
    `;

    var highBloodPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      High Blood Pressure: ${p["High blood pressure crude prevalence (%)"]}%
    `;

    var cancerAdultsPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Cancer (except skin): ${p["Cancer (except skin) crude prevalence (%)"]}%
    `;

    var highCholesterolPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      High Cholesterol: ${p["Cholesterol screening crude prevalence (%)"]}%
    `;

    var kidneyDiseasePopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Chronic Kidney Disease: ${p["Chronic kidney disease crude prevalence (%)"]}%
    `;

    var pulmonaryDiseasePopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Pulmonary Disease: ${p["Arthritis crude prevalence (%)"]}%
    `;

    var heartDiseasePopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Heart Disease: ${p["Coronary heart disease crude prevalence (%)"]}%
    `;

    var diabetesPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Diabetes: ${p["Diabetes crude prevalence (%)"]}%
    `;

    var obesityPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Obesity: ${p["Obesity crude prevalence (%)"]}%
    `;

    var strokePopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Stroke: ${p["Stroke crude prevalence (%)"]}%
    `;

    var currentAsthmaLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Current asthma crude prevalence (%)",
        getColorForCurrentAsthma
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(currentAsthmaPopup);
      },
    });
    healthOutcomesLayers.currentAsthma.addLayer(currentAsthmaLayer);

    var highBloodLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "High blood pressure crude prevalence (%)",
        getColorForHighBlood
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(highBloodPopup);
      },
    });
    healthOutcomesLayers.highBlood.addLayer(highBloodLayer);

    var cancerAdultsLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Cancer (except skin) crude prevalence (%)",
        getColorForCancerAdults
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(cancerAdultsPopup);
      },
    });
    healthOutcomesLayers.cancerAdults.addLayer(cancerAdultsLayer);

    var highCholesterolLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Cholesterol screening crude prevalence (%)",
        getColorForHighCholesterol
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(highCholesterolPopup);
      },
    });
    healthOutcomesLayers.highCholesterol.addLayer(highCholesterolLayer);

    var kidneyDiseaseLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Chronic kidney disease crude prevalence (%)",
        getColorForKidneyDisease
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(kidneyDiseasePopup);
      },
    });
    healthOutcomesLayers.kidneyDisease.addLayer(kidneyDiseaseLayer);

    var pulmonaryDiseaseLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Arthritis crude prevalence (%)",
        getColorForPulmonaryDisease
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(pulmonaryDiseasePopup);
      },
    });
    healthOutcomesLayers.pulmonaryDisease.addLayer(pulmonaryDiseaseLayer);

    var heartDiseaseLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Coronary heart disease crude prevalence (%)",
        getColorForHeartDisease
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(heartDiseasePopup);
      },
    });
    healthOutcomesLayers.heartDisease.addLayer(heartDiseaseLayer);

    var diabetesLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Diabetes crude prevalence (%)",
        getColorForDiabetes
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(diabetesPopup);
      },
    });
    healthOutcomesLayers.diabetes.addLayer(diabetesLayer);

    var obesityLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Obesity crude prevalence (%)",
        getColorForObesity
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(obesityPopup);
      },
    });
    healthOutcomesLayers.obesity.addLayer(obesityLayer);

    var strokeLayer = L.geoJson(feature, {
      style: healthOutcomesStyle(
        "Stroke crude prevalence (%)",
        getColorForStroke
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(strokePopup);
      },
    });
    healthOutcomesLayers.stroke.addLayer(strokeLayer);
  });
}

addHealthOutcomesData(healthDataGeojson);

var outcomeBaseLayers = {
  "Current Asthma": healthOutcomesLayers.currentAsthma,
  "High Blood Pressure": healthOutcomesLayers.highBlood,
  "Cancer (except skin)": healthOutcomesLayers.cancerAdults,
  "High Cholesterol": healthOutcomesLayers.highCholesterol,
  "Chronic Kidney Disease": healthOutcomesLayers.kidneyDisease,
  "Pulmonary Disease": healthOutcomesLayers.pulmonaryDisease,
  "Heart Disease": healthOutcomesLayers.heartDisease,
  Diabetes: healthOutcomesLayers.diabetes,
  Obesity: healthOutcomesLayers.obesity,
  Stroke: healthOutcomesLayers.stroke,
};

L.control
  .layers(outcomeBaseLayers, null, { collapsed: false })
  .addTo(maps["healthOutcomesMap"]);

// HEALTH RISK LEGEND CONTROL
var healthOutcomesLegend = L.control({ position: "bottomleft" });

healthOutcomesLegend.onAdd = function () {
  var div = L.DomUtil.create("div", "healthOutcomesLegend");
  div.innerHTML = `
    <h4>Percent Current Asthma</h4>
    <i style="background: #034e7b"></i><span>35.8% - above</span><br>
    <i style="background: #0570b0"></i><span>28.3% - 35.8%</span><br>
    <i style="background: #3690c0"></i><span>23.4% - 28.3%</span><br>
    <i style="background: #74a9cf"></i><span>19.1% - 23.4%</span><br>
    <i style="background: #a6bddb"></i><span>15.6% - 19.1%</span><br>
    <i style="background: #d0d1e6"></i><span>12.8% - 15.6%</span><br>
    <i style="background: #f1eef6"></i><span>9.8% - 12.8%</span><br>
    <i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>
    <i style="background: #606060"></i><span>No Data</span><br>
  `;
  return div;
};

healthOutcomesLegend.addTo(maps["healthOutcomesMap"]);

function updateLegendForHealthOutcomes(layerName) {
  var legendContent = "";
  switch (layerName) {
    case "Current Asthma":
      legendContent = `
        <h4>Percent Current Asthma</h4>
        <i style="background: #034e7b"></i><span>35.8% - above</span><br>
        <i style="background: #0570b0"></i><span>28.3% - 35.8%</span><br>
        <i style="background: #3690c0"></i><span>23.4% - 28.3%</span><br>
        <i style="background: #74a9cf"></i><span>19.1% - 23.4%</span><br>
        <i style="background: #a6bddb"></i><span>15.6% - 19.1%</span><br>
        <i style="background: #d0d1e6"></i><span>12.8% - 15.6%</span><br>
        <i style="background: #f1eef6"></i><span>9.8% - 12.8%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "High Blood Pressure":
      legendContent = `
        <h4>Percent High Blood Pressure</h4>
        <i style="background: #034e7b"></i><span>35.8% - above</span><br>
        <i style="background: #0570b0"></i><span>28.3% - 35.8%</span><br>
        <i style="background: #3690c0"></i><span>23.4% - 28.3%</span><br>
        <i style="background: #74a9cf"></i><span>19.1% - 23.4%</span><br>
        <i style="background: #a6bddb"></i><span>15.6% - 19.1%</span><br>
        <i style="background: #d0d1e6"></i><span>12.8% - 15.6%</span><br>
        <i style="background: #f1eef6"></i><span>9.8% - 12.8%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Cancer (except skin)":
      legendContent = `
        <h4>Percent Cancer (except skin)</h4>
        <i style="background: #034e7b"></i><span>35.8% - above</span><br>
        <i style="background: #0570b0"></i><span>28.3% - 35.8%</span><br>
        <i style="background: #3690c0"></i><span>23.4% - 28.3%</span><br>
        <i style="background: #74a9cf"></i><span>19.1% - 23.4%</span><br>
        <i style="background: #a6bddb"></i><span>15.6% - 19.1%</span><br>
        <i style="background: #d0d1e6"></i><span>12.8% - 15.6%</span><br>
        <i style="background: #f1eef6"></i><span>9.8% - 12.8%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "High Cholesterol":
      legendContent = `
        <h4>Percent High Cholesterol</h4>
        <i style="background: #034e7b"></i><span>35.8% - above</span><br>
        <i style="background: #0570b0"></i><span>28.3% - 35.8%</span><br>
        <i style="background: #3690c0"></i><span>23.4% - 28.3%</span><br>
        <i style="background: #74a9cf"></i><span>19.1% - 23.4%</span><br>
        <i style="background: #a6bddb"></i><span>15.6% - 19.1%</span><br>
        <i style="background: #d0d1e6"></i><span>12.8% - 15.6%</span><br>
        <i style="background: #f1eef6"></i><span>9.8% - 12.8%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Chronic Kidney Disease":
      legendContent = `
        <h4>Percent Chronic Kidney Disease</h4>
        <i style="background: #034e7b"></i><span>35.8% - above</span><br>
        <i style="background: #0570b0"></i><span>28.3% - 35.8%</span><br>
        <i style="background: #3690c0"></i><span>23.4% - 28.3%</span><br>
        <i style="background: #74a9cf"></i><span>19.1% - 23.4%</span><br>
        <i style="background: #a6bddb"></i><span>15.6% - 19.1%</span><br>
        <i style="background: #d0d1e6"></i><span>12.8% - 15.6%</span><br>
        <i style="background: #f1eef6"></i><span>9.8% - 12.8%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Pulmonary Disease":
      legendContent = `
        <h4>Percent Pulmonary Disease</h4>
        <i style="background: #034e7b"></i><span>35.8% - above</span><br>
        <i style="background: #0570b0"></i><span>28.3% - 35.8%</span><br>
        <i style="background: #3690c0"></i><span>23.4% - 28.3%</span><br>
        <i style="background: #74a9cf"></i><span>19.1% - 23.4%</span><br>
        <i style="background: #a6bddb"></i><span>15.6% - 19.1%</span><br>
        <i style="background: #d0d1e6"></i><span>12.8% - 15.6%</span><br>
        <i style="background: #f1eef6"></i><span>9.8% - 12.8%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Heart Disease":
      legendContent = `
        <h4>Percent Heart Disease</h4>
        <i style="background: #034e7b"></i><span>35.8% - above</span><br>
        <i style="background: #0570b0"></i><span>28.3% - 35.8%</span><br>
        <i style="background: #3690c0"></i><span>23.4% - 28.3%</span><br>
        <i style="background: #74a9cf"></i><span>19.1% - 23.4%</span><br>
        <i style="background: #a6bddb"></i><span>15.6% - 19.1%</span><br>
        <i style="background: #d0d1e6"></i><span>12.8% - 15.6%</span><br>
        <i style="background: #f1eef6"></i><span>9.8% - 12.8%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Diabetes":
      legendContent = `
        <h4>Percent Diabetes</h4>
        <i style="background: #034e7b"></i><span>35.8% - above</span><br>
        <i style="background: #0570b0"></i><span>28.3% - 35.8%</span><br>
        <i style="background: #3690c0"></i><span>23.4% - 28.3%</span><br>
        <i style="background: #74a9cf"></i><span>19.1% - 23.4%</span><br>
        <i style="background: #a6bddb"></i><span>15.6% - 19.1%</span><br>
        <i style="background: #d0d1e6"></i><span>12.8% - 15.6%</span><br>
        <i style="background: #f1eef6"></i><span>9.8% - 12.8%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Obesity":
      legendContent = `
        <h4>Percent Obesity</h4>
        <i style="background: #034e7b"></i><span>35.8% - above</span><br>
        <i style="background: #0570b0"></i><span>28.3% - 35.8%</span><br>
        <i style="background: #3690c0"></i><span>23.4% - 28.3%</span><br>
        <i style="background: #74a9cf"></i><span>19.1% - 23.4%</span><br>
        <i style="background: #a6bddb"></i><span>15.6% - 19.1%</span><br>
        <i style="background: #d0d1e6"></i><span>12.8% - 15.6%</span><br>
        <i style="background: #f1eef6"></i><span>9.8% - 12.8%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Stroke":
      legendContent = `
        <h4>Percent Stroke</h4>
        <i style="background: #034e7b"></i><span>35.8% - above</span><br>
        <i style="background: #0570b0"></i><span>28.3% - 35.8%</span><br>
        <i style="background: #3690c0"></i><span>23.4% - 28.3%</span><br>
        <i style="background: #74a9cf"></i><span>19.1% - 23.4%</span><br>
        <i style="background: #a6bddb"></i><span>15.6% - 19.1%</span><br>
        <i style="background: #d0d1e6"></i><span>12.8% - 15.6%</span><br>
        <i style="background: #f1eef6"></i><span>9.8% - 12.8%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 9.8%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
  }
  document.querySelector(".healthOutcomesLegend").innerHTML = legendContent;
}

maps["healthOutcomesMap"].on("baselayerchange", function (e) {
  updateLegendForHealthOutcomes(e.name);
});

// Set currentAsthma layer as the default
updateLegendForHealthOutcomes("Current Asthma");
healthOutcomesLayers.currentAsthma.addTo(maps["healthOutcomesMap"]);

//=========================================================== Screening Rates Map =================================================================

maps["screeningRatesMap"] = L.map("screeningRatesMap", {
  maxBounds: bounds,
  maxZoom: 18,
  minZoom: 11,
}).setView([40.65, -73.97], 11);

var baseLayer4 = L.tileLayer(
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
).addTo(maps["screeningRatesMap"]);

var screeningRatesLayers = {
  annualCheckUp: L.geoJson(null, {
    style: screeningRatesStyle(
      "Annual checkup crude prevalence (%)",
      getColorForAnnualCheckUp
    ),
  }),
  dentalVisit: L.geoJson(null, {
    style: screeningRatesStyle(
      "Dental visit crude prevalence (%)",
      getColorForDentalVisit
    ),
  }),
  cholesterolScreening: L.geoJson(null, {
    style: screeningRatesStyle(
      "Cholesterol screening crude prevalence (%)",
      getColorForCholesterolScreening
    ),
  }),
  mammographyScreening: L.geoJson(null, {
    style: screeningRatesStyle(
      "Mammography use crude prevalence (%)",
      getColorForMammographyScreening
    ),
  }),
  cervicalScreening: L.geoJson(null, {
    style: screeningRatesStyle(
      "Cervical cancer screening crude prevalence (%)",
      getColorForCervicalScreening
    ),
  }),
  colorectalScreening: L.geoJson(null, {
    style: screeningRatesStyle(
      "Colorectal cancer screening crude prevalence (%)",
      getColorForColorectalScreening
    ),
  }),
};

function screeningRatesStyle(propertyName, colorFunction) {
  return function (feature) {
    return {
      fillColor: colorFunction(feature.properties[propertyName]),
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
  };
}

function getColorForAnnualCheckUp(percent) {
  return percent > 70
    ? "#034e7b"
    : percent > 60
    ? "#0570b0"
    : percent > 50
    ? "#3690c0"
    : percent > 40
    ? "#74a9cf"
    : percent > 30
    ? "#a6bddb"
    : percent > 20
    ? "#d0d1e6"
    : percent > 10
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function getColorForDentalVisit(percent) {
  return percent > 70
    ? "#034e7b"
    : percent > 60
    ? "#0570b0"
    : percent > 50
    ? "#3690c0"
    : percent > 40
    ? "#74a9cf"
    : percent > 30
    ? "#a6bddb"
    : percent > 20
    ? "#d0d1e6"
    : percent > 10
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function getColorForCholesterolScreening(percent) {
  return percent > 70
    ? "#034e7b"
    : percent > 60
    ? "#0570b0"
    : percent > 50
    ? "#3690c0"
    : percent > 40
    ? "#74a9cf"
    : percent > 30
    ? "#a6bddb"
    : percent > 20
    ? "#d0d1e6"
    : percent > 10
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function getColorForMammographyScreening(percent) {
  return percent > 70
    ? "#034e7b"
    : percent > 60
    ? "#0570b0"
    : percent > 50
    ? "#3690c0"
    : percent > 40
    ? "#74a9cf"
    : percent > 30
    ? "#a6bddb"
    : percent > 20
    ? "#d0d1e6"
    : percent > 10
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function getColorForCervicalScreening(percent) {
  return percent > 70
    ? "#034e7b"
    : percent > 60
    ? "#0570b0"
    : percent > 50
    ? "#3690c0"
    : percent > 40
    ? "#74a9cf"
    : percent > 30
    ? "#a6bddb"
    : percent > 20
    ? "#d0d1e6"
    : percent > 10
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function getColorForColorectalScreening(percent) {
  return percent > 70
    ? "#034e7b"
    : percent > 60
    ? "#0570b0"
    : percent > 50
    ? "#3690c0"
    : percent > 40
    ? "#74a9cf"
    : percent > 30
    ? "#a6bddb"
    : percent > 20
    ? "#d0d1e6"
    : percent > 10
    ? "#f1eef6"
    : percent > 0
    ? "#f1eef6"
    : "#606060";
}

function addScreeningRatesData(data) {
  data.features.forEach(function (feature) {
    var p = feature.properties;

    var annualCheckUpPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Annual Checkup: ${p["Annual checkup crude prevalence (%)"]}%
    `;

    var dentalVisitPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Dental Visit: ${p["Dental visit crude prevalence (%)"]}%
    `;

    var cholesterolScreeningPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Cholesterol Screening: ${p["Cholesterol screening crude prevalence (%)"]}%
    `;

    var mammographyScreeningPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Mammography Screening: ${p["Mammography use crude prevalence (%)"]}%
    `;

    var cervicalScreeningPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Cervical Screening: ${p["Cervical cancer screening crude prevalence (%)"]}%
    `;

    var colorectalScreeningPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Colorectal Screening: ${p["Colorectal cancer screening crude prevalence (%)"]}%
    `;

    var annualCheckUpLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Annual checkup crude prevalence (%)",
        getColorForAnnualCheckUp
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(annualCheckUpPopup);
      },
    });
    screeningRatesLayers.annualCheckUp.addLayer(annualCheckUpLayer);

    var dentalVisitLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Dental visit crude prevalence (%)",
        getColorForDentalVisit
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(dentalVisitPopup);
      },
    });
    screeningRatesLayers.dentalVisit.addLayer(dentalVisitLayer);

    var cholesterolScreeningLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Cholesterol screening crude prevalence (%)",
        getColorForCholesterolScreening
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(cholesterolScreeningPopup);
      },
    });
    screeningRatesLayers.cholesterolScreening.addLayer(
      cholesterolScreeningLayer
    );

    var mammographyScreeningLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Mammography use crude prevalence (%)",
        getColorForMammographyScreening
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(mammographyScreeningPopup);
      },
    });
    screeningRatesLayers.mammographyScreening.addLayer(
      mammographyScreeningLayer
    );

    var cervicalScreeningLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Cervical cancer screening crude prevalence (%)",
        getColorForCervicalScreening
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(cervicalScreeningPopup);
      },
    });
    screeningRatesLayers.cervicalScreening.addLayer(cervicalScreeningLayer);

    var colorectalScreeningLayer = L.geoJson(feature, {
      style: screeningRatesStyle(
        "Colorectal cancer screening crude prevalence (%)",
        getColorForColorectalScreening
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(colorectalScreeningPopup);
      },
    });
    screeningRatesLayers.colorectalScreening.addLayer(colorectalScreeningLayer);
  });
}

addScreeningRatesData(healthDataGeojson);

var screeningBaseLayers = {
  "Annual Checkup": screeningRatesLayers.annualCheckUp,
  "Dental Visit": screeningRatesLayers.dentalVisit,
  "Cholesterol Screening": screeningRatesLayers.cholesterolScreening,
  "Mammography Screening": screeningRatesLayers.mammographyScreening,
  "Cervical Screening": screeningRatesLayers.cervicalScreening,
  "Colorectal Screening": screeningRatesLayers.colorectalScreening,
};

L.control
  .layers(screeningBaseLayers, null, { collapsed: false })
  .addTo(maps["screeningRatesMap"]);

// SCREENING RATES LEGEND CONTROL
var screeningRatesLegend = L.control({ position: "bottomleft" });

screeningRatesLegend.onAdd = function () {
  var div = L.DomUtil.create("div", "screeningRatesLegend");
  div.innerHTML = `
    <h4>Percent Annual Checkup</h4>
    <i style="background: #034e7b"></i><span>70% - above</span><br>
    <i style="background: #0570b0"></i><span>60% - 70%</span><br>
    <i style="background: #3690c0"></i><span>50% - 60%</span><br>
    <i style="background: #74a9cf"></i><span>40% - 50%</span><br>
    <i style="background: #a6bddb"></i><span>30% - 40%</span><br>
    <i style="background: #d0d1e6"></i><span>20% - 30%</span><br>
    <i style="background: #f1eef6"></i><span>10% - 20%</span><br>
    <i style="background: #f1eef6"></i><span>0% - 10%</span><br>
    <i style="background: #606060"></i><span>No Data</span><br>
  `;
  return div;
};

screeningRatesLegend.addTo(maps["screeningRatesMap"]);

function updateLegendForScreeningRates(layerName) {
  var legendContent = "";
  switch (layerName) {
    case "Annual Checkup":
      legendContent = `
        <h4>Percent Annual Checkup</h4>
        <i style="background: #034e7b"></i><span>70% - above</span><br>
        <i style="background: #0570b0"></i><span>60% - 70%</span><br>
        <i style="background: #3690c0"></i><span>50% - 60%</span><br>
        <i style="background: #74a9cf"></i><span>40% - 50%</span><br>
        <i style="background: #a6bddb"></i><span>30% - 40%</span><br>
        <i style="background: #d0d1e6"></i><span>20% - 30%</span><br>
        <i style="background: #f1eef6"></i><span>10% - 20%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 10%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Dental Visit":
      legendContent = `
        <h4>Percent Dental Visit</h4>
        <i style="background: #034e7b"></i><span>70% - above</span><br>
        <i style="background: #0570b0"></i><span>60% - 70%</span><br>
        <i style="background: #3690c0"></i><span>50% - 60%</span><br>
        <i style="background: #74a9cf"></i><span>40% - 50%</span><br>
        <i style="background: #a6bddb"></i><span>30% - 40%</span><br>
        <i style="background: #d0d1e6"></i><span>20% - 30%</span><br>
        <i style="background: #f1eef6"></i><span>10% - 20%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 10%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Cholesterol Screening":
      legendContent = `
        <h4>Percent Cholesterol Screening</h4>
        <i style="background: #034e7b"></i><span>70% - above</span><br>
        <i style="background: #0570b0"></i><span>60% - 70%</span><br>
        <i style="background: #3690c0"></i><span>50% - 60%</span><br>
        <i style="background: #74a9cf"></i><span>40% - 50%</span><br>
        <i style="background: #a6bddb"></i><span>30% - 40%</span><br>
        <i style="background: #d0d1e6"></i><span>20% - 30%</span><br>
        <i style="background: #f1eef6"></i><span>10% - 20%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 10%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Mammography Screening":
      legendContent = `
        <h4>Percent Mammography Screening</h4>
        <i style="background: #034e7b"></i><span>70% - above</span><br>
        <i style="background: #0570b0"></i><span>60% - 70%</span><br>
        <i style="background: #3690c0"></i><span>50% - 60%</span><br>
        <i style="background: #74a9cf"></i><span>40% - 50%</span><br>
        <i style="background: #a6bddb"></i><span>30% - 40%</span><br>
        <i style="background: #d0d1e6"></i><span>20% - 30%</span><br>
        <i style="background: #f1eef6"></i><span>10% - 20%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 10%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Cervical Screening":
      legendContent = `
        <h4>Percent Cervical Screening</h4>
        <i style="background: #034e7b"></i><span>70% - above</span><br>
        <i style="background: #0570b0"></i><span>60% - 70%</span><br>
        <i style="background: #3690c0"></i><span>50% - 60%</span><br>
        <i style="background: #74a9cf"></i><span>40% - 50%</span><br>
        <i style="background: #a6bddb"></i><span>30% - 40%</span><br>
        <i style="background: #d0d1e6"></i><span>20% - 30%</span><br>
        <i style="background: #f1eef6"></i><span>10% - 20%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 10%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
    case "Colorectal Screening":
      legendContent = `
        <h4>Percent Colorectal Screening</h4>
        <i style="background: #034e7b"></i><span>70% - above</span><br>
        <i style="background: #0570b0"></i><span>60% - 70%</span><br>
        <i style="background: #3690c0"></i><span>50% - 60%</span><br>
        <i style="background: #74a9cf"></i><span>40% - 50%</span><br>
        <i style="background: #a6bddb"></i><span>30% - 40%</span><br>
        <i style="background: #d0d1e6"></i><span>20% - 30%</span><br>
        <i style="background: #f1eef6"></i><span>10% - 20%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 10%</span><br>
        <i style="background: #606060"></i><span>No Data</span><br>
      `;
      break;
  }
  document.querySelector(".screeningRatesLegend").innerHTML = legendContent;
}

maps["screeningRatesMap"].on("baselayerchange", function (e) {
  updateLegendForScreeningRates(e.name);
});

// Set annualCheckUp layer as the default
updateLegendForScreeningRates("Annual Checkup");
screeningRatesLayers.annualCheckUp.addTo(maps["screeningRatesMap"]);

//=========================================================== Health Status Map =================================================================

maps["healthStatusMap"] = L.map("healthStatusMap", {
  maxBounds: bounds,
  maxZoom: 18,
  minZoom: 11,
}).setView([40.65, -73.97], 11);

var baseLayer5 = L.tileLayer(
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
).addTo(maps["healthStatusMap"]);

var healthStatusLayers = {
  depression: L.geoJson(null, {
    style: healthStatusStyle(
      "Depression crude prevalence (%)",
      getColorForDepression
    ),
  }),
  mentalHealthBad: L.geoJson(null, {
    style: healthStatusStyle(
      "Frequent mental health distress crude prevalence (%)",
      getColorForMentalHealthBad
    ),
  }),
  physicalHealthBad: L.geoJson(null, {
    style: healthStatusStyle(
      "Frequent physical health distress crude prevalence (%)",
      getColorForPhysicalHealthBad
    ),
  }),
  poorSelfRatedHealth: L.geoJson(null, {
    style: healthStatusStyle(
      "Fair or poor health crude prevalence (%)",
      getColorForPoorSelfRatedHealth
    ),
  }),
  disability: L.geoJson(null, {
    style: healthStatusStyle(
      "Any disability crude prevalence (%)",
      getColorForDisability
    ),
  }),
};

function healthStatusStyle(propertyName, colorFunction) {
  return function (feature) {
    return {
      fillColor: colorFunction(feature.properties[propertyName]),
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
  };
}

// ALL COLOR FUNCTIONS ARE TEMPORARY WILL CHANGE LATER
function getColorForDepression(percent) {
  return percent > 20
    ? "#034e7b"
    : percent > 15
    ? "#0570b0"
    : percent > 10
    ? "#3690c0"
    : percent > 5
    ? "#74a9cf"
    : percent > 0
    ? "#a6bddb"
    : "#d0d1e6";
}

function getColorForMentalHealthBad(percent) {
  return percent > 20
    ? "#034e7b"
    : percent > 15
    ? "#0570b0"
    : percent > 10
    ? "#3690c0"
    : percent > 5
    ? "#74a9cf"
    : percent > 0
    ? "#a6bddb"
    : "#d0d1e6";
}

function getColorForPhysicalHealthBad(percent) {
  return percent > 20
    ? "#034e7b"
    : percent > 15
    ? "#0570b0"
    : percent > 10
    ? "#3690c0"
    : percent > 5
    ? "#74a9cf"
    : percent > 0
    ? "#a6bddb"
    : "#d0d1e6";
}

function getColorForPoorSelfRatedHealth(percent) {
  return percent > 20
    ? "#034e7b"
    : percent > 15
    ? "#0570b0"
    : percent > 10
    ? "#3690c0"
    : percent > 5
    ? "#74a9cf"
    : percent > 0
    ? "#a6bddb"
    : "#d0d1e6";
}

function getColorForDisability(percent) {
  return percent > 30
    ? "#034e7b"
    : percent > 25
    ? "#0570b0"
    : percent > 20
    ? "#3690c0"
    : percent > 15
    ? "#74a9cf"
    : percent > 10
    ? "#a6bddb"
    : percent > 5
    ? "#d0d1e6"
    : "#f1eef6";
}

function addHealthStatusData(data) {
  data.features.forEach(function (feature) {
    var p = feature.properties;

    var depressionPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Depression: ${p["Depression crude prevalence (%)"]}%
    `;

    var mentalHealthBadPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Frequent Mental Health Distress: ${p["Frequent mental health distress crude prevalence (%)"]}%
    `;

    var physicalHealthBadPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Frequent Physical Health Distress: ${p["Frequent physical health distress crude prevalence (%)"]}%
    `;

    var poorSelfRatedHealthPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Fair or Poor Health: ${p["Fair or poor health crude prevalence (%)"]}%
    `;

    var disabilityPopup = `
      Census tract: ${p["Census tract FIPS"]}<br>
      Any Disability: ${p["Any disability crude prevalence (%)"]}%
    `;

    var depressionLayer = L.geoJson(feature, {
      style: healthStatusStyle(
        "Depression crude prevalence (%)",
        getColorForDepression
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(depressionPopup);
      },
    });
    healthStatusLayers.depression.addLayer(depressionLayer);

    var mentalHealthBadLayer = L.geoJson(feature, {
      style: healthStatusStyle(
        "Frequent mental health distress crude prevalence (%)",
        getColorForMentalHealthBad
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(mentalHealthBadPopup);
      },
    });
    healthStatusLayers.mentalHealthBad.addLayer(mentalHealthBadLayer);

    var physicalHealthBadLayer = L.geoJson(feature, {
      style: healthStatusStyle(
        "Frequent physical health distress crude prevalence (%)",
        getColorForPhysicalHealthBad
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(physicalHealthBadPopup);
      },
    });
    healthStatusLayers.physicalHealthBad.addLayer(physicalHealthBadLayer);

    var poorSelfRatedHealthLayer = L.geoJson(feature, {
      style: healthStatusStyle(
        "Fair or poor health crude prevalence (%)",
        getColorForPoorSelfRatedHealth
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(poorSelfRatedHealthPopup);
      },
    });
    healthStatusLayers.poorSelfRatedHealth.addLayer(poorSelfRatedHealthLayer);

    var disabilityLayer = L.geoJson(feature, {
      style: healthStatusStyle(
        "Any disability crude prevalence (%)",
        getColorForDisability
      ),
      onEachFeature: function (feature, layer) {
        layer.bindPopup(disabilityPopup);
      },
    });
    healthStatusLayers.disability.addLayer(disabilityLayer);
  });
}

addHealthStatusData(healthDataGeojson);

var healthStatusBaseLayers = {
  Depression: healthStatusLayers.depression,
  "Frequent Mental Health Distress": healthStatusLayers.mentalHealthBad,
  "Frequent Physical Health Distress": healthStatusLayers.physicalHealthBad,
  "Fair or Poor Health": healthStatusLayers.poorSelfRatedHealth,
  Disability: healthStatusLayers.disability,
};

L.control
  .layers(healthStatusBaseLayers, null, { collapsed: false })
  .addTo(maps["healthStatusMap"]);

// HEALTH STATUS LEGEND CONTROL
var healthStatusLegend = L.control({ position: "bottomleft" });

healthStatusLegend.onAdd = function () {
  var div = L.DomUtil.create("div", "healthStatusLegend");
  div.innerHTML = `
    <h4>Percent Depression</h4>
    <i style="background: #034e7b"></i><span>20% - above</span><br>
    <i style="background: #0570b0"></i><span>15% - 20%</span><br>
    <i style="background: #3690c0"></i><span>10% - 15%</span><br>
    <i style="background: #74a9cf"></i><span>5% - 10%</span><br>
    <i style="background: #a6bddb"></i><span>0% - 5%</span><br>
    <i style="background: #d0d1e6"></i><span>No Data</span><br>
  `;
  return div;
};

healthStatusLegend.addTo(maps["healthStatusMap"]);

function updateLegendForHealthStatus(layerName) {
  var legendContent = "";
  switch (layerName) {
    case "Depression":
      legendContent = `
        <h4>Percent Depression</h4>
        <i style="background: #034e7b"></i><span>20% - above</span><br>
        <i style="background: #0570b0"></i><span>15% - 20%</span><br>
        <i style="background: #3690c0"></i><span>10% - 15%</span><br>
        <i style="background: #74a9cf"></i><span>5% - 10%</span><br>
        <i style="background: #a6bddb"></i><span>0% - 5%</span><br>
        <i style="background: #d0d1e6"></i><span>No Data</span><br>
      `;
      break;
    case "Frequent Mental Health Distress":
      legendContent = `
        <h4>Percent Frequent Mental Health Distress</h4>
        <i style="background: #034e7b"></i><span>20% - above</span><br>
        <i style="background: #0570b0"></i><span>15% - 20%</span><br>
        <i style="background: #3690c0"></i><span>10% - 15%</span><br>
        <i style="background: #74a9cf"></i><span>5% - 10%</span><br>
        <i style="background: #a6bddb"></i><span>0% - 5%</span><br>
        <i style="background: #d0d1e6"></i><span>No Data</span><br>
      `;
      break;
    case "Frequent Physical Health Distress":
      legendContent = `
        <h4>Percent Frequent Physical Health Distress</h4>
        <i style="background: #034e7b"></i><span>20% - above</span><br>
        <i style="background: #0570b0"></i><span>15% - 20%</span><br>
        <i style="background: #3690c0"></i><span>10% - 15%</span><br>
        <i style="background: #74a9cf"></i><span>5% - 10%</span><br>
        <i style="background: #a6bddb"></i><span>0% - 5%</span><br>
        <i style="background: #d0d1e6"></i><span>No Data</span><br>
      `;
      break;
    case "Fair or Poor Health":
      legendContent = `
        <h4>Percent Fair or Poor Health</h4>
        <i style="background: #034e7b"></i><span>20% - above</span><br>
        <i style="background: #0570b0"></i><span>15% - 20%</span><br>
        <i style="background: #3690c0"></i><span>10% - 15%</span><br>
        <i style="background: #74a9cf"></i><span>5% - 10%</span><br>
        <i style="background: #a6bddb"></i><span>0% - 5%</span><br>
        <i style="background: #d0d1e6"></i><span>No Data</span><br>
      `;
      break;
    case "Disability":
      legendContent = `
        <h4>Percent Disability</h4>
        <i style="background: #034e7b"></i><span>30% - above</span><br>
        <i style="background: #0570b0"></i><span>25% - 30%</span><br>
        <i style="background: #3690c0"></i><span>20% - 25%</span><br>
        <i style="background: #74a9cf"></i><span>15% - 20%</span><br>
        <i style="background: #a6bddb"></i><span>10% - 15%</span><br>
        <i style="background: #d0d1e6"></i><span>5% - 10%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 5%</span><br>
        <i style="background: #f1eef6"></i><span>No Data</span><br>
      `;
      break;
    case "Hearing disability crude prevalence (%)":
      legendContent = `
        <h4>Percent Hearing Disability</h4>
        <i style="background: #034e7b"></i><span>30% - above</span><br>
        <i style="background: #0570b0"></i><span>25% - 30%</span><br>
        <i style="background: #3690c0"></i><span>20% - 25%</span><br>
        <i style="background: #74a9cf"></i><span>15% - 20%</span><br>
        <i style="background: #a6bddb"></i><span>10% - 15%</span><br>
        <i style="background: #d0d1e6"></i><span>5% - 10%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 5%</span><br>
        <i style="background: #f1eef6"></i><span>No Data</span><br>
        `;
      break;
    case "Vision disability crude prevalence (%)":
      legendContent = `
        <h4>Percent Vision Disability</h4>
        <i style="background: #034e7b"></i><span>30% - above</span><br>
        <i style="background: #0570b0"></i><span>25% - 30%</span><br>
        <i style="background: #3690c0"></i><span>20% - 25%</span><br>
        <i style="background: #74a9cf"></i><span>15% - 20%</span><br>
        <i style="background: #a6bddb"></i><span>10% - 15%</span><br>
        <i style="background: #d0d1e6"></i><span>5% - 10%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 5%</span><br>
        <i style="background: #f1eef6"></i><span>No Data</span><br>
          `;
      break;
    case "Cognitive disability crude prevalence (%)":
      legendContent = `
        <h4>Percent Cognitive Disability</h4>
        <i style="background: #034e7b"></i><span>30% - above</span><br>
        <i style="background: #0570b0"></i><span>25% - 30%</span><br>
        <i style="background: #3690c0"></i><span>20% - 25%</span><br>
        <i style="background: #74a9cf"></i><span>15% - 20%</span><br>
        <i style="background: #a6bddb"></i><span>10% - 15%</span><br>
        <i style="background: #d0d1e6"></i><span>5% - 10%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 5%</span><br>
        <i style="background: #f1eef6"></i><span>No Data</span><br>
            `;
      break;
    case "Mobility disability crude prevalence (%)":
      legendContent = `
        <h4>Percent Mobility Disability</h4>
        <i style="background: #034e7b"></i><span>30% - above</span><br>
        <i style="background: #0570b0"></i><span>25% - 30%</span><br>
        <i style="background: #3690c0"></i><span>20% - 25%</span><br>
        <i style="background: #74a9cf"></i><span>15% - 20%</span><br>
        <i style="background: #a6bddb"></i><span>10% - 15%</span><br>
        <i style="background: #d0d1e6"></i><span>5% - 10%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 5%</span><br>
        <i style="background: #f1eef6"></i><span>No Data</span><br>
              `;
      break;
    case "Self-care disability crude prevalence (%)":
      legendContent = `
        <h4>Percent Self-care Disability</h4>
        <i style="background: #034e7b"></i><span>30% - above</span><br>
        <i style="background: #0570b0"></i><span>25% - 30%</span><br>
        <i style="background: #3690c0"></i><span>20% - 25%</span><br>
        <i style="background: #74a9cf"></i><span>15% - 20%</span><br>
        <i style="background: #a6bddb"></i><span>10% - 15%</span><br>
        <i style="background: #d0d1e6"></i><span>5% - 10%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 5%</span><br>
        <i style="background: #f1eef6"></i><span>No Data</span><br>
              `;
      break;
    case "Independent living disability crude prevalence (%)":
      legendContent = `
        <h4>Percent Independent Living Disability</h4>
        <i style="background: #034e7b"></i><span>30% - above</span><br>
        <i style="background: #0570b0"></i><span>25% - 30%</span><br>
        <i style="background: #3690c0"></i><span>20% - 25%</span><br>
        <i style="background: #74a9cf"></i><span>15% - 20%</span><br>
        <i style="background: #a6bddb"></i><span>10% - 15%</span><br>
        <i style="background: #d0d1e6"></i><span>5% - 10%</span><br>
        <i style="background: #f1eef6"></i><span>0% - 5%</span><br>
        <i style="background: #f1eef6"></i><span>No Data</span><br>
                `;
      break;
  }
  document.querySelector(".healthStatusLegend").innerHTML = legendContent;
}

maps["healthStatusMap"].on("baselayerchange", function (e) {
  updateLegendForHealthStatus(e.name);
});

// Set depression layer as the default
updateLegendForHealthStatus("Depression");
healthStatusLayers.depression.addTo(maps["healthStatusMap"]);

//=========================================================== Health Status DROPDOWN =================================================================

var disabilityControl;

var DisabilityControl = L.Control.extend({
  // Position
  options: {
    position: "topright",
  },

  onAdd: function (map) {
    var container = L.DomUtil.create("div", "disability-control");

    var select = L.DomUtil.create("select", "", container);
    select.id = "disabilitySelect";
    select.onchange = updateHealthStatusMap;

    var disabilities = [
      { value: "", text: "Any Disability Among Adults Aged ≥ 18 Years" },
      {
        value: "Hearing disability crude prevalence (%)",
        text: "Hearing Disability Among Adults Aged ≥18 Years",
      },
      {
        value: "Vision disability crude prevalence (%)",
        text: "Vision Disability Among Adults Aged ≥18 Years",
      },
      {
        value: "Cognitive disability crude prevalence (%)",
        text: "Cognitive Disability Among Adults Aged ≥18 Years",
      },
      {
        value: "Mobility disability crude prevalence (%)",
        text: "Mobility Disability Among Adults Aged ≥18 Years",
      },
      {
        value: "Self-care disability crude prevalence (%)",
        text: "Self-care Disability Among Adults Aged ≥18 Years",
      },
      {
        value: "Independent living disability crude prevalence (%)",
        text: "Independent Living Disability Among Adults Aged ≥18 Years",
      },
    ];

    // Populate dropdown
    for (var i = 0; i < disabilities.length; i++) {
      var option = L.DomUtil.create("option", "", select);
      option.value = disabilities[i].value;
      option.text = disabilities[i].text;
    }

    return container;
  },
});

function addDisabilityControl() {
  if (!disabilityControl) {
    disabilityControl = new DisabilityControl();
    maps["healthStatusMap"].addControl(disabilityControl);
  }
}

function removeDisabilityControl() {
  if (disabilityControl) {
    maps["healthStatusMap"].removeControl(disabilityControl);
    disabilityControl = null;
  }
}

function updateHealthStatusMap() {
  // Get selected disability from the dropdown
  var selectedDisability = document.getElementById("disabilitySelect").value;

  // Clear existing layer
  healthStatusLayers.disability.clearLayers();

  // Add new layer based on the selected disability
  var selectedDisabilityGeojson = L.geoJson(healthDataGeojson, {
    style: function (feature) {
      var style;
      if (selectedDisability === "") {
        // Default style for any disability (if no specific disability is selected)
        style = {
          fillColor: getColorForDisability(
            feature.properties["Any disability crude prevalence (%)"]
          ),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      } else {
        var percentage = feature.properties[selectedDisability];
        style = {
          fillColor: getColorForDisability(percentage),
          weight: 0.5,
          opacity: 1,
          color: "white",
          fillOpacity: 0.8,
        };
      }
      return style;
    },

    // Adding a popup for each feature
    onEachFeature: function (feature, layer) {
      var p = feature.properties;

      var popupContent;
      if (selectedDisability === "") {
        popupContent = `
          <p>Any Disability Among Adults Aged ≥ 18 Years: ${p["Any disability crude prevalence (%)"]}%</p>
        `;
      } else {
        popupContent = `
          <p>${selectedDisability}: ${p[selectedDisability]}%</p>
        `;
      }

      layer.bindPopup(popupContent);

      // Change style based on mouse events
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
  }).addTo(healthStatusLayers.disability);

  // Update the legend based on selected layer and disability
  selectedLayer = "disability";
  updateLegendForHealthStatus(selectedDisability);
}

// Eventlistener for baselayer change to toggle disability dropdown
maps["healthStatusMap"].on("baselayerchange", function (e) {
  if (e.name == "Disability") {
    addDisabilityControl();
  } else {
    removeDisabilityControl();
  }
});
