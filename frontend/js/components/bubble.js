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
 * @param {string} selectedDate format '2019-03-10 00:00'  
 */
const bubble = (data, svg, projection, selectedDate) => {
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
                        .range([10, 20, 30, 40, 50, 60]);

    const getCountryNames = new Intl.DisplayNames(['en'], {type: 'region'});

    const level = (value) => {
        if (value <= 10) {
            return 'level-1';
        } else if (value <= 500) {
            return 'level-2';
        } else if (value <= 2500) {
            return 'level-3';
        } else if (value <= 12500) {
            return 'level-4';
        } else if (value <= 62500) {
            return 'level-5';
        } else {
            return 'level-6';
        }
    }

    const formattedData = dateRangeFilter(data, selectedDate);
    const width = +svg.style('width').replace('px','');
    const height = +svg.style('height').replace('px','');

    formattedData.forEach(d => {
        const pos = projection([countryGeo[d.sourceCountry]['Longitude (average)'], countryGeo[d.sourceCountry]['Latitude (average)']]);
        d.x = pos[0];
        d.y = pos[1];
    });


    const updateData = (formattedData) => {
        d3.selectAll('.bubble').remove();
        d3.selectAll('.bubble-country').remove();
        const simulation = d3.forceSimulation(formattedData)
            .force('x', d3.forceX(d => projection([countryGeo[d.sourceCountry]['Longitude (average)'], countryGeo[d.sourceCountry]['Latitude (average)']])[0]).strength(0.03))
            .force('y', d3.forceY(d => projection([countryGeo[d.sourceCountry]['Longitude (average)'], countryGeo[d.sourceCountry]['Latitude (average)']])[1]).strength(0.03))
            .force('charge', d3.forceManyBody().strength(-1))
            .force('collide', d3.forceCollide().radius(d => size(level(d.numberOfAlerts)) + 2).strength(1))
            .force('center', d3.forceCenter(width / 1.8, height / 2.4));    
        

        const node = svg.selectAll('.bubble').data(formattedData.filter(d => d.numberOfAlerts > 0)).enter().append('circle')
            .attr('class', 'bubble')
            .attr('id', d => d.sourceCountry)
            .attr('r', d => size(level(d.numberOfAlerts)))
            .attr('stroke-width', '1px')
            .attr('stroke', '#000000')
            .attr('fill', d => color(level(d.numberOfAlerts)))
            .on('mouseover', (d,i) => {
                div.transition()
                    .duration(200)
                    .style('opacity', 1);
                div.html(`${i.date} <br/>
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
                    .style('top', `${(d.pageY)}px`)
                    .style('left', `${(d.pageX)}px`);
            })
            .on('mouseout', () => {
                div.transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .on('click', (d,i) => onClick(d, i));
        
        const title = svg.selectAll('.bubble-country').data(formattedData.filter(d => d.numberOfAlerts > 0)).enter().append('text')
            .attr('class', 'bubble-country')
            .attr('id', d => d.sourceCountry)
            .text(d => d.sourceCountry)
            .attr('text-anchor','middle')
            .style('font-family', 'arial')
            .style('font-size', '12px');
    
        simulation.nodes(formattedData.filter(d => d.numberOfAlerts > 0)).on('tick', () => {
            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
            title
                .attr('x', d => d.x)
                .attr('y', d => d.y + 5);
        });
    }
    updateData(formattedData);

    function onClick(d, i) {
        if (d3.select(d.currentTarget).classed('selected')) {
            // unselect country and send event to other components
            globalProxy.country = '';
            d3.select(d.currentTarget).classed('selected', false);
            d3.selectAll('.target-line').remove();
            d3.selectAll('.bubble, .bubble-country')
                .attr('opacity', '1')
                .attr('stroke-width', '1px');
        } else {
            // select country and send event to other components
            globalProxy.country = d3.select(d.currentTarget).attr('id');
            d3.select(d.currentTarget).classed('selected', true);
            svg.selectAll('.target-line')
                .data(i.target).enter()
                .append('path')
                .classed('target-line', true)
                .attr('d', d => d3.line()([[i.x, i.y], [d3.select(`#${d}`).attr('cx'), d3.select(`#${d}`).attr('cy')]]))
                .attr('stroke', '#000000')
                .attr('stroke-width', '1px')
                .attr('fill', 'none');
            d3.selectAll('.bubble, .bubble-country')
                .attr('opacity', '0.3');
            d3.selectAll(`#${d3.select(d.currentTarget).attr('id')}`)
                .attr('opacity', '1')
                .attr('stroke-width', '3px')
                .raise();
            i.target.map(v => {
                d3.selectAll(`#${v}`)
                    .attr('opacity', '1')
                    .attr('stroke-width', '3px')
                    .raise();
            });
        }
    }
}

/**
 * Helper function to select data in the range of date.
 * @param {*} data see README.md for its structure
 * @param {string} selectedDate format: '2019-03-10 00:00'
 */
const dateRangeFilter = (data, selectedDate) => {
    const formattedData = [];
    Object.keys(data).map(country => {
        let countryRecord = {};
        let targetList = [];
        const targetGeoList = data[country].date[selectedDate].target;
        targetGeoList.map(v => {
            if (!targetList.includes(v)) {
                targetList.push(v);
            }
        });
        targetList.map(v => [v.split(',').map(geo => Number(geo))]);
        countryRecord['sourceCountry'] = country;
        countryRecord['sourceLatitude'] = data[country].sourceLatitude;
        countryRecord['sourceLongitude'] = data[country].sourceLongitude;
        countryRecord['date'] = selectedDate;
        countryRecord['numberOfAlerts'] = data[country].date[selectedDate].numberOfAlerts;
        countryRecord['target'] = targetList;
        formattedData.push(countryRecord);
    });
    return formattedData;
}
