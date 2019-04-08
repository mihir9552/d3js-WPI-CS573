// SLIDER DOESNT WORK

let data;
let locations;
let selectedColorValue;
let selectedShotValue;
let selectedValue = [0, 90];

const svg = d3.select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

const pitchG = svg.append("g");

const shotPosG = svg.append("g");

const colorLegendG = svg.append("g");

const playerPosG = svg.append("g");

const statsBoxG = svg.append("g");

const sliderG = svg
  .append("g")
  .attr("class", "slider-G")
  .attr("transform", `translate(160, 450)`);

const colorScale = d3
  .scaleOrdinal()
  .domain(["France", "Croatia"])
  .range(["#0146AD", "Red"]);

// svg.call(zoom().on('zoom', () => {
//   pitchG.attr('transform', event.transform);
// }));

const loadData = () =>
  d3
    .json("https://vizhub.com/threedoorsdown0/datasets/allShotsNew.json")
    .then(d => d);

loadData().then(processedData => {
  data = processedData;
  render();
});

const onLegendClick = d => {
  selectedColorValue = d;
  render();
};

const onShotClick = d => {
  selectedShotValue = d;
  render();
};

const onSliderMove = d => {
  //   console.log(d);
  selectedValue = d;
  render();
};

const shotPositions = (selection, props) => {
  const {
    data,
    circleRadius,
    scale,
    colorScale,
    selectedColorValue,
    onLegendClick,
    onShotClick,
    selectedShotValue,
    selectedValue
  } = props;

  //console.log(selectedValue)
  const pitchG = selection.attr("transform", `translate(100, 20)`);

  const plotShots = pitchG.selectAll(".shots").data(data);

  const plotShotsEnter = plotShots
    .enter()
    .append("g")
    .attr("class", "shots");

  plotShotsEnter
    .merge(plotShots)
    .attr("opacity", d => {
      if (!selectedShotValue || d === selectedShotValue) return 1;
      else return 0.03;

      if (selectedValue) {
        if (selectedValue[0] < selectedValue[1]) {
          if (d.minute >= selectedValue[0] && d.minute <= selectedValue[1])
            return 1;
          else return 0.03;
        } else {
          if (d.minute >= selectedValue[1] && d.minute <= selectedValue[0])
            return 1;
          else return 0.03;
        }
      } else {
        if (!selectedShotValue || d === selectedShotValue) return 1;
        else return 0.03;
      }
    })

    // ((!selectedShotValue || d === selectedShotValue)
    //  && (!selectedValue || (d.minute >= selectedValue[0] && d.minute <= selectedValue[1])) )
    //     ? 1
    //     : 0.03)
    .on("click", d => onShotClick(d === selectedShotValue ? null : d));

  plotShotsEnter
    .append("line")
    .merge(plotShots.select("line"))
    .attr("x1", d => d.location[1] * scale)
    .attr("y1", d => (d.location[0] - (d.location[0] - 30) * 2) * scale)
    .attr("x2", d => d.shot.end_location[1] * scale)
    .attr(
      "y2",
      d => (d.shot.end_location[0] - (d.shot.end_location[0] - 30) * 2) * scale
    )
    .attr("stroke", d => colorScale(d.team.name))
    .attr("stroke-width", 2)
    .attr("marker-end", d => {
      if (d.team.name === "France") return "url(#franceArrow)";
      else return "url(#arrow)";
    })
    .attr("opacity", d =>
      !selectedColorValue || d.team.name === selectedColorValue ? 1 : 0.05
    );

  plotShotsEnter
    .append("circle")
    .merge(plotShots.select("circle"))
    .attr("cx", d => d.location[1] * scale)
    .attr("cy", d => (d.location[0] - (d.location[0] - 30) * 2) * scale)
    .attr("r", circleRadius)
    .attr("fill", d => colorScale(d.team.name))
    .attr("opacity", d =>
      !selectedColorValue || d.team.name === selectedColorValue ? 1 : 0.05
    )
    .attr("stroke", "black")
    .attr("stroke-width", 2);

  plotShots.exit().remove();
};

