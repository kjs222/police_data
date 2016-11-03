var renderNeighborhoodIncidentsChart = function(data) {
  var svg = dimple.newSvg("#neigh-incidents-scatter", 950, 550)

  data.forEach(function (d) {
    d["Day"] = d["date"].substring(0, d["date"].length - 6);
    d["Time of Day"] =
        "2000-01-01 " + d["date"].substring(d["date"].length - 5);
  }, this);


  var myChart = new dimple.chart(svg, data);
  myChart.setBounds(50, 40, 650, 400)
  var y = myChart.addTimeAxis("y", "Day", "%d %b %Y", "%d %b");
  var x = myChart.addTimeAxis("x", "Time of Day",
    "%Y-%m-%d %H:%M", "%H:%M");

  myChart.addSeries(["neighborhood", "address", "disposition description", "call type description"], dimple.plot.bubble);
  var myLegend = myChart.addLegend(900, 100, 60, 300, "Right");
  myChart.draw();

  myChart.legends = [];
      svg.selectAll("title_text")
        .data(["Click legend to","show/hide by Call Type:"])
        .enter()
        .append("text")
          .attr("x", 850)
          .attr("y", function (d, i) { return 80 + i * 14; })
          .style("font-family", "sans-serif")
          .style("font-size", "10px")
          .style("color", "Black")
          .text(function (d) { return d; });


  var filterValues = dimple.getUniqueValues(data, "call type description");
  myLegend.shapes.selectAll("rect")
    .on("click", function (e) {
      console.log("clicked")
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
      myChart.data = dimple.filterData(data, "call type description", filterValues);
      myChart.draw(900);
  });
};

var chartNeighborhoodIncidents = function(neighborhood, month, code) {
  var queryString = "?neighborhood=" + neighborhood + "&month=" + month + "&code=" + code;
  $.get('/api/v1/stats/neigh_incident_stats' + queryString, function(stats) {
      renderNeighborhoodIncidentsChart(stats);
  });
};

$(document).ready(function(){
  chartNeighborhoodIncidents("Gaslamp", "01/01/15", "A");
})
