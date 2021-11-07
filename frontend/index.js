// function test() {
//     k = 10
//     n = 4
//     duration = 250
//     const svg = d3.create("svg")
//     .attr("viewBox", [0, 0, width, height]);
    
//     const updateBars = bars(svg);
//     const updateAxis = axis(svg);
//     const updateLabels = labels(svg);
//     const updateTicker = ticker(svg);
    
//     yield svg.node();
    
//     for (const keyframe of keyframes) {
//     const transition = svg.transition()
//       .duration(duration)
//       .ease(d3.easeLinear);
    
//     // Extract the top bar’s value.
//     x.domain([0, keyframe[1][0].value]);
    
//     updateAxis(keyframe, transition);
//     updateBars(keyframe, transition);
//     updateLabels(keyframe, transition);
//     updateTicker(keyframe, transition);
    
//     invalidation.then(() => svg.interrupt());
//     await transition.end();
//     }
// }

// function rank(value) {
//     const data = Array.from(names, name => ({name, value: value(name)}));
//     data.sort((a, b) => d3.descending(a.value, b.value));
//     for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
//     return data;
// }

//--------------------------------------------------------------------------------------
// import Dropzone from "dropzone"

var obj_csv = {
    size:0,
    dataFile:[]
};

function readImage(input) {
    csvData = []
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.readAsBinaryString(input.files[0]);
        reader.onload = function (e) {
            obj_csv.size = e.total;
            obj_csv.dataFile = e.target.result
            csvData = parseData(obj_csv.dataFile)
            csvData.shift()
            csvData.pop()
        }
    }
}

//  const{Dropzone} = new Dropzone("dropzone")

// function fileUpload(){
//   var myDropzone = new Dropzone()
//   myDropzone.on("addedfile", file => {
//     console.log("File added: ", file.name)
//   })
// }


function flash(element){
  console.log("flash: ", element)
  document.getElementById(element).classList.add('secondary');
  setTimeout(function() {
    document.getElementById(element).classList.remove('secondary');
  }, 200);
}


function parseData(data){
    let csvData = [];
    let lbreak = data.split("\n");
    lbreak.forEach(res => {
        csvData.push(res.split(","));
    });

    return csvData
}

function generateData(){
    //console.log(csvData)
}

function getMaxSlopesAndIds(numberTopIds){ //numberOfIds
    var slopes = {} //create dictionary to hold slopes with ids as key
    var maxIds = {} //create dictionary to house the id's with highest slopes (greatest increase in demand)
    var lrModels = []
    for(let i = 0; i < csvData.length; i++) {
        let lrVals = [[1, parseInt(csvData[i][5])], [2, parseInt(csvData[i][6])], [3, parseInt(csvData[i][7])], [4, parseInt(csvData[i][8])], [5, parseInt(csvData[i][9])], [6, parseInt(csvData[i][10])]] //store pair Values in an Array
        lrModels[i] = regression.linear(lrVals);
        
        // const gradient = result.equation[0];
        // const yIntercept = result.equation[1];
        slopes[csvData[i][0]] = lrModels[i].equation[0] //Calculate slope for every row (Month as x, new value as y)
    }
    //get max slope (or top 20-30 or something), these are doctors trending higher, faster
    
    // var b = { '1': 0.02, '2': 0.87, '3': 0.54, '4': 0.09, '5': 0.74 };
    var arr = Object.keys( slopes ).map(function ( key ) { return slopes[key]; });
    var max = Math.max.apply( null, arr );
    console.log(max)
    // for(let j = 0; j < numberTopIds; j++){
    //     var max = Math.max.apply( null, arr );
    // }
}

//------------------------------------------BAR CHART RACE------------------------------------------

