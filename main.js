function showMap(mapId) {
  const maps = document.querySelectorAll(".map");
  maps.forEach((map) => {
    if (map.id === mapId) {
      map.classList.add("active");
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
  .getElementById("btnUnhealthyBehaviorsMap")
  .addEventListener("click", () => {
    showMap("unhealthyBehaviorsMap");
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

// Show demo-lang map by default
document.addEventListener("DOMContentLoaded", () => {
  showMap("demographicLanguageMap");
});
