function showMap(mapId) {
  const mapsElements = document.querySelectorAll(".map");
  mapsElements.forEach((map) => {
    if (map.id === mapId) {
      map.classList.add("active");
      maps[mapId].invalidateSize();
    } else {
      map.classList.remove("active");
    }
  });
}

document
  .getElementById("btnDemographicLanguageMap")
  .addEventListener("click", () => {
    showMap("demographicLanguageMap");
  });

document
  .getElementById("btnHealthRiskBehaviorsMap")
  .addEventListener("click", () => {
    showMap("healthRiskBehaviorsMap");
  });

document
  .getElementById("btnHealthOutcomesMap")
  .addEventListener("click", () => {
    showMap("healthOutcomesMap");
  });

document
  .getElementById("btnScreeningRatesMap")
  .addEventListener("click", () => {
    showMap("screeningRatesMap");
  });

document.getElementById("btnHealthStatusMap").addEventListener("click", () => {
  showMap("healthStatusMap");
});

// Show demo-lang map by default
document.addEventListener("DOMContentLoaded", () => {
  showMap("demographicLanguageMap");
  maps["demographicLanguageMap"].invalidateSize();
});
