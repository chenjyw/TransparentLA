app = {};

app.departments = ["Aging", "Fire", "Information Technology Agency", "Los Angeles Convention Center", "Police", "Public Works - Street Services", "Transportation", "Zoo"];

function updateExpendChart(d3Obj, newData) {
    d3Obj.data([newData]);
}

$(function()
{
    queue()
        .defer(d3.csv, "data/2012_General_Fund_Budget_Expenditures_v1.csv")
        .defer(d3.csv, "data/2012_Payroll_v1.csv")
        .defer(d3.csv, "data/2012_eCheckbook_Data_v1.csv")
        .await(dataLoaded);

    function dataLoaded(error, expenditures, payroll, checkbook) {

        app.expendChartData = expenditures;
        app.currentExpendChartData = _.filter(app.expendChartData, function(d) { return d.department_name == "Los Angeles Convention Center"; });
        app.currentExpendChartDataTotal = _.reduce(_.map(app.currentExpendChartData, function(d) { return +d.total_expenditures; }), function(p, v) { return p + v;}, 0);

        var w = 300,
            h = 300,
            r = Math.min(w, h) / 2,
            labelr = r - 55, // radius for label anchor
            color = d3.scale.category20(),
            donut = d3.layout.pie(),
            arc = d3.svg.arc().innerRadius(r * .55).outerRadius(r);

        var vis = d3.select(".expenditures-chart")
          .append("svg:svg")
            .data([app.currentExpendChartData])
            .attr("width", w + 200)
            .attr("height", h + 100);

        var arcs = vis.selectAll("g.arc")
            .data(donut.value(function(d) { return d.total_expenditures; }))
          .enter().append("svg:g")
            .attr("class", "arc")
            .attr("transform", "translate(" + (r + 125) + "," + (r + 30) + ")");

        arcs.append("svg:path")
            .attr("fill", function(d, i) { return color(i); })
            .attr("d", arc);

        arcs.append("svg:text")
            .attr("transform", function(d) {
                var c = arc.centroid(d),
                    x = c[0],
                    y = c[1],
                    // pythagorean theorem for hypotenuse
                    h = Math.sqrt(x*x + y*y);
                return "translate(" + (x/h * labelr) +  ',' +
                   (y/h * labelr) +  ")";
            })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) {
                // are we past the center?
                return (d.endAngle + d.startAngle)/2 > Math.PI ?
                    "end" : "start";
            })
            .text(function(d, i) {
                return d.value/app.currentExpendChartDataTotal > 0.05 ? d.data.account_name : '';
            });

        arcs.append("svg:text")
            .attr("transform", function(d) {
                var c = arc.centroid(d),
                    x = c[0],
                    y = c[1],
                    // pythagorean theorem for hypotenuse
                    h = Math.sqrt(x*x + y*y);
                return "translate(" + (x/h * labelr) +  ',' +
                   (y/h * labelr) +  ")";
            })
            .attr("dy", "23px")
            .attr("text-anchor", function(d) {
                // are we past the center?
                return (d.endAngle + d.startAngle)/2 > Math.PI ?
                    "end" : "start";
            })
            .text(function(d, i) {
                return d.value/app.currentExpendChartDataTotal > 0.05 ? Math.round(d.value/app.currentExpendChartDataTotal * 100) + "%" : '';
            });
    }

    // Smooth scrolling
    $('a[href*=#]:not([href=#])').click(function () {
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
