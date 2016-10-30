var renderNeighborhoodStatsChart = function(stats) {
  var svg = dimple.newSvg("#neighborhood-stats", 950, 550);
  var myChart = new dimple.chart(svg, stats);
  myChart.setBounds(50, 40, 750, 450)
  var x = myChart.addMeasureAxis("x", "num_incidents");
  var y = myChart.addMeasureAxis("y", "num_arrests");
  var z = myChart.addMeasureAxis("z", "num_transient_incidents");

  y.overrideMax = 1800;
  x.overrideMax = 25000;


  var s = myChart.addSeries(["neighborhood"], dimple.plot.bubble);

  s.getTooltipText = function (e) {
      return [
          "Neighborhood: " + e.aggField[0],
          "Incidents: " + e.cx.toFixed(0),
          "Arrests: " + e.cz.toFixed(0),
          "Transient Related Incidents: " + e.cy.toFixed(0)
      ];
  };

  s.lineWeight = 4;
  s.lineMarkers = true;
  var myLegend = myChart.addLegend(900, 100, 60, 300, "Right");
  myChart.draw();

  myChart.legends = [];
      svg.selectAll("title_text")
        .data(["Click legend to","show/hide by Neighborhood:"])
        .enter()
        .append("text")
          .attr("x", 850)
          .attr("y", function (d, i) { return 80 + i * 14; })
          .style("font-family", "sans-serif")
          .style("font-size", "10px")
          .style("color", "Black")
          .text(function (d) { return d; });


  var filterValues = dimple.getUniqueValues(stats, "neighborhood");
  myLegend.shapes.selectAll("rect")
    .on("click", function (e) {
      var hide = false;
      var newFilters = [];
      filterValues.forEach(function (f) {
        if (f === e.aggField.slice(-1)[0]) {
          hide = true;
        } else {
          newFilters.push(f);
        }
      });
      if (hide) {
        d3.select(this).style("opacity", 0.2);
      } else {
        newFilters.push(e.aggField.slice(-1)[0]);
        d3.select(this).style("opacity", 0.8);
      }
      filterValues = newFilters;
      myChart.data = dimple.filterData(stats, "neighborhood", filterValues);
      myChart.draw(900);
    });

}

$.get('/api/v1/stats/neighborhood_stats', function(stats) {
    renderNeighborhoodStatsChart(stats);
});
