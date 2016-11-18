$(document).ready(function() {
  drawMap();

});

var drawMap = function() {
    var color_domain = [250, 500, 1000, 1500, 2000, 4000]
    var ext_color_domain = [0, 250, 500, 1000, 1500, 2000]
    var legend_labels = ["< 250", "250+", "500+", "1000+", "1500+", "> 2000"]
    var color = d3.scale.threshold()
                        .domain(color_domain)
                        .range(["#adfcad", "#ffcb40", "#ffba00", "#ff7d73", "#ff4e40", "#ff1300"]);

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
                           .translate(offset);
                          //  .center(center)


    var path = d3.geo.path().projection(projection);

    svg.append("rect")
       .attr('width', width)
       .attr('height', height)
       .style('stroke', 'black')
       .style('fill', 'none');

   queue()
   .defer(d3.json, "sd_neigh_geojson.json")
   .defer(d3.json, "api/v1/stats/neigh_arrest_stats")
   .await(ready);

   function ready(error, map, data) {

     var scale  = 100;
     var center = d3.geo.centroid(map)
     var bounds  = path.bounds(map);
     var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
                    height - (bounds[0][1] + bounds[1][1])/2];

     projection = d3.geo.mercator()
                        .center(center)
                        .scale(scale)
                        .translate(offset);

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
          .style("fill", function(d) {
                return color(arrestsByNeighborhood[d.properties.neighborhood]);
           })
          .style("stroke-width", "1")
          .style("stroke", "black")
  }

  // svg.append("g")
  //     .attr("class", "region")
  //     .selectAll("path")
  //     .data(topojson.object(map, map.objects.russia).geometries)
  //     //.data(topojson.feature(map, map.objects.russia).features) <-- in case topojson.v1.js
  //     .enter().append("path")
  //     .attr("d", path)
  //     .style("fill", function(d) {
  //       return color(rateById[d.properties.region]);
  //     })
  //     .style("opacity", 0.8)



  //

}
