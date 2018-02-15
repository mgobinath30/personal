/* 
** Project	: XOXO Car Digital Inspection
** Summary	: Pulls data from XOXO API and populates web page
** Company	: iCandy Webs, LLC
** Author 	: Bonitto Daley
** Website	: icandywebs.com
*/

//Declare Variables
const 	apiPath		= '/api/api.aspx?request=inspection&id='; //XOXO API Request path
const 	hostName 	= window.location.hostname; //Get the hostName 
let 	inspObj		= ''; //Will store JSON inspection Obj
const 	locale 		= 'en-us';

//Retrieves the GUID from current URL
function getGUID() {
	//let url  = new URL( window.location.href ); //get current URL
	//let GUID = url.searchParams.get( 'inspectionid' ); //get GUID from url param

	let GUID = getUrlParameter( 'inspectionid' );

	//If GUID can't be found from URL, set a test GUID
	if( '' === GUID || null === GUID )
		GUID = window.prompt( 'A GUID could not be found from the URL. Please enter a GUID.' );
		//GUID = '04D281A9-CDBD-4140-A3C7-7078CD4153D5'; //Set test GUID

	return GUID;
};
//Retrieves URL Parameter
function getUrlParameter( name ) {
    name 		= name.replace( /[\[]/, '\\[').replace(/[\]]/, '\\]' );
    let regex 	= new RegExp( '[\\?&]' + name + '=([^&#]*)' );
    let results = regex.exec( location.search );

    return results === null ? '' : decodeURIComponent( results[1].replace( /\+/g, ' ' ) );
};

//Checks domain name and sets API URL
const apiURL = ( 'autoinsight.info' !== hostName || 'xoxocar.com' !== hostName ) ?
	'//autoinsight.info' + apiPath + getGUID() : 
	'//' + hostName + apiPath + getGUID();

/* 
** Get the inspection data request
** Ref: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON
*/
function getInspectionObj() {
	let request = new XMLHttpRequest();
	request.open( 'GET', apiURL );
	request.responseType = 'json';
	request.send();
	return request;
}

//Temporarily store the XHR request
inspObj = getInspectionObj();

/*
** Once XHR request is completed, store JSON Obj
** Populate page w/ data from JSON Obj
*/
inspObj.onload = function() {
	inspObj = inspObj.response;
	populatePage( inspObj );
}

//Fill in all HTML elements w/ inspection data
function populatePage( jsonObj ) {
	populateInspectionDate( jsonObj );
	populateCustomerName( jsonObj );
	populateCustomerVehicle( jsonObj );
	populateShopDetails( jsonObj );
	populateInspectionDetails( jsonObj );
}

//Format and populate the inspection date
function populateInspectionDate( jsonObj ) {
	let inspectionDate 	= new Date( jsonObj.InspectionDate );
	let month 			= inspectionDate.toLocaleString( locale, { month: "long" } );
	let day 			= inspectionDate.getDate();
	let year 			= inspectionDate.getFullYear();
	inspectionDate 		= month + ' ' + day + ' ' + year;
	jQuery( '.inspection-date' ).html( inspectionDate );
}

//Populate customer name
function populateCustomerName( jsonObj ) {
	let firstName 	= jsonObj.CustomerFirstName;
	let lastName 	= jsonObj.CustomerLastName;
	jQuery( '.customer-name' ).html( firstName + ' ' + lastName );
}

