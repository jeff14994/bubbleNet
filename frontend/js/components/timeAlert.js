/**
 *  CSE 578 Project
 *  Author: Anrui Xiao
 *  Email: axiao3@asu.edu
 *  ASUID: 1217052876
 */

/**
 * This component is refactored by Yu-Hsien Tu.
 */

/**
 * with parameters: data, (string) country, (string) date, (string of single int) time, (string) category, (string) protocol type 
 * note that category and protocol type cannot be selected at the same time.  
 * Examles: 
 * time_alert(data,"whole world","Sun Mar 10 2019","17","Recon.Scanning",""): select heatmap and bullet  
 * time_alert(data,"whole world","Sun Mar 10 2019","17","",""): select heatmap while global time changed  
 * time_alert(data,"whole world","Sun Mar 10 2019","","","tcp"): select bullet while global attribute changed 
 * @param {*} data 
 * @param {string} pass_country 
 * @param {string} pass_date 
 * @param {string} pass_time 
 * @param {string} pass_cate 
 * @param {string} pass_proto 
 */
const timeAlert = (
    data,
    pass_country,
    pass_date, 
    pass_time, 
    pass_cate, 
    pass_proto
) => {
    var numberOfAlerts = 0;
    if (pass_country !== '') {
        if (pass_time !== '') {
            if (pass_cate !== '' && pass_proto === '') {
                if (data[pass_country].date[pass_date].time[parseInt(pass_time)].detail.length > 0) {
                    data[pass_country].date[pass_date].time[parseInt(pass_time)].detail.map((v, idx) => {
                        if (v.Category === pass_cate) {
                            numberOfAlerts += parseInt(data[pass_country].date[pass_date].time[parseInt(pass_time)].detail[idx].ConnCount);
                        }
                    })
                }
            } else if (pass_cate === '' && pass_proto !== '') {
                if (data[pass_country].date[pass_date].time[parseInt(pass_time)].detail.length > 0) {
                    data[pass_country].date[pass_date].time[parseInt(pass_time)].detail.map((v, idx) => {
                        if (v.ProtocolType === pass_proto) {
                            numberOfAlerts += parseInt(data[pass_country].date[pass_date].time[parseInt(pass_time)].detail[idx].ConnCount);
                        }
                    })
                }
            } else {
                numberOfAlerts += data[pass_country].date[pass_date].time[parseInt(pass_time)].numberOfAlerts;
            }
        } else {
            if (pass_cate !== '' && pass_proto === '') {
                if (data[pass_country].date[pass_date].detail.length > 0) {
                    data[pass_country].date[pass_date].detail.map((v, idx) => {
                        if (v.Category === pass_cate) {
                            numberOfAlerts += parseInt(data[pass_country].date[pass_date].detail[idx].ConnCount);
                        }
                    })
                }
            } else if (pass_cate === '' && pass_proto !== '') {
                if (data[pass_country].date[pass_date].detail.length > 0) {
                    data[pass_country].date[pass_date].detail.map((v, idx) => {
                        if (v.ProtocolType === pass_proto) {
                            numberOfAlerts += parseInt(data[pass_country].date[pass_date].detail[idx].ConnCount);
                        }
                    })
                }
            } else {
                numberOfAlerts += data[pass_country].date[pass_date].numberOfAlerts;
            }
        }
    } else {
        if (pass_time !== '') {
            if (pass_cate !== '' && pass_proto === '') {
                Object.entries(data).map(([_, countryData])=>{
                    if (countryData.date[pass_date].time[parseInt(pass_time)].detail.length > 0){
                        countryData.date[pass_date].time[parseInt(pass_time)].detail.map((v, idx) => {
                            if (v.Category === pass_cate) {
                                numberOfAlerts += parseInt(countryData.date[pass_date].time[parseInt(pass_time)].detail[idx].ConnCount);
                            }
                        })
                    }
                });
            } else if (pass_cate === '' && pass_proto !== '') {
                Object.entries(data).map(([_, countryData])=>{
                    if (countryData.date[pass_date].time[parseInt(pass_time)].detail.length > 0){
                        countryData.date[pass_date].time[parseInt(pass_time)].detail.map((v, idx) => {
                            if (v.ProtocolType === pass_proto) {
                                numberOfAlerts += parseInt(countryData.date[pass_date].time[parseInt(pass_time)].detail[idx].ConnCount);
                            }
                        })
                    }
                });
            } else {
                Object.entries(data).map(([_, countryData])=>{
                    numberOfAlerts += countryData.date[pass_date].time[parseInt(pass_time)].numberOfAlerts;
                });
            }
        } else {
            if (pass_cate !== '' && pass_proto === '') {
                Object.entries(data).map(([_, countryData])=>{
                    if (countryData.date[pass_date].detail.length > 0){
                        countryData.date[pass_date].detail.map((v, idx) => {
                            if (v.Category === pass_cate) {
                                numberOfAlerts += parseInt(countryData.date[pass_date].detail[idx].ConnCount);
                            }
                        })
                    }                    
                });
            } else if (pass_cate === '' && pass_proto !== '') {
                Object.entries(data).map(([_, countryData])=>{
                    if (countryData.date[pass_date].detail.length > 0){
                        countryData.date[pass_date].detail.map((v, idx) => {
                            if (v.ProtocolType === pass_proto) {
                                numberOfAlerts += parseInt(countryData.date[pass_date].detail[idx].ConnCount);
                            }
                        })
                    }                    
                });
            } else {
                Object.entries(data).map(([_, countryData])=>{
                    numberOfAlerts += countryData.date[pass_date].numberOfAlerts;
                });
            }
        }
    }

    var defaultAlerts = 0;
    Object.entries(data).map(([_, countryData])=>{
        defaultAlerts += countryData.date[pass_date].numberOfAlerts;
    });

    drawTimer(pass_country, pass_date, numberOfAlerts, pass_time);
    drawAlert(defaultAlerts, pass_country !== '' ? numberOfAlerts : -1);
}   


