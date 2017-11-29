// set body height
function setBodyHeight() {
	var height = $(window).height();
	$("body").css("height", height);
}

// set elements under fixed image (france-hero)
function setIntroText() {
	var introTxt = document.getElementById("intro-txt"),
	image = document.getElementById("france-hero"),
	imageHeight = window.getComputedStyle(image).getPropertyValue("height");

	introTxt.style.marginTop=imageHeight;
}

// set map under intro text
function mapUnderIntro() {
	var txtHeight = $("#intro-txt").outerHeight(),
	map = $("#map");
	map.css("marginTop", txtHeight);
}

// set height of map to full height of screen
function setMapHeight() {
	var height = $(window).height(),
	map = $("#map");
	map.css("height", height);
}


$(document).ready( function() {

	setMapHeight();

	$(window).resize(function() {
		setMapHeight();
	});

	// As user scrolls, image brightens
	var fixed = true;
	var scrollPosition = 0;
	var letsGo = false;

	// initially set background brightness to 0
	$('#france-hero').css( "filter",'brightness(0%)' );

	$(this).scroll(function() {
	    if( $(this).scrollTop() <= 1000 ) {
	        $('#lets-go').css('display', 'none');
	        // check scroll status and change image brightness
	        if ($(this).scrollTop() <= 20 ) {
	        	$('#france-hero').css( "filter",'brightness(0%)' );
	        } else if ($(this).scrollTop() <= 40) {
	        	$('#france-hero').css( "filter",'brightness(30%)' );
	        } else if ($(this).scrollTop() <= 60) {
	        	$('#france-hero').css( "filter",'brightness(50%)' );
	        } else if ($(this).scrollTop() <= 80) {
	        	$('#france-hero').css( "filter",'brightness(70%)' );
	        } else if ($(this).scrollTop() >= 80) {
	        	$('#france-hero').css( "filter",'brightness(100%)' );
	        } 
	    } 

	    // let's go animation
		var windowHeight = $(window).height();

		// check if intro txt is in the middle-ish of screen
		var textTop = $("#intro-txt").offset().top - $(window).scrollTop();
		if (textTop <= windowHeight*0.3 && !letsGo) {
	    	letsGo = true; 
	    	$('#lets-go').css('display', 'inline');
			$('#lets-go').addClass('animated fadeInDown');
		}
		if (letsGo == true) {
			$('#lets-go').css('display', 'inline');
		}

		// marseille animation
		var mapTop = $("#map").offset().top - $(window).scrollTop();
		if (mapTop <= windowHeight*0.2) {
	    	$('#lets-go').css('display', 'inline');
			$('#marseille-txt').addClass('animated zoomIn');
		}
		if (letsGo == true) {
			$('#lets-go').css('display', 'inline');
		}


	});

	//$('#marseille-txt').addClass('animated fadeOutRight');
});



// map functionality
// help from https://stackoverflow.com/questions/36523773/how-to-make-route-direction-between-multiple-markers

function initialize() {
	var geocoder;
	var map;
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	var locations = [
	    ['Cathedrale de la Major', 43.2990273, 5.3654427, 1],
	    ['Vieux Port', 43.293802, 5.372858, 2],
	    ['Four des Navettes', 43.290699, 5.364259, 3],
	    ['Vallon des Auffes', 43.285771, 5.350088, 4],
	    ['Notre Dame de la Garde', 43.284022, 5.369065, 5]
	];

	directionsDisplay = new google.maps.DirectionsRenderer();

	// initialize map to center on Marseille
	var map = new google.maps.Map(document.getElementById('map'), {
	zoom: 25,
	center: new google.maps.LatLng(43.2924878, 5.3551394),
	mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	directionsDisplay.setMap(map);
	var infowindow = new google.maps.InfoWindow();

	var marker, i;
	var request = {
	travelMode: google.maps.TravelMode.WALKING
	};

	// set markers at locations
	for (i = 0; i < locations.length; i++) {
		marker = new google.maps.Marker({
		  position: new google.maps.LatLng(locations[i][1], locations[i][2]),
		  map: map
		});

		// show info when user clicks on marker
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
		  return function() {
		    infowindow.setContent(locations[i][0]);
		    infowindow.open(map, marker);
		  }
		})(marker, i));

		// differentiate between origin, destination, waypoints
		if (i == 0) request.origin = marker.getPosition();
		else if (i == locations.length - 1) request.destination = marker.getPosition();
		else {
		  if (!request.waypoints) request.waypoints = [];
		  request.waypoints.push({
		    location: marker.getPosition(),
		    stopover: true
		  });
		}
	}

	directionsService.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
		  directionsDisplay.setDirections(result);
		}
	});

	google.maps.event.addDomListener(window, "load", initialize);
}



