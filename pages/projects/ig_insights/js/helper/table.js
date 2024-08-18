import {INSIGHT_KEYS, TABLE_COLUMNS} from "../constants/facebook.js";

function populateInsight(row, data) {
    for (const metric of data) {
        row[metric.name] = metric.values[0].value;
    }
}

export function createInsight(id, response, videoResponse, postResponse) {
    let row = {};
    row.id = id;
    if (response.data !== null && response.data !== undefined) {
        populateInsight(row, response.data);
    }
    if (videoResponse.data !== null && videoResponse.data !== undefined) {
        row.media_type = 'VIDEO';
        populateInsight(row, videoResponse.data);
    } else if (postResponse.data !== null && postResponse.data !== undefined) {
        row.media_type = 'POST';
        populateInsight(row, postResponse.data);
    }
    if (row.media_type === null || row.media_type === undefined) {
        row.media_type = 'DEPRECATED';
    }
    return row;
}

function createRow(insight, totalInsight) {
    let row = `${insight.id},${insight.media_type}`
    for (const key of INSIGHT_KEYS) {
        if (insight[key] === null || insight[key] === undefined) {
            row += ',0';
        } else if (key === `ig_reels_video_view_total_time`) {
            const millis = insight[key];
            const seconds = millis / parseFloat("1000");
            const minutes = seconds / parseFloat("60");
            const hours = minutes / parseFloat("60");
            row += `,${hours.toFixed(3)}`;
            totalInsight[key] += hours;
        } else {
            row += `,${insight[key]}`;
            totalInsight[key] += insight[key];
        }
    }
    return row;
}

export function createTable(insights) {
    console.log("Creating table...");
    let table = [];
    // Create header
    let header = TABLE_COLUMNS.join(',');
    table.push(header);
    // Initialize totals
    let totalInsight = {};
    for (const key of INSIGHT_KEYS) {
        totalInsight[key] = 0;
    }
    // Stringify each row, while summing to total
    for (const insight of insights) {
        table.push(createRow(insight, totalInsight));
    }
    // Append total
    let totalInsightString = "Total:, ALL";
    for (const key of INSIGHT_KEYS) {
        if (key === `ig_reels_video_view_total_time`) {
            totalInsightString += `,${totalInsight[key].toFixed(3)}`;
        } else {
            totalInsightString += `,${totalInsight[key]}`;
        }
    }
    table.push(totalInsightString);
    return table;
}

export function createTableHtml(table) {
    const tableHtml = document.createElement('table');
    const thead = tableHtml.appendChild(document.createElement('thead'));
    const tbody = tableHtml.appendChild(document.createElement('tbody'));
    table.forEach((line, index) => {
        let parent;
        let cellTag;
        if (index === 0) {
            parent = thead;
            cellTag = 'th';
        } else {
            parent = tbody;
            cellTag = 'td';
        }
        const tr = parent.appendChild(document.createElement('tr'));
        line.split(',').forEach((cell) => {
            const cellElement = tr.appendChild(document.createElement(cellTag));
            cellElement.appendChild(document.createTextNode(cell.trim()));
        });
    });
    const tableDiv = document.querySelector('#table');
    while(tableDiv.firstChild) {
        tableDiv.removeChild(tableDiv.lastChild);
    }
    tableDiv.appendChild(tableHtml);
}

let csvContent = "";
export function click() {
    window.open(encodeURI(csvContent))
}

export function createDownloadButton(table) {
    csvContent = "data:text/csv;charset=utf-8,";
    csvContent += table.join('\n');
    const downloadButton = document.createElement('button');
    downloadButton.innerText = "Download Results";
    downloadButton.onclick = click;
    const downloadDiv = document.querySelector('#download');
    while(downloadDiv.firstChild) {
        downloadDiv.removeChild(downloadDiv.lastChild);
    }
    downloadDiv.appendChild(downloadButton);

}