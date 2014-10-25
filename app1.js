$( document ).ready(function() {

  var total_width = 740;
  var total_r     = 360;
  circle_list = [{'r': 360}, {'r': 25}, {'r': 50}];
  ellipse_list = [{'rx': 360, 'ry':90}, {'rx':360, 'ry': 250}, {'rx': 90, 'ry': 360}, {'rx': 250, 'ry': 360}];


  var svgContainer = d3.select("#stars").append("svg")
                          .attr("width", total_width)
                          .attr("height", total_width);
  
  var circleGroup = svgContainer.append("g");
  var elipseGroup = svgContainer.append("g");

  circleGroup.selectAll("circle")
                          .data(circle_list)
                          .enter()
                          .append("circle")
                          .attr("cx", total_r)
                          .attr("cy", total_r)
                          .attr("r", function (d) { return d.r; })
                          .attr("fill","transparent")
                          .attr("stroke","white");

  circleGroup.append("circle")
                          .attr("cx", total_r)
                          .attr("cy", total_r)
                          .attr("r", total_r + 10)
                          .attr("fill", "transparent")
                          .attr("stroke", "white")
                          .attr("stroke-width", 4);

  circleGroup.append("circle")
                          .attr("cx", total_r)
                          .attr("cy", total_r)
                          .attr("r", 20)
                          .attr("fill", "white")
                          .attr("stroke", "white");

  elipseGroup.selectAll("ellipse")
                          .data(ellipse_list)
                          .enter()
                          .append("ellipse")
                          .attr("cx", total_r)
                          .attr("cy", total_r)
                          .attr("rx", function (d) { return d.rx;})
                          .attr("ry",function (d) { return d.ry;})
                          .attr("fill", "transparent")
                          .attr("stroke", "white")
                          .style("stroke-dasharray", ("6, 10"));
});

