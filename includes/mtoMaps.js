jQuery(document).ready(function($) {
  const mapCenterButton = document.getElementById('map-center-button');

  function centerMap(){
    map.flyToBounds(clusterBounds, {
      animate: false
    });
  }

  mapCenterButton.addEventListener('click', centerMap);
});