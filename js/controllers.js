'use strict';

angular.module('transparentLA', []).controller('payrollCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
  var getPayroll = function(department) {
    // TODO: Spinner
    $http.get('https://controllerdata.lacity.org/resource/payroll.json?department_title='+department).success(function(data) {
      var jobs = _.groupBy(data, function(d) { return d["job_class_title"]; });
      var positionAvgs = _.map(jobs, function(values, position) {
          var positionAmounts = _.map(values, function(position) { return +position["regular_pay"]; }),
              positionTotal = _.reduce(positionAmounts, function(a, b) { return a + b; }),
              positionAvg = Math.round(positionTotal / values.length * 100)/100;

          return {position_name: position, avg_salary: positionAvg};
      });

      $scope.data = positionAvgs;
    })
  };

  var getTopVendors = function(department) {
    var url = "https://controllerdata.lacity.org/resource/checkbook.json?department_name="+department+"&fiscal_year=2013";
    // TODO: Spinner
    $http.get(url).success(function(data) {
      var vendors = _.groupBy(data, function(d) {return d["vendor_name"]; });
      var topVendors = _.map(vendors, function(val, gr) {
          var vendorAmounts = _.map(val, function(vendor) { return +vendor.dollar_amount; }),
              vendorTotal = _.reduce(vendorAmounts, function(a, b) { return a+b; });
          return {vendor_name: gr, total: vendorTotal};
      });

      $scope.vendors = topVendors;
    });
  };

  // keep eyes on the path = use $watch
  if ($location.path().indexOf("aging") != -1) {
    getPayroll("aging");
    getTopVendors("aging");
  }
  else if ($location.path().indexOf("airports") != -1) {
    getPayroll("airports");
    getTopVendors("airports");
  }
  else if ($location.path().indexOf("contr") != -1) {
    getPayroll("controller");
    getTopVendors("controller");
  }
  else if ($location.path().indexOf("fire") != -1) {
    getPayroll("fire");
    getTopVendors("fire");
  }
  else if ($location.path().indexOf("ita") != -1) {
    getPayroll("information%20technology%20agency");
    getTopVendors("information%20technology%20agency");
  }
  else if ($location.path().indexOf("lacc") != -1) {
    getPayroll("los%20angeles%20convention%20center");
    getTopVendors("los%20angeles%20convention%20center");
  }
  else if ($location.path().indexOf("police") != -1) {
    getPayroll("police");
    getTopVendors("police");
  }
  else if ($location.path().indexOf("transportation") != -1) {
    getPayroll("transportation");
    getTopVendors("transportation");
  }
  else if ($location.path().indexOf("zoo") != -1) {
    getPayroll("zoo");
    getTopVendors("zoo");
  }
}]);

// NOTE
// %28 for (
// %29 for )
