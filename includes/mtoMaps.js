jQuery(document).ready(function($) {
  const mapCenterButton = document.getElementById('map-center-button');

  function centerMap(){
    if(clusterBounds){
      reCenterMap();
    }
  }

  mapCenterButton.addEventListener('click', centerMap);
});