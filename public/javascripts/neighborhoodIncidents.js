var renderNeighborhoodIncidentsChart = function(data) {
  var svg = dimple.newSvg("#neigh-incidents-scatter", 950, 550)

  data.forEach(function (d) {
    d["Day"] = d["date"].substring(0, d["date"].length - 6);
    d["Time of Day"] =
        "2000-01-01 " + d["date"].substring(d["date"].length - 5);
  }, this);


  var myChart = new dimple.chart(svg, data);
  myChart.setBounds(50, 40, 650, 400)
  var x = myChart.addTimeAxis("x", "Day", "%d %b %Y", "%d %b");
  var y = myChart.addTimeAxis("y", "Time of Day",
    "%Y-%m-%d %H:%M", "%H:%M");

  myChart.addSeries(["neighborhood", "address", "disposition description", "call type description"], dimple.plot.bubble);
  var myLegend = myChart.addLegend(900, 100, 60, 300, "Right");
  myChart.draw();

};

var chartNeighborhoodIncidents = function(neighborhood, month, code) {
  var queryString = "?neighborhood=" + neighborhood + "&month=" + month + "&code=" + code;
  $.get('/api/v1/stats/neigh_incident_stats' + queryString, function(stats) {
      renderNeighborhoodIncidentsChart(stats);
  });
};

$(document).ready(function(){
  chartNeighborhoodIncidents("Talmadge", "01/01/15", "A");
})
