$(document).ready(function(){

$('.container-fluid').css('height',window.innerHeight);
$('.container-fluid').resize(function(){
	$(this).css('height',window.innerHeight);
});
/////////////////
///// MODAL /////
/////////////////

// opens the modal at the start of the website
$('#welcome').modal('show');

// hides the modal using the enter key
$('.modal-content').keydown(function(e){
	if (e.which==13) {
		// console.log('enter key was pressed');
		$('#welcome').modal('hide');
		//client_events.js
		welcome();
	}
});

///// END OF MODAL /////

///////////////////
///// NAV BAR /////
///////////////////

$('header').hide();
$('#nav_down').click(function(){
	$(this).hide();
	$('header').slideDown();
});

$('#nav_up').click(function(){
	$('header').slideUp('fast');
	$('#nav_down').slideDown('slow');
});

///// END OF NAV BAR ////


});