function cleanForBarChartRace() {
    finalArray = [];
    // iterate through columns 11 through 16 (inclusive)
    for (let i = 11; i < 17; i++) {
        cholecap = 0;
        novaitch = 0;
        nasalclear = 0;
        zapapain = 0;
        // iterate through the 1000 doctors
        for (let j = 0; j < 1000; j++) {
            if (csvData[j][4] === "Cholecap") {
                cholecap += parseInt(csvData[j][i]);
            } else if (csvData[j][4] === "Zap-a-Pain") {
                zapapain += parseInt(csvData[j][i]);
            } else if (csvData[j][4] === "Nasalclear") {
                nasalclear += parseInt(csvData[j][i]);
            } else if (csvData[j][4] === "Nova-itch") {
                novaitch += parseInt(csvData[j][i]);
            }
        }
        // we've gotten the monthly sums of each product
        // add to array
        let entry = {
            date : i - 10,
            dataSet : [
                {name : "Cholecap", value : cholecap},
                {name : "Zap-a-Pain", value : zapapain},
                {name : "Nasalclear", value : nasalclear},
                {name : "Nova-itch", value : novaitch}
            ]
        };
        finalArray.push(entry);
    }
    console.log(finalArray);
    return finalArray;
}

function generateBarChartRace() {
    const myChart = new BarChartRace("bar-chart-race");
    cleanCsvData = cleanForBarChartRace();
    myChart
      .setTitle("Total Prescriptions Over Time")
      .addDatasets(cleanCsvData)
      .render();
    
    d3Select("button").on("click", function() {
        if (this.innerHTML === "Stop") {
          this.innerHTML = "Resume";
          myChart.stop();
        } else if (this.innerHTML === "Resume") {
          this.innerHTML = "Stop";
          myChart.start();
        } else {
          this.innerHTML = "Stop";
          myChart.render();
        }
    });
}

