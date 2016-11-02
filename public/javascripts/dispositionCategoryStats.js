

var renderDispositionCategoryChart = function(data, element) {
  var svg = dimple.newSvg(element, 400, 400);
  var myChart = new dimple.chart(svg, data);
  myChart.setBounds(70, 30, 200, 330);
  var x = myChart.addCategoryAxis("x", "month");
  x.addGroupOrderRule("month");
  myChart.addPctAxis("y", "incidents");
  var s = myChart.addSeries(["neighborhood", "type"], dimple.plot.area);
  s.lineWeight = 1;
  s.barGap = 0.05;
  if (element === "#disp-cat-2") {
    myChart.addLegend(300, 20, 100, 300, "left");
  }
  myChart.draw();
}


$.get('api/v1/stats/disposition_category_stats', function(stats){
  renderDispositionCategoryChart(stats, "#disp-cat-1")
})

$.get('api/v1/stats/disposition_category_stats?neighborhood=Hillcrest', function(stats){
  renderDispositionCategoryChart(stats, "#disp-cat-2")
})