const freezeFrames = (selection, props) => {
  const {
    data,
    circleRadius,
    scale,
    colorScale,
    selectedColorValue,
    onLegendClick,
    onShotClick,
    selectedShotValue,
    hover,
    hoverOff
  } = props;

  const pitchG = selection.attr("transform", `translate(100, 20)`);

  let freezeFramePos;

  if (selectedShotValue) {
    if (selectedShotValue.shot) {
      freezeFramePos = selectedShotValue.shot.freeze_frame;
    } else {
      freezeFramePos = [];
    }
  } else {
    freezeFramePos = [];
  }

  // var div = pitchG.append("div")
  //   .attr("class", "tooltip")
  //   .style("opacity", 0);

  const plotPlayers = selection.selectAll("circle").data(freezeFramePos);
  plotPlayers
    .enter()
    .append("circle")
    .merge(plotPlayers)
    .attr("cx", d => d.location[1] * scale)
    .attr("cy", d => (d.location[0] - (d.location[0] - 30) * 2) * scale)
    .attr("r", circleRadius)
    .attr("fill", d => {
      if (selectedShotValue.team.name === "Croatia" && d.teammate === true)
        return "red";
      else if (
        selectedShotValue.team.name === "Croatia" &&
        d.teammate === false
      )
        return "#0146AD";
      else if (selectedShotValue.team.name === "France" && d.teammate === true)
        return "#0146AD";
      else if (selectedShotValue.team.name === "France" && d.teammate === false)
        return "red";
    })
    // .on('mouseover', hover)
    //     .on('mouseout', hoverOff)
    .append("title")
    .text(function(d) {
      return d.player.name;
    });
  // .on("mouseover", function(d) {
  // div.transition()
  // .duration(200)
  // .style("opacity", .9);
  // div.html('<h1>hello')
  // .style("left", "100px")
  // .style("top", "100px");
  // console.log(div)
  // })
  // .on("mouseout", function(d) {
  // div.transition()
  // .duration(500)
  // .style("opacity", 0)});

  plotPlayers.exit().remove();
};