function BarChartRace(chartId, extendedSettings) {
    const chartSettings = {
      width: 500,
      height: 400,
      padding: 40,
      titlePadding: 5,
      columnPadding: 0.4,
      ticksInXAxis: 5,
      duration: 3500,
      ...extendedSettings
    };
  
    chartSettings.innerWidth = chartSettings.width - chartSettings.padding * 2;
    chartSettings.innerHeight = chartSettings.height - chartSettings.padding * 2;
  
    const chartDataSets = [];
    let chartTransition;
    let timerStart, timerEnd;
    let currentDataSetIndex = 0;
    let elapsedTime = chartSettings.duration;
  
    const chartContainer = d3.select(`#${chartId} .chart-container`);
    const xAxisContainer = d3.select(`#${chartId} .x-axis`);
    const yAxisContainer = d3.select(`#${chartId} .y-axis`);
  
    const xAxisScale = d3.scaleLinear().range([0, chartSettings.innerWidth]);
  
    const yAxisScale = d3
      .scaleBand()
      .range([0, chartSettings.innerHeight])
      .padding(chartSettings.columnPadding);
  
    d3.select(`#${chartId}`)
      .attr("width", chartSettings.width)
      .attr("height", chartSettings.height);
  
    chartContainer.attr(
      "transform",
      `translate(${chartSettings.padding} ${chartSettings.padding})`
    );
  
    chartContainer
      .select(".current-date")
      .attr(
        "transform",
        `translate(${chartSettings.innerWidth} ${chartSettings.innerHeight})`
      );
  
    function draw({ dataSet, date: currentDate }, transition) {
      const { innerHeight, ticksInXAxis, titlePadding } = chartSettings;
      const dataSetDescendingOrder = dataSet.sort(
        ({ value: firstValue }, { value: secondValue }) =>
          secondValue - firstValue
      );
  
      chartContainer.select(".current-date").text("Month " + currentDate);
  
      xAxisScale.domain([0, dataSetDescendingOrder[0].value]);
      yAxisScale.domain(dataSetDescendingOrder.map(({ name }) => name));
  
      xAxisContainer.transition(transition).call(
        d3
          .axisTop(xAxisScale)
          .ticks(ticksInXAxis)
          .tickSize(-innerHeight)
      );
  
      yAxisContainer
        .transition(transition)
        .call(d3.axisLeft(yAxisScale).tickSize(0));
  
      // The general update Pattern in d3.js
  
      // Data Binding
      const barGroups = chartContainer
        .select(".columns")
        .selectAll("g.column-container")
        .data(dataSetDescendingOrder, ({ name }) => name);
  
      // Enter selection
      const barGroupsEnter = barGroups
        .enter()
        .append("g")
        .attr("class", "column-container")
        .attr("transform", `translate(0,${innerHeight})`);
  
      barGroupsEnter
        .append("rect")
        .attr("class", "column-rect")
        .attr("width", 0)
        .attr("height", yAxisScale.step() * (1 - chartSettings.columnPadding));
  
      barGroupsEnter
        .append("text")
        .attr("class", "column-title")
        .attr("y", (yAxisScale.step() * (1 - chartSettings.columnPadding)) / 2)
        .attr("x", -titlePadding)
        .text(({ name }) => name);
  
      barGroupsEnter
        .append("text")
        .attr("class", "column-value")
        .attr("y", (yAxisScale.step() * (1 - chartSettings.columnPadding)) / 2)
        .attr("x", titlePadding)
        .text(0);
  
      // Update selection
      const barUpdate = barGroupsEnter.merge(barGroups);
  
      barUpdate
        .transition(transition)
        .attr("transform", ({ name }) => `translate(0,${yAxisScale(name)})`)
        .attr("fill", "normal");
  
      barUpdate
        .select(".column-rect")
        .transition(transition)
        .attr("width", ({ value }) => xAxisScale(value));
  
      barUpdate
        .select(".column-title")
        .transition(transition)
        .attr("x", ({ value }) => xAxisScale(value) - titlePadding);
  
      barUpdate
        .select(".column-value")
        .transition(transition)
        .attr("x", ({ value }) => xAxisScale(value) + titlePadding)
        .tween("text", function({ value }) {
          const interpolateStartValue =
            elapsedTime === chartSettings.duration
              ? this.currentValue || 0
              : +this.innerHTML;
  
          const interpolate = d3.interpolate(interpolateStartValue, value);
          this.currentValue = value;
  
          return function(t) {
            d3.select(this).text(Math.ceil(interpolate(t)));
          };
        });
  
      // Exit selection
      const bodyExit = barGroups.exit();
  
      bodyExit
        .transition(transition)
        .attr("transform", `translate(0,${innerHeight})`)
        .on("end", function() {
          d3.select(this).attr("fill", "none");
        });
  
      bodyExit
        .select(".column-title")
        .transition(transition)
        .attr("x", 0);
  
      bodyExit
        .select(".column-rect")
        .transition(transition)
        .attr("width", 0);
  
      bodyExit
        .select(".column-value")
        .transition(transition)
        .attr("x", titlePadding)
        .tween("text", function() {
          const interpolate = d3.interpolate(this.currentValue, 0);
          this.currentValue = 0;
  
          return function(t) {
            d3.select(this).text(Math.ceil(interpolate(t)));
          };
        });
  
      return this;
    }
  
    function addDataset(dataSet) {
      chartDataSets.push(dataSet);
  
      return this;
    }
  
    function addDatasets(dataSets) {
      chartDataSets.push.apply(chartDataSets, dataSets);
  
      return this;
    }
  
    function setTitle(title) {
      d3.select(".chart-title")
        .attr("x", chartSettings.width / 2)
        .attr("y", -chartSettings.padding / 2)
        .text(title);
  
      return this;
    }
  
    /* async function render() {
      for (const chartDataSet of chartDataSets) {
        chartTransition = chartContainer
          .transition()
          .duration(chartSettings.duration)
          .ease(d3.easeLinear);
  
        draw(chartDataSet, chartTransition);
  
        await chartTransition.end();
      }
    } */
  
    async function render(index = 0) {
      currentDataSetIndex = index;
      timerStart = d3.now();
  
      chartTransition = chartContainer
        .transition()
        .duration(elapsedTime)
        .ease(d3.easeLinear)
        .on("end", () => {
          if (index < chartDataSets.length) {
            elapsedTime = chartSettings.duration;
            render(index + 1);
          } else {
            d3.select("button").text("Play");
          }
        })
        .on("interrupt", () => {
          timerEnd = d3.now();
        });
  
      if (index < chartDataSets.length) {
        draw(chartDataSets[index], chartTransition);
      }
  
      return this;
    }
  
    function stop() {
      d3.select(`#${chartId}`)
        .selectAll("*")
        .interrupt();
  
      return this;
    }
  
    function start() {
      elapsedTime -= timerEnd - timerStart;
  
      render(currentDataSetIndex);
  
      return this;
    }
  
    return {
      addDataset,
      addDatasets,
      render,
      setTitle,
      start,
      stop
    };
  }