//Populate customer vehicle info
function populateCustomerVehicle( jsonObj ) {
	let vehicleHealth 	= jsonObj.VehicleHealthPercent * 100;
	let vehicleImage 	= jsonObj.VehicleImageUrl;
	let vehicleLicense 	= jsonObj.VehicleLicense;
	let vehicleMake 	= jsonObj.VehicleMake;
	let vehicleModel 	= jsonObj.VehicleModel;
	let vehicleMileage 	= Number( jsonObj.VehicleOdometer ).toLocaleString();
	let vehicleVIN 		= jsonObj.VehicleVIN;
	let vehicleYear 	= jsonObj.VehicleYear;

	//Sets health indicator color based upon vehicleHealth
	if ( vehicleHealth <= 16.67 )
		jQuery( '.health-indicator' ).css({ backgroundColor: '#EF3E23' });

	if ( vehicleHealth > 16.67 && vehicleHealth <= 33.33 )
		jQuery( '.health-indicator' ).css({ backgroundColor: '#F57E20' });

	if ( vehicleHealth > 33.33 && vehicleHealth <= 50 )
		jQuery( '.health-indicator' ).css({ backgroundColor: '#FCB316' });

	if ( vehicleHealth > 50 && vehicleHealth <= 66.66 )
		jQuery( '.health-indicator' ).css({ backgroundColor: '#FFDF00' });

	if ( vehicleHealth > 66.66 && vehicleHealth <= 83.33 )
		jQuery( '.health-indicator' ).css({ backgroundColor: '#B2D345' });

	if ( vehicleHealth > 83.33 && vehicleHealth <= 100 )
		jQuery( '.health-indicator' ).css({ backgroundColor: '#68BD45' });

	if( vehicleImage !== '' ){
		jQuery( 'div.vehicle-bg')
			.addClass( 'active' )
			.css({ 'background': 'url(' + vehicleImage + ') no-repeat center' })
		jQuery( 'img.vehicle-bg' ).prop({ src: vehicleImage });
	}
			
	
	jQuery( '.customer-plate-number' ).html( vehicleLicense );
	jQuery( '.customer-VIN' ).html( vehicleVIN );
	jQuery( '.customer-vehicle' ).html( vehicleYear + ' ' + vehicleMake + ' ' + vehicleModel );
	jQuery( '.customer-vehicle-mileage' ).html( vehicleMileage );

	//Animates health meter marker and adjusts for health meter's border width and caret width in px
	jQuery( '.health-meter-marker' )
		.delay(1500)
		.animate({ marginLeft: vehicleHealth - 5.5 + '%' }, 1000);
}

//Populate shop details
function populateShopDetails( jsonObj ) {
	let shop 	 	= '';
	let shopName	= jsonObj.ShopName;
	let shopAddress = jsonObj.ShopAddress;
	let shopCity	= jsonObj.ShopCity;
	let shopState	= jsonObj.ShopState;
	let shopZip	 	= jsonObj.ShopZip;
	let shopPhone	= jsonObj.ShopPhone;
	let shopLogo 	= jsonObj.ShopLogoUrl;

	//Format Shop Address
	shop += shopAddress + '<br>';
	shop += shopCity + ', ';
	shop += shopState + ' ';
	shop += shopZip;

	//Output objects and HTML attributes
	jQuery( '.shop-address' ).html( shop );
	jQuery( '.shop-name' ).html( shopName );
	jQuery( '.shop-details' ).html( shopName + '<br>' + shop );
	jQuery( '.shop-phone-number').html( shopPhone );
	jQuery( '#contact-shop' ).prop({ href: 'tel:+1' + shopPhone });
	jQuery( '.shop-logo' ).prop({ src: shopLogo, alt: shopName + ' logo' });
}