const pitch = (selection, props) => {
  const {
    scale,
    pitchWidth,
    pitchLength,
    halfwayCircleRadius,
    cornerRadius,
    goalLength,
    goalWidth,
    eighteenYardBoxWidth,
    eighteenYardBoxLength,
    sixYardBoxLength,
    sixYardBoxWidth,
    penaltySpotDistFromGoal,
    penaltyArcRadius
  } = props;

  const g = selection.attr("transform", `translate(100, 20)`);

  const rect = g
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", pitchLength * scale)
    .attr("width", pitchWidth * scale)
    .attr("fill", "green")
    .attr("stroke", "black");

  const halfwayCircle = g
    .append("path")
    .attr(
      "d",
      d3.arc()({
        innerRadius: halfwayCircleRadius * scale,
        outerRadius: halfwayCircleRadius * scale + 4,
        startAngle: -Math.PI / 2,
        endAngle: Math.PI / 2
      })
    )
    .attr("fill", "white")
    .attr(
      "transform",
      `translate(${(pitchWidth * scale) / 2}, ${pitchLength * scale})`
    );

  const kickOffSpot = g
    .append("path")
    .attr(
      "d",
      d3.arc()({
        innerRadius: 0,
        outerRadius: 4,
        startAngle: -Math.PI / 2,
        endAngle: Math.PI / 2
      })
    )
    .attr("fill", "white")
    .attr(
      "transform",
      `translate(${(pitchWidth * scale) / 2}, ${pitchLength * scale})`
    );

  const rightCornerCircle = g
    .append("path")
    .attr(
      "d",
      d3.arc()({
        innerRadius: cornerRadius * scale * 2,
        outerRadius: cornerRadius * scale * 2 + 2,
        startAngle: -Math.PI / 2,
        endAngle: -Math.PI
      })
    )
    .attr("fill", "white")
    .attr("transform", `translate(${pitchWidth * scale}, 0)`);

  const leftCornerCircle = g
    .append("path")
    .attr(
      "d",
      d3.arc()({
        innerRadius: cornerRadius * scale * 2,
        outerRadius: cornerRadius * scale * 2 + 2,
        startAngle: Math.PI / 2,
        endAngle: Math.PI
      })
    )
    .attr("fill", "white")
    .attr("transform", `translate(0, 0)`);

  const goalVertical1 = g
    .append("line")
    .attr("x1", (pitchWidth * scale) / 2 - (goalLength * scale) / 2)
    .attr("y1", 0)
    .attr("x2", (pitchWidth * scale) / 2 - (goalLength * scale) / 2)
    .attr("y2", -goalWidth * scale)
    .attr("stroke", "black")
    .attr("stroke-width", 4);

  const goalVertical2 = g
    .append("line")
    .attr("x1", (pitchWidth * scale) / 2 + (goalLength * scale) / 2)
    .attr("y1", 0)
    .attr("x2", (pitchWidth * scale) / 2 + (goalLength * scale) / 2)
    .attr("y2", -goalWidth * scale)
    .attr("stroke", "black")
    .attr("stroke-width", 4);

  const goalHorizontal = g
    .append("line")
    .attr("x1", (pitchWidth * scale) / 2 - (goalLength * scale) / 2)
    .attr("y1", -goalWidth * scale)
    .attr("x2", (pitchWidth * scale) / 2 + (goalLength * scale) / 2)
    .attr("y2", -goalWidth * scale)
    .attr("stroke", "black")
    .attr("stroke-width", 4);

  const eighteenYardBoxHorizontal = g
    .append("line")
    .attr("x1", (pitchWidth * scale) / 2 - (eighteenYardBoxWidth * scale) / 2)
    .attr("y1", eighteenYardBoxLength * scale)
    .attr("x2", (pitchWidth * scale) / 2 + (eighteenYardBoxWidth * scale) / 2)
    .attr("y2", eighteenYardBoxLength * scale)
    .attr("stroke", "white")
    .attr("stroke-width", 4);

  const eighteenYardBoxVertical1 = g
    .append("line")
    .attr("x1", (pitchWidth * scale) / 2 - (eighteenYardBoxWidth * scale) / 2)
    .attr("y1", 0)
    .attr("x2", (pitchWidth * scale) / 2 - (eighteenYardBoxWidth * scale) / 2)
    .attr("y2", eighteenYardBoxLength * scale)
    .attr("stroke", "white")
    .attr("stroke-width", 4);

  const eighteenYardBoxVertical2 = g
    .append("line")
    .attr("x1", (pitchWidth * scale) / 2 + (eighteenYardBoxWidth * scale) / 2)
    .attr("y1", 0)
    .attr("x2", (pitchWidth * scale) / 2 + (eighteenYardBoxWidth * scale) / 2)
    .attr("y2", eighteenYardBoxLength * scale)
    .attr("stroke", "white")
    .attr("stroke-width", 4);

  const sixYardBoxVertical1 = g
    .append("line")
    .attr("x1", (pitchWidth * scale) / 2 - (sixYardBoxWidth * scale) / 2)
    .attr("y1", 0)
    .attr("x2", (pitchWidth * scale) / 2 - (sixYardBoxWidth * scale) / 2)
    .attr("y2", sixYardBoxLength * scale)
    .attr("stroke", "white")
    .attr("stroke-width", 4);

  const sixYardBoxVertical2 = g
    .append("line")
    .attr("x1", (pitchWidth * scale) / 2 + (sixYardBoxWidth * scale) / 2)
    .attr("y1", 0)
    .attr("x2", (pitchWidth * scale) / 2 + (sixYardBoxWidth * scale) / 2)
    .attr("y2", sixYardBoxLength * scale)
    .attr("stroke", "white")
    .attr("stroke-width", 4);

  const sixYardBoxHorizontal = g
    .append("line")
    .attr("x1", (pitchWidth * scale) / 2 - (sixYardBoxWidth * scale) / 2)
    .attr("y1", sixYardBoxLength * scale)
    .attr("x2", (pitchWidth * scale) / 2 + (sixYardBoxWidth * scale) / 2)
    .attr("y2", sixYardBoxLength * scale)
    .attr("stroke", "white")
    .attr("stroke-width", 4);

  const penaltySpot = g
    .append("circle")
    .attr("cx", (pitchWidth * scale) / 2)
    .attr("cy", penaltySpotDistFromGoal * scale)
    .attr("r", 3)
    .attr("fill", "white");

  const penaltyArc = g
    .append("path")
    .attr(
      "d",
      d3.arc()({
        innerRadius: penaltyArcRadius * scale,
        outerRadius: penaltyArcRadius * scale + 4,
        startAngle: -Math.PI + 0.9,
        endAngle: -Math.PI - 0.9
      })
    )
    .attr("fill", "white")
    .attr(
      "transform",
      `translate(${(pitchWidth * scale) / 2}, ${penaltySpotDistFromGoal *
        scale})`
    );
};

