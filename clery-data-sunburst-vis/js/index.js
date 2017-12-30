// Dimensions of sunburst.
var width = 800;
height = 800;
var radius = Math.min(width, height) / 2;

// make `colors` an ordinal scale
var colors = d3.scale.category20();

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0;

var vis = d3.select("#chart").append("svg:svg")
  .attr("width", width)
  .attr("height", height)
  .append("svg:g")
  .attr("id", "container")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var partition = d3.layout.partition()
  .size([2 * Math.PI, radius * radius])
  .value(function(d) {
    return d.size;
  });

var arc = d3.svg.arc()
  .startAngle(function(d) {
    return d.x;
  })
  .endAngle(function(d) {
    return d.x + d.dx;
  })
  .innerRadius(function(d) {
    return Math.sqrt(d.y);
  })
  .outerRadius(function(d) {
    return Math.sqrt(d.y + d.dy);
  });

// Use d3.csv.parseRows so that we do not need to have a header
// row, and can receive the csv as an array of arrays.

var json = getData();
createVisualization(json);

// Main function to draw and set up the visualization, once we have the data.
function createVisualization(json) {
  // Bounding circle underneath the sunburst, to make it easier to detect
  // when the mouse leaves the parent g.
  vis.append("svg:circle")
    .attr("r", radius)
    .style("opacity", 0);

  // For efficiency, filter nodes to keep only those large enough to see.
  var nodes = partition.nodes(json)
    .filter(function(d) {
      return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
    });

  var uniqueNames = (function(a) {
    var output = [];
    a.forEach(function(d) {
      if (output.indexOf(d.name) === -1) {
        output.push(d.name);
      }
    });
    return output;
  })(nodes);

  // set domain of colors scale based on data
  colors.domain(uniqueNames);


  // add each data as a group
  var pathGroup = vis.selectAll(".path-group")
    .data(nodes)
    .enter().append("g")
      .attr("class", "path-group")

  var path = pathGroup.append("svg:path")
    .attr("display", function(d) {
      return d.depth ? null : "none"; // hide root
    })
    .attr("d", arc)
    .attr("fill-rule", "evenodd")
    .style("fill", function(d) {
      return colors(d.name);
    })
    .style("opacity", 1)
    .on("mouseover", mouseover);

  // d3.selectAll(".path-group").append("text")
  //   .style("text-anchor", "middle")
  //   .attr("startOffset", "50%")
  //   .text("Hello!")

  // Add the mouseleave handler to the bounding circle.
  d3.select("#container").on("mouseleave", mouseleave);

  // Get total size of the tree = value of root node from partition.
  totalSize = path.node().__data__.value;
};

// Fade all but the current sequence
function mouseover(d) {
  console.log(d);
  //var percentage = (100 * d.value / totalSize).toPrecision(3);
  var percentageString = d.name; //EDDITED THIS PART__________

  d3.select("#percentage")
    .text(percentageString);


  var sequenceArray = getAncestors(d);

  // Fade all the segments.
  d3.selectAll("path")
    .style("opacity", 0.3);

  // Then highlight only those that are an ancestor of the current segment.
  vis.selectAll("path")
    .filter(function(node) {
      return (sequenceArray.indexOf(node) >= 0);
    })
    .style("opacity", 1);
}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {


  // Deactivate all segments during transition.
  d3.selectAll("path").on("mouseover", null);

  // Transition each segment to full opacity and then reactivate it.
  d3.selectAll("path")
    .transition()
    .duration(500)
    .style("opacity", 1)
    .each("end", function() {
      d3.select(this).on("mouseover", mouseover);
    });
}

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
function getAncestors(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

function getData() {
  return {
    "name": "ROOT NODE NOBODY SEES",
    "children": [{
        "name": "Investigation Proceeds",
        "children": [{ 
          "name": "Scheduled",
          "size": 10
        },{ 
          "name": "Active Investigations",
          "size": 10
        },{ 
          "name": "Decision not to charge",
          "size": 10
        },{
            "name": "Hearings",
            "children": [{
                "name": "Found Responsible",
                "size": 10 // NOTE: like it or not, d3 backwards computes radial width from leaf node "size," so you only actually need data for leaf nodes.
              }, {
                "name": "Found Not Responsible",
                "size": 10
              }] // closes children of "Hearings"
          }, {
        "name": "Non-hearing Resolution",
        "size": 100
      }] // closes children of "Investigation Proceeds"
      }, {
        "name": "No Investigation",
        "children": [{ 
          "name": "Complainant doesn't respond or proceed",
          "size": 10
        },{ 
          "name": "Informal Intervention",
          "size": 10
        }]
      }] // CLOSES ALL CHILD NODES
  };
};