var dispositionCategoryStats = null;

var renderDispositionCategoryChart = function(neigh1, neigh2 ) {
  var neigh1 = neigh1 || "Gaslamp";
  var neigh2 = neigh2 || "La Jolla";

  var svg = dimple.newSvg("#disposition-category-stats", 590, 400);
  data = dimple.filterData(dispositionCategoryStats, "neighborhood", [neigh1, neigh2])
  var myChart = new dimple.chart(svg, data);
  myChart.setBounds(70, 30, 340, 330);
  var x = myChart.addCategoryAxis("x", ["Owner", "Month"]);
  // x.addGroupOrderRule("Date");
  myChart.addPctAxis("y", "Unit Sales");
  var s = myChart.addSeries("SKU", dimple.plot.area);
  s.lineWeight = 1;
  s.barGap = 0.05;
  myChart.addLegend(430, 20, 100, 300, "left");
  myChart.draw();


}


$.get('api/v1/stats/disposition_category_stats', function(stats){
  dispositionCategoryStats = stats;
  renderDispositionCategoryChart()
})