//------------------------------------------STACKED BAR CHART------------------------------------------

function cleanForStackedBarChart() {
    finalArray = [];
    // iterate through columns 11 through 16 (inclusive)
    for (let i = 11; i < 17; i++) {
        cholecap = 0;
        novaitch = 0;
        nasalclear = 0;
        zapapain = 0;
        // iterate through the 1000 doctors
        for (let j = 0; j < 1000; j++) {
            if (csvData[j][4] === "Cholecap") {
                cholecap += parseInt(csvData[j][i]);
            } else if (csvData[j][4] === "Zap-a-Pain") {
                zapapain += parseInt(csvData[j][i]);
            } else if (csvData[j][4] === "Nasalclear") {
                nasalclear += parseInt(csvData[j][i]);
            } else if (csvData[j][4] === "Nova-itch") {
                novaitch += parseInt(csvData[j][i]);
            }
        }
        // we've gotten the monthly sums of each product
        // add to array
        let entry = {
            date : i - 10,
            dataSet : [
                {name : "Cholecap", value : cholecap},
                {name : "Zap-a-Pain", value : zapapain},
                {name : "Nasalclear", value : nasalclear},
                {name : "Nova-itch", value : novaitch}
            ]
        };
        finalArray.push(entry);
    }
    console.log(finalArray);
    return finalArray;
}

function generateStackedBarChart() {
    var n = 6, // The number of series.
    m = 4; // The number of values per series.

    cleanCsvData = cleanForBarChartRace(csvData);
    stackedData = []

    for (let i = 0; i < cleanCsvData.length; i++) {
        stackedData[i] = [
            cleanCsvData[i].dataSet[0].value,
            cleanCsvData[i].dataSet[1].value,
            cleanCsvData[i].dataSet[2].value,
            cleanCsvData[i].dataSet[3].value
        ];
    }

    // The xz array has m elements, representing the x-values shared by all series.
    // The yz array has n elements, representing the y-values of each of the n series.
    // Each yz[i] is an array of m non-negative numbers representing a y-value for xz[i].
    // The y01z array has the same structure as yz, but with stacked [y₀, y₁] instead of y.
    var xz = d3.range(m),
        yz = stackedData,
        y01z = d3.stack().keys(d3.range(n))(d3.transpose(yz)),
        yMax = d3.max(yz, function(y) { return d3.max(y); }),
        y1Max = d3.max(y01z, function(y) { return d3.max(y, function(d) { return d[1]; }); });

    var svg = d3.select("#stacked-bar-chart"),
        margin = {top: 40, right: 10, bottom: 20, left: 10},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .domain(xz)
        .rangeRound([0, width])
        .padding(0.08);

    var y = d3.scaleLinear()
        .domain([0, y1Max])
        .range([height, 0]);

    var color = d3.scaleOrdinal()
        .domain(d3.range(n))
        .range(d3.schemeCategory20c);

    var series = g.selectAll(".series")
    .data(y01z)
    .enter().append("g")
        .attr("fill", function(d, i) { return color(i); });

    var rect = series.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
        .attr("x", function(d, i) { return x(i); })
        .attr("y", height)
        .attr("width", x.bandwidth())
        .attr("height", 0);

    rect.transition()
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); });

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .tickSize(0)
            .tickPadding(6));

    let inputs = d3.selectAll("#stacked-input-form .stacked-input")
        .on("change", changed);

    var timeout = d3.timeout(function() {
    d3.select("input[value=\"grouped\"]")
        .property("checked", true)
        .dispatch("change");
    }, 2000);

    function changed() {
        timeout.stop();
        if (this.value === "grouped") transitionGrouped();
        else transitionStacked();
    }
    
    function transitionGrouped() {
        y.domain([0, yMax]);

        rect.transition()
            .duration(500)
            .delay(function(d, i) { return i * 10; })
            .attr("x", function(d, i) { return x(i) + x.bandwidth() / n * this.parentNode.__data__.key; })
            .attr("width", x.bandwidth() / n)
            .transition()
            .attr("y", function(d) { return y(d[1] - d[0]); })
            .attr("height", function(d) { return y(0) - y(d[1] - d[0]); });
    }

    function transitionStacked() {
        y.domain([0, y1Max]);

        rect.transition()
            .duration(500)
            .delay(function(d, i) { return i * 10; })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .transition()
            .attr("x", function(d, i) { return x(i); })
            .attr("width", x.bandwidth());
    }

    function bumps(m) {
        var values = [], i, j, w, x, y, z;
    
        // Initialize with uniform random values in [0.1, 0.2).
        for (i = 0; i < m; ++i) {
        values[i] = 0.1 + 0.1 * Math.random();
        }
    
        // Add five random bumps.
        for (j = 0; j < 5; ++j) {
        x = 1 / (0.1 + Math.random());
        y = 2 * Math.random() - 0.5;
        z = 10 / (0.1 + Math.random());
        for (i = 0; i < m; i++) {
            w = (i / m - y) * z;
            values[i] += x * Math.exp(-w * w);
        }
        }
    
        // Ensure all values are positive.
        for (i = 0; i < m; ++i) {
        values[i] = Math.max(0, values[i]);
        }
    
        return values;
    }
}