/**
 * Function to render timer view.
 * @param {string} country 
 * @param {string} date 
 * @param {number} numberOfAlerts 
 * @param {string} timeSlot 
 */
const drawTimer = (country, date, numberOfAlerts, timeSlot) => {
    // remove previous view
    d3.select('#time_svg').selectAll('g').remove();

    const DEFAULT_COUNTRY = 'Whole World';
    const DEFAULT_TIME_SLOT = '00:00 - 23:59';

    const getCountryNames = new Intl.DisplayNames(['en'], {type: 'region'});

    const timerSvg = d3.select('#time_svg');
    const g = timerSvg.append('g');

    // the rectangle surrounding timer
    g.append('rect')
        .attr('x', 5)
        .attr('y', 5)
        .attr('width', 290)
        .attr('height', 90)
        .attr('fill', '#FFFFFF')
        .attr('stroke','Gainsboro'); 
    // the string show the date and weekday
    g.append('text')
        .attr('text-size', '24')
        .attr('font-weight', '500')
        .attr('fill', 'DimGray')
        .attr('x', 20)
        .attr('y', 20)
        .text(date); 

    // the string show the time range
    g.append('text')
        .attr('font-size', '12')
        .attr('font-weight', '500')
        .attr('fill', 'DimGray')
        .attr('x', 20)
        .attr('y', 40)
        .text(timeSlot !== '' ? timeSlot : DEFAULT_TIME_SLOT); 

    // the string show the number of alerts
    g.append('text')
        .attr('font-size', '12')
        .attr('font-weight', 'bold')
        .attr('fill', 'DimGray')
        .attr('x', 20)
        .attr('y', 80)
        .text(numberOfAlerts > 1 ? `${numberOfAlerts.toLocaleString('en-US')} alerts`: `${numberOfAlerts.toLocaleString('en-US')} alert`); 

    // the string show the name of country selected
    g.append('text')
        .attr('font-size', '16')
        .attr('font-weight', '500')
        .attr('fill', 'DimGray')
        .attr('x', 150)
        .attr('y', 80)
        .text(country !== '' ? getCountryNames.of(country) : DEFAULT_COUNTRY);
}

