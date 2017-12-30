console.clear();

const allRaces = [
  "Rape",
  "Folding",
  "Statutory Rape",
];
const years = ["2013", "2014", "2015"];
const processed = [
  {
    "Rape": 16,
    "Folding": 10,
    "Statutory Rape": 0
  },
  {
    "Rape": 26,
    "Folding": 4,
    "Statutory Rape": 0
  },
  {
    "Rape": 25,
    "Folding": 11,
    "Statutory Rape": 3
  }
];
let n = allRaces.length, // number of layers
  m = processed.length, // number of samples per layer
  stack = d3.stack().keys(allRaces);

let layers = stack(processed); // calculate the stack layout

layers.forEach(function(d, i) {
  //adding keys to every datapoint
  d.forEach(function(dd, j) {
    dd.month = years[j];
    dd.race = allRaces[i];
  });
});

let yStackMax = d3.max(layers, function(layer) {
    return d3.max(layer, function(d) {
      return d[1];
    });
  });
let margin = { top: 40, right: 10, bottom: 20, left: 10 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

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
  .domain(allRaces)
  .rangeRound([0, x.bandwidth()]);
let color = d3.scaleOrdinal(d3.schemeCategory20c).domain([0, n - 1]);

let svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let layer = svg
  .selectAll(".layer")
  .data(layers)
  .enter()
  .append("g")
  .attr("class", "layer")
  .style("fill", function(d, i) {
    return color(i);
  });

let rect = layer
  .selectAll("rect")
  .data(function(d) {
    return d;
  })
  .enter()
  .append("rect")
  .attr("x", function(d) {
    return x(d.month);
  })
  .attr("y", height)
  .attr("width", x.bandwidth() / m)
  .attr("height", 0);

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

let legend = svg
  .selectAll(".legend")
  .data(allRaces)
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
    return color(i);
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

let timeout = setTimeout(function() {
  d3
    .select('input[value="grouped"]')
    .property("checked", true)
    .each(change);
}, 2000);

function change() {
  clearTimeout(timeout);
  if (this.value === "grouped") transitionGrouped();
  else transitionStacked();
}

function transitionGrouped() {
  rect
    .transition()
    .duration(500)
    .delay(function(d, i) {
      return i * 10;
    })
    .attr("x", function(d) {
      return x(d.month) + z(d.race);
    })
    .transition()
    .attr("y", function(d) {
      return y(d.data[d.race]);
    })
    .attr("height", function(d) {
      return height - y(d.data[d.race]);
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
      return x(d.month);
    })
}