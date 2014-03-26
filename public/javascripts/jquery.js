$(document).ready(function(){

/////////////////
///// MODAL /////
/////////////////

// opens the modal at the start of the website
$('#welcome').modal('show');

// hides the modal using the enter key
document.onkeydown=function(){
	if (event.keyCode==13) {
		// console.log('enter key was pressed');
		$('#welcome').modal('hide');
	}
};

///// END OF MODAL /////

///////////////////
///// NAV BAR /////
///////////////////

$('header').hide();
$('#min_top').click(function(){
	$(this).hide();
	$('header').slideDown();
});

$('header').hover(function(){

}, function(){
	$(this).slideUp('fast');
	$('#min_top').slideDown();
});

///// END OF NAV BAR////
});

