

var renderDispositionCategoryChart = function(data) {
  var svg = dimple.newSvg("#disposition-category-stats", 590, 400);
  var myChart = new dimple.chart(svg, data);
  myChart.setBounds(70, 30, 340, 330);
  var x = myChart.addCategoryAxis("x", "month");
  x.addGroupOrderRule("month");
  myChart.addPctAxis("y", "count");
  var s = myChart.addSeries(["neighborhood", "code"], dimple.plot.area);
  s.lineWeight = 1;
  s.barGap = 0.05;
  myChart.addLegend(430, 20, 100, 300, "left");
  myChart.draw();
}


$.get('api/v1/stats/disposition_category_stats', function(stats){
  renderDispositionCategoryChart(stats)
})
