/**
 *  CSE 578 Project
 *  Author: Zain Jakwani
 *  Email: zjakwani@asu.edu
 *  ASUID: 1219121137
 */



var margin = {top: 10, right: 10, bottom: 30, left: 30},
width = 220 - margin.left - margin.right,
height = 100 - margin.top - margin.bottom;

var world_data1 = {"udp": 0, "tcp": 0, "icmp": 0}
var country_data1 = {}
var world_days1 = {}
var country_days1 = {}

var world_data2 = {"Recon.Scanning": 0, "Attempt.Login": 0}
var country_data2 = {}
var world_days2 = {}
var country_days2 = {}

var max_val1 = null
var max_val2 = null

var x;
var y;
const yClean = (x) => {
  if (x == 0) {
    return y(1);
  }
  else {
    return y(x);
  }
}
var x2;
var y2;
const yClean2 = (x) => {
  if (x == 0) {
    return y2(1);
  }
  else {
    return y2(x);
  }
}

/**
 *  Bullet chart component.
 */
const bullet = (data) => {

    // console.log(data)
    // preprocessing
    /**
     * Fix missing protocol type. (by Yu-Hsien Tu)
     * There is three types of protocol: udp, tcp, and icmp instead of two.
     */
    for (const cn of Object.keys(data)) {
      for (const date of Object.keys(data[cn].date)) {
        for (const obj of data[cn].date[date].detail) {
          if (obj["ProtocolType"] === "udp" || obj["ProtocolType"] === "tcp" || obj["ProtocolType"] === "icmp") {
            world_data1[obj["ProtocolType"]] += (1*obj['ConnCount'])

            if (!(date in world_days1)) {
              world_days1[date] = {"udp": 0, "tcp": 0, "icmp": 0};
            }
            world_days1[date][obj["ProtocolType"]] += (1*obj['ConnCount'])

            if (!(cn in country_data1)) {
              country_data1[cn] = {"udp": 0, "tcp": 0, "icmp": 0};
            }
            country_data1[cn][obj["ProtocolType"]] += (1*obj['ConnCount'])

            if (!(date in country_days1)) {
              country_days1[date] = {}
            }
            if (!(cn in country_days1[date])) {
              country_days1[date][cn] = {"udp": 0, "tcp": 0, "icmp": 0};
            }
            country_days1[date][cn][obj["ProtocolType"]] += (1*obj['ConnCount'])
          }

        if (obj["Category"] === "Recon.Scanning" || obj["Category"] === "Attempt.Login") {
          world_data2[obj["Category"]] += (1*obj['ConnCount'])

          if (!(date in world_days2)) {
            world_days2[date] = {"Recon.Scanning": 0, "Attempt.Login": 0}
          }
          world_days2[date][obj["Category"]] += (1*obj['ConnCount'])

          if (!(cn in country_data2)) {
            country_data2[cn] = {"Recon.Scanning": 0, "Attempt.Login": 0}
          }
          country_data2[cn][obj["Category"]] += (1*obj['ConnCount'])

          if (!(date in country_days2)) {
            country_days2[date] = {}
          }
          if (!(cn in country_days2[date])) {
            country_days2[date][cn] = {"Recon.Scanning": 0, "Attempt.Login": 0}
          }
          country_days2[date][cn][obj["Category"]] += (1*obj['ConnCount'])
        }
        }
      }
    }

    max_val1 = Math.max(world_data1["udp"], world_data1["tcp"], world_data1["icmp"])
    max_val2 = Math.max(world_data2["Recon.Scanning"], world_data2["Attempt.Login"])


    var bar_data1 = [
      { Label: "udp", Value: world_data1["udp"] },
      { Label: "tcp", Value: world_data1["tcp"] },
      { Label: "icmp", Value: world_data1["icmp"] },
    ]
    var bar_data2 = [
      { Label: "Recon.Scanning", Value: world_data2["Recon.Scanning"] },
      { Label: "Attempt.Login", Value: world_data2["Attempt.Login"] },
    ]


    // charts
    const svg1 = d3.select('#attribute')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("id", "attributeChart")
          .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
    svg1.append("text")
      .attr("x", 10)
      .attr("font-size", "12px")
      .text("Protocol Type");

    const svg2 = d3.select('#attribute')
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("id", "categoryChart")
          .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
      svg2.append("text")
            .attr("x", 110)
            .attr("font-size", "12px")
            .text("Category");
        

      x = d3.scaleBand()
      .range([ 0, width ])
      .domain(bar_data1.map(function(d) { return d.Label; }))
      .padding(0.2);
      y = d3.scaleLog()
        .domain([1, max_val1])
        .range([ height, 0]);

      x2 = d3.scaleBand()
      .range([ 0, width ])
      .domain(bar_data2.map(function(d) { return d.Label; }))
      .padding(0.2);
      y2 = d3.scaleLog()
        .domain([1, max_val2])
        .range([ height, 0]);


      svg1.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(10,0)")
        .style("text-anchor", "end")
        .style("text-transform", "uppercase")
        .style("font-size", "12px");
      svg1.append("g")
        .style("font", "4px")
        .call(d3.axisLeft(y).ticks(5));

      svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x2))
      .selectAll("text")
        .attr("transform", "translate(35,0)")
        .style("text-anchor", "end")
        .style("text-transform", "uppercase")
        .style("font-size", "9px");
      svg2.append("g")
        .style("font", "3px")
        .call(d3.axisLeft(y2).ticks(5));
       

    // Please update the class when modifying others code.
    // Rename class (by Yu-Hsien Tu)
    var tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip_bullet")
      .style("opacity", 0)
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
            .html("Number of attacks: " + i.Value)
            .style("opacity", "1")
            .style("position", "absolute")
            .style("left", (e.pageX) + "px")
            .style("top", (e.pageY) + "px")
            .attr('width', 120)
            .attr('height', 80)
            .style('padding', "5px")
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

    svg1.selectAll("mybar")
            .data(bar_data1)
            .enter()
            .append("rect")
              .attr("class", "worldBar")
              .attr("x", function(d) { return x(d.Label); })
              .attr("y", function(d) { return yClean(d.Value); })
              .attr("width", x.bandwidth())
              .attr("height", function(d) { return height - yClean(d.Value); })
              .attr("fill", "#E8E8E8")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

    svg2.selectAll("mybar")
              .data(bar_data2)
              .enter()
              .append("rect")
                .attr("class", "worldBar2")
                .attr("x", function(d) { return x2(d.Label); })
                .attr("y", function(d) { return yClean2(d.Value); })
                .attr("width", x2.bandwidth())
                .attr("height", function(d) { return height - yClean2(d.Value); })
                .attr("fill", "#E8E8E8")
              .on("mouseover", mouseover)
              .on("mousemove", mousemove)
              .on("mouseleave", mouseleave)
}

