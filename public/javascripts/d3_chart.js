var queryString = "?neighborhood=Talmadge&month=01/01/15&code=%A";
$.get('/api/v1/stats/neigh_incident_stats' + queryString, function(data) {
  console.log("called")

  var width = 1000,
    height = 600,
    padding = 100;

    var dayFormat = d3.time.format('%d %b %Y')
    var timeFormat = d3.time.format('%Y-%m-%d %H:%M')

  data.forEach(function (d) {
    d["Day"] = d["date"].substring(0, d["date"].length - 6);
    d["Time of Day"] =
        "2000-01-01 " + d["date"].substring(d["date"].length - 5);
  }, this);



  var xValue = function(d) { return dayFormat.parse(d["Day"]);}
  var yValue = function(d) { return timeFormat.parse(d["Time of Day"]);}

  var cValue = function(d) { return d["call type description"]; }
  var color = d3.scale.category20();

  var vis = d3.select(".d3-chart-time-scatter")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

  var xScale = d3.time.scale()
      .domain([d3.min(data, xValue), d3.max(data, xValue)])
      .range([padding, width-padding*2]);

  var yScale = d3.time.scale()
      .domain([d3.min(data, yValue), d3.max(data, yValue)])
      .range([height-padding, padding])

  var xMap = function(d) { return xScale(xValue(d));};
  var yMap = function(d) { return yScale(yValue(d));};

  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  var yAxis = d3.svg.axis()
        .orient("left")
        .scale(yScale)
        .ticks(24)
        .tickFormat(d3.time.format("%X"));

  var xAxis = d3.svg.axis()
        .orient("bottom")
        .scale(xScale);


  vis.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate("+padding+",0)")
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "10px")

      // draw x axis with labels and move to the bottom of the chart area
  vis.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("y", 15)
      .attr("x", 0)
      .attr("dy", ".35em")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size","12px")

  vis.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "dot")
      .attr('cx', xMap)
      .attr('cy', yMap)
      .attr('r', 5)
      .attr('fill', function(d) { return color(cValue(d)); })
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html("Incident Number:" + d["incident number"] + "<br/>Date: " + d["date"] + "<br>Address: " + d["address"] + "<br>Disposition: " + d["disposition description"] + "<br>Call Type: " + d["call type description"])
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

});









var queryString = "?neighborhood=Talmadge&month=01/01/15&code=%A";
$.get('/api/v1/stats/neigh_incident_stats' + queryString, function(data) {

  var width = 1200,
    height = 400,
    xPadding = 200,
    yPadding = 50;

  var timeFormat = d3.time.format('%d %b %Y %H:%M')

  var xValue = function(d) { return timeFormat.parse(d.date);}

  var vis = d3.select(".d3-chart-scatter")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

  var xScale = d3.time.scale()
      .domain([d3.min(data, xValue), d3.max(data, xValue)])
      .range([xPadding, width-xPadding*2]);

  var yScale = d3.scale.ordinal()
      .domain(data.map(function(d) { return d["call type description"]; }))
      .rangePoints([height-yPadding - 10, yPadding])

  var xMap = function(d) { return xScale(xValue(d));};

  var yAxis = d3.svg.axis()
        .orient("left")
        .scale(yScale);

  var xAxis = d3.svg.axis()
        .orient("bottom")
        .scale(xScale);

  vis.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate("+xPadding+",0)")
    .call(yAxis);

      // draw x axis with labels and move to the bottom of the chart area
  vis.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + (height - yPadding) + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 15)
      .attr("dy", ".35em")
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start")
      .style("font-size","12px")


  vis.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "dot")
      .attr('cx', xMap)
      .attr('cy', function(d) { return yScale(d["call type description"]); })
      .attr('r', 5)
      .attr('fill', 'red')

});

$.get('/api/v1/stats/overview_stats', function(data) {


  var width = 1100,
    height = 600,
    padding = 100;

  var cValue = function(d) { return d.neighborhood;}
  var color = d3.scale.category20();


  var xValue = function(d) { return d.num_incidents;}
  var yValue = function(d) { return d.num_arrests;}
  var zValue = function(d) { return d.num_transient_incidents;}


  var vis = d3.select(".d3-chart-bubble")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

  var xScale = d3.scale.linear()
      .domain([0, d3.max(data, xValue)])
      .range([padding, width-padding*2]);

  var yScale = d3.scale.linear()
      .domain([0, d3.max(data, yValue)])
      .range([height-padding, 0]);

  var zScale = d3.scale.linear()
      .domain([0, d3.max(data, zValue)])
      .range([3, 30]);

  var xMap = function(d) { return xScale(xValue(d));};
  var yMap = function(d) { return yScale(yValue(d));};
  var zMap = function(d) { return zScale(zValue(d));};

  // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

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
      .attr('r', zMap)
      .attr('fill', function(d) { return color(cValue(d));})
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["neighborhood"] + "<br/>Total Incidents: " + xValue(d) + "<br>Total Arrests: " + yValue(d) + "<br>Total Transient Incidents: " + zValue(d))
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

      // draw legend
var legend = vis.selectAll(".legend")
    .data(color.domain())
  .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

// draw legend colored rectangles
legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

// draw legend text
legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d;})

});

// http://bl.ocks.org/weiglemc/6185069
