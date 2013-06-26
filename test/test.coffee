

# pie chart
pie = require('simple-d3-charts').pie

pie_chart = new pie("#pie-chart", {
    pie:
      width: 300
      height: 300
      r: 60
      ir: 30
  })

_update_pie = ()->
  arrayRange = 100000
  arraySize = Math.ceil(Math.random() * 10)
  fillArray = =>
    data_label: "data_label"
    data_value: Math.ceil(Math.random() * (arrayRange))
  d = d3.range(arraySize).map(fillArray)
  pie_chart.update(d)

_update_pie()

$("#pie-chart-update").click ()=>
  _update_pie()

# updateInterval = window.setInterval(_update, 500)

line = require('simple-d3-charts').line

line_chart = new line("#line-chart", {
    width: 600
    height: 300
    scale_x:
      min: 0
      max: 10
    scale_y:
      min: 0
      max: 10
  })

_update_line = ()->
  d = []
  arrayRange = 10
  for i in [0..10]
    d.push({
        data_label: "data_label"
        x: i
        y: Math.ceil(Math.random() * (arrayRange))
      })
  line_chart.update(d)

_update_line()

$("#line-chart-update").click ()=>
  _update_line()

