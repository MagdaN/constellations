$( document ).ready(function() {

  var svgContainer = d3.select("#stars").append("svg")
                                        .attr("width", 700)
                                        .attr("height", 700);

  var firnament_outer = svgContainer.append("circle")
                                      .attr("cx", 350)
                                      .attr("cy", 350)
                                      .attr("r", 350)
                                      .attr("fill", "black")
                                      .attr("stroke", "white");

  var firnament = svgContainer.append("circle")
                                      .attr("cx", 350)
                                      .attr("cy", 350)
                                      .attr("r", 340)
                                      .attr("fill", "black")
                                      .attr("stroke", "white");

  var horizontal_elipse = svgContainer.append("ellipse")
                            .attr("cx", 350)
                            .attr("cy", 350)
                            .attr("rx", 340)
                            .attr("ry",80)
                            .attr("fill", "black")
                            .attr("stroke", "white")
                            .style("stroke-dasharray", ("6, 10"));

  var vertical_elipse = svgContainer.append("ellipse")
                            .attr("cx", 350)
                            .attr("cy", 350)
                            .attr("rx", 80)
                            .attr("ry",340)
                            .attr("fill", "transparent")
                            .attr("stroke", "white")
                            .style("stroke-dasharray", ("6, 10"));

  var horizontal_line = svgContainer.append("line")
                                            .attr("x1", 10)
                                            .attr("y1", 350)
                                            .attr("x2", 690)
                                            .attr("y2", 350)
                                            .attr("stroke", "white");

  var vertical_line = svgContainer.append("line")
                                            .attr("x1", 350)
                                            .attr("y1", 0)
                                            .attr("x2", 350)
                                            .attr("y2", 700)
                                            .attr("stroke", "white");
  
                                        

  /*d3.json("data/orion.json", function(error, stars) {

    var circles = svgContainer.selectAll("circle")
                              .data(stars)
                              .enter()
                              .append("circle");

    var circleAttributes = circles
                        .attr("cx", function (d) { return d.x*10; })
                        .attr("cy", function (d) { return d.y; })
                        .attr("name", function (d) { return d.name; })
                        .attr("r", 5 )
                        .attr("fill", 'red' );
  });*/


});

