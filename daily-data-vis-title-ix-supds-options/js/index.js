const prop = {
  name: 0,
  heading: 1,
  content: 2,
  question: 3,
  option1: 4,
  option1_link: 5,
  option2: 6,
  option2_link: 7
}

const allOptions = {   
 "start": ["start", "First step", "[a little context]", "Do you wish to pursue formal criminal charges on the accused?", "Yes", "SUDPS", "No", "Title_IX"],
"SUDPS": ["SUDPS", "Formal Criminal Charges via SUDPS", "here's how you start it", "Click for next", "next", "SUDPS_investigation"],
  "Title_IX": ["Title_IX", "Handling it via Stanford Title IX", "[a little info on what Title IX is]", "Do you wish to have formal disciplinary action taken by Stanford?", "Yes", "Formal_Resolution", "No", "Informal_Resolution"],
  "SUDPS_investigation": ["SUDPS_investigation", "SUDPS Investigation", "[all about SUDPS investigation]", "Afterward, the process moves to the DA:", "DA process", "DA"],
  "Formal_Resolution": ["Formal_Resolution", "Formal Resolution", "At some point, break into two options for accused: 1. Non-hearing resolution (no trial; accused agrees to sanctions) 1. Hearing resolution (trial)"],
  "Informal_Resolution": ["Informal_Resolution", "Informal Resolution", "[present different kinds of outcomes.]"],
  "DA": ["DA", "DA Involvement",  "[description of how DA investigates]"]
}

window.onload = () => {
  console.clear()
  main()
};

const main = () => {
  console.log("sup")
  updateView(allOptions["start"])
}

const updateView = (data) => {
  console.log(data[prop.name])
  d3.select("#heading" ).html(data[prop.heading])
  d3.select("#content" ).html(data[prop.content])
  d3.select("#question").html(data[prop.question])
  d3.select("#option1" ).html(data[prop.option1])
      .on("click", () => updateView(allOptions[data[prop.option1_link]]))
  d3.select("#option2" ).html(data[prop.option2])
      .on("click", () => updateView(allOptions[data[prop.option2_link]]))
  // console.log(allOptions[data[prop.option1_link]])
}