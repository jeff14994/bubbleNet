/**
 *  CSE 578 Project
 *  Author: Jiahui Gao
 *  Email: jgao76@asu.edu
 *  ASUID: 1221030200
 */

// Move callback function for alert button to index.js (by Yu-Hsien Tu)

function initTable(data, country, date) {
	if (country === '') {
		alert('Please select a country!');
		return 
	} else {
		var data_detail = data[country].date[date].detail;
	}
	//console.log(data);

	function tabulate(data, columns) {
		var table = d3.select('#table1').selectAll("*").remove()

		var table = d3.select('#table1').append('table')
		var thead = table.append('thead')
		var tbody = table.append('tbody');

		// append the header row
		thead.append('tr')
			.selectAll('th')
			.data(columns).enter()
			.append('th')
			.text(function (column) { return column; });

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
			.data(data)
			.enter()
			.append('tr');

		// create a cell in each row for each column
		var cells = rows.selectAll('td')
			.data(function (row) {
				return columns.map(function (column) {
					return { column: column, value: row[column] };
				});
			})
			.enter()
			.append('td')
			.text(function (d) { 
				return d.column === 'ConnCount' ? parseInt(d.value).toLocaleString('en-US') : d.value; 
			});

		return table;
	}

	// Add date and country in column (by Yu-Hsien Tu)
	const getCountryNames = new Intl.DisplayNames(['en'], {type: 'region'});
	data_detail.map(v => {
		v.Date = date;
		v.Country = getCountryNames.of(country);
	});
	// render the tables
	tabulate(data_detail, ['Date', 'Country', 'ConnCount', 'ID', 'Category', 'ProtocolType'])
}