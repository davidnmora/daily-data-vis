const prop = {
  name: 0,
  heading: 1,
  content: 2,
  question: 3,
  option1: 4,
  option1_link: 5,
  option2: 6,
  option2_link: 7
};

const allOptions = {
  start: [
    "start",
    "First step",
    "Assuming you know the name of your perpetrator and are willing to disclose the accused’s name, several options are available, based on how one wishes to proceed. The following questions provide high level guidance through them. Rarely, such as in extreme cases or cases involving repeat offenders, Stanford may choose to procee with a formal 'investigation over objection' despite a victim requesting only informal intervention.",
    "Do you want to explore potential criminal charges (SUDPS) or disciplinary charges (Title IX)?  (Note that choosing one over the other does not mean you can’t report to both departments.)",
    "Yes",
    "SUDPS",
    "No",
    "Title_IX"
  ],
  SUDPS: [
    "SUDPS",
    "Formal Criminal Charges via SUDPS",
    "Upon reporting the assault to Stanford University Police Department [through what means?] (SUDPS), SUDPS provides the victim with resources, writes a report, and opens an investigation in which interviews with the victim, suspect, and/or witnesses are conducted. The case is then sent to the District Attorney (DA).",
    "Click for information on the DA's involvement",
    "DA Involvement",
    "DA"
  ],
  Title_IX: [
    "Title_IX",
    "Handling it via Stanford Title IX",
    "Stanford’s TItle IX office, amoung other things, handles cases of sexual harassment, sexual misconduct, sexual assault. It is a University process, not a legal process. Victims may pursue formal disciplinary actions against the perpetrator, or opt for an informal resolution between the parties.",
    "Do you wish to have formal disciplinary action taken by Stanford?",
    "Yes",
    "Formal_Resolution",
    "No",
    "Informal_Resolution"
  ],
  Formal_Resolution: [
    "Formal_Resolution",
    "Formal Resolution",
    "A formal investigation begins, parties sent a Notice of Concern, and interim measures are implemented on a case-by-case basis. Title IX investigator interviews parties and witnesses and collects relevant documentary evidence. Title IX Coordinator decides whether to charge the accused, and notifies students involved. If the accused is charged: a. Three trained panelists review Hearing File, meet with parties and witnesses, and finally deliberate and determine responsibility using preponderance of the evidence standard, before notifying the students involved",
    "[At some point, break into two options for accused: 1. Non-hearing resolution (no trial; accused agrees to sanctions) 1. Hearing resolution (trial)]"
  ],
  Informal_Resolution: [
    "Informal_Resolution",
    "Informal Resolution",
    "[Where can I find concrete info on what this could be?]"
  ],
  DA: ["DA", "DA Involvement", "The District Attorney’s sexual assault unit reviews case, conducting further investigation if lacking sufficient evidence. If sufficient evidense is found to charge the accused, a formal court case begins."]
};

window.onload = () => {
  console.clear();
  main();
};

const main = () => {
  updateView(allOptions["start"], allOptions["start"]);
};

const updateView = data => {
  d3.select("#heading").html(data[prop.heading]);
  d3.select("#content").html(data[prop.content]);
  d3.select("#question").html(data[prop.question]);
  createButtons(data);
};

const createButtons = data => {
  let restart = d3.select("#restart-button")
  let option1 = d3.select("#option1")
  let option2 = d3.select("#option2")
  if(data[prop.name] != "start") {
    restart
      .on("click", () => updateView(allOptions["start"]))
        .style("display", "inline")
  } else {
    restart.style("display", "none")
  }
 
  if (data[prop.option1]) {
    option1
      .html(data[prop.option1])
      .on("click", () => updateView(allOptions[data[prop.option1_link]]))
      .style("display", "inline");
  } else {  
    option1.style("display", "none");
  }
  
  if (data[prop.option2]) {
    option2
      .html(data[prop.option2])
      .on("click", () => updateView(allOptions[data[prop.option2_link]]))
      .style("display", "inline");
  } else {
    option2.style("display", "none");
  }
};
