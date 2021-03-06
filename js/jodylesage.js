/* custom js for jodylesage.com */
var userIsValidated = false;

/* initialize the page */
$(document).ready(function(){
	if (!window.location.hash) {
		window.location.hash = "#home";
	}
	addListeners();
	handleNewtabClicks();
});

/* function for adding listers to page elements */
function addListeners(){
	/*
		jQuery for navbar buttons
		https://stackoverflow.com/questions/19579083/bootstrap-how-to-use-navbar
	*/
	$(".navbar-nav a").on('click',function(e) {
		$('.content').hide(); // hides all content divs

		var hash = $(this).attr('href');
		window.location.hash = hash;
		
		$(hash).show();
	});
	
	// fix wonky bootstrap CSS on middle-click
	$(".navbar-nav a").on('mouseup',function(e) {
		if (e.which != 1) {
			$(this).blur();
		}
	});
	
	/* navigates to home tab when 'Jody LeSage' brand element is clicked */
	$(".navbar-brand").on('click', function(){
		$("#homeTab").click();
	});
	
	/*
		code to manually manage active menu items courtesy Pete Nykänen
		https://stackoverflow.com/questions/24514717/bootstrap-navbar-active-state-not-working
	*/
	$(".nav a").on("click", function(e){
		if (e.which == 1) {
			$(".nav").find(".active").removeClass("active");
			$(this).parent().addClass("active");
			$(this).parent().focus();
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

function onloadRecaptchaCallback(){
	// enable buttons and add recaptcha listeners
	$('.validate-button').removeClass("disabled");
	$('.validate-button').on('click', function(){
		if(!userIsValidated){
			grecaptcha.execute();
		}
	});
	var validateButton = getValidateButtonFromIFrame();
	validateButton.removeClass("disabled");
	validateButton.on('click', function(){
		if(!userIsValidated){
			grecaptcha.execute();
		}
	});
	
	
	/* tells recaptcha how to behave */
	grecaptcha.render('submitRecaptcha', {
		'sitekey' : '6LdBvpwUAAAAAAmeJoG_HIiIoWEuhAQ4YvRE9Fxj',
		'callback' : userValidated
	});
}

/* returns "show contact info" button from resume */
function getValidateButtonFromIFrame(){
	return $('#resume-iframe').contents().find('header').contents().find('.validate-button');
}

/* function for inserting personal data into the site after the user has been validated */
function populatePersonalData(json){
	/* update the email anchor in the resume iFrame */
	var iframeBody = $('#resume-iframe').contents().find('body');
	var emailItem = iframeBody.contents().find('#resume-email');
	
	if(json["errMessage"]){
		console.log(json["errMessage"]);
		return;
	}
	
	if(json["email"]){
		userIsValidated = true;
		
		emailItem.attr({
			"href" : "mailto:" + json["email"],
			"itemprop" : "email"
		});
		emailItem.hide().html(json["email"]).fadeIn('slow');	// fade in for dramatic effect
		
		/* update information on the contact page
		   cannot be streamlined because of the iFrame */
		emailItem = $('#contact-email');
		emailItem.attr({
			"href" : "mailto:" + json["email"],
			"itemprop" : "email"
		});
		emailItem.hide().html(json["email"]).fadeIn('slow');
		
		/* remove 'show contact info' buttons after user has passed the captcha */
		$('.validate-button').hide('slow', function() { validateButton.remove(); });
		var validateButton = getValidateButtonFromIFrame();
		validateButton.hide('slow', function() { validateButton.remove(); });
	}
}

/* opens the correct tab when user middle-clicks a navbar item */
function handleNewtabClicks(){
	var hash = window.location.hash;
	$('nav a[href="' + hash + '"]').click();
};