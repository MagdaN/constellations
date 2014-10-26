var orion = null;
var destinations = null;
var path = null;

var total_width = 1140;
var total_height = 680;
var center = {
  'x': 800,
  'y': 340
};
var black_circle = {
  'r': 330
};
var outer_circle = {
  'r': 310
};
var inner_circles = [
  {'r': 300},
  {'r':  40},
  {'r':  80}
];
var ellipse_list = [
  {'rx': 300, 'ry':  60},
  {'rx': 300, 'ry': 180},
  {'rx':  60, 'ry': 300},
  {'rx': 180, 'ry': 300}
];
var box_offset = 25;
var selected = 'Sol';

function ra2x(ra) {
  var x = ra;
  //x *= 1.5;
  x += -20;
  x *= (Math.PI / 180.0);
  x = center.x - (Math.cos(x) * inner_circles[0].r);
  return x;
}

function dec2y(dec) {
  var y = dec;
  //y *= 1.5;
  //y += 20;
  y *= (Math.PI / 180.0);
  y = center.y + (Math.sin(y) * inner_circles[0].r);
  return y;
}

function transition(destination) {
  d3.select('#orion-stars').selectAll("circle")
    .transition()
    .duration(2000)
    .attr("cx", function (d) {
      return ra2x(d.coords[destination].ra);
    })
    .attr("cy", function (d) {
      return dec2y(d.coords[destination].dec);
    });

  d3.select('#orion-rays').selectAll("line")
    .transition()
    .duration(2000)
    .attr("x2", function (d) {
      return ra2x(d.coords[destination].ra);
    })
    .attr("y2", function (d) {
      return dec2y(d.coords[destination].dec);
    });

  d3.select('#orion-path').selectAll("line")
    .transition()
    .duration(2000)
    .attr("x1", function (d) {
      return ra2x(orion[d[0]].coords[destination].ra);
    })
    .attr("x2", function (d) {
      return ra2x(orion[d[1]].coords[destination].ra);
    })
    .attr("y1", function (d) {
      return dec2y(orion[d[0]].coords[destination].dec);
      
    })
    .attr("y2", function (d) {
      return dec2y(orion[d[1]].coords[destination].dec);
    });
}

