console.clear();

const allRaces = [
  "Black",
  "Hispanic/Latino",
  "White",
  "Unknown",
  "Asian/Pacific Islander",
  "Native American"
];
const months = ["January", "February", "March", "April", "May", "June"];
const processed = [
  {
    Black: 22,
    "Hispanic/Latino": 17,
    White: 41,
    Unknown: 6,
    "Asian/Pacific Islander": 2,
    "Native American": 2
  },
  {
    Black: 21,
    "Hispanic/Latino": 15,
    White: 46,
    Unknown: 1,
    "Asian/Pacific Islander": 1,
    "Native American": 0
  },
  {
    Black: 37,
    "Hispanic/Latino": 14,
    White: 59,
    Unknown: 0,
    "Asian/Pacific Islander": 3,
    "Native American": 1
  },
  {
    Black: 29,
    "Hispanic/Latino": 16,
    White: 47,
    Unknown: 2,
    "Asian/Pacific Islander": 1,
    "Native American": 1
  },
  {
    Black: 26,
    "Hispanic/Latino": 5,
    White: 41,
    Unknown: 6,
    "Asian/Pacific Islander": 3,
    "Native American": 0
  },
  {
    Black: 0,
    "Hispanic/Latino": 0,
    White: 2,
    Unknown: 0,
    "Asian/Pacific Islander": 0,
    "Native American": 0
  }
];
let n = allRaces.length, // number of layers
  m = processed.length, // number of samples per layer
  stack = d3.stack().keys(allRaces);

let layers = stack(processed); // calculate the stack layout

layers.forEach(function(d, i) {
  //adding keys to every datapoint
  d.forEach(function(dd, j) {
    dd.month = months[j];
    dd.race = allRaces[i];
  });
});

let yGroupMax = d3.max(layers, function(layer) {
    return d3.max(layer, function(d) {
      return d[1] - d[0];
    });
  }),
  yStackMax = d3.max(layers, function(layer) {
    return d3.max(layer, function(d) {
      return d[1];
    });
  });
let margin = { top: 40, right: 10, bottom: 20, left: 10 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

let x = d3
  .scaleBand()
  .domain(months)
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
  .attr("width", x.bandwidth())
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
  y.domain([0, yGroupMax]);

  rect
    .transition()
    .duration(500)
    .delay(function(d, i) {
      return i * 10;
    })
    .attr("x", function(d) {
      return x(d.month) + z(d.race);
    })
    .attr("width", x.bandwidth() / m)
    .transition()
    .attr("y", function(d) {
      return y(d.data[d.race]);
    })
    .attr("height", function(d) {
      return height - y(d.data[d.race]);
    });
}

function transitionStacked() {
  y.domain([0, yStackMax]);

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
    .attr("width", x.bandwidth());
}