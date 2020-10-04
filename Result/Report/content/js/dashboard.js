/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.27617825050432, "KoPercent": 1.7238217494956904};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9827617825050431, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "go_to_site"], "isController": false}, {"data": [1.0, 500, 1500, "getCountry_SOAP_Request"], "isController": false}, {"data": [0.9477196885428254, 500, 1500, "comment_send_1"], "isController": false}, {"data": [0.9477196885428254, 500, 1500, "comment_send_2"], "isController": false}, {"data": [1.0, 500, 1500, "open_\u0441lient_page"], "isController": false}, {"data": [1.0, 500, 1500, "open_project_007"], "isController": false}, {"data": [1.0, 500, 1500, "login-1"], "isController": false}, {"data": [1.0, 500, 1500, "login-0"], "isController": false}, {"data": [1.0, 500, 1500, "deleteCommentFromDB"], "isController": false}, {"data": [1.0, 500, 1500, "open_project_007-0"], "isController": false}, {"data": [1.0, 500, 1500, "login"], "isController": false}, {"data": [1.0, 500, 1500, "open_project_007-1"], "isController": false}, {"data": [1.0, 500, 1500, "open_projects_page"], "isController": false}, {"data": [1.0, 500, 1500, "open_guestbook_page_1"], "isController": false}, {"data": [1.0, 500, 1500, "open_guestbook_page_2"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10906, 188, 1.7238217494956904, 2.3612690262240923, 0, 87, 1.0, 5.0, 6.0, 17.0, 36.27449676037412, 263.0155507603059, 13.800310060510158], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["go_to_site", 1815, 0, 0.0, 3.4639118457300313, 1, 30, 3.0, 6.0, 6.0, 7.0, 6.037100728110937, 133.40682582694143, 2.0339841320295635], "isController": false}, {"data": ["getCountry_SOAP_Request", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 47.02524038461539, 41.91706730769231], "isController": false}, {"data": ["comment_send_1", 1798, 94, 5.2280311457174635, 2.1256952169076713, 0, 57, 1.0, 3.0, 5.0, 23.00999999999999, 5.981609378950591, 1.870958572240076, 3.602174763505196], "isController": false}, {"data": ["comment_send_2", 1798, 94, 5.2280311457174635, 1.6590656284760859, 0, 57, 1.0, 3.0, 4.0, 10.009999999999991, 5.981669078630005, 33.52183619546052, 1.740759165460685], "isController": false}, {"data": ["open_\u0441lient_page", 1814, 0, 0.0, 2.014884233737592, 1, 10, 1.0, 5.0, 5.0, 6.0, 6.034416800561527, 36.153525660617284, 2.2982642111513627], "isController": false}, {"data": ["open_project_007", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 120.41015625, 81.54296875], "isController": false}, {"data": ["login-1", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 446.6145833333333, 169.59635416666666], "isController": false}, {"data": ["login-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 113.60677083333333, 186.19791666666666], "isController": false}, {"data": ["deleteCommentFromDB", 15, 0, 0.0, 7.0666666666666655, 0, 81, 1.0, 35.40000000000003, 81.0, 81.0, 0.05349195480999658, 5.537253134628552E-4, 0.0], "isController": false}, {"data": ["open_project_007-0", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 170.41015625, 190.91796875], "isController": false}, {"data": ["login", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 240.09486607142856, 152.48325892857142], "isController": false}, {"data": ["open_project_007-1", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 172.65625, 86.71875], "isController": false}, {"data": ["open_projects_page", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 2316.9921875, 76.3671875], "isController": false}, {"data": ["open_guestbook_page_1", 1829, 0, 0.0, 1.8660470202296335, 1, 8, 1.0, 5.0, 5.0, 5.0, 6.084416707695174, 24.43526655396302, 2.341074397296776], "isController": false}, {"data": ["open_guestbook_page_2", 1829, 0, 0.0, 2.9732094040459263, 0, 87, 1.0, 4.0, 13.0, 34.700000000000045, 6.084457189240258, 33.59427368871465, 1.770672111712497], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0421\\u043F\\u0430\\u0441\\u0438\\u0431\\u043E!\'\\\/", 22, 11.702127659574469, 0.20172382174949569], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0411\\u043B\\u0430\\u0433\\u043E\\u0434\\u0430\\u0440\\u044E \\u0437\\u0430 \\u043E\\u0442\\u043B\\u0438\\u0447\\u043D\\u0443\\u044E \\u0440\\u0430\\u0431\\u043E\\u0442\\u0443!\'\\\/", 27, 14.361702127659575, 0.2475701448743811], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u041E\\u0442\\u043B\\u0438\\u0447\\u043D\\u044B\\u0435 \\u0440\\u0435\\u0431\\u044F\\u0442\\u0430.\'\\\/", 20, 10.638297872340425, 0.18338529249954152], "isController": false}, {"data": ["500", 94, 50.0, 0.8619108747478452], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0420\\u0435\\u043A\\u043E\\u043C\\u0435\\u043D\\u0434\\u0443\\u044E, \\u044D\\u0442\\u043E \\u043B\\u0443\\u0447\\u0448\\u0430\\u044F \\u043A\\u043E\\u043C\\u043F\\u0430\\u043D\\u0438\\u044F \\u043D\\u0430 \\u0441\\u0432\\u0435\\u0442\\u0435\'\\\/", 22, 11.702127659574469, 0.20172382174949569], "isController": false}, {"data": ["Response was null", 3, 1.5957446808510638, 0.02750779387493123], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10906, 188, "500", 94, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0411\\u043B\\u0430\\u0433\\u043E\\u0434\\u0430\\u0440\\u044E \\u0437\\u0430 \\u043E\\u0442\\u043B\\u0438\\u0447\\u043D\\u0443\\u044E \\u0440\\u0430\\u0431\\u043E\\u0442\\u0443!\'\\\/", 27, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0421\\u043F\\u0430\\u0441\\u0438\\u0431\\u043E!\'\\\/", 22, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0420\\u0435\\u043A\\u043E\\u043C\\u0435\\u043D\\u0434\\u0443\\u044E, \\u044D\\u0442\\u043E \\u043B\\u0443\\u0447\\u0448\\u0430\\u044F \\u043A\\u043E\\u043C\\u043F\\u0430\\u043D\\u0438\\u044F \\u043D\\u0430 \\u0441\\u0432\\u0435\\u0442\\u0435\'\\\/", 22, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u041E\\u0442\\u043B\\u0438\\u0447\\u043D\\u044B\\u0435 \\u0440\\u0435\\u0431\\u044F\\u0442\\u0430.\'\\\/", 20], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["comment_send_1", 1798, 94, "500", 94, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["comment_send_2", 1798, 94, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0411\\u043B\\u0430\\u0433\\u043E\\u0434\\u0430\\u0440\\u044E \\u0437\\u0430 \\u043E\\u0442\\u043B\\u0438\\u0447\\u043D\\u0443\\u044E \\u0440\\u0430\\u0431\\u043E\\u0442\\u0443!\'\\\/", 27, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0421\\u043F\\u0430\\u0441\\u0438\\u0431\\u043E!\'\\\/", 22, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0420\\u0435\\u043A\\u043E\\u043C\\u0435\\u043D\\u0434\\u0443\\u044E, \\u044D\\u0442\\u043E \\u043B\\u0443\\u0447\\u0448\\u0430\\u044F \\u043A\\u043E\\u043C\\u043F\\u0430\\u043D\\u0438\\u044F \\u043D\\u0430 \\u0441\\u0432\\u0435\\u0442\\u0435\'\\\/", 22, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u041E\\u0442\\u043B\\u0438\\u0447\\u043D\\u044B\\u0435 \\u0440\\u0435\\u0431\\u044F\\u0442\\u0430.\'\\\/", 20, "Response was null", 3], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
