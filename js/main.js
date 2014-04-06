app = {};

app.departments = ["Aging", "Fire", "Information Technology Agency", "Los Angeles Convention Center", "Police", "Public Works - Street Services", "Transportation", "Zoo"];

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function renderExpendChart(dept) {
    $(".expenditures-chart").html("");

    app.currentExpendChartData = _.filter(app.expendituresData, function(d) { return d.department_name == dept; });
    app.currentExpendChartDataTotal = _.reduce(_.map(app.currentExpendChartData, function(d) { return +d.total_expenditures; }), function(p, v) { return p + v;}, 0);

    var w = 214,
        h = 214,
        r = Math.min(w, h) / 2,
        labelr = r - 47, // radius for label anchor
        color = d3.scale.category20(),
        donut = d3.layout.pie(),
        arc = d3.svg.arc().innerRadius(r * .38).outerRadius(r);

    var vis = d3.select(".expenditures-chart")
      .append("svg:svg")
        .data([app.currentExpendChartData])
        .attr("width", w + 400)
        .attr("height", h + 200);

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
        .attr("dy", ".38em")
        .attr("text-anchor", function(d) {
            // are we past the center?
            return (d.endAngle + d.startAngle)/2 > Math.PI ?
                "end" : "start";
        })
        .attr("class", "expend-dept")
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
        .attr("class", "expend-percent")
        .text(function(d, i) {
            return d.value/app.currentExpendChartDataTotal > 0.05 ? Math.round(d.value/app.currentExpendChartDataTotal * 100) + "%" : '';
        });
}

function renderTopVendors(dept) {
    $(".vendors-table table").html("");

    var filteredData = _.filter(app.checkbookData, function(d) { return d["DEPARTMENT NAME"] == dept; });
    var vendorGroups = _.groupBy(filteredData, function(d) { return d.vendor_name; });

    var vendorTotals = _.map(vendorGroups, function(values, group) {
            var vendorAmounts = _.map(values, function(vendor) { return +vendor.dollar_amount; }),
                vendorTotal = _.reduce(vendorAmounts, function(p, v) { return p + v; }, 0);
            return {vendorName: group, total: vendorTotal};
        });

    var rankedVendors = _.sortBy(vendorTotals, function(vendor) { return vendor.total; }).reverse().slice(0,10);

    rankedVendors.forEach(function(vendor) {
        $(".vendors-table table").append('<tr><td>' + vendor.vendorName + '</td><td>$' + numberWithCommas(Math.round(vendor.total)) + '</td></tr>');
    });

}


// Used to form anchor hashes
app.slugify = function(text) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-');
};

$(function()
{
    queue()
        .defer(d3.csv, "data/2012_General_Fund_Budget_Expenditures_v1.csv")
        .defer(d3.csv, "data/2012_Payroll_v1.csv")
        .defer(d3.csv, "data/2012_eCheckbook_Data_v1.csv")
        .await(dataLoaded);

    function dataLoaded(error, expenditures, payroll, checkbook) {
        $('#department-name').text('Aging');

        app.expendituresData = expenditures;
        app.checkbookData = checkbook;

        renderExpendChart("Aging");
        renderTopVendors("Aging");


    }

    $(".department").on("click", function(e) {
        var $currentTarget = $(e.currentTarget);
        var dept = $currentTarget.attr("data-department-name");

        $("#department-name").text(dept);

        renderExpendChart(dept);
        renderTopVendors(dept);
        //renderTopJobs(dept);
        e.preventDefault();
    });

});
