$( document ).ready(function() {

  var svgContainer = d3.select("body").append("svg")
                                      .attr("width", 700)
                                      .attr("height", 700)
                                      .style("border", "1px solid black");


  d3.json("data/orion.json", function(error, stars) {

    var circles = svgContainer.selectAll("circle")
                            .data(stars)
                            .enter()
                            .append("circle");

    var circleAttributes = circles
                       .attr("cx", function (d) { return d.x; })
                       .attr("cy", function (d) { return d.y; })
                       .attr("name", function (d) { return d.name; })
                       .attr("r", 5 );


    
  });
  

  


});

