/**
 *  CSE 578 Project
 *  Author: Yu-Chuan, Hung
 *  Email: yhung17@asu.edu
 *  ASUID: 1219439611
 */
const heatmap = (data, country)  => {
    console.log("Loading heatmap");
    // console.log(data)
    let preProcessData = dataPreProcess(data, country)
    const xData = preProcessData[0]
    const yData = preProcessData[1]
    data = preProcessData[2]
    // setup dimensions and margins
    const margin = {top: 90, right: 25, bottom: 30, left: 36}
    const width = 250
    const height = 800 - margin.top - margin.bottom;
    // build x scales and axis:
    const x = d3.scaleBand()
                    .range([ 0, width ])
                    .domain(xData)
                    .padding(0.04);
    // build y scales and axis:
    const y = d3.scaleBand()
                    .range([ height, 0 ])
                    .domain(yData)
                    .padding(0.04);
     // Build color scale
    var color = d3.scaleSequential()
                    .interpolator(d3.interpolateReds)
                    .domain([1,80])
    // create a tooltip
    var tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip_heatmap")
                    .style("opacity", 0)
    // remove the chart before drawing a new one
    d3.select("#heatmap svg").remove();
    // append the svg object to the body of the page
    const svg = d3.select("#heatmap")
                    .append("svg")
                    .attr("width", 300)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    svg.append("g")
            .style("font-size", 12)
            .attr("transform", `translate(0, -15)`)
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()
    svg.append("g")
            .style("font-size", 12)
            .call(d3.axisLeft(y).tickSize(0).tickFormat(d => d + ":00"))
            .select(".domain").remove()
    // mouseover event handler function
    var mouseover = function(d) {
        tooltip
            .transition()
            .duration(500)
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    var mousemove = function(e, i) {
        tooltip
            .html("Number of attack: " + i.ConnCount)
            .style("opacity", "1")
            .style("position", "absolute")
            .style("left", (e.pageX) + "px")
            .style("top", (e.pageY) + "px")
            // reuse the tooltip style from bubble.js and modify the border radius
            .attr('width', 120)
            .attr('height', 80)
            .style('margin', '6px')
            .style('align-items', 'center')
            .style('font', '14px arial')
            .style('color', '#FFFFFF')
            .style('background','#000000')
            .style('opacity', '0.8')
            .style('border-radius', '6px')
    }
    var mouseleave = function(d) {
        tooltip
            .transition()
            .duration(500)
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.7)
    }
    // show the squares when hovering
    svg.selectAll()
            .data(data)
            .enter()
            .append("rect")
                .attr("x", function(d) { return x(d.date) })
                .attr("y", function(d) { return y(d.time) })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("width", x.bandwidth() )
                .attr("height", y.bandwidth() )
                .style("fill", function(d) { return color(d.ConnCount)} )
                .style("stroke-width", 4)
                .style("stroke", "none")
                .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
}
function dataPreProcess(data, country) {
    // get data and time
    data.map(d => {d.date = d.EventTime.substr(8,2), d.time = d.EventTime.substr(11,2)});
    // draw heatmap based on country
    countryData = data.filter(d => d.SourceCountry == country);
    // set x and y values
    const xData = Array.from(new Set(data.map(d => d.date)))
    const yData = Array.from(new Set(data.map(d => (d.time))))
    xData.sort()
    yData.sort().reverse()
    return [xData, yData, countryData]
}

