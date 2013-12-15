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
        .attr("dy", ".14em")
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

function renderTopJobs(dept) {
    $(".salaries-table table").html("");
    $(".salary-dist").html("");

    /* Salary Table*/
   var filteredData = _.filter(app.payrollData, function(d) { return d["Department Title"] == dept; });
   var positionGroups = _.groupBy(filteredData, function(d) { return d["Job Class Title"]; });

   var positionAvgs = _.map(positionGroups, function(values, position) {
        var positionAmounts = _.map(values, function(position) { return +position['Regular Pay']; }),
            positionTotal = _.reduce(positionAmounts, function(p, v) { return p + v; }, 0),
            positionAvg = positionTotal / values.length;

        return {positionName: position, avg_salary: positionAvg};
   });
    var rankedPositions = _.sortBy(positionAvgs, function(position) { return position.avg_salary; }).reverse().slice(0,10);


    rankedPositions.forEach(function(position) {
        $(".salaries-table table").append('<tr><td>' + position.positionName + '</td><td>$' + numberWithCommas(Math.round(position.avg_salary)) + '</td></tr>');
    });

    /* Salary dist*/
    var positionSalaries = _.map(filteredData, function(position) { return position['Regular Pay']; }).sort(function(a,b) { return a - b;});

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = 432 - margin.left - margin.right,
        height = 215 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain([0, positionSalaries.length])
        .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.


    var y = d3.scale.linear()
        .domain([0, d3.max(positionSalaries, function(d) { return d; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var svg = d3.select(".salary-dist").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
        .data(positionSalaries)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) { return "translate(" + x(i) + ", " + y(d) + ")" ; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(1))
        .attr("height", function(d) { return height - y(d); });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);    
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
    // Populate left menu
    app.departments.forEach(function(department) {
        $('#menu-list').append('\
            <li>\
                <a href="" class="department menu-list-link" data-department-name="' + department + '">' + department + '<span class="right-arrow">&rarr;</span></a>\
            </li>');
    });

    $('.menu-list-link').hover(function(e) {
        var child = this.children[0],
            $child = $(child);
        $child.show()
    }, function(e) {
        var child = this.children[0],
            $child = $(child);
        $child.hide();
    });

    queue()
        .defer(d3.csv, "data/2012_General_Fund_Budget_Expenditures_v1.csv")
        .defer(d3.csv, "data/2012_Payroll_v1.csv")
        .defer(d3.csv, "data/2012_eCheckbook_Data_v1.csv")
        .await(dataLoaded);

    function dataLoaded(error, expenditures, payroll, checkbook) {
        $('#department-name').text('Aging');

        app.expendituresData = expenditures;
        app.payrollData = payroll;
        app.checkbookData = checkbook;

        renderExpendChart("Aging");
        renderTopVendors("Aging");
        renderTopJobs("Aging");


    }

    $(".department").on("click", function(e) {
        var $currentTarget = $(e.currentTarget);
        var dept = $currentTarget.attr("data-department-name");

        $("#department-name").text(dept);

        renderExpendChart(dept);
        renderTopVendors(dept);
        renderTopJobs(dept);
        e.preventDefault();
    });

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