const updateBulletCountry = (target) => {
    const country = target.country;
    const date = target.date;

    if (!country) {
      var bulletBars = d3.selectAll(".bulletBar");
      bulletBars.transition()
        .duration(2000) // 2 seconds
        .attr("y", function(d) { return yClean(1); })
        .attr("height", function(d) { return height - yClean(1); })
        .on("end", () => bulletBars.remove())
      var bulletLines = d3.selectAll(".bulletLine");
      bulletLines.transition()
        .duration(2000) // 2 seconds
        .attr("y", function(d) { return yClean(1); })
        .on("end", () => bulletLines.remove())

      var bulletBars2 = d3.selectAll(".bulletBar2");
        bulletBars2.transition()
          .duration(2000) // 2 seconds
          .attr("y", function(d) { return yClean2(1); })
          .attr("height", function(d) { return height - yClean2(1); })
          .on("end", () => bulletBars2.remove())
      var bulletLines2 = d3.selectAll(".bulletLine2");
        bulletLines2.transition()
          .duration(2000) // 2 seconds
          .attr("y", function(d) { return yClean2(1); })
          .on("end", () => bulletLines2.remove())
      return;
    }

    const svg = d3.select("#attributeChart");
    const svg2 = d3.select("#categoryChart");

    var existingBullet = svg.selectAll(".bulletBar")

    var line_data1 = [
      { Label: "udp", Value: country_data1[country]["udp"]},
      { Label: "tcp", Value: country_data1[country]["tcp"]},
      { Label: "icmp", Value: country_data1[country]["icmp"]},
    ];
    var line_data2 = [
      { Label: "Recon.Scanning", Value: country_data2[country]["Recon.Scanning"]},
      { Label: "Attempt.Login", Value: country_data2[country]["Attempt.Login"]},
    ];

    var bullet_data1;
    var bullet_data2;
    if (!date) {
      bullet_data1 = line_data1;
      bullet_data2 = line_data2;
    }
    else {
      bullet_data1 = [
        { Label: "udp", Value: country_days1[date][country]["udp"]},
        { Label: "tcp", Value: country_days1[date][country]["tcp"]},
        { Label: "icmp", Value: country_days1[date][country]["icmp"]},
      ];
      bullet_data2 = [
        { Label: "Recon.Scanning", Value: country_days2[date][country]["Recon.Scanning"]},
        { Label: "Attempt.Login", Value: country_days2[date][country]["Attempt.Login"]},
      ];
    }

    if (existingBullet.empty()) {
      // Reuse the same div (by Yu-Hsien Tu)
      var tooltip = d3.select('.tooltip_bullet');
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
              .html("Number of attacks: " + i.Value)
              .style("opacity", "1")
              .style("position", "absolute")
              .style("left", (e.pageX) + "px")
              .style("top", (e.pageY) + "px")
              .attr('width', 120)
              .attr('height', 80)
              .style('padding', "5px")
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

      svg.selectAll("mybullet")
      .data(bullet_data1)
      .enter()
      .append("rect")
        .attr("class", "bulletBar")
        .attr("x", function(d) { return x(d.Label) + (0.25 * x.bandwidth()); })
        .attr("y", function(d) { return y(1); })
        .attr("width", 0.5 * x.bandwidth())
        .attr("height", function(d) { return height - yClean(1); })
        .attr("fill", "#C0C0C0")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
      svg.selectAll(".bulletBar")
        .transition()
        .duration(2000) // 2 seconds
        .attr("y", function(d) { return yClean(d.Value); })
        .attr("height", function(d) { return height - yClean(d.Value); })
      
      svg.selectAll("myline")
        .data(line_data1)
        .enter()
        .append("rect")
          .attr("class", "bulletLine")
          .attr("x", function(d) { return x(d.Label); })
          .attr("y", function(d) { return y(1); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return x.bandwidth() * 0.02; })
          .attr("fill", "#707070")
      svg.selectAll(".bulletLine")
          .transition()
          .duration(2000) // 2 seconds
          .attr("y", function(d) { return yClean(d.Value); });


      svg2.selectAll("mybullet2")
          .data(bullet_data2)
          .enter()
          .append("rect")
            .attr("class", "bulletBar2")
            .attr("x", function(d) { return x2(d.Label) + (0.25 * x2.bandwidth()); })
            .attr("y", function(d) { return y2(1); })
            .attr("width", 0.5 * x2.bandwidth())
            .attr("height", function(d) { return height - yClean2(1); })
            .attr("fill", "#C0C0C0")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
          svg2.selectAll(".bulletBar2")
            .transition()
            .duration(2000) // 2 seconds
            .attr("y", function(d) { return yClean2(d.Value); })
            .attr("height", function(d) { return height - yClean2(d.Value); })
        svg2.selectAll("myline2")
            .data(line_data2)
            .enter()
            .append("rect")
              .attr("class", "bulletLine2")
              .attr("x", function(d) { return x2(d.Label); })
              .attr("y", function(d) { return y2(1); })
              .attr("width", x2.bandwidth())
              .attr("height", function(d) { return x2.bandwidth() * 0.02; })
              .attr("fill", "#707070")
          svg2.selectAll(".bulletLine2")
              .transition()
              .duration(2000) // 2 seconds
              .attr("y", function(d) { return yClean2(d.Value); });
    }
    else {
      svg.selectAll(".bulletBar")
        .data(bullet_data1)
        .transition()
        .duration(2000) // 2 seconds
        .attr("y", function(d) { return yClean(d.Value); })
        .attr("height", function(d) { return height - yClean(d.Value); })
        svg.selectAll(".bulletLine")
          .data(line_data1)
          .transition()
          .duration(2000) // 2 seconds
          .attr("y", function(d) { return yClean(d.Value); });

        svg2.selectAll(".bulletBar2")
        .data(bullet_data2)
        .transition()
        .duration(2000) // 2 seconds
        .attr("y", function(d) { return yClean2(d.Value); })
        .attr("height", function(d) { return height - yClean2(d.Value); })
        svg2.selectAll(".bulletLine2")
          .data(line_data2)
          .transition()
          .duration(2000) // 2 seconds
          .attr("y", function(d) { return yClean2(d.Value); });
      }
}

