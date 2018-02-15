/* 
** Project  : XOXO Car Digital Inspection
** Summary  : Custom animations for XOXO web app
** Company  : iCandy Webs, LLC
** Developer: Bonitto Daley
** Website  : icandywebs.com
*/

//Activates and Deactivates classes and styles on hamburger menu click event
jQuery( '#menu' ).on( 'click', function(e){

  //Activate Menu
  jQuery( this ).toggleClass( 'active' );

  if ( jQuery( this ).hasClass( 'active' ) ) {
    //Activate Menu Panel
    jQuery( '#menu-panel-wrapper' )
      .css({ 'display': 'block' })
      .animate({ left: 15 })
      .toggleClass( 'active' );
      
    //Changes icon once menu is active
    jQuery( '#menu i' )
      .removeClass( 'icon-menu' )
      .addClass( 'icon-close' );
  } else {
    //Deactivate Menu Panel
    jQuery( '#menu-panel-wrapper' )
      .animate({ left: '110%' }, function(){
        jQuery( this ).toggleClass( 'active' );
      });
    //Changes icon once menu is inactive
    jQuery( '#menu i' )
      .removeClass( 'icon-close' )
      .addClass( 'icon-menu' );
  }
  //e.stopPropagation();
});

//Shows inspection details 
jQuery( '#view-inspection' )
  .on( 'click', function(){
    jQuery( '#intro-view' ).removeClass( 'active' );
    jQuery( '#inspection-details-wrapper' ).show();
    jQuery( '#vehicle-health-wrapper' ).hide();
    jQuery( '#vehicle-health-overview' ).hide();
});

//Hides inspection details
jQuery( '#health-indicator' )
  .on( 'click', function(){
    jQuery( '#intro-view' ).addClass( 'active' );
    jQuery( '#inspection-details-wrapper' ).hide();
    jQuery( '#vehicle-health-wrapper' ).show();
    jQuery( '#vehicle-health-overview' ).show();
});

//Shows and hides 
jQuery( '.nav-tabs .nav-link' )
  .on( 'click', function() {

    let activeTab = jQuery( this ).data( 'tab' );

    jQuery( '.link-overview' ).each( function() {
      if( jQuery( this ).hasClass( activeTab ) )
        jQuery( this ).addClass( 'active' );
      else
        jQuery( this ).removeClass( 'active' );
    });

    jQuery( '.desktop-table-overview' ).each( function() {
      if ( jQuery( this ).hasClass( activeTab ) )
        jQuery( this ).addClass( 'active' );
      else
        jQuery( this ).removeClass( 'active' );
    });

});

//Activates mobile viewport once a certain scroll height is reached
jQuery( window ).scroll( function() {
  if ( jQuery( window ).scrollTop() > 250 
      && jQuery( window ).width() < 991
      && !jQuery( '#intro-view' ).hasClass( 'active' ) ) {
    jQuery( '#customer-name' ).hide();
    jQuery( 'header .customer-name' ).show();
    jQuery( 'header h1.h2' ).hide();
    jQuery( 'header .inspection-date' ).hide();
    jQuery( '#customer-wrapper' ).removeClass( 'py-3' ).addClass( 'py-2 active' );
    jQuery( '#utility-wrapper').addClass( 'active container' );
    jQuery( '#inspection-details-wrapper' ).addClass( 'push-down' );
  } else {
    jQuery( '#customer-name' ).show();
    jQuery( 'header .customer-name' ).hide();
    jQuery( 'header h1.h2' ).show();
    jQuery( 'header .inspection-date' ).show();
    jQuery( '#customer-wrapper' ).removeClass( 'py-2 active' ).addClass( 'py-3' );
    jQuery( '#utility-wrapper').removeClass( 'active container' );
    jQuery( '#inspection-details-wrapper' ).removeClass( 'push-down' );
  }
});
//Smooth scroll to all anchor tags
jQuery( 'a' ).smoothScroll();