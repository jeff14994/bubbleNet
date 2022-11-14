/**
 *  CSE 578 Project
 *  Author: Yu-Hsien Tu
 *  Email: yuhsien1@asu.edu
 *  ASUID: 1222290303
 */

/**
 * Bubble component.  
 * @param {*} data {  
 *      numberOfAlerts: number,   
 *      date: string,   
 *      sourceCountry: string,   
 *      sourceLatitude: number,   
 *      sourceLongitude: number,  
 *      target: [[targetLatitude:number, targetLongitude:number]],  
 *  }
 * @param {string} svg the html element to render
 * @param {string} projection projection function from d3
 * @param {string} startDate format '2019-03-10 mst'  
 * @param {string} endDate format '2019-03-10 mst' (if endDate and startDate are the same, then it will become single date picker) 
 */
const bubble = (data, svg, projection, startDate, endDate) => {
    // tooltip
    const div = d3.select('body')
        .append('div')
        .classed('tooltip bottom', true)
        .style('opacity', 0);
    
    const color = d3.scaleOrdinal()
                        .domain(['level-1', 'level-2', 'level-3', 'level-4', 'level-5', 'level-6'])
                        .range(['#48B0D4', '#92DCEB', '#FA011E', '#FEA85C', '#FFDF8C', '#FFFFBC']);

    const size = d3.scaleOrdinal()
                        .domain(['level-1', 'level-2', 'level-3', 'level-4', 'level-5', 'level-6'])
                        .range([8, 16, 24, 32, 48, 64]);

    const getCountryNames = new Intl.DisplayNames(['en'], {type: 'region'});

    const level = (value) => {
        if (value <= 10) {
            return 'level-1';
        } else if (value <= 500) {
            return 'level-2';
        } else if (value <= 2500) {
            return 'level-3';
        } else if (value <= 10000) {
            return 'level-4';
        } else if (value <= 50000) {
            return 'level-5';
        } else {
            return 'level-6';
        }
    }

    const formattedData = dateRangeFilter(data, startDate, endDate);

    const eachBubble = svg.selectAll('.bubble')
        .data(formattedData).enter();

    eachBubble.append('ellipse')
        .attr('class', 'bubble')
        .attr('id', d => d.sourceCountry)
        .attr('cx', d => projection([d.sourceLongitude, d.sourceLatitude])[0])
        .attr('cy', d => projection([d.sourceLongitude, d.sourceLatitude])[1])
        .attr('rx', d => size(level(d.numberOfAlerts)))
        .attr('ry', d => size(level(d.numberOfAlerts)) / 1.5)
        .attr('stroke-width', '1px')
        .attr('stroke', '#000000')
        .attr('fill', d => color(level(d.numberOfAlerts)))
        .on('mouseover', (d,i) => {
            const tmp = i.date.split('-');
            div.transition()
                .duration(200)
                .style('opacity', 1);
            div.html(`${tmp[0] != tmp[1] ? new Date(tmp[0]).toDateString('en-US') + ' - ' + new Date(tmp[1]).toDateString('en-US'): new Date(tmp[0]).toDateString('en-US')} <br/>
                      00:00 - 23:59 <br/>
                      ${getCountryNames.of(i.sourceCountry)}: <span style="color:red;">${i.numberOfAlerts} alerts</span>`)
                .attr('width', 120)
                .attr('height', 80)
                .style('display', 'block')
                .style('margin', '8px')
                .style('align-items', 'center')
                .style('position', 'absolute')
                .style('font', '14px arial')
                .style('color', '#FFFFFF')
                .style('background','#000000')
                .style('opacity', '0.8')
                .style('border-radius', '8px')
                .style('pointer-events', 'none')
                .style('left', (d.pageX) + 'px')
                .style('top', (d.pageY) + 'px');
        })
        .on('mouseout', (d,i) => {
            div.transition()
                .duration(500)
                .style('opacity', 0);
        })
        .on('click', (d,i) => {
            if (d3.select(d.currentTarget).classed('selected')) {
                d3.select(d.currentTarget).classed('selected', false);
                d3.selectAll('.target-line').remove();
            } else {
                d3.select(d.currentTarget).classed('selected', true);
                svg.selectAll('.target-line')
                    .data(i.target).enter()
                    .append('path')
                    .classed('target-line', true)
                    .attr('d', d => d3.line()([[projection([i.sourceLongitude, i.sourceLatitude])[0], projection([i.sourceLongitude, i.sourceLatitude])[1]], [projection(d)[0], projection(d)[1]]]))
                    .attr('stroke', '#000000')
                    .attr('stroke-width', '1px')
                    .attr('fill', 'none');
                d3.select(d.currentTarget).raise();
            }
        });
    
    // We need to discuss if we want to keep country name in the middle of the bubble.
    eachBubble.append('text')
        .attr('class', 'bubble-name')
        .attr('x', d => projection([d.sourceLongitude, d.sourceLatitude])[0])
        .attr('y', d => projection([d.sourceLongitude, d.sourceLatitude])[1] + 5)
        .text(d => d.sourceCountry)
        .attr('text-anchor','middle')
        .style('font-family', 'arial')
        .style('font-size', '12px');
}

/**
 * Helper function to select data in the range of date.
 * @param {*} data see README.md for its structure
 * @param {string} start format: '2019-03-10 mst'
 * @param {string} end format: '2019-03-16 mst'
 */
const dateRangeFilter = (data, start, end) => {
    const formattedData = [];
    const dateRange = ['Sun Mar 10 2019', 'Mon Mar 11 2019', 'Tue Mar 12 2019', 'Wed Mar 13 2019', 'Thu Mar 14 2019', 'Fri Mar 15 2019', 'Sat Mar 16 2019'];
    Object.keys(data).map(country => {
        let countryRecord = {};
        let alerts = 0;
        let targetList = [];
        let dummyRange = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24) + 1;
        [...Array(dummyRange).keys()].map(idx => {
            alerts += data[country].date[dateRange[idx]].numberOfAlerts;
            const targetGeoList = data[country].date[dateRange[idx]].target;
            targetGeoList.map(v => {
                if (!targetList.includes(v)) {
                    targetList.push(v);
                }
            });
        });
        targetList.map(v => [v.split(',').map(geo => Number(geo))]);
        countryRecord['sourceCountry'] = country;
        countryRecord['sourceLatitude'] = data[country].sourceLatitude;
        countryRecord['sourceLongitude'] = data[country].sourceLongitude;
        countryRecord['date'] = `${new Date(start).toDateString('en-US')}-${new Date(end).toDateString('en-US')}`;
        countryRecord['numberOfAlerts'] = alerts;
        countryRecord['target'] = targetList;
        formattedData.push(countryRecord);
    });
    return formattedData;
}