/**
 *  CSE 578 Project
 *  Author: Jiahui Gao
 *  Email: jgao76@asu.edu
 *  ASUID: 1221030200
 */


function initTable(data, country, date) {

	var data_detail = data[country].date[date].detail;
	//console.log(data);

	function tabulate(data, columns) {
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
			.text(function (d) { return d.value; });

		return table;
	}

	// render the tables
	tabulate(data_detail, ['ConnCount', 'ID', 'Category', 'ProtocolType'])
}