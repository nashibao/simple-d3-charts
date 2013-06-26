var Line, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

Line = (function() {
  function Line(dom, options) {
    this.update = __bind(this.update, this);
    this.dom = dom;
    this.m = [60, 60, 60, 60];
    this.w = options.width - this.m[1] - this.m[3];
    this.h = options.height - this.m[0] - this.m[2];
    this.graph = d3.select(this.dom).append("svg:svg").attr("width", this.w + this.m[1] + this.m[3]).attr("height", this.h + this.m[0] + this.m[2]).append("svg:g").attr("transform", "translate(" + this.m[3] + "," + this.m[0] + ")");
    this.x_axis = this.graph.append("svg:g").attr("class", "x axis").attr("transform", "translate(0," + this.h + ")");
    this.y_axis = this.graph.append("svg:g").attr("class", "y axis").attr("transform", "translate(-6,0)");
    this.path = this.graph.append("svg:path");
  }

  Line.prototype.update = function(data) {
    var rs,
      _this = this;
    rs = _(data).reduce(function(result, obj) {
      if (result.x.min > obj.x) {
        result.x.min = obj.x;
      }
      if (result.x.max < obj.x) {
        result.x.max = obj.x;
      }
      if (result.y.min > obj.y) {
        result.y.min = obj.y;
      }
      if (result.y.max < obj.y) {
        result.y.max = obj.y;
      }
      return result;
    }, {
      x: {
        min: 1000000,
        max: -1000000
      },
      y: {
        min: 1000000,
        max: -1000000
      }
    });
    this.scale_x = rs.x;
    this.scale_y = rs.y;
    this.x = d3.scale.linear().domain([this.scale_x.min, this.scale_x.max]).range([0, this.w]);
    this.y = d3.scale.linear().domain([this.scale_y.min, this.scale_y.max]).range([this.h, 0]);
    this.xAxis = d3.svg.axis().scale(this.x).tickSize(-this.h).tickSubdivide(false);
    this.x_axis.call(this.xAxis);
    this.yAxisLeft = d3.svg.axis().scale(this.y).ticks(3).orient("left");
    this.y_axis.call(this.yAxisLeft);
    this.line_path = d3.svg.line().x(function(d, i) {
      return _this.x(d.x);
    }).y(function(d) {
      return _this.y(d.y);
    });
    this.path.transition().duration(100).ease("in").attr("d", this.line_path(data));
    if (!this.circle2) {
      this.circle2 = this.graph.selectAll("circle.line2").data(data).enter().append("svg:circle").attr("class", "line2").attr("cx", this.line_path.x()).attr("cy", this.line_path.y()).attr("r", 8);
    } else {
      this.circle2.data(data).transition().duration(100).ease("in").attr("cx", this.line_path.x()).attr("cy", this.line_path.y()).attr("r", 8);
    }
    if (!this.circle1) {
      this.circle1 = this.graph.selectAll("circle.line").data(data).enter().append("svg:circle").attr("class", "line").attr("cx", this.line_path.x()).attr("cy", this.line_path.y()).attr("r", 5);
    } else {
      this.circle1.data(data).transition().duration(100).ease("in").attr("cx", this.line_path.x()).attr("cy", this.line_path.y()).attr("r", 5);
    }
    if (!this.rect_val) {
      this.rect_val = this.graph.selectAll("rect.val").data(data).enter().append("svg:rect").attr("class", "val").attr("x", function(d) {
        return _this.x(d.x) - d.data_label.length * 3 - 3;
      }).attr("y", function(d) {
        return _this.y(d.y) - 30;
      }).attr("width", function(d) {
        return d.data_label.length * 6;
      }).attr("height", 18);
    } else {
      this.rect_val.data(data).transition().duration(100).ease("in").attr("class", "val").attr("x", function(d) {
        return _this.x(d.x) - d.data_label.length * 3 - 3;
      }).attr("y", function(d) {
        return _this.y(d.y) - 30;
      }).attr("width", function(d) {
        return d.data_label.length * 6;
      }).attr("height", 18);
    }
    if (!this.text_val) {
      return this.text_val = this.graph.selectAll("text.val").data(data).enter().append("svg:text").attr("class", "val").attr("x", function(d) {
        return _this.x(d.x) - d.data_label.length * 3;
      }).attr("y", function(d) {
        return _this.y(d.y) - 16;
      }).attr("width", 30).text(function(d) {
        return d.data_label;
      });
    } else {
      return this.text_val.data(data).transition().duration(100).ease("in").attr("class", "val").attr("x", function(d) {
        return _this.x(d.x) - d.data_label.length * 3;
      }).attr("y", function(d) {
        return _this.y(d.y) - 16;
      }).attr("width", 30).text(function(d) {
        return d.data_label;
      });
    }
  };

  return Line;

})();

module.exports = Line;
