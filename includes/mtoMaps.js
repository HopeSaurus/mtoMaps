jQuery(document).ready(function($) {
  const mapCenterButton = document.getElementById('map-center-button');

  function centerMap(){
    map.flyToBounds(clusterBounds, {
      duration: 2,
    });
  }

  mapCenterButton.addEventListener('click', centerMap);
});