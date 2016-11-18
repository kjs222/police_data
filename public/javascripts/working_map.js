$(document).ready(function() {
  drawMap();

});

var drawMap = function() {
  d3.json("sd_neigh_geojson.json", function(data) {
    var margin = 75,
        width = 1000-margin,
        height = 600 - margin

    var center = d3.geo.centroid(data)
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
                           .center(center)
                           .translate(offset);

    var path = d3.geo.path().projection(projection);

   var bounds  = path.bounds(data);
  //  var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
  //  var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
  //  var scale   = (hscale < vscale) ? hscale : vscale;
   var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
                 height - (bounds[0][1] + bounds[1][1])/2];

  projection = d3.geo.mercator()
                     .center(center)
                     .scale(scale)
                     .translate(offset);

  path = path.projection(projection);


  svg.append("rect")
     .attr('width', width)
     .attr('height', height)
     .style('stroke', 'black')
     .style('fill', 'none');

  svg.selectAll("path").data(data.features)
       .enter()
       .append("path")
       .attr("d", path)
       .style("fill", "red")
       .style("stroke-width", "1")
       .style("stroke", "black")
   });

}
