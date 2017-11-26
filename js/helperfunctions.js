// gets the current month in a format used for filling in resume microdata
function getCurrentYearAndMonth() {
	var d = new Date();
	var s = d.getFullYear() + '-';
	if (d.getMonth() < 9){
		s = s + '0';	// pad a leading zero for single-digit months
	}
	var s = s + (d.getMonth() + 1);
	return s;
}

// prints the resume when the print resume button is clicked
function printResume(){
	window.print();
};


window.onload = function() {
	// populate microdata with current month
	var x = getCurrentYearAndMonth();
	$('.present').attr("datetime", x);
	
	// initialize tooltips
	$('[data-toggle="tooltip"]').tooltip();
};