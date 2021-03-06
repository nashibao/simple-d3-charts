var line, line_chart, pie, pie_chart, _update_line, _update_pie,
  _this = this;

pie = require('simple-d3-charts').pie;

pie_chart = new pie("#pie-chart", {
  pie: {
    width: 300,
    height: 300,
    r: 60,
    ir: 30
  }
});

_update_pie = function() {
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

_update_pie();

$("#pie-chart-update").click(function() {
  return _update_pie();
});

line = require('simple-d3-charts').line;

line_chart = new line("#line-chart", {
  width: 600,
  height: 300,
  scale_x: {
    min: 0,
    max: 10
  },
  scale_y: {
    min: 0,
    max: 10
  }
});

_update_line = function() {
  var arrayRange, d, i, _i;
  d = [];
  arrayRange = 10;
  for (i = _i = 0; _i <= 10; i = ++_i) {
    d.push({
      data_label: "data_label",
      x: i,
      y: Math.ceil(Math.random() * arrayRange)
    });
  }
  return line_chart.update(d);
};

_update_line();

$("#line-chart-update").click(function() {
  return _update_line();
});
