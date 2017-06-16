/* custom js for jodylesage.com */

/* initialize the page */
$(document).ready(function(){
	addListeners();
});

/* function for adding listers to page elements */
function addListeners(){
	/*
		jQuery for navbar buttons
		https://stackoverflow.com/questions/19579083/bootstrap-how-to-use-navbar
	*/
	$(".navbar-nav a").on('click',function(e) {
		e.preventDefault(); // stops link form loading
		$('.content').hide(); // hides all content divs
		$('#' + $(this).attr('href') ).show(); //get the href and use it find which div to show
	});
}