console.clear();

const offenseNames = [
  "Rape",
  "Fondling",
  "Statutory Rape"
];
const years = ["2013", "2014", "2015"];
const offensesByYear = [
  {
    "Rape": 16,
    "Fondling": 10,
    "Statutory Rape": 0
  },
  {
    "Rape": 26,
    "Fondling": 4,
    "Statutory Rape": 0
  },
  {
    "Rape": 25,
    "Fondling": 11,
    "Statutory Rape": 3
  }
];

const generateClassStr = str => {
  return str.replace(/\s+/g, '-').toLowerCase();
}

let n     = offenseNames.length, // number of layers
    m     = offensesByYear.length, // number of samples per layer
    stack = d3.stack().keys(offenseNames);

let layers = stack(offensesByYear); // calculate the stack layout

layers.forEach(function(d, i) {
  // add keys to every datapoint
  d.forEach(function(dd, j) {
    dd.year = years[j];
    dd.offenseName = offenseNames[i];
    dd.class = generateClassStr(dd.offenseName);
    dd.value =  dd.data[dd.offenseName]
  });
});

let yStackMax = d3.max(layers, function(layer) {
    return d3.max(layer, function(d) {
      return d[1];
    });
  });
let margin = { top: 70, right: 15, bottom: 40, left: 50 },
  fullChartWidth = fullChartHeight = 500,
  width  = fullChartWidth  - margin.left - margin.right,
  height = fullChartHeight - margin.top  - margin.bottom;

d3.select("#stacked-bar-chart-container")
  .style("width",  fullChartWidth)
  .style("height", fullChartHeight)

let x = d3
  .scaleBand()
  .domain(years)
  .rangeRound([0, width])
  .padding(0.08);

let y = d3
  .scaleLinear()
  .domain([0, yStackMax])
  .range([height, 0]);
let z = d3
  .scaleBand()
  .domain(offenseNames)
  .rangeRound([0, x.bandwidth()]);
let color = ["#7fc97f", "#beaed4", "#fdc086"]

let svg = d3
  .select("#stacked-bar-chart-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right + 20)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + (margin.left + 20) + "," + margin.top + ")");

let layer = svg
  .selectAll(".layer")
  .data(layers)
  .enter()
  .append("g")
  .attr("class", "layer")
  .style("fill", function(d, i) {
    return color[i];
  });

// Define the div for the tooltip
let tooltip = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

let rect = layer
  .selectAll(".bar")
  .data(function(d) {
    return d;
  })
  .enter()
  .append("rect")
  .attr("class", d => generateClassStr(d.offenseName) + " bar")
  .attr("x", function(d) {
    return x(d.year);
  })
  .attr("y", height)
  .attr("width", x.bandwidth() / m)
  .attr("height", 0)
  .on("mouseover", d => {
    d3.selectAll(".bar")
      .filter(dd => dd.class != d.class)
      .style("opacity", 0.6)
  })
  .on("mousemove", function(d) {   
    tooltip
      .style("opacity", .9) 
      .html("<b>" + d.value + "</b> cases of " + d.offenseName + " in " + d.year)  
      .style("left", (d3.mouse(this)[0]) + "px")   
      .style("top",  (d3.mouse(this)[1]) + 40 + "px");  
    })          
  .on("mouseout", function(d) {  
    d3.selectAll(".bar").style("opacity", 1) 
    tooltip.style("opacity", 0); 
  });

rect
  .transition()
  .delay(function(d, i) {
    return i * 10;
  })
  .attr("y", function(d) {
    return y(d[1]);
  })
  .attr("height", function(d) {
    return y(d[0]) - y(d[1]);
  });

svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).tickSizeOuter(0));

  // add the Y gridlines
svg.append("g")     
  .attr("class", "grid")
  .call(d3.axisLeft(y)
    .ticks(10)
    .tickSize(-width)
    .tickFormat("")
  )

// Add the y Axis
svg.append("g")
  .call(d3.axisLeft(y));

// text label for the y axis
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left - 30)
  .attr("x", 0 - (height / 2))
  .attr("dy", "3em")
  .style("text-anchor", "middle")
  .text("Offenses per Year"); 

let legend = svg
  .selectAll(".legend")
  .data(offenseNames.reverse()) // match stack order
  .enter()
  .append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) {
    return "translate(0," + i * 20 + ")";
  });

legend
  .append("rect")
  .attr("x", width - 18)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", function(d, i) {
    return color[offenseNames.length - 1 - i]; // match stack order
  });

legend
  .append("text")
  .attr("x", width - 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function(d) {
    return d;
  });

d3.selectAll("input").on("change", change);

function change() {
  (this.value === "grouped") ? transitionGrouped() : transitionStacked();
}

function transitionGrouped() {
  rect
    .transition()
    .duration(500)
    .delay(function(d, i) {
      return i * 10;
    })
    .attr("x", function(d) {
      return x(d.year) + z(d.offenseName);
    })
    .transition()
    .attr("y", function(d) {
      return y(d.data[d.offenseName]);
    })
    .attr("height", function(d) {
      return height - y(d.data[d.offenseName]);
    });
}

function transitionStacked() {
  rect
    .transition()
    .duration(500)
    .delay(function(d, i) {
      return i * 10;
    })
    .attr("y", function(d) {
      return y(d[1]);
    })
    .attr("height", function(d) {
      return y(d[0]) - y(d[1]);
    })
    .transition()
    .attr("x", function(d) {
      return x(d.year);
    })
}