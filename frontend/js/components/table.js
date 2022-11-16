/**
 *  CSE 578 Project
 *  Author: Jiahui Gao
 *  Email: jgao76@asu.edu
 *  ASUID: 1221030200
 */


function initTable(data, country) {
    //default. to be discussed.
    let date = "Sun Mar 10 2019";

    let table = document.querySelector("#table1 table");

    let tabelHTML = "<thead>  <tr>  <th>ConnCount</th> <th>ID</th> <th>Category</th> <th>Targets</th> </tr> </thead> <tbody>";

    for (let i = 0; i < data[country].date[date].numberOfAlerts; i++) {
        tabelHTML += '<tr>  <td>' + data[country].date[date].detail[i].ConnCount +
            '</td> <td>' + data[country].date[date].detail[i].ID +
            '</td> <td>' + data[country].date[date].detail[i].Category +
            '</td> <td>' + data[country].date[date].detail[i].ProtocolType + '</td> </tr>';
    }
    tabelHTML += "</tbody>";

    table.innerHTML = tabelHTML;
}