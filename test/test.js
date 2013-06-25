var pie, pie_chart, _update,
  _this = this;

pie = require('simple-d3-charts').pie;

$.fn.pie = function(options) {
  return new pie("#" + this.attr("id"), options);
};

pie_chart = $("#easy-as-pie-chart").pie({
  pie: {
    width: 300,
    height: 300,
    r: 60,
    ir: 30
  }
});

_update = function() {
  var arrayRange, arraySize, d, fillArray,
    _this = this;
  arrayRange = 100000;
  arraySize = Math.ceil(Math.random() * 10);
  fillArray = function() {
    return {
      data_label: "data_label",
      data_value: Math.ceil(Math.random() * arrayRange)
    };
  };
  d = d3.range(arraySize).map(fillArray);
  return pie_chart.update(d);
};

_update();

$("#pie-chart-update").click(function() {
  return _update();
});
