$(function() {
<<<<<<< HEAD
	// Smooth scrolling
	$('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
    	var target = $(this.hash);
    	target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    	if (target.length) {
    		$('html, body').animate({
    			scrollTop: target.offset().top
        	}, 500);
        	return false;
    	}
    }
  });
});
=======

    queue()
        .defer(d3.csv, "data/2012_General_Fund_Budget_Expenditures_v1.csv")
        .defer(d3.csv, "data/2012_Payroll_v1.csv")
        .defer(d3.csv, "data/2012_eCheckbook_Data_v1.csv")
        .await(dataLoaded);

    function dataLoaded(error, expenditures, payroll, checkbook) {
        console.log(expenditures);
        window.expenditures = crossfilter(expenditures);
        window.payroll = crossfilter(payroll);
        window.checkbook = crossfilter(checkbook);
    }
});
>>>>>>> d3fe043ca99e77b1d7765e56e05711367dea7e84
