/**
 *  CSE 578 Project
 *  Author: Anrui Xiao
 *  Email: axiao3@asu.edu
 *  ASUID: 1217052876
 */


/**
 * numberOfAlerts: number,   
 *      date: string,   
 *      sourceCountry: string,   
 */
 const time_alert = (data,pass_country,pass_date) => {
    

    selected_country = "AZ";
    selected_date = "Fri Mar 15 2019";
    alerts = 0;
    
    
    //console.log(data);
    Object.keys(data).map(country => {
        //console.log(country);
        let current_country = country;//string: country name need to show
        ////console.log(current_country);
        if (current_country == selected_country){//coment out or change !!
        //console.log(typeof current_country)
        let dates = data[country].date;
        Object.keys(dates).map(idx =>{
            //console.log(typeof idx)
            let current_date = idx//string: current weekday & date need to show
            ////console.log(current_date);
            if(current_date == selected_date){
            let num_alerts = dates[idx].numberOfAlerts//number: number of alerts need to show, draw bar
            //console.log(num_alerts);
            alerts = num_alerts;
            console.log(alerts);
            }
        })
        //let num_alerts = dates.numberOfAlerts
        //console.log(num_alerts);
        //console.log(typeof dates);
        //console.log(data[country].date);
        }//coment out or change if country =...
    })

    ////console.log("alerts out of search structure: "+ alerts);
    const dt = draw_timer(selected_country, selected_date, alerts);
    const da = draw_alert(alerts);
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

    console.log("draw_timer");

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
    .text(selected_date); 

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
    .text(+alerts +" alerts"); 

    let contry_str = g_time.append('text')
    .attr("font-size", "16")
    .attr("font-weight", "500")
    .attr('fill', "DimGray")
    .attr('x', 230)
    .attr('y', 45)
    .text(selected_country); 

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
    d3.select("#alert_svg svg").remove();
    console.log("draw_alert");
    const svg_alert = d3.select('#alert_svg');
    const width = +svg_alert.style('width').replace('px','');
    const height = +svg_alert.style('height').replace('px','');

    const margin_alert = { top:10, bottom:10, right:10, left:10 };
    const innerWidth_alert = width - margin_alert.left - margin_alert.right;
    const innerHeight_alert = height - margin_alert.top - margin_alert.bottom;
    g_alert = svg_alert.append('g').attr('transform',`translate(${margin_alert.left},${margin_alert.top})`);
    g_alert.remove();
    g_alert = svg_alert.append('g').attr('transform',`translate(${margin_alert.left},${margin_alert.top})`);

    var xScale = d3.scaleLinear();

    var bar_frame = g_alert.append('rect')
    .attr('x', 100)
    .attr('y', 54.5)
    .attr("width",170)
    .attr("height", 19)
    .attr("fill","Gainsboro")
    .attr("stroke","DimGray")
    .attr("stroke-width", 2);
    //.attr("rx", 4); 

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

  

    xScale.domain([0, alerts])
                  .range([100, innerWidth_alert-20]);
    //let x_axis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"))
    var x_axis = d3.axisBottom().scale(xScale).ticks(alerts).tickFormat(d3.format("d")).tickSize(-2);

    if(alerts>5){
      x_axis = d3.axisBottom().scale(xScale).ticks(4).tickFormat(d3.format("~s")).tickSize(-2);
    }              
    
    g_alert.append('g')
            .attr('transform',`translate(0, ${innerHeight_alert-48})`)
            .transition().duration(2000)
            .call(x_axis);

    

    var alert_bar = g_alert.append("g")
            .append('rect')
            .attr("x",  xScale(0))
            .attr("y", 60)
            .attr("width", 0)
            .transition()
            .ease(d3.easeLinear)
            .duration(400)
            .delay(function (d, i) {
            return i * 50;
                                })
            .attr('width',  xScale(alerts)-100)
            .attr("height", 10)
            .attr("fill", "Gray");
      //round rect .attr("rx", 4)
    /*g_alert.append('g').append('circle')
                 .attr('cx', 20)
                 .attr('cy', 50)
                 .attr('r',5)
                 .attr('fill','rgb(255 99 71)');*/
      //svg_alert.exit().remove();
      //d3.select("#alert_svg svg").remove();
      
 }
