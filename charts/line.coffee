class Line
  constructor: (dom, options)->
    @dom = dom
    # define dimensions of graph
    @m = [60, 60, 60, 60] # margins
    @w = options.width - @m[1] - @m[3] # width
    @h = options.height - @m[0] - @m[2] # height

    @scale_x = options.scale_x
    @scale_y = options.scale_y

    # scalex
    @x = d3.scale.linear().domain([@scale_x.min, @scale_x.max]).range([0, @w])
    # scaley
    @y = d3.scale.linear().domain([@scale_y.min, @scale_y.max]).range([@h, 0])

    # line
    @line_path = d3.svg.line().x((d, i) =>
      return @x(d.x)
    ).y((d) =>
      return @y(d.y)
    )
    # graph
    @graph = d3.select(@dom)
      .append("svg:svg")
      .attr("width", @w + @m[1] + @m[3])
      .attr("height", @h + @m[0] + @m[2])
      .append("svg:g")
      .attr("transform", "translate(" + @m[3] + "," + @m[0] + ")")

    # create yAxis
    @xAxis = d3.svg.axis().scale(@x).tickSize(-@h).tickSubdivide(false)

    # Add the x-axis.
    @graph
      .append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + @h + ")")
      .call @xAxis

    # create left yAxis
    @yAxisLeft = d3.svg.axis().scale(@y).ticks(4).orient("left")

    # Add the y-axis to the left
    @graph
      .append("svg:g")
      .attr("class", "y axis")
      .attr("transform", "translate(-6,0)")
      .call @yAxisLeft

    @graph.selectAll(".x.axis g.tick.major text")
      .attr("y", 10)

    @path = @graph.append("svg:path")

  update: (data)=>


    # line
    @path
      .transition()
      .duration(100)
      .ease("in")
      .attr "d", @line_path(data)

    # circle
    if not @circle2
      @circle2 = @graph.selectAll("circle.line2")
        .data(data)
        .enter().append("svg:circle")
        .attr("class", "line2")
        .attr("cx", @line_path.x())
        .attr("cy", @line_path.y())
        .attr("r", 8);
    else
      @circle2
        .data(data)
        .transition()
        .duration(100)
        .ease("in")
        .attr("cx", @line_path.x())
        .attr("cy", @line_path.y())
        .attr("r", 8);


    if not @circle1
      @circle1 = @graph.selectAll("circle.line")
        .data(data)
        .enter().append("svg:circle")
        .attr("class", "line")
        .attr("cx", @line_path.x())
        .attr("cy", @line_path.y())
        .attr("r", 3);
    else
      @circle1
        .data(data)
        .transition()
        .duration(100)
        .ease("in")
        .attr("cx", @line_path.x())
        .attr("cy", @line_path.y())
        .attr("r", 3);

    # # text
    if not @rect_val
      @rect_val = @graph.selectAll("rect.val")
        .data(data)
        .enter().append("svg:rect")
        .attr("class", "val")
        .attr("x", (d)=>
          return @x(d.x) - d.data_label.length * 3 - 3
        )
        .attr("y", (d)=>
          return @y(d.y) - 30
        )
        .attr("width", (d)=>
          return d.data_label.length*6)
        .attr("height", 18)
    else
      @rect_val
        .data(data)
        .transition()
        .duration(100)
        .ease("in")
        .attr("class", "val")
        .attr("x", (d)=>
          return @x(d.x) - d.data_label.length * 3 - 3
        )
        .attr("y", (d)=>
          return @y(d.y) - 30
        )
        .attr("width", (d)=>
          return d.data_label.length*6)
        .attr("height", 18)

    if not @text_val
      @text_val = @graph.selectAll("text.val")
        .data(data)
        .enter().append("svg:text")
        .attr("class", "val")
        .attr("x", (d)=>
          return @x(d.x) - d.data_label.length * 3
        )
        .attr("y", (d)=>
          return @y(d.y) - 16
        )
        .attr("width", 30)
        .text((d)=>
          return d.data_label
        )
    else
      @text_val
        .data(data)
        .transition()
        .duration(100)
        .ease("in")
        .attr("class", "val")
        .attr("x", (d)=>
          return @x(d.x) - d.data_label.length * 3
        )
        .attr("y", (d)=>
          return @y(d.y) - 16
        )
        .attr("width", 30)
        .text((d)=>
          return d.data_label
        )

module.exports = Line