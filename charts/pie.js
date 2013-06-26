var Pie,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Pie = (function() {
  function Pie(dom, options) {
    this.textTween = __bind(this.textTween, this);
    this.removePieTween = __bind(this.removePieTween, this);
    this.pieTween = __bind(this.pieTween, this);
    this.update = __bind(this.update, this);
    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7,
      _this = this;
    this.pie_width = (_ref = options != null ? (_ref1 = options.pie) != null ? _ref1.width : void 0 : void 0) != null ? _ref : 450;
    this.pie_height = (_ref2 = options != null ? (_ref3 = options.pie) != null ? _ref3.height : void 0 : void 0) != null ? _ref2 : 300;
    this.pie_r = (_ref4 = options != null ? (_ref5 = options.pie) != null ? _ref5.r : void 0 : void 0) != null ? _ref4 : 100;
    this.pie_ir = (_ref6 = options != null ? (_ref7 = options.pie) != null ? _ref7.ir : void 0 : void 0) != null ? _ref6 : 45;
    this.textOffset = 14;
    this.tweenDuration = 250;
    this.lines = void 0;
    this.valueLabels = void 0;
    this.nameLabels = void 0;
    this.pieData = [];
    this.oldPieData = false;
    this.filteredPieData = [];
    this.donut = d3.layout.pie().value(function(d) {
      return d.data_value;
    });
    this.color_func = d3.scale.category20();
    this.arc_func = d3.svg.arc().startAngle(function(d) {
      return d.startAngle;
    }).endAngle(function(d) {
      return d.endAngle;
    }).innerRadius(this.pie_ir).outerRadius(this.pie_r);
    this.streakerDataAdded = void 0;
    this.vis_group = d3.select(dom).append("svg:svg").attr("width", this.pie_width).attr("height", this.pie_height);
    this.arc_group = this.vis_group.append("svg:g").attr("class", "arc").attr("transform", "translate(" + (this.pie_width / 2) + "," + (this.pie_height / 2) + ")");
    this.label_group = this.vis_group.append("svg:g").attr("class", "@label_group").attr("transform", "translate(" + (this.pie_width / 2) + "," + (this.pie_height / 2) + ")");
    this.center_group = this.vis_group.append("svg:g").attr("class", "@center_group").attr("transform", "translate(" + (this.pie_width / 2) + "," + (this.pie_height / 2) + ")");
    this.paths = this.arc_group.append("svg:circle").attr("fill", "#EFEFEF").attr("r", this.pie_r);
    this.whiteCircle = this.center_group.append("svg:circle").attr("fill", "white").attr("r", this.pie_ir);
    this.totalValue = this.center_group.append("svg:text").attr("class", "total").attr("dy", 7).attr("text-anchor", "middle").text("Waiting...");
  }

  Pie.prototype.update = function(streakerDataAdded) {
    var filterData, totalOctets,
      _this = this;
    filterData = function(element, index, array) {
      element.name = _this.streakerDataAdded[index].data_label;
      element.value = _this.streakerDataAdded[index].data_value;
      totalOctets += element.value;
      return element.value > 0;
    };
    this.streakerDataAdded = streakerDataAdded;
    if (this.oldPieData !== false) {
      this.oldPieData = this.filteredPieData;
    }
    this.pieData = this.donut(this.streakerDataAdded);
    totalOctets = 0;
    this.filteredPieData = this.pieData.filter(filterData);
    if (this.oldPieData === false) {
      this.oldPieData = this.filteredPieData;
    }
    if (this.filteredPieData.length > 0 && this.oldPieData.length > 0) {
      this.arc_group.selectAll("circle").remove();
      this.totalValue.text(function() {
        var kb;
        kb = totalOctets / 1024;
        return kb.toFixed(1);
      });
      this.paths = this.arc_group.selectAll("path").data(this.filteredPieData);
      this.paths.enter().append("svg:path").attr("stroke", "white").attr("stroke-width", 0.5).attr("fill", function(d, i) {
        return _this.color_func(i);
      }).transition().duration(this.tweenDuration).attrTween("d", this.pieTween);
      this.paths.transition().duration(this.tweenDuration).attrTween("d", this.pieTween);
      this.paths.exit().transition().duration(this.tweenDuration).attrTween("d", this.removePieTween).remove();
      this.lines = this.label_group.selectAll("line").data(this.filteredPieData);
      this.lines.enter().append("svg:line").attr("x1", 0).attr("x2", 0).attr("y1", -this.pie_r - 3).attr("y2", -this.pie_r - 8).attr("stroke", "gray").attr("transform", function(d) {
        return "rotate(" + (d.startAngle + d.endAngle) / 2 * (180 / Math.PI) + ")";
      });
      this.lines.transition().duration(this.tweenDuration).attr("transform", function(d) {
        return "rotate(" + (d.startAngle + d.endAngle) / 2 * (180 / Math.PI) + ")";
      });
      this.lines.exit().remove();
      this.valueLabels = this.label_group.selectAll("text.value").data(this.filteredPieData).attr("dy", function(d) {
        if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5) {
          return 5;
        } else {
          return -7;
        }
      }).attr("text-anchor", function(d) {
        if ((d.startAngle + d.endAngle) / 2 < Math.PI) {
          return "beginning";
        } else {
          return "end";
        }
      }).text(function(d) {
        var percentage;
        percentage = (d.value / totalOctets) * 100;
        return percentage.toFixed(1) + "%";
      });
      this.valueLabels.enter().append("svg:text").attr("class", "value").attr("transform", function(d) {
        return "translate(" + Math.cos((d.startAngle + d.endAngle - Math.PI) / 2) * (_this.pie_r + _this.textOffset) + "," + Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) * (_this.pie_r + _this.textOffset) + ")";
      }).attr("dy", function(d) {
        if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5) {
          return 5;
        } else {
          return -7;
        }
      }).attr("text-anchor", function(d) {
        if ((d.startAngle + d.endAngle) / 2 < Math.PI) {
          return "beginning";
        } else {
          return "end";
        }
      }).text(function(d) {
        var percentage;
        percentage = (d.value / totalOctets) * 100;
        return percentage.toFixed(1) + "%";
      });
      this.valueLabels.transition().duration(this.tweenDuration).attrTween("transform", this.textTween);
      this.valueLabels.exit().remove();
      this.nameLabels = this.label_group.selectAll("text.units").data(this.filteredPieData).attr("dy", function(d) {
        if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5) {
          return 17;
        } else {
          return 5;
        }
      }).attr("text-anchor", function(d) {
        if ((d.startAngle + d.endAngle) / 2 < Math.PI) {
          return "beginning";
        } else {
          return "end";
        }
      }).text(function(d) {
        return d.name;
      });
      this.nameLabels.enter().append("svg:text").attr("class", "units").attr("transform", function(d) {
        return "translate(" + Math.cos((d.startAngle + d.endAngle - Math.PI) / 2) * (_this.pie_r + _this.textOffset) + "," + Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) * (_this.pie_r + _this.textOffset) + ")";
      }).attr("dy", function(d) {
        if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5) {
          return 17;
        } else {
          return 5;
        }
      }).attr("text-anchor", function(d) {
        if ((d.startAngle + d.endAngle) / 2 < Math.PI) {
          return "beginning";
        } else {
          return "end";
        }
      }).text(function(d) {
        return d.name;
      });
      this.nameLabels.transition().duration(this.tweenDuration).attrTween("transform", this.textTween);
      return this.nameLabels.exit().remove();
    }
  };

  Pie.prototype.pieTween = function(d, i) {
    var e0, s0,
      _this = this;
    s0 = void 0;
    e0 = void 0;
    if (this.oldPieData[i]) {
      s0 = this.oldPieData[i].startAngle;
      e0 = this.oldPieData[i].endAngle;
    } else if (!this.oldPieData[i] && this.oldPieData[i - 1]) {
      s0 = this.oldPieData[i - 1].endAngle;
      e0 = this.oldPieData[i - 1].endAngle;
    } else if (!this.oldPieData[i - 1] && this.oldPieData.length > 0) {
      s0 = this.oldPieData[this.oldPieData.length - 1].endAngle;
      e0 = this.oldPieData[this.oldPieData.length - 1].endAngle;
    } else {
      s0 = 0;
      e0 = 0;
    }
    i = d3.interpolate({
      startAngle: s0,
      endAngle: e0
    }, {
      startAngle: d.startAngle,
      endAngle: d.endAngle
    });
    return function(t) {
      var b;
      b = i(t);
      return _this.arc_func(b);
    };
  };

  Pie.prototype.removePieTween = function(d, i) {
    var e0, s0,
      _this = this;
    s0 = 2 * Math.PI;
    e0 = 2 * Math.PI;
    i = d3.interpolate({
      startAngle: d.startAngle,
      endAngle: d.endAngle
    }, {
      startAngle: s0,
      endAngle: e0
    });
    return function(t) {
      var b;
      b = i(t);
      return _this.arc_func(b);
    };
  };

  Pie.prototype.textTween = function(d, i) {
    var a, b, fn,
      _this = this;
    a = void 0;
    if (this.oldPieData[i]) {
      a = (this.oldPieData[i].startAngle + this.oldPieData[i].endAngle - Math.PI) / 2;
    } else if (!this.oldPieData[i] && this.oldPieData[i - 1]) {
      a = (this.oldPieData[i - 1].startAngle + this.oldPieData[i - 1].endAngle - Math.PI) / 2;
    } else if (!this.oldPieData[i - 1] && this.oldPieData.length > 0) {
      a = (this.oldPieData[this.oldPieData.length - 1].startAngle + this.oldPieData[this.oldPieData.length - 1].endAngle - Math.PI) / 2;
    } else {
      a = 0;
    }
    b = (d.startAngle + d.endAngle - Math.PI) / 2;
    fn = d3.interpolateNumber(a, b);
    return function(t) {
      var val;
      val = fn(t);
      return "translate(" + Math.cos(val) * (_this.pie_r + _this.textOffset) + "," + Math.sin(val) * (_this.pie_r + _this.textOffset) + ")";
    };
  };

  return Pie;

})();

module.exports = Pie;
