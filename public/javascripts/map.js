$(document).ready(function() {
  drawMap();

});

var drawMap = function() {
    var color_domain = [500, 1000, 1500, 2000, 4000]
    var ext_color_domain = [0, 500, 1000, 1500, 2000]
    // var legend_labels = ["< 250", "250+", "500+", "1000+", "1500+", "> 2000"]
    var color = d3.scale.threshold()
                        .domain(color_domain)
                        .range(d3.schemeReds[5]);

    // new for color
    // var arrests = d3.map();
    var x = d3.scale.linear()
        .domain([1, 6])
        .rangeRound([600, 860]);
    // var color = d3.scale.threshold()
    //     .domain(d3.range(2, 10))
    //     .range(d3.schemeBlues[9]);





    var margin = 75,
        width = 1000-margin,
        height = 600 - margin

    //
    var scale  = 40000;
    var offset = [width/2, height/2];

    var svg = d3.select("#map")
                .append('svg')
                .attr('width', width + margin)
                .attr('height', height + margin)
                .append('g')
                .attr('class', 'map')

    var projection = d3.geo.mercator()
                           .scale(scale)
                           .center([-117.2, 32.7])
                           .translate(offset);


    var path = d3.geo.path().projection(projection);

    svg.append("rect")
       .attr('width', width)
       .attr('height', height)
       .style('stroke', 'black')
       .style('fill', 'none');

      //new for color
      var g = svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(0,40)");


     g.selectAll("rect")
       .data(color.range().map(function(d) {
           d = color.invertExtent(d);
           if (d[0] == null) d[0] = x.domain()[0];
           if (d[1] == null) d[1] = x.domain()[1];
           return d;
         }))
       .enter().append("rect")
         .attr("height", 8)
         .attr("x", function(d) { return x(d[0]); })
         .attr("width", function(d) { return x(d[1]) - x(d[0]); })
         .attr("fill", function(d) { return color(d[0]); });

     g.append("text")
         .attr("class", "caption")
         .attr("x", x.range()[0])
         .attr("y", -6)
         .attr("fill", "#000")
         .attr("text-anchor", "start")
         .attr("font-weight", "bold")
         .text("Unemployment rate");

    //  g.call(d3.axis.bottom(x)
    //      .tickSize(13)
    //      .tickFormat(function(x, i) { return i ? x : x + "%"; })
    //      .tickValues(color.domain()))
    //    .select(".domain")
    //      .remove();





   queue()
   .defer(d3.json, "sd_neigh_geojson.json")
   .defer(d3.json, "api/v1/stats/neigh_arrest_stats")
   .await(ready);

   function ready(error, map, data) {

     var center = d3.geo.centroid(map)
     var bounds  = path.bounds(map);
     var scale = 40000;



     projection = d3.geo.mercator()
                        .center(center)
                        .scale(scale)
                        .translate([-1200, 100]);

     path = path.projection(projection);

     var arrestsByNeighborhood = {};
     var neighborhoodNames = {};

     data.forEach(function(d) {
       arrestsByNeighborhood[d.neighborhood] = +d.num_arrests;
       neighborhoodNames[d.neighborhood] = d.neighborhood;
     });

     svg.selectAll("path")
          .data(map.features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("fill", function(d) { return color(arrestsByNeighborhood[d.properties.name]);})
          .style("stroke-width", "1")
          .style("stroke", "black")
  }


}

// http://bl.ocks.org/KoGor/5685876