//------------------------------------------HIERARCHICAL BAR CHART------------------------------------------

// function generateHierBarChart() {
//     var margin = {top: 30, right: 120, bottom: 0, left: 120},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;

//     var x = d3.scaleLinear()
//         .range([0, width]);

//     var barHeight = 20;

//     var color = d3.scaleOrdinal()
//         .range(["steelblue", "#ccc"]);

//     var duration = 750,
//         delay = 25;

//     var partition = d3.partition().size([height, width]);

//     var xAxis = d3.axisBottom(x)

//     var svg = d3.select("body").append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     svg.append("rect")
//         .attr("class", "background")
//         .attr("width", width)
//         .attr("height", height)
//         .on("click", up);

//     svg.append("g")
//         .attr("class", "x axis");

//     svg.append("g")
//         .attr("class", "y axis")
//     .append("line")
//         .attr("y1", "100%");

//     d3.json("readme.json", function(error, root) {
//     if (error) throw error;

//     partition.nodes(root);
//     x.domain([0, root.value]).nice();
//     down(root, 0);
//     });

//     function down(d, i) {
//     if (!d.children || this.__transition__) return;
//     var end = duration + d.children.length * delay;

//     // Mark any currently-displayed bars as exiting.
//     var exit = svg.selectAll(".enter")
//         .attr("class", "exit");

//     // Entering nodes immediately obscure the clicked-on bar, so hide it.
//     exit.selectAll("rect").filter(function(p) { return p === d; })
//         .style("fill-opacity", 1e-6);

//     // Enter the new bars for the clicked-on data.
//     // Per above, entering bars are immediately visible.
//     var enter = bar(d)
//         .attr("transform", stack(i))
//         .style("opacity", 1);

//     // Have the text fade-in, even though the bars are visible.
//     // Color the bars as parents; they will fade to children if appropriate.
//     enter.select("text").style("fill-opacity", 1e-6);
//     enter.select("rect").style("fill", color(true));

//     // Update the x-scale domain.
//     x.domain([0, d3.max(d.children, function(d) { return d.value; })]).nice();

//     // Update the x-axis.
//     svg.selectAll(".x.axis").transition()
//         .duration(duration)
//         .call(xAxis);

//     // Transition entering bars to their new position.
//     var enterTransition = enter.transition()
//         .duration(duration)
//         .delay(function(d, i) { return i * delay; })
//         .attr("transform", function(d, i) { return "translate(0," + barHeight * i * 1.2 + ")"; });

