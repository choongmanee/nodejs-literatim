$(document).ready(function(){

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

//////////////////////
///// FITTEXT.JS /////
//////////////////////

$('.fittext').fitText();

///// END OF FITTEXT.JS /////

//////////////////////
///// SORT USERS /////
//////////////////////

$("#container_row").sortable();

///// END OF SORT USERS /////

$(document).on('click','.hideuser',function(){
	console.log('x marks the spot');
	$(this).parent().slideUp();
});

});