const updateBulletDate = (target) => {
  const country = target.country;
  const date = target.date;

  const svg = d3.select("#attributeChart");
  const svg2 = d3.select("#categoryChart");

  var newBarData1;
  var newBulletData1;
  var newBarData2;
  var newBulletData2;

  if (date) {
    newBarData1 = [
      { Label: "udp", Value: world_days1[date]["udp"]},
      { Label: "tcp", Value: world_days1[date]["tcp"]},
      { Label: "icmp", Value: world_days1[date]["icmp"]},
    ];
    newBarData2 = [
      { Label: "Recon.Scanning", Value: world_days2[date]["Recon.Scanning"]},
      { Label: "Attempt.Login", Value: world_days2[date]["Attempt.Login"]},
    ];

    if (country) {
      newBulletData1 = [
        { Label: "udp", Value: country_days1[date][country]["udp"]},
        { Label: "tcp", Value: country_days1[date][country]["tcp"]},
        { Label: "icmp", Value: country_days1[date][country]["icmp"]},
      ];
      newBulletData2 = [
        { Label: "Recon.Scanning", Value: country_days2[date][country]["Recon.Scanning"]},
        { Label: "Attempt.Login", Value: country_days2[date][country]["Attempt.Login"]},
      ];
    }
  }
  else {
    newBarData1 = [
      { Label: "udp", Value: world_data1["udp"] },
      { Label: "tcp", Value: world_data1["tcp"]},
      { Label: "icmp", Value: world_data1["icmp"]},
    ];
    newBarData2 = [
      { Label: "Recon.Scanning", Value: world_data2["Recon.Scanning"] },
      { Label: "Attempt.Login", Value: world_data2["Attempt.Login"]},
    ];

    if (country) {
      newBulletData1 = [
        { Label: "udp", Value: country_data1[country]["udp"]},
        { Label: "tcp", Value: country_data1[country]["tcp"]},
        { Label: "icmp", Value: country_data1[country]["icmp"]},
      ];
      newBulletData2 = [
        { Label: "Recon.Scanning", Value: country_data2[country]["Recon.Scanning"]},
        { Label: "Attempt.Login", Value: country_data2[country]["Attempt.Login"]},
      ];
    }
  }

  svg.selectAll(".worldBar")
      .data(newBarData1)
      .transition()
      .duration(2000) // 2 seconds
      .attr("y", function(d) { return yClean(d.Value); })
      .attr("height", function(d) { return height - yClean(d.Value); });

  svg2.selectAll(".worldBar2")
    .data(newBarData2)
    .transition()
    .duration(2000) // 2 seconds
    .attr("y", function(d) { return yClean2(d.Value); })
    .attr("height", function(d) { return height - yClean2(d.Value); });

  const existingBullet = svg.selectAll(".bulletBar")
  if (country && !existingBullet.empty()) {
    existingBullet.data(newBulletData1)
      .transition()
      .duration(2000) // 2 seconds
      .attr("y", function(d) { return yClean(d.Value); })
      .attr("height", function(d) { return height - yClean(d.Value); })
    
    svg2.selectAll(".bulletBar2")
      .data(newBulletData2)
      .transition()
      .duration(2000) // 2 seconds
      .attr("y", function(d) { return yClean2(d.Value); })
      .attr("height", function(d) { return height - yClean2(d.Value); })
  }
}