//     // Transition entering text.
//     enterTransition.select("text")
//         .style("fill-opacity", 1);

//     // Transition entering rects to the new x-scale.
//     enterTransition.select("rect")
//         .attr("width", function(d) { return x(d.value); })
//         .style("fill", function(d) { return color(!!d.children); });

//     // Transition exiting bars to fade out.
//     var exitTransition = exit.transition()
//         .duration(duration)
//         .style("opacity", 1e-6)
//         .remove();

//     // Transition exiting bars to the new x-scale.
//     exitTransition.selectAll("rect")
//         .attr("width", function(d) { return x(d.value); });

//     // Rebind the current node to the background.
//     svg.select(".background")
//         .datum(d)
//         .transition()
//         .duration(end);

//     d.index = i;
//     }

//     function up(d) {
//     if (!d.parent || this.__transition__) return;
//     var end = duration + d.children.length * delay;

//     // Mark any currently-displayed bars as exiting.
//     var exit = svg.selectAll(".enter")
//         .attr("class", "exit");

//     // Enter the new bars for the clicked-on data's parent.
//     var enter = bar(d.parent)
//         .attr("transform", function(d, i) { return "translate(0," + barHeight * i * 1.2 + ")"; })
//         .style("opacity", 1e-6);

//     // Color the bars as appropriate.
//     // Exiting nodes will obscure the parent bar, so hide it.
//     enter.select("rect")
//         .style("fill", function(d) { return color(!!d.children); })
//         .filter(function(p) { return p === d; })
//         .style("fill-opacity", 1e-6);

//     // Update the x-scale domain.
//     x.domain([0, d3.max(d.parent.children, function(d) { return d.value; })]).nice();

//     // Update the x-axis.
//     svg.selectAll(".x.axis").transition()
//         .duration(duration)
//         .call(xAxis);

//     // Transition entering bars to fade in over the full duration.
//     var enterTransition = enter.transition()
//         .duration(end)
//         .style("opacity", 1);

//     // Transition entering rects to the new x-scale.
//     // When the entering parent rect is done, make it visible!
//     enterTransition.select("rect")
//         .attr("width", function(d) { return x(d.value); })
//         .each("end", function(p) { if (p === d) d3.select(this).style("fill-opacity", null); });

//     // Transition exiting bars to the parent's position.
//     var exitTransition = exit.selectAll("g").transition()
//         .duration(duration)
//         .delay(function(d, i) { return i * delay; })
//         .attr("transform", stack(d.index));

//     // Transition exiting text to fade out.
//     exitTransition.select("text")
//         .style("fill-opacity", 1e-6);

//     // Transition exiting rects to the new scale and fade to parent color.
//     exitTransition.select("rect")
//         .attr("width", function(d) { return x(d.value); })
//         .style("fill", color(true));

//     // Remove exiting nodes when the last child has finished transitioning.
//     exit.transition()
//         .duration(end)
//         .remove();

//     // Rebind the current parent to the background.
//     svg.select(".background")
//         .datum(d.parent)
//         .transition()
//         .duration(end);
//     }

//     // Creates a set of bars for the given data node, at the specified index.
//     function bar(d) {
//     var bar = svg.insert("g", ".y.axis")
//         .attr("class", "enter")
//         .attr("transform", "translate(0,5)")
//         .selectAll("g")
//         .data(d.children)
//         .enter().append("g")
//         .style("cursor", function(d) { return !d.children ? null : "pointer"; })
//         .on("click", down);

//     bar.append("text")
//         .attr("x", -6)
//         .attr("y", barHeight / 2)
//         .attr("dy", ".35em")
//         .style("text-anchor", "end")
//         .text(function(d) { return d.name; });

//     bar.append("rect")
//         .attr("width", function(d) { return x(d.value); })
//         .attr("height", barHeight);

//     return bar;
//     }

//     // A stateful closure for stacking bars horizontally.
//     function stack(i) {
//     var x0 = 0;
//     return function(d) {
//         var tx = "translate(" + x0 + "," + barHeight * i * 1.2 + ")";
//         x0 += x(d.value);
//         return tx;
//     };
//     }
// }