//Populate inspection details
function populateInspectionDetails( jsonObj ) {
	let inspectionHTML		 = '';
	let inspectionTitle		 = jsonObj.InspectionTitle;
	let inspectPointsObj 	 = jsonObj.InspectionPoints;
	let groupNameID			 = []; //Store group names by key to ID them later
	let odometerUnit		 = jsonObj.ShopOdometerUnit;
	let totalPointsPassed 	 = jsonObj.InspectionPointGreenTotal;
	let totalPointsNonUrgent = jsonObj.InspectionPointYellowTotal;
	let totalPointsUrgent 	 = jsonObj.InspectionPointRedTotal;

	jQuery( '#inspection-title' ).html( inspectionTitle );
	jQuery( '.count-passed' ).html( totalPointsPassed );
	jQuery( '.count-nonurgent' ).html( totalPointsNonUrgent );
	jQuery( '.count-urgent' ).html( totalPointsUrgent );

	//Loop through inspections
	jQuery( inspectPointsObj ).each( function() {
		let category 		 = this.Category;
		let decision		 = this.Decision;
		let description 	 = this.Description;
		let groupName		 = this.GroupName;
		let lastServicedDate = new Date( this.LastDate );
		let media			 = this.Media;
		let monthInterval 	 = this.MonthInterval;
		let note			 = this.Note;
		let odometerInterval = this.OdometerInterval;
		let recommendation 	 = this.Recommendation;
		let sequenceNumber   = this.SequenceNumber;
		let techNotes  		 = '';
		let techRecommend 	 = '';
		let learnMoreURL	 = this.LearnMoreUrl;
		let videos			 = [];

		/*
		** 1. Check if Group Name exists in array
		** 2. Store Group Name to identify inspection points by Group ID
		*/
		//if ( !groupNameID.includes( groupName ) )
		if ( !groupNameID.indexOf( groupName ) ) {
			groupNameID.push( groupName );
			inspectionHTML += '<h3 id="group-' + groupNameID.indexOf( groupName ) + 
				'" class="h6 group-name mt-3" data-group-id="' + 
				groupNameID.indexOf( groupName ) + '">' + groupName + '</h3>';
		}

		//Open - #inspection or .inspection-items
		inspectionHTML += '<div id="inspection-' + sequenceNumber + '" class="inspection-' + sequenceNumber + 
			' inspection-item mb-3 fadeInUp active" data-group-id="' + 
			groupNameID.indexOf( groupName ) + '" data-decision="' + decision + '">';
		inspectionHTML += '<div class="content-wrapper clearfix">';
		inspectionHTML += '<table class="table table-responsive-xs m-0"><tbody><tr><td>';
		inspectionHTML += '<div id="health-indicator-wrapper-' + sequenceNumber + '" class="health-indicator-wrapper">';
		inspectionHTML += '<div class="health-indicator"></div>';
		inspectionHTML += '</div></td><td>';
		inspectionHTML += '<h3 class="inspection-description mb-0 h6 heading">' + description + '</h3>';

		//Check for technician notes
		if( note !== '' ) {
			inspectionHTML += '<h4 class="technician-notes mt-2 heading h6">Technician Notes</h4>';
			inspectionHTML += '<p>' + note + '</p>';
			//For modal description
			techNotes 		= '<strong>Technician Notes</strong><p>' + note.replace( /"/g, '&quot;' ) + '</p>';
		}

		//Check for technician recommendations
		if( recommendation !== '' ) {
			inspectionHTML += '<h4 class="technician-recommendations heading h6">Recommendation</h4>';
			inspectionHTML += '<p>' + recommendation + '</p>';
			//For modal description
			techRecommend 	= '<strong>Recommendation</strong><p>' + recommendation.replace( /"/g, '&quot;' ) + '</p>';
		}

		inspectionHTML += '</td></tr></tbody></table></div>'; //Close - .content-wrapper

		//Check if any photos are associated with inspection
		if( media.length !== 0 ) {
			inspectionHTML += '<div class="media-wrapper wrapper clearfix">';
			inspectionHTML += '<table class="table table-responsive-xs mb-0"><tbody>';
			inspectionHTML += '<tr><th scope="row" class="text-center"><i class="icomoon icon-camera"></i></th><td>';

			let imageClass = ( media.length === 1 ) ? 'img-single' : 'img-thumbnail m-1';
				
			//Loop through each media type
			jQuery( media ).each( function(){

				//Checks if media type is an image (1) or video (2)
				if( this.MediaType === 1 ){
					inspectionHTML += 
						'<img class="' + imageClass + ' photo float-left mobx" src="' + 
						this.ThumbnailUrl + '" width="50" height="50" data-rel="' + 
						this.MediaType + '" data-title="' + description.replace( /"/g, '&quot;' ) + '" data-desc="' + techNotes + techRecommend 
						+ '" data-thumb="' + this.ThumbnailUrl + '">';
				} else {
					//Store videos in array for output in videos section
					videos.push( 
						'<a href="' + this.Url + '" class="video mobx" data-poster="' + 
						this.ThumbnailUrl + '" data-rel="' + sequenceNumber + 
						'" data-title="' + description.replace( /"/g, '&quot;' ) + '" data-desc="' + techNotes + techRecommend 
						+ '"><img class="img-thumbnail float-left m-1 mobx" src="' + 
						this.ThumbnailUrl + '" width="50" height="50"></a>' 
					);
				}
			});
			inspectionHTML += '</td></tr></tbody></table></div>'; //Close - .media-wrapper
		}

		//Check if any videos are associated with inspection
		if( learnMoreURL !== '' || videos.length > 0 ) {
			inspectionHTML += '<div class="video-wrapper wrapper clearfix">';
			inspectionHTML += '<table class="table table-responsive-xs mb-0"><tbody>';
			inspectionHTML += '<tr><th scope="row" class="text-center"><i class="icomoon icon-film-play"></i></th><td>';
			inspectionHTML += '<a class="learn-more-url mobx" href="' + 	
				learnMoreURL + '" data-rel="' + sequenceNumber + '-2"><img src="images/learn-more-video.png" class="img-thumbnail float-left m-1"></a>';

			//Checks if videos exist and stores results 
			if ( videos.length > 0 )
				jQuery( videos ).each( function( index, value ){ inspectionHTML += value; });

			inspectionHTML += '</td></tr></tbody></table></div>'; //Close - .video-wrapper
		}

		//Check if any alerts are associated with inspection
		if ( monthInterval > 0 || odometerInterval > 0 ) {
			inspectionHTML += '<div class="alert-wrapper wrapper clearfix">';
			inspectionHTML += '<table class="table table-responsive-xs mb-0"><tbody>';
			inspectionHTML += '<tr><th scope="row" class="text-center"><i class="icomoon icon-question"></i></th><td>';
			
			let monthText = ( monthInterval > 1 ) ? 'MOS.' : 'MO.';

			if( monthInterval > 0 && odometerInterval === 0 )
				inspectionHTML += '<p>Check every ' + monthInterval + ' ' + monthText + '</p>';
			
			if ( monthInterval === 0 && odometerInterval > 0 )
				inspectionHTML += '<p>Check every ' + Number( odometerInterval ).toLocaleString() + ' ' + odometerUnit + '.</p>';
			
			if ( monthInterval > 0 && odometerInterval > 0 )
				inspectionHTML += '<p>Check every ' + monthInterval + ' ' + monthText + ' or '  + 
					Number( odometerInterval ).toLocaleString() + ' ' + odometerUnit + '.</p>';
			
			if( lastServicedDate.getTime() > new Date( "1900-01-01T00:00" ).getTime() )
				inspectionHTML += '<p>' + category + ' Category last serviced on ' + lastServicedDate.toLocaleString( locale ) + '.</p>';
			
			inspectionHTML += '</td></tr></tbody></table></div>'; //Close - .alert-wrapper
		}
		inspectionHTML += '</div>'; //Close - #inspection or .inspection-items
	});
	
	//Output inspection details
	jQuery( '#inspection-details' ).html( inspectionHTML );

	//Loads Lightbox - ModuloBox
    loadModuloBox();

} //Close - populateShopDetails()

//Filters inspection items
jQuery( '.btn-filter' ).on( 'click', function() {
  jQuery( this ).toggleClass( 'active' );

  //Stores active filters
  let activeFilters = [];

  //Get all elements with active filters
  jQuery( '.btn-filter.active' ).each( function(){
    activeFilters.push( jQuery( this ).attr( 'id' ) );
  });

  //Urgent Filter
  if( activeFilters.includes( 'filter-urgent' ) )
    jQuery( '.inspection-item[data-decision="3"]' ).addClass( 'active' );
  else
    jQuery( '.inspection-item[data-decision="3"]' ).removeClass( 'active' );

  //Non-Urgent Filter
  if( activeFilters.includes( 'filter-nonurgent' ) )
    jQuery( '.inspection-item[data-decision="2"]' ).addClass( 'active' );
  else
    jQuery( '.inspection-item[data-decision="2"]' ).removeClass( 'active' );

  //Passed Filter
  if( activeFilters.includes( 'filter-passed' ) )
    jQuery( '.inspection-item[data-decision="1"]' ).addClass( 'active' );
  else
    jQuery( '.inspection-item[data-decision="1"]' ).removeClass( 'active' );

  //Shows/Hides Group names when filter is active/inactive
  jQuery( '.group-name' ).each( function(){
    //Get the Group ID 
    let id = jQuery( this ).data( 'group-id' );
    
    //Checks if group's have any active inspection items/groups
    if( jQuery('[data-group-id="' + id + '"].active').length === 0 )
      jQuery( '#group-' + id ).hide();
    else
      jQuery( '#group-' + id ).show();
  });
});

//Loads Lightbox
function loadModuloBox() {
	//Set ModuloBox options
    let options = { 
    	controls 		: ['zoom', 'play', 'fullScreen', 'close'],
    	mediaSelector 	: '.mobx',
    	scrollToZoom  	: true,
    	prevNextTouch	: true,
    };

	//Create instance of ModuloBox
    let mobx = new ModuloBox( options );
    //Initialize ModuloBox
    mobx.init();
	//Get/Update all media available in the document
	mobx.getGalleries();

} //Close - loadModuloBox()

//Loads Isotope plugin
function loadIsotope() {
	//Set Isotope options
	let options = {
		itemSelector	: '.inspection-item',
		getSortData		: {
	    	groupID 	: '[data-group-id]',
	    	decision 	: '[data-decision]'
	   	}
	};

	//Initialize Isotope
	jQuery( '#inspection-details' ).isotope( options );

} //Close - loadIsotope()