/**
 * Function to render alert view.
 * @param {number} totalAlerts 
 * @param {number} selectedCountryAlerts 
 */
const drawAlert = (totalAlerts, selectedCountryAlerts) => {
    // remove previous view
    d3.selectAll('.alert-string').remove();
    d3.select('.tooltip-time-alert').remove();

    const HOVER_PADDING = 10;
    const BAR_LENGTH = 180;
    const alertSvg = d3.select('#alert_svg');

    const updateAlert = (data) => {
        alertSvg.selectAll('.alert-bar').data([data]).join(
            enter => enter.append('rect')
                            .attr('class', 'alert-bar')
                            .attr('x', 100)
                            .attr('y', 67)
                            .attr('width', 0)
                            .attr('height', 16)
                            .transition()
                            .duration(2000)
                            .attr('width', d => xScale(d) - 100)
                            .attr('height', 16)
                            .attr('fill', 'Gray'),
            update => update.transition()
                            .duration(2000)
                            .attr('width', d => xScale(d) - 100),
        );
    }

    const xScale = d3.scaleLog()
                        .domain([1, totalAlerts])
                        .range([100, 100 + BAR_LENGTH]);
    const xAxis = d3.axisTop().scale(xScale).ticks(4);

    if (d3.select('.alert-x-axis').nodes().length > 0) {
        d3.select('.alert-x-axis')
            .transition()
            .duration(2000)
            .call(xAxis);
    } else {
        // update x-axis
        alertSvg.append('g')
            .attr('class', 'alert-x-axis')
            .attr('transform', 'translate(0, 50)')
            .transition()
            .duration(2000)
            .call(xAxis);
        // default alert bar
        alertSvg.append('rect')
            .attr('class', 'default-alert-bar')
            .attr('x', 100)
            .attr('y', 60)
            .attr('width', BAR_LENGTH)
            .attr('height', 30)
            .attr('fill', 'Gainsboro')
            .attr('stroke','Gainsboro')
            .attr('stroke-width', '1px');
    }

    const tooltip = d3.select('body').append('div')
                    .attr('class', 'tooltip-time-alert')
                    .style('opacity', 0);

    // string: "Alerts"
    alertSvg.append('text')
        .attr('class', 'alert-string')
        .attr('font-size', '20')
        .attr('font-weight', '500')
        .attr('fill', 'DimGray')
        .attr('x', 5)
        .attr('y', 20)
        .text('Alerts:'); 

    // string "quantity"
    alertSvg.append('text')
        .attr('class', 'alert-string')
        .attr('font-size', '16')
        .attr('fill', 'DimGray')
        .attr('x', 220)
        .attr('y', 25)
        .text('Quantity'); 
    
    if (selectedCountryAlerts !== -1) {
        updateAlert(selectedCountryAlerts);
    } else {
        d3.select('.alert-bar')
            .transition()
            .duration(2000)
            .attr('width', 0)
            .remove();
    }
    
    // hover effect
    d3.select('.default-alert-bar')
        .on('mouseover', d => {
            d3.select('.default-alert-bar')
                .attr('stroke', 'DimGray')
            tooltip.transition()
                .duration(500)
                .style('opacity', 1);
            tooltip.html(`Number of alerts: ${totalAlerts.toLocaleString('en-US')}`)
                .attr('width', 120)
                .attr('height', 80)
                .style('display', 'block')
                .style('padding', '8px')
                .style('align-items', 'center')
                .style('position', 'absolute')
                .style('font', '14px arial')
                .style('color', '#FFFFFF')
                .style('background','#000000')
                .style('opacity', '0.8')
                .style('border-radius', '8px')
                .style('pointer-events', 'none')
                .style('top', `${(d.pageY + HOVER_PADDING)}px`)
                .style('left', `${(d.pageX + HOVER_PADDING)}px`);
        })
        .on('mouseout', () => {
            d3.select('.default-alert-bar')
                .attr('stroke', 'none');
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        })
        // TODO: add click event
        .on('click', () => {
            d3.select('.default-alert-bar')
                .attr('stroke-width', '3px')
                .attr('stroke', 'DimGray');
        });
}