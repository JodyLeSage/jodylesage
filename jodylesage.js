/* custom js for jodylesage.com */
var userIsValidated = false;

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
	
	// validate user when viewing private data
	$('.contains-private-info').one('click', function(){
		if(!userIsValidated){
			grecaptcha.execute();
		}
	});
}

/* use the backend to verify the user was indeed validated by recaptcha */
function userValidated(token) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if (this.readyState == 4 && this.status == 200) {
			var json = JSON.parse(this.responseText);
			populatePersonalData(json);
		}
	};
	xmlhttp.open("POST", "php/validateUser.php?token=" + token, true);
	xmlhttp.send();
}

/* tells recaptcha how to behave */
function onloadRecaptchaCallback(){
	grecaptcha.render('submitRecaptcha', {
		'sitekey' : '6LeOwyUUAAAAAIy-WfjdNkxv-KcWauJ6mzSiICUH',
		'callback' : userValidated
	});
}

/* function for inserting personal data into the site after the user has been validated */
function populatePersonalData(json){
	// update the email anchor in the resume iFrame
	var iframeBody = $('#resume-iframe').contents().find('body');
	var emailItem = iframeBody.contents().find('#resume-email');
	if(json["email"]){
		emailItem.attr({
			"href" : "mailto:" + json["email"],
			"itemprop" : "email"
		});
		emailItem.hide().html(json["email"]).fadeIn('slow');	// fade in for dramatic effect
	}
	
	// update information on the contact page
	// cannot be streamlined because of the iFrame
	emailItem = $('#contact-email');
	emailItem.attr({
		"href" : "mailto:" + json["email"],
		"itemprop" : "email"
	});
	emailItem.hide().html(json["email"]).fadeIn('slow');
	
}