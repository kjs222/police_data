// var queryString = "?neighborhood=Talmadge&month=01/01/15&code=%A";
// $.get('/api/v1/stats/neigh_incident_stats' + queryString, function(data) {
//
//   var width = 1000,
//     height = 400,
//     padding = 100;
//
//   var timeFormat = d3.time.format('%d %b %Y %H:%M')
//
//   var categories = data.map(function(d) { return d["call type description"] });
//
//
//   var vis = d3.select(".d3-chart")
//               .append("svg")
//               .attr("width", width)
//               .attr("height", height);
//
//   var xScale = d3.time.scale()
//       .domain([d3.min(data, function(d) { return  timeFormat.parse(d["date"]) }), d3.max(data, function(d) { return timeFormat.parse(d["date"])})])
//       .range([padding, width-padding*2]);
//
//   var yScale = d3.scale.ordinal()
//       .domain(categories)
//       .range([height-padding, 0]);
//
//   var yAxis = d3.svg.axis()
//         .orient("left")
//         .scale(yScale);
//
//   var xAxis = d3.svg.axis()
//         .orient("bottom")
//         .scale(xScale);
//
//   vis.append("g")
//     .attr("class", "yaxis")
//     .attr("transform", "translate("+padding+",0)")
//     .call(yAxis);
//
//       // draw x axis with labels and move to the bottom of the chart area
//   vis.append("g")
//       .attr("class", "xaxis")
//       .attr("transform", "translate(0," + (height - padding) + ")")
//       .call(xAxis);
//
//   d3.selectAll(".dot")
//     .data(data)
//     .enter()
//     .append("circle")
//       .attr("class", "dot")
//       .attr('cx', function(d) { debugger; return xScale[timeFormat.parse(d["date"])]  })
//       .attr('cy', function(d) { return yScale[d['call type description']]})
//       .attr('radius', "10px")
//       .attr('fill', 'red')
//
//
//   // vis.selectAll(".xaxis text")  // select all the text elements for the xaxis
//   //         .attr("transform", function(d) {
//   //             return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
//   //       });
//
// });

$.get('/api/v1/stats/overview_stats', function(data) {


  var width = 1100,
    height = 600,
    padding = 100;

  var xValue = function(d) { return d.num_incidents;}
  var yValue = function(d) { return d.num_arrests;}

  var vis = d3.select(".d3-chart")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

  var xScale = d3.scale.linear()
      .domain([0, d3.max(data, xValue)])
      .range([padding, width-padding*2]);

  var yScale = d3.scale.linear()
      .domain([0, d3.max(data, yValue)])
      .range([height-padding, 0]);

  var xMap = function(d) { return xScale(xValue(d));};
  var yMap = function(d) { return yScale(yValue(d));};

  var yAxis = d3.svg.axis()
        .orient("left")
        .scale(yScale);

  var xAxis = d3.svg.axis()
        .orient("bottom")
        .scale(xScale);

  vis.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate("+padding+",0)")
    .call(yAxis);

      // draw x axis with labels and move to the bottom of the chart area
  vis.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis);

  vis.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "dot")
      .attr('cx', xMap)
      .attr('cy', yMap)
      .attr('r', 10)
      .attr('fill', 'red')


  // vis.selectAll(".xaxis text")  // select all the text elements for the xaxis
  //         .attr("transform", function(d) {
  //             return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
  //       });

});
