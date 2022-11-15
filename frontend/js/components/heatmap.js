const heatmap = (data, country)  => {
    console.log("Loading heatmap");
    console.log(data)
    data.map(d => {d.date = d.EventTime.substr(8,2), d.time = d.EventTime.substr(11,2)});
    // draw heatmap based on country
    data = data.filter(d => d.SourceCountry == country);
    console.log(data)
    // set x and y values
    const xData = Array.from(new Set(data.map(d => d.date)))
    const yData = Array.from(new Set(data.map(d => (d.time))))
    xData.sort()
    yData.sort().reverse()
    console.log(xData)
    console.log(yData)
    // setup dimensions and margins
    const margin = {top: 90, right: 25, bottom: 30, left: 36},
    width = 250,
    height = 800 - margin.top - margin.bottom;
    // remove the chart before drawing a new one
    d3.select("#heatmap svg").remove();
    // append the svg object to the body of the page
    const svg = d3.select("#heatmap")
        .append("svg")
        .attr("width", 300)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    // build xscales and axis:
    const x = d3.scaleBand()
        .range([ 0, width ])
        .domain(xData)
        .padding(0.04);
    svg.append("g")
        .style("font-size", 12)
        .attr("transform", `translate(0, -15)`)
        .call(d3.axisBottom(x).tickSize(0))
        .select(".domain").remove()

    // build Y scales and axis:
    const y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(yData)
        .padding(0.04);
    svg.append("g")
        .style("font-size", 12)
        .call(d3.axisLeft(y).tickSize(0).tickFormat(d => d + ":00"))
        .select(".domain").remove()
     // Build color scale
    var myColor = d3.scaleSequential()
        .interpolator(d3.interpolateReds)
        .domain([1,80])

    // create a tooltip
    var tooltip = d3.select("#heatmap")
            .append("p")
            .style("opacity", 0)
            .attr("class", "tooltip_heatmap")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("width", "10px")
            .style("height", "10px")
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
        tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    var mousemove = function(d, i) {
        tooltip
        .html("The exact value of<br>this cell is: " + i.ConnCount)
            .style("left", (d.eventX(this)[0]+70) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
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
        .style("fill", function(d) { return myColor(d.ConnCount)} )
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
}

