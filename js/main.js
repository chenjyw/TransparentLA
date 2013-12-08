$(function() {

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
