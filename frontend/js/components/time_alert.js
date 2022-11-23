/**
 *  CSE 578 Project
 *  Author: Anrui Xiao
 *  Email: axiao3@asu.edu
 *  ASUID: 1217052876
 */


/*
        // with parameters: data, (string) country, (string) date, (string of single int) time, (string) category, (string) protocol type
        //note that category and protocol type cannot be selected at the same time.
        //examles: 
        //time_alert(data,"whole world","Sun Mar 10 2019","17","Recon.Scanning",""): select heatmap and bullet 
        //time_alert(data,"whole world","Sun Mar 10 2019","17","",""): select heatmap while global time changed
        //time_alert(data,"whole world","Sun Mar 10 2019","","","tcp"): select bullet while global attribute changed
        
        //time_alert(data,"whole world","Sun Mar 10 2019");//data seg, current selected country, date
        //change to:   time_alert(data,"whole world","Sun Mar 10 2019","","",""); as default
 */

 var xScale = d3.scaleLinear();

 const time_alert = (data,pass_country,pass_date) => {
   svg_alert = d3.select('#alert_svg');
   const width = +svg_alert.style('width').replace('px','');
   const height = +svg_alert.style('height').replace('px','');

   const margin_alert = { top:10, bottom:10, right:10, left:10 };
   const innerWidth_alert = width - margin_alert.left - margin_alert.right;
   const innerHeight_alert = height - margin_alert.top - margin_alert.bottom;
   g_alert = svg_alert.append('g').attr('transform',`translate(${margin_alert.left},${margin_alert.top})`);

   //  selected_country = "AZ";
   //  selected_date = "Fri Mar 15 2019";
   //  alerts = 0;
    
    default_country = "whole world";
    default_date = "Sun Mar 10 2019";
    
    // console.log(data);

    //if it is default whole world:
    //add up alerts of all countries on selected date
    if(pass_country == default_country || pass_country == ""){
      // console.log("default add up");
      let sum_alerts = 0;
      Object.keys(data).map(country => {
         let current_country = country;
         let dates = data[country].date;
         
            Object.keys(dates).map(idx =>{
               let current_date = idx
               if(current_date == pass_date){
                  let num_alerts = dates[idx].numberOfAlerts;
                  sum_alerts = sum_alerts + num_alerts;
               }
            })
         
      })
      //console.log("total alerts of the date: "+ sum_alerts);
      alerts = sum_alerts;

      const ddt = draw_default_timer(pass_country, pass_date, alerts);
      g_alert.remove();
      const dda = draw_default_alert(alerts);
    }

    //if it is not default:
    else{ 
    Object.keys(data).map(country => {
        //console.log(country);
        let current_country = country;//string: country name need to show
        ////console.log(current_country);
        if (current_country == pass_country){//coment out or change !!
        //console.log(typeof current_country)
        let dates = data[country].date;
        Object.keys(dates).map(idx =>{
            //console.log(typeof idx)
            let current_date = idx//string: current weekday & date need to show
            ////console.log(current_date);
            if(current_date == pass_date){
            let num_alerts = dates[idx].numberOfAlerts;//number: number of alerts need to show, draw bar
            //console.log(num_alerts);
            alerts = num_alerts;
            // console.log(alerts);
            }
        })
        //let num_alerts = dates.numberOfAlerts
        //console.log(num_alerts);
        //console.log(typeof dates);
        //console.log(data[country].date);
        }//coment out or change if country =...
    })

    ////console.log("alerts out of search structure: "+ alerts);
    const dt = draw_timer(pass_country, pass_date, alerts);
    g_alert.remove();
    const da = draw_alert(alerts);
   }
 }

 const draw_timer = (str_country, str_date, num_alerts) => {
    svg_time = d3.select('#time_svg');
    const width = +svg_time.style('width').replace('px','');
    const height = +svg_time.style('height').replace('px','');

    const margin_time = { top:10, bottom:10, right:10, left:10 };
    const innerWidth_time = width - margin_time.left - margin_time.right;
    const innerHeight_time = height - margin_time.top - margin_time.bottom;
    
    g_time = svg_time.append('g').attr('transform',`translate(${margin_time.left},${margin_time.top})`);
    g_time.remove();
    g_time = svg_time.append('g').attr('transform',`translate(${margin_time.left},${margin_time.top})`);


   //  console.log("draw_timer");

    let frame = g_time.append('rect')
    .attr('x', 10)
    .attr('y', -5)
    .attr("width",270)
    .attr("height",85)
    .attr("fill","white")
    .attr("stroke","Gainsboro"); 

    let date_str = g_time.append('text')
    .attr("font-size", "20")
    .attr("font-weight", "500")
    .attr('fill', "DimGray")
    .attr('x', 40)
    .attr('y', 15)
    .text(str_date); 

    let time_range_str = g_time.append('text')
    .attr("font-size", "15")
    .attr("font-weight", "500")
    .attr('fill', "DimGray")
    .attr('x', 40)
    .attr('y', 36)
    .text("00:00 - 23:59"); 

    let num_atk_str = g_time.append('text')
    .attr("font-size", "12")
    .attr("font-weight", "500")
    .attr('fill', "DimGray")
    .attr('x', 40)
    .attr('y', 65)
    .text(+num_alerts +" alerts"); 

    let contry_str = g_time.append('text')
    .attr("font-size", "16")
    .attr("font-weight", "500")
    .attr('fill', "DimGray")
    .attr('x', 230)
    .attr('y', 45)
    .text(str_country); 

    /*let arrow = g_time.append('text')
    .attr("font-size", "16")
    .attr("font-weight", "500")
    .attr('fill', "red")
    .attr('x', 180)
    .attr('y', 65)
    .text("↑"); *///red arrow if have data

   /*let arrow = g_time.append('text')
    .attr("font-size", "16")
    .attr("font-weight", "500")
    .attr('fill', "green")
    .attr('x', 180)
    .attr('y', 65)
    .text("↓"); *///red arrow if have data

    //d3.select('#time_svg').remove();
    
    
 }

 const draw_alert = (num_of_alerts) => {
    d3.select("#alert_svg").select(".domain").remove();
    d3.selectAll(".axis_t_a").remove();
   //  console.log("draw_alert");
    svg_alert = d3.select('#alert_svg');
    //selectAll("axis_t_a").remove();
    const width = +svg_alert.style('width').replace('px','');
    const height = +svg_alert.style('height').replace('px','');

    const margin_alert = { top:10, bottom:10, right:10, left:10 };
    const innerWidth_alert = width - margin_alert.left - margin_alert.right;
    const innerHeight_alert = height - margin_alert.top - margin_alert.bottom;
    g_alert = svg_alert.append('g').attr('transform',`translate(${margin_alert.left},${margin_alert.top})`);
    g_alert.selectAll(".axis").remove();
    g_alert.selectAll().remove();
    g_alert = svg_alert.append('g').attr('transform',`translate(${margin_alert.left},${margin_alert.top})`);

    var div_t_a = d3.select("body").append("div")
    .attr("class", "tooltip_t_a")
    .style("opacity", 0)

    //var xScale = d3.scaleLinear();

    var bar_frame = g_alert.append('rect')
    .attr('x', 100)
    .attr('y', 54.5)
    .attr("width",170)
    .attr("height", 19)
    .attr("fill","Gainsboro")
    .attr("stroke","DimGray")
    .attr("stroke-width", 2);
    //.attr("rx", 1); 
  

    xScale.domain([0, num_of_alerts])
                  .range([100, innerWidth_alert-20]);
                  //.attr("class", "axis");
    //let x_axis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"))
    var x_axis; 

    if(num_of_alerts>5){
      x_axis = d3.axisBottom().scale(xScale).ticks(4).tickFormat(d3.format("~s")).tickSize(-2);
    }  else {
      x_axis = d3.axisBottom().scale(xScale).ticks(alerts).tickFormat(d3.format("d")).tickSize(-2);
    }            
    
    g_alert.append('g')
            .attr('transform',`translate(0, ${innerHeight_alert-48})`)
            .attr("class","axis_t_a")
            .transition().duration(2000)
            .call(x_axis);
 

    var alert_bar = g_alert
            .append("g")
            .append('rect')
            .attr("class", "alert_bar");

   // Resolved incorrect animation for alert bar view (by Yu-Chuan, Hung)
   // 1. Comment out wrong code
   // 2. Fix animation for alert bar view
   //draw inner bar when triggered: when selected a country thru bubble 
   console.log("num_of_alerts: " + num_of_alerts);
   alert_bar.attr("x",  100)
            .attr("y", 60)
            // .transition()
            .attr('width',  10)
            .attr("height", 10)
            .attr("fill", "Gray");
   //draw inner bar when triggered: when selected a country thru bubble 
   alert_bar
            .transition()
            .duration(400)
            .ease(d3.easeLinear)
            .attr("x", 100)
            .attr('width',  xScale(num_of_alerts)-100)
            .attr("height", 10)
            .delay(function (d, i) {
            return i * 50;})

   bar_frame.on("mouseover", function(e, d){
               bar_frame.attr("stroke","DimGray")
               .attr("stroke-width", 2);
               //.attr("rx", 1); 

               div_t_a.transition()
               .duration(500)
               .style("opacity", 1);

               d3.select(this)
               .style("stroke", "black")
               .style("opacity", 1)
               // console.log("mouseover");

               div_t_a.html(" "+num_of_alerts + " alerts ")
                .attr('width', 120)
                .attr('height', 80)
                .style('display', 'block')
                .style('margin', '8px')
                .style('align-items', 'center')
                .style('position', 'absolute')
                .style('font', '14px arial')
                .style('color', 'red')
                .style('background','#000000')
                .style('opacity', '0.8')
                .style('border-radius', '8px')
                .style('pointer-events', 'none')
                .style('top', `${(e.pageY)}px`)
                .style('left', `${(e.pageX)}px`);
            })
            .on("mousemove",function(e, d){
               // console.log("mousemove");
            })
            .on("mouseout", function(d) {
               div_t_a.transition()
               .duration(500)
               .style('opacity', 0);
               
               /*bar_frame.attr("stroke-width", 0)
                        .attr("rx", 0); */

               // console.log("mouseout");
            })
            .on("click", function(e, d){
               bar_frame.attr("stroke","DimGray")
               .attr("stroke-width", 2);
               // console.log("click");
            });//influence with heatmap
           //g_alert.remove();
      //svg_alert.exit().remove();
      //d3.select("#alert_svg svg").remove();
      
 }

 const draw_default_timer = (str_country, str_date, num_alerts) => {
   svg_time = d3.select('#time_svg');
    const width = +svg_time.style('width').replace('px','');
    const height = +svg_time.style('height').replace('px','');

    const margin_time = { top:10, bottom:10, right:10, left:10 };
    const innerWidth_time = width - margin_time.left - margin_time.right;
    const innerHeight_time = height - margin_time.top - margin_time.bottom;
    g_time = svg_time.append('g').attr('transform',`translate(${margin_time.left},${margin_time.top})`);
    g_time.remove();
    g_time = svg_time.append('g').attr('transform',`translate(${margin_time.left},${margin_time.top})`);

   //  console.log("draw_timer");

    let frame = g_time.append('rect')
    .attr('x', 10)
    .attr('y', -5)
    .attr("width",270)
    .attr("height",85)
    .attr("fill","white")
    .attr("stroke","Gainsboro"); 

    let date_str = g_time.append('text')
    .attr('class', 'date-str')
    .attr("font-size", "20")
    .attr("font-weight", "500")
    .attr('fill', "DimGray")
    .attr('x', 40)
    .attr('y', 15)
    .text(str_date); 

    let time_range_str = g_time.append('text')
    .attr('class', 'time_range_str')
    .attr("font-size", "15")
    .attr("font-weight", "500")
    .attr('fill', "DimGray")
    .attr('x', 40)
    .attr('y', 36)
    .text("00:00 - 23:59"); 

    let num_atk_str = g_time.append('text')
    .attr('class', 'num_atk_str')
    .attr("font-size", "12")
    .attr("font-weight", "500")
    .attr('fill', "DimGray")
    .attr('x', 40)
    .attr('y', 65)
    .text(+alerts +" alerts"); 

    let contry_str = g_time.append('text')
    .attr('class', 'num_atk_str')
    .attr("font-size", "16")
    .attr("font-weight", "500")
    .attr('fill', "DimGray")
    .attr('x', 180)
    .attr('y', 45)
    .text(str_country); 

    /*let arrow = g_time.append('text')
    .attr("font-size", "16")
    .attr("font-weight", "500")
    .attr('fill', "red")
    .attr('x', 180)
    .attr('y', 65)
    .text("↑"); *///red arrow if have data

   /*let arrow = g_time.append('text')
    .attr("font-size", "16")
    .attr("font-weight", "500")
    .attr('fill', "green")
    .attr('x', 180)
    .attr('y', 65)
    .text("↓"); *///red arrow if have data

    //d3.select('#time_svg').remove();
    
    
 }

 const draw_default_alert = (num_of_alerts) => {
    d3.select("#alert_svg").select(".domain").remove();
    d3.selectAll('#alert_svg g').remove()
    d3.selectAll('.tooltip_t_a').remove()
    d3.selectAll(".axis_t_a").remove();
   //  console.log("draw_alert");
    svg_alert = d3.select('#alert_svg');
    const width = +svg_alert.style('width').replace('px','');
    const height = +svg_alert.style('height').replace('px','');

    const margin_alert = { top:10, bottom:10, right:10, left:10 };
    const innerWidth_alert = width - margin_alert.left - margin_alert.right;
    const innerHeight_alert = height - margin_alert.top - margin_alert.bottom;
    g_alert = svg_alert.append('g').attr('transform',`translate(${margin_alert.left},${margin_alert.top})`);
    g_alert.selectAll(".axis").remove();
    g_alert.selectAll().remove();
    g_alert = svg_alert.append('g').attr('transform',`translate(${margin_alert.left},${margin_alert.top})`);

    var div_t_a = d3.select("body").append("div")
    .attr("class", "tooltip_t_a")
    .style("opacity", 0)

   

    var bar_frame = g_alert.append('rect')
    .attr('x', 100)
    .attr('y', 54.5)
    .attr("width",170)
    .attr("height", 19)
    .attr("fill","Gainsboro")
    .attr("stroke","DimGray")
    .attr("stroke-width", 2);
    //.attr("rx", 1); 

    let label_a_str = g_alert.append('text')
    .attr("font-size", "20")
    .attr("font-weight", "500")
    .attr('fill', "DimGray")
    .attr('x', -5)
    .attr('y', 15)
    .text("Alerts: "); 

    let label_q_str = g_alert.append('text')
    .attr("font-size", "16")
    .attr("font-weight", "500")
    .attr('fill', "DimGray")
    .attr('x', 200)
    .attr('y', 25)
    .text("Quantity"); 

  

    xScale.domain([0, num_of_alerts])
                  .range([100, innerWidth_alert-20]);
                  //.attr("class", "axis");
    //let x_axis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"))
    var x_axis; 

    if(num_of_alerts>5){
      x_axis = d3.axisBottom().scale(xScale).ticks(4).tickFormat(d3.format("~s")).tickSize(-2);
    }  else {
      x_axis = d3.axisBottom().scale(xScale).ticks(alerts).tickFormat(d3.format("d")).tickSize(-2);
    }            
    
    g_alert.append('g')
            .attr('transform',`translate(0, ${innerHeight_alert-48})`)
            .attr("class","axis_t_a")
            .transition().duration(2000)
            .call(x_axis);


   bar_frame.on("mouseover", function(e, d){
               bar_frame.attr("stroke","DimGray")
               .attr("stroke-width", 2);
               //.attr("rx", 1); 

               div_t_a.transition()
               .duration(500)
               .style("opacity", 1);

               d3.select(this)
               .style("stroke", "black")
               .style("opacity", 1)
               // console.log("mouseover");

               div_t_a.html(" "+num_of_alerts + " alerts ")
                .attr('width', 120)
                .attr('height', 80)
                .style('display', 'block')
                .style('margin', '8px')
                .style('align-items', 'center')
                .style('position', 'absolute')
                .style('font', '14px arial')
                .style('color', 'red')
                .style('background','#000000')
                .style('opacity', '0.8')
                .style('border-radius', '8px')
                .style('pointer-events', 'none')
                .style('top', `${(e.pageY)}px`)
                .style('left', `${(e.pageX)}px`);
            })
            .on("mousemove",function(e, d){
               // console.log("mousemove");
            })
            .on("mouseout", function(d) {
               div_t_a.transition()
               .duration(500)
               .style('opacity', 0);
               
               /*bar_frame.attr("stroke-width", 0)
                        .attr("rx", 0); */

               // console.log("mouseout");
            })
            .on("click", function(e, d){
               bar_frame.attr("stroke","DimGray")
               .attr("stroke-width", 2);
               // console.log("click");
            });//influence with heatmap
           //g_alert.remove();
      //svg_alert.exit().remove();
      //d3.select("#alert_svg svg").remove();
}
