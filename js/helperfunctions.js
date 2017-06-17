// gets the current month in a format used for filling in resume microdata
function getCurrentYearAndMonth() {
	var d = new Date();
	var s = d.getFullYear() + '-';
	if (d.getMonth() < 10){
		s = s + '0';	// pad a leading zero for single-digit months
	}
	var s = s + d.getMonth();
	return s;
}

// prints the resume when the print resume button is clicked
function printResume(){
	window.print();
};