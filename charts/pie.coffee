class Pie
  #range of potential values for each item
  constructor: (dom, options)->
    @pie_width = options?.pie?.width ? 450
    @pie_height = options?.pie?.height ? 300
    @pie_r = options?.pie?.r ? 100
    @pie_ir = options?.pie?.ir ? 45
    @textOffset = 14
    @tweenDuration = 250
    @lines = undefined
    @valueLabels = undefined
    @nameLabels = undefined
    @pieData = []
    @oldPieData = false
    @filteredPieData = []
    @donut = d3.layout.pie().value((d) =>
      d.data_value
    )
    @color_func = d3.scale.category20()
    @arc_func = d3.svg.arc().startAngle((d) =>
      d.startAngle
    ).endAngle((d) =>
      d.endAngle
    ).innerRadius(@pie_ir).outerRadius(@pie_r)
    @streakerDataAdded = undefined
    @vis_group = d3.select(dom).append("svg:svg").attr("width", @pie_width).attr("height", @pie_height)
    @arc_group = @vis_group.append("svg:g").attr("class", "arc").attr("transform", "translate(" + (@pie_width / 2) + "," + (@pie_height / 2) + ")")
    @label_group = @vis_group.append("svg:g").attr("class", "@label_group").attr("transform", "translate(" + (@pie_width / 2) + "," + (@pie_height / 2) + ")")
    @center_group = @vis_group.append("svg:g").attr("class", "@center_group").attr("transform", "translate(" + (@pie_width / 2) + "," + (@pie_height / 2) + ")")
    @paths = @arc_group.append("svg:circle").attr("fill", "#EFEFEF").attr("r", @pie_r)
    @whiteCircle = @center_group.append("svg:circle").attr("fill", "white").attr("r", @pie_ir)
    # @totalLabel = @center_group.append("svg:text").attr("class", "label").attr("dy", -15).attr("text-anchor", "middle").text("TOTAL")
    @totalValue = @center_group.append("svg:text").attr("class", "total").attr("dy", 7).attr("text-anchor", "middle").text("Waiting...")
    # @totalUnits = @center_group.append("svg:text").attr("class", "units").attr("dy", 21).attr("text-anchor", "middle").text("kb")


  # to run each time data is generated
  update: (streakerDataAdded)=>
    filterData = (element, index, array) =>
      element.name = @streakerDataAdded[index].data_label
      element.value = @streakerDataAdded[index].data_value
      totalOctets += element.value
      element.value > 0
    @streakerDataAdded = streakerDataAdded
    if @oldPieData != false
      @oldPieData = @filteredPieData
    @pieData = @donut(@streakerDataAdded)
    totalOctets = 0
    @filteredPieData = @pieData.filter(filterData)
    if @oldPieData == false
      @oldPieData = @filteredPieData
    if @filteredPieData.length > 0 and @oldPieData.length > 0
      
      #REMOVE PLACEHOLDER CIRCLE
      @arc_group.selectAll("circle").remove()
      @totalValue.text =>
        kb = totalOctets / 1024
        kb.toFixed 1

      
      #return bchart.label.abbreviated(totalOctets*8);
      
      #DRAW ARC @PATHS
      @paths = @arc_group.selectAll("path").data(@filteredPieData)
      @paths.enter().append("svg:path").attr("stroke", "white").attr("stroke-width", 0.5).attr("fill", (d, i) =>
        @color_func i
      ).transition().duration(@tweenDuration).attrTween "d", @pieTween
      @paths.transition().duration(@tweenDuration).attrTween "d", @pieTween
      @paths.exit().transition().duration(@tweenDuration).attrTween("d", @removePieTween).remove()
      
      #DRAW TICK MARK @LINES FOR LABELS
      @lines = @label_group.selectAll("line").data(@filteredPieData)
      @lines.enter().append("svg:line").attr("x1", 0).attr("x2", 0).attr("y1", -@pie_r - 3).attr("y2", -@pie_r - 8).attr("stroke", "gray").attr "transform", (d) =>
        "rotate(" + (d.startAngle + d.endAngle) / 2 * (180 / Math.PI) + ")"

      @lines.transition().duration(@tweenDuration).attr "transform", (d) =>
        "rotate(" + (d.startAngle + d.endAngle) / 2 * (180 / Math.PI) + ")"

      @lines.exit().remove()
      
      #DRAW LABELS WITH PERCENTAGE VALUES
      @valueLabels = @label_group.selectAll("text.value").data(@filteredPieData).attr("dy", (d) =>
        if (d.startAngle + d.endAngle) / 2 > Math.PI / 2 and (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5
          5
        else
          -7
      ).attr("text-anchor", (d) =>
        if (d.startAngle + d.endAngle) / 2 < Math.PI
          "beginning"
        else
          "end"
      ).text((d) =>
        percentage = (d.value / totalOctets) * 100
        percentage.toFixed(1) + "%"
      )
      @valueLabels.enter().append("svg:text").attr("class", "value").attr("transform", (d) =>
        "translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI) / 2)) * (@pie_r + @textOffset) + "," + Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) * (@pie_r + @textOffset) + ")"
      ).attr("dy", (d) =>
        if (d.startAngle + d.endAngle) / 2 > Math.PI / 2 and (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5
          5
        else
          -7
      ).attr("text-anchor", (d) =>
        if (d.startAngle + d.endAngle) / 2 < Math.PI
          "beginning"
        else
          "end"
      ).text (d) =>
        percentage = (d.value / totalOctets) * 100
        percentage.toFixed(1) + "%"

      @valueLabels.transition().duration(@tweenDuration).attrTween "transform", @textTween
      @valueLabels.exit().remove()
      
      #DRAW LABELS WITH ENTITY NAMES
      @nameLabels = @label_group.selectAll("text.units").data(@filteredPieData).attr("dy", (d) =>
        if (d.startAngle + d.endAngle) / 2 > Math.PI / 2 and (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5
          17
        else
          5
      ).attr("text-anchor", (d) =>
        if (d.startAngle + d.endAngle) / 2 < Math.PI
          "beginning"
        else
          "end"
      ).text((d) =>
        d.name
      )
      @nameLabels.enter().append("svg:text").attr("class", "units").attr("transform", (d) =>
        "translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI) / 2)) * (@pie_r + @textOffset) + "," + Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) * (@pie_r + @textOffset) + ")"
      ).attr("dy", (d) =>
        if (d.startAngle + d.endAngle) / 2 > Math.PI / 2 and (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5
          17
        else
          5
      ).attr("text-anchor", (d) =>
        if (d.startAngle + d.endAngle) / 2 < Math.PI
          "beginning"
        else
          "end"
      ).text (d) =>
        d.name

      @nameLabels.transition().duration(@tweenDuration).attrTween "transform", @textTween
      @nameLabels.exit().remove()

  #/////////////////////////////////////////////////////////
  # FUNCTIONS //////////////////////////////////////////////
  #/////////////////////////////////////////////////////////

  # Interpolate the arcs in data space.
  pieTween: (d, i) =>
    s0 = undefined
    e0 = undefined
    if @oldPieData[i]
      s0 = @oldPieData[i].startAngle
      e0 = @oldPieData[i].endAngle
    else if not (@oldPieData[i]) and @oldPieData[i - 1]
      s0 = @oldPieData[i - 1].endAngle
      e0 = @oldPieData[i - 1].endAngle
    else if not (@oldPieData[i - 1]) and @oldPieData.length > 0
      s0 = @oldPieData[@oldPieData.length - 1].endAngle
      e0 = @oldPieData[@oldPieData.length - 1].endAngle
    else
      s0 = 0
      e0 = 0
    i = d3.interpolate(
      startAngle: s0
      endAngle: e0
    ,
      startAngle: d.startAngle
      endAngle: d.endAngle
    )
    (t) =>
      b = i(t)
      @arc_func b
  removePieTween: (d, i) =>
    s0 = 2 * Math.PI
    e0 = 2 * Math.PI
    i = d3.interpolate(
      startAngle: d.startAngle
      endAngle: d.endAngle
    ,
      startAngle: s0
      endAngle: e0
    )
    (t) =>
      b = i(t)
      @arc_func b
  textTween: (d, i) =>
    a = undefined
    if @oldPieData[i]
      a = (@oldPieData[i].startAngle + @oldPieData[i].endAngle - Math.PI) / 2
    else if not (@oldPieData[i]) and @oldPieData[i - 1]
      a = (@oldPieData[i - 1].startAngle + @oldPieData[i - 1].endAngle - Math.PI) / 2
    else if not (@oldPieData[i - 1]) and @oldPieData.length > 0
      a = (@oldPieData[@oldPieData.length - 1].startAngle + @oldPieData[@oldPieData.length - 1].endAngle - Math.PI) / 2
    else
      a = 0
    b = (d.startAngle + d.endAngle - Math.PI) / 2
    fn = d3.interpolateNumber(a, b)
    (t) =>
      val = fn(t)
      "translate(" + Math.cos(val) * (@pie_r + @textOffset) + "," + Math.sin(val) * (@pie_r + @textOffset) + ")"

module.exports = Pie
