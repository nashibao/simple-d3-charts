
pie = require('simple-d3-charts').pie

$.fn.pie = (options) ->
  return new pie "#" + this.attr("id"), options

pie_chart = $("#easy-as-pie-chart").pie({
    pie:
      width: 300
      height: 300
      r: 60
      ir: 30
  })

_update = ()->
  arrayRange = 100000
  arraySize = Math.ceil(Math.random() * 10)
  fillArray = =>
    data_label: "data_label"
    data_value: Math.ceil(Math.random() * (arrayRange))
  d = d3.range(arraySize).map(fillArray)
  pie_chart.update(d)

_update()

$("#pie-chart-update").click ()=>
  _update()

# updateInterval = window.setInterval(_update, 500)
