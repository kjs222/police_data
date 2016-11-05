var renderNeighborhoodStatsChart = function(bubbleStats) {
  var bubbleSvg = dimple.newSvg("#neighborhood-stats", 1050, 550);
  var bubbleChart = new dimple.chart(bubbleSvg, bubbleStats);
  bubbleChart.setBounds(60, 60, 850, 450)
  var bubbleX = bubbleChart.addMeasureAxis("x", "num_incidents");
  bubbleX.title = "Total Number of Incidents"
  var bubbleY = bubbleChart.addMeasureAxis("y", "num_arrests");
  bubbleY.title = "Total Number of Arrests"
  var z = bubbleChart.addMeasureAxis("z", "num_transient_incidents");

  bubbleY.overrideMax = 1800;
  bubbleX.overrideMax = 25000;


  var bubbleSeries = bubbleChart.addSeries(["neighborhood"], dimple.plot.bubble);

  bubbleSeries.getTooltipText = function (e) {
      return [
          "Neighborhood: " + e.aggField[0],
          "Incidents: " + e.cx.toFixed(0),
          "Arrests: " + e.cz.toFixed(0),
          "Transient Related Incidents: " + e.cy.toFixed(0)
      ];
  };

  bubbleSeries.lineWeight = 4;
  bubbleSeries.lineMarkers = true;
  var bubbleLegend = bubbleChart.addLegend(1000, 190, 60, 300, "Right");
  bubbleChart.draw();

  bubbleSvg.selectAll(".dimple-axis-x")
    .style("font-size", '14px')
    .attr("y", 550)
  bubbleSvg.selectAll(".dimple-axis-y")
    .style("font-size", '14px')
    .attr("y", 260)
  bubbleSvg.selectAll(".dimple-legend")
    .style("font-size", '12px')
  bubbleSvg.selectAll(".dimple-custom-axis-label")
    .style("font-size", '12px')


  bubbleChart.legends = [];
      bubbleSvg.selectAll("title_text")
        .data(["Click legend to","show/hide:"])
        .enter()
        .append("text")
          .attr("x", 925)
          .attr("y", function (d, i) { return 80 + i * 14; })
          .style("font-family", "sans-serif")
          .style("font-size", "12px")
          .style("color", "Black")
          .text(function (d) { return d; });


  var bubbleFilterValues = dimple.getUniqueValues(bubbleStats, "neighborhood");
  bubbleLegend.shapes.selectAll("rect")
    .on("click", function (e) {
      var bubbleHide = false;
      var newBubbleFilters = [];
      bubbleFilterValues.forEach(function (f) {
        if (f === e.aggField.slice(-1)[0]) {
          bubbleHide = true;
        } else {
          newBubbleFilters.push(f);
        }
      });
      if (bubbleHide) {
        d3.select(this).style("opacity", 0.2);
      } else {
        newBubbleFilters.push(e.aggField.slice(-1)[0]);
        d3.select(this).style("opacity", 0.8);
      }
      bubbleFilterValues = newBubbleFilters;
      bubbleChart.data = dimple.filterData(bubbleStats, "neighborhood", bubbleFilterValues);
      bubbleChart.draw(900);
    });

}


$.get('/api/v1/stats/overview_stats', function(stats) {
    var stats = stats.length === 2 ? stats[0] : stats;
    renderNeighborhoodStatsChart(stats);
});