$( document ).ready(function() {

  var svgContainer = d3.select("#stars").append("svg")
                          .attr("width", total_width)
                          .attr("height", total_height);
  
  svgContainer.append("g")
    .append("circle")
    .attr("cx", center.x)
    .attr("cy", center.y)
    .attr("r", black_circle.r)
    .attr("fill", "black");

  svgContainer.append("g")
    .selectAll("circle")
    .data(inner_circles)
    .enter()
    .append("circle")
    .attr("cx", center.x)
    .attr("cy", center.y)
    .attr("r", function (d) { return d.r; })
    .attr("fill","transparent")
    .attr("stroke","white");

  svgContainer.append("g")
    .append("circle")
    .attr("cx", center.x)
    .attr("cy", center.y)
    .attr("r", outer_circle.r)
    .attr("fill", "transparent")
    .attr("stroke", "white")
    .attr("stroke-width", 2);

  svgContainer.append("g")
    .selectAll("ellipse")
    .data(ellipse_list)
    .enter()
    .append("ellipse")
    .attr("cx", center.x)
    .attr("cy", center.y)
    .attr("rx", function (d) { return d.rx; })
    .attr("ry", function (d) { return d.ry; })
    .attr("fill", "transparent")
    .attr("stroke", "white");

  random_stars = [];

  for (var i=0; i<2000; i++) {
    var random_star = {
      r: Math.random(),
      x: ra2x(Math.random() * 180),
      y: dec2y((Math.random() - 0.5) * 180)
    };

    var dist = Math.sqrt(Math.pow(random_star.x - center.x,2) + Math.pow(random_star.y - center.y,2));

    if (dist < inner_circles[0].r) {
      random_stars.push(random_star);
    }
  }

  svgContainer.append("g").selectAll("circle")
    .data(random_stars)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    })
    .attr("r", function (d) {
      return d.r;
    })
    .attr("fill","white");


  d3.json("data/orion.json", function(error, json) {
    if (error) return console.warn(error);

    orion = json.orion;
    destinations = json.destinations;
    path = json.path;

    for (var i=0; i<destinations.length; i++) {
      destinations[i]['y'] = 110 + 100 * i;
    }

    svgContainer.append("g")
      .append("circle")
      .attr("cx", center.x)
      .attr("cy", center.y)
      .attr("r", outer_circle.r)
      .attr("fill", "transparent")
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    svgContainer.append("g")
      .selectAll("circle")
      .data(destinations)
      .enter()
      .append("circle")
      .attr("id", function (d) { return 'textcircle_' + d.name;})
      .attr("cx", 95)
      .attr("cy", function (d) {return d.y + 75;} )
      .attr("r", 50)
      .attr("fill", "transparent")
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .style("visibility", "hidden");

    svgContainer.append("g")
      .selectAll("circle")
      .data(destinations)
      .enter()
      .append("circle")
      .attr("id", function (d) { return 'textsmallcircle_' + d.name;})
      .attr("cx", 95)
      .attr("cy", function (d) {return d.y + 75;} )
      .attr("r", 35)
      .attr("fill", "transparent")
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .style("visibility", "hidden");

    svgContainer.append("g")
      .selectAll("rect")
      .data(destinations)
      .enter()
      .append("rect")
      .attr("id", function (d) { return 'textfield_' + d.name;})
      .attr("x", 60)
      .attr("y", function (d) {return d.y + box_offset + 15;})
      .attr("rx", 35)
      .attr("ry", 35)
      .attr("width", 350)
      .attr("height", 70)
      .style("fill", "transparent")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("visibility", "hidden");

    svgContainer.append("g")
      .selectAll("text")
      .data(destinations)
      .enter()
      .append("text")
      .attr("x", 170)
      .attr("fill", "white")
      .attr("y", function (d) { return (d.y + box_offset + 35);})
      .attr("id", function (d) {return 'name_' + d.name;})
      .attr("font-weight", "bold")
      .style("visibility", "hidden")
      .text(function(d) { return d.name; });

    svgContainer.append("g")
      .selectAll("text")
      .data(destinations)
      .enter()
      .append("text")
      .attr("x", 170)
      .attr("fill", "white")
      .attr("y", function (d) { return (d.y + box_offset + 55);})
      .attr("id", function (d) {return 'distance_' + d.name;})
      .style("visibility", "hidden")
      .text(function(d) { return 'Distance: ' + d.distance + ' lyr'; });

    svgContainer.append("g")
      .selectAll("text")
      .data(destinations)
      .enter()
      .append("text")
      .attr("x", 170)
      .attr("fill", "white")
      .attr("y", function (d) { return (d.y + box_offset + 75);})
      .attr("id", function (d) {return 'amag_' + d.name;})
      .style("visibility", "hidden")
      .text(function(d) { return 'Absolute Magnitude: ' + d.amag; });

    svgContainer.append("g")
      .selectAll("text")
      .data(destinations)
      .enter()
      .append("image")
      .attr('xlink:href', function (d) { return 'img/' + d.name + '.png'; })
      .attr("x", 20)
      .attr("y", function (d) { return d.y; } )
      .attr('width', 150)
      .attr('height', 150)
      .on("click", function(d){
          transition(d.name);

          d3.select('#textcircle_' + selected).style("visibility", "hidden");
          d3.select('#name_' + selected).style("visibility", "hidden");
          d3.select('#distance_' + selected).style("visibility", "hidden");
          d3.select('#amag_' + selected).style("visibility", "hidden");
          d3.select('#spectype_' + selected).style("visibility", "hidden");

          selected = d.name;

          d3.select('#textcircle_' + d.name).style("visibility", "visible");
          d3.select('#name_' + d.name).style("visibility", "visible");
          d3.select('#distance_' + d.name).style("visibility", "visible");
          d3.select('#amag_' + d.name).style("visibility", "visible");
          d3.select('#spectype_' + d.name).style("visibility", "visible");
        })
      .on("mouseover", function (d) {
          d3.select('#textfield_' + d.name).style("visibility", "visible");
          d3.select('#textsmallcircle_' + d.name).style("visibility", "visible");
          d3.select('#name_' + d.name).style("visibility", "visible");
          d3.select('#distance_' + d.name).style("visibility", "visible");
          d3.select('#amag_' + d.name).style("visibility", "visible");
          d3.select('#spectype_' + d.name).style("visibility", "visible");
      })
      .on("mouseout", function (d) {
          d3.select('#textfield_' + d.name).style("visibility", "hidden");
          d3.select('#textsmallcircle_' + d.name).style("visibility", "hidden");
          
          if (d.name != selected) {
            d3.select('#name_' + d.name).style("visibility", "hidden");
            d3.select('#distance_' + d.name).style("visibility", "hidden");
            d3.select('#amag_' + d.name).style("visibility", "hidden");
            d3.select('#spectype_' + d.name).style("visibility", "hidden");
          }
      });

    d3.select('#textcircle_Sol').style("visibility", "visible");
    d3.select('#name_Sol').style("visibility", "visible");
    d3.select('#distance_Sol').style("visibility", "visible");
    d3.select('#amag_Sol').style("visibility", "visible");
    d3.select('#spectype_Sol').style("visibility", "visible");

    var destination = 'Sol';

    svgContainer.append("g")
      .attr('id','orion-stars')
      .selectAll("circle")
      .data(orion)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return ra2x(d.coords[destination].ra);
      })
      .attr("cy", function (d) {
        return dec2y(d.coords[destination].dec);
      })
      .attr("r", 3)
      .attr("fill","white");
      
    svgContainer.append("g")
      .attr('id','orion-rays')
      .selectAll("line")
      .data(orion)
      .enter()
      .append("line")
      .attr("x1", function (d) {
        return center.x;
      })
      .attr("x2", function (d) {
        return ra2x(d.coords[destination].ra);
      })
      .attr("y1", function (d) {
        return center.y;
      })
      .attr("y2", function (d) {
        return dec2y(d.coords[destination].dec);
      })
      .attr("stroke-width","1")
      .attr("stroke","white")
      .style("stroke-dasharray", ("4, 4"));

    svgContainer.append("g")
      .attr('id','orion-path')
      .selectAll("line")
      .data(path)
      .enter()
      .append("line")
      .attr("x1", function (d) {
        return ra2x(orion[d[0]].coords[destination].ra);
      })
      .attr("x2", function (d) {
        return ra2x(orion[d[1]].coords[destination].ra);
      })
      .attr("y1", function (d) {
        return dec2y(orion[d[0]].coords[destination].dec);
        
      })
      .attr("y2", function (d) {
        return dec2y(orion[d[1]].coords[destination].dec);
      })
      .attr("stroke-width","2")
      .attr("stroke","white");
  
    svgContainer.append("g")
      .append("image")
      .attr('xlink:href', 'img/sphere2.png')
      .attr("x", center.x - 35)
      .attr("y", center.y - 35)
      .attr('width', 70)
      .attr('height', 70);

  });
});
