jQuery(document).ready(function($) {
  const mapCenterButton = document.getElementById('map-center-button');

  function centerMap(){
    map.fitMapToBounds(clusterBounds, { padding: [50, 50] });
  }

  mapCenterButton.addEventListener('click', centerMap);
});