const colorLegend = (selection, props) => {
  const {
    colorScale,
    circleRadius,
    spacing,
    textOffset,
    onLegendClick,
    selectedColorValue,
    legendDim
  } = props;

  const pitchG = selection.attr("transform", `translate(100, 20)`);

  const groups = selection.selectAll(".legend").data(colorScale.domain());

  const groupsEnter = groups
    .enter()
    .append("g")
    .attr("class", "legend");

  groupsEnter
    .merge(groups)
    .attr("transform", (d, i) => `translate(0, ${i * spacing})`)
    .attr("opacity", d =>
      !selectedColorValue || d === selectedColorValue ? 1 : 0.3
    )
    .on("click", d => onLegendClick(d === selectedColorValue ? null : d));

  groupsEnter
    .append("rect")
    .merge(groups.select("rect"))
    .attr("x", 600)
    .attr("y", 80)
    .attr("width", legendDim)
    .attr("height", legendDim)
    .attr("fill", colorScale);

  groupsEnter
    .append("text")
    .merge(groups.select("text"))
    .text(d => d)
    .attr("dy", "0.32em")
    .attr("x", 600 + textOffset + legendDim / 1.5)
    .attr("y", 80 + legendDim / 2);

  groups.exit().remove();
};

const statsBox = (selection, props) => {
  const { statsBoxLength, statsBoxWidth, selectedShotValue } = props;

  //   console.log(selectedShotValue);

  let goal = "No";
  if (selectedShotValue && !selectedShotValue.shot) console.log("Yes");

  if (selectedShotValue) {
    if (selectedShotValue.shot.outcome.name === "Goal") goal = "Yes";
  }

  selection.html(
    selectedShotValue
      ? `
          <div>
                <h2>${selectedShotValue.player.name}</h2>
                ${selectedShotValue.team.name}<br/>
                Play Pattern: ${selectedShotValue.play_pattern.name}<br />
                With his: ${selectedShotValue.shot.body_part.name}<br />
                In the: ${selectedShotValue.minute}th minute<br />
                Goal?: ${goal}<br />
            </div>
        `
      : null
  );
};

