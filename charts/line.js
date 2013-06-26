var Line,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Line = (function() {
  function Line(dom, options) {
    this.update = __bind(this.update, this);
    this.dom = dom;
    this.m = [60, 60, 60, 60];
    this.w = options.width - this.m[1] - this.m[3];
    this.h = options.height - this.m[0] - this.m[2];
  }

  Line.prototype.update = function(data) {
    var _this = this;
    this.x = d3.scale.linear().domain([0, data.length - 1]).range([0, this.w]);
    this.y = d3.scale.linear().domain([0, 10]).range([this.h, 0]);
    this.line_path = d3.svg.line().x(function(d, i) {
      return _this.x(d.x);
    }).y(function(d) {
      return _this.y(d.y);
    });
    this.graph = d3.select(this.dom).append("svg:svg").attr("width", this.w + this.m[1] + this.m[3]).attr("height", this.h + this.m[0] + this.m[2]).append("svg:g").attr("transform", "translate(" + this.m[3] + "," + this.m[0] + ")");
    this.xAxis = d3.svg.axis().scale(this.x).tickSize(-this.h).tickSubdivide(false);
    this.graph.append("svg:g").attr("class", "x axis").attr("transform", "translate(0," + this.h + ")").call(this.xAxis);
    this.yAxisLeft = d3.svg.axis().scale(this.y).ticks(4).orient("left");
    this.graph.append("svg:g").attr("class", "y axis").attr("transform", "translate(-6,0)").call(this.yAxisLeft);
    this.graph.append("svg:path").attr("d", this.line_path(data));
    this.graph.selectAll("circle.line2").data(data).enter().append("svg:circle").attr("class", "line2").attr("cx", this.line_path.x()).attr("cy", this.line_path.y()).attr("r", 8);
    this.graph.selectAll("circle.line").data(data).enter().append("svg:circle").attr("class", "line").attr("cx", this.line_path.x()).attr("cy", this.line_path.y()).attr("r", 3);
    this.graph.selectAll(".x.axis g.tick.major text").attr("y", 10);
    this.graph.selectAll("rect.val").data(data).enter().append("svg:rect").attr("class", "val").attr("x", function(d) {
      return _this.x(d.x) - d.data_label.length * 3 - 3;
    }).attr("y", function(d) {
      return _this.y(d.y) - 30;
    }).attr("width", function(d) {
      return d.data_label.length * 6;
    }).attr("height", 18);
    return this.graph.selectAll("text.val").data(data).enter().append("svg:text").attr("class", "val").attr("x", function(d) {
      return _this.x(d.x) - d.data_label.length * 3;
    }).attr("y", function(d) {
      return _this.y(d.y) - 16;
    }).attr("width", 30).text(function(d) {
      return d.data_label;
    });
  };

  return Line;

})();

module.exports = Line;
