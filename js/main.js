app = {};

app.departments = ["Aging", "Fire", "Information Technology Agency", "Los Angeles Convention Center", "Police", "Public Works - Street Services", "Transportation", "Zoo"];

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
        var slug = app.slugify(department);
        $('#menu-list').append('<li><a class="menu-list-link" id="link-' + slug + '" href="#' + slug + '">' + department + '<span class="right-arrow">&rarr;</span></a></li>');
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

        var expendChartData = expenditures,
            initialExpendChartData = _.filter(expendChartData, function(d) { return d.department_name == "Aging"; });

        var initialExpendChartGroups = _.groupBy(initialExpendChartData, function(d) { return d.account_name; });
        app.chartValues = _.map(initialExpendChartGroups, function(group) { return _.reduce(group, function(p, v) { return p + v; }, 0); });


        // var w = 400,
        //     h = 400,
        //     r = Math.min(w, h) / 2,
        //     labelr = r + 30, // radius for label anchor
        //     color = d3.scale.category20(),
        //     donut = d3.layout.pie(),
        //     arc = d3.svg.arc().innerRadius(r * .6).outerRadius(r);

        // var vis = d3.select("body")
        //   .append("svg:svg")
        //     .data([data])
        //     .attr("width", w + 150)
        //     .attr("height", h);

        // var arcs = vis.selectAll("g.arc")
        //     .data(donut.value(function(d) { return d.val }))
        //   .enter().append("svg:g")
        //     .attr("class", "arc")
        //     .attr("transform", "translate(" + (r + 30) + "," + r + ")");

        // arcs.append("svg:path")
        //     .attr("fill", function(d, i) { return color(i); })
        //     .attr("d", arc);

        // arcs.append("svg:text")
        //     .attr("transform", function(d) {
        //         var c = arc.centroid(d),
        //             x = c[0],
        //             y = c[1],
        //             // pythagorean theorem for hypotenuse
        //             h = Math.sqrt(x*x + y*y);
        //         return "translate(" + (x/h * labelr) +  ',' +
        //            (y/h * labelr) +  ")"; 
        //     })
        //     .attr("dy", ".35em")
        //     .attr("text-anchor", function(d) {
        //         // are we past the center?
        //         return (d.endAngle + d.startAngle)/2 > Math.PI ?
        //             "end" : "start";
        //     })
        //     .text(function(d, i) { return d.value.toFixed(2); });
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