const slider = (selection, props) => {
  const { v1, v2, onSliderMove, selectedValue } = props;

  //console.log([v1, v2])
  var sliderVals = [v1, v2];
  var width = 400;
  //   svg = d3.select("#slider-holder").append("svg")
  //     .attr('width', width+30)
  //     .attr('height', 50);

  var x = d3
    .scaleLinear()
    .domain([0, 90])
    .range([0, width])
    .clamp(true);

  var xMin = x(0),
    xMax = x(90);

  //console.log([xMin, xMax])

  //console.log(x(90))

  // var slider = svg.append("g")
  //     .attr("class", "slider")
  //     .attr("transform", "translate(5,20)");

  selection
    .append("line")
    .attr("class", "track")
    .attr("x1", 10 + x.range()[0])
    .attr("x2", 10 + x.range()[1]);

  // console.log(x.range())
  var selRange = selection
    .append("line")
    .attr("class", "sel-range")
    .attr("x1", 10 + x(sliderVals[0]))
    .attr("x2", 10 + x(sliderVals[1]));

  // console.log(x(sliderVals[1]))

  selection
    .insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(10,24)")
    .selectAll("text")
    .data(x.ticks(10))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    //.style("fill", function(x){return color(x);})
    .text(function(d) {
      return d;
    });

  var handle = selection
    .selectAll("rect")
    .data([0, 1])
    .enter()
    .append("rect", ".track-overlay")
    .attr("class", "handle")
    .attr("y", -8)
    .attr("x", function(d) {
      return x(sliderVals[d]);
    })
    .attr("rx", 3)
    .attr("height", 16)
    .attr("width", 20)
    .call(
      d3
        .drag()
        .on("start", startDrag)
        .on("drag", drag)
        .on("end", endDrag)
    );

  function startDrag() {
    d3.select(this)
      .raise()
      .classed("active", true);
  }

  function drag(d) {
    var x1 = d3.event.x;
    if (x1 > xMax) {
      x1 = xMax;
    } else if (x1 < xMin) {
      x1 = xMin;
    }
    d3.select(this).attr("x", x1);
    // console.log(d3.select(this));
    var x2 = x(sliderVals[d == 0 ? 1 : 0]);

    selRange.attr("x1", 10 + x1).attr("x2", 10 + x2);
    //console.log(x2)
  }

  function endDrag(d) {
    var v = Math.round(x.invert(d3.event.x));
    var elem = d3.select(this);
    sliderVals[d] = v;
    var v1 = Math.min(sliderVals[0], sliderVals[1]),
      v2 = Math.max(sliderVals[0], sliderVals[1]);
    elem.classed("active", false).attr("x", x(v));
    selRange.attr("x1", 10 + x(v1)).attr("x2", 10 + x(v2));
    onSliderMove([v1, v2]);
    // updateGraph(v1, v2);
  }
};

const render = () => {
  shotPosG.call(shotPositions, {
    data,
    circleRadius: 5,
    scale: 6.8,
    colorScale,
    selectedColorValue,
    onLegendClick,
    onShotClick,
    selectedShotValue,
    selectedValue
  });

  playerPosG.call(freezeFrames, {
    data,
    circleRadius: 5,
    scale: 6.8,
    colorScale,
    selectedColorValue,
    onLegendClick,
    onShotClick,
    selectedShotValue
    // hover,
    // hoverOff
  });

  pitchG.call(pitch, {
    scale: 6.8,
    pitchWidth: 80,
    pitchLength: 60,
    halfwayCircleRadius: 9.15,
    cornerRadius: 1,
    goalLength: 8,
    goalWidth: 2,
    eighteenYardBoxWidth: 44,
    eighteenYardBoxLength: 18,
    sixYardBoxLength: 6,
    sixYardBoxWidth: 20,
    penaltySpotDistFromGoal: 12,
    penaltyArcRadius: 9.15
  });

  colorLegendG.call(colorLegend, {
    colorScale,
    circleRadius: 10,
    spacing: 20,
    textOffset: 10,
    onLegendClick,
    selectedColorValue,
    legendDim: 15
  });

  d3.select("#statsBox").call(statsBox, {
    data,
    scale: 6.8,
    pitchWidth: 80,
    pitchLength: 60,
    onShotClick,
    selectedShotValue
  });

  sliderG.call(slider, {
    v1: 0,
    v2: 90,
    onSliderMove,
    selectedValue
  });
};

render();

// import { json } from 'd3';
