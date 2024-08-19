import {INSIGHT_KEYS, TABLE_COLUMNS, TABLE_MAP} from "../constants/facebook.js";
import {getError, hasError, log} from "./log.js";

function populateInsight(insight, data) {
    for (const metric of data) {
        insight[metric.name] = metric.values[0].value;
    }
}

export function createInsight(mediaInfo, response, videoResponse, postResponse) {
    let insight = {};
    insight.errors = [];
    if (hasError(mediaInfo)) {
        insight.errors.push(getError(mediaInfo.error));
    } else {
        insight.id = mediaInfo.id;
        insight.media_type = mediaInfo.media_type;
        insight.permalink = mediaInfo.permalink;
        insight.timestamp = mediaInfo.timestamp;
        insight.username = mediaInfo.username;
    }
    if (hasError(response)) {
        // Remove commas from error message so as to not interfere with the CSV file
        insight.errors.push(getError(response.error).replace(/,/g, '/'));
    } else if (response.data !== null && response.data !== undefined) {
        populateInsight(insight, response.data);
    }
    if (hasError(videoResponse)) {
        insight.errors.push(getError(videoResponse.error).replace(/,/g, '/'));
    } else if (videoResponse.data !== null && videoResponse.data !== undefined) {
        populateInsight(insight, videoResponse.data);
    }
    if (hasError(postResponse)) {
        insight.errors.push(getError(postResponse.error).replace(/,/g, '/'));
    } else if (postResponse.data !== null && postResponse.data !== undefined) {
        populateInsight(insight, postResponse.data);
    }
    return insight;
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
    row += `,${insight.username},${insight.timestamp},${insight.permalink},${insight.errors}`;
    return row;
}

export function createTable(insights) {
    log("Creating table...");
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
    // Empty cells at end.
    totalInsightString += ',,,,';
    table.push(totalInsightString);
    return table;
}

export function createTableHtml(table) {
    // Create table element
    const tableHtml = document.createElement('table');
    const thead = tableHtml.appendChild(document.createElement('thead'));
    const tbody = tableHtml.appendChild(document.createElement('tbody'));
    // Read each array element into each row
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
            if (TABLE_MAP['VIDEO'].includes(cell)) {
                cellElement.style.backgroundColor = "yellow";
            } else if (TABLE_MAP['POST'].includes(cell)) {
                cellElement.style.backgroundColor = "orange";
            } else if (TABLE_MAP['ERROR'].includes(cell)) {
                cellElement.style.backgroundColor = "red";
            }
            cellElement.appendChild(document.createTextNode(cell.trim()));
        });
    });
    // Remove existing table, if repeating calculation.
    const tableDiv = document.querySelector('#table');
    while(tableDiv.firstChild) {
        tableDiv.removeChild(tableDiv.lastChild);
    }
    // Insert into html
    tableDiv.appendChild(tableHtml);
    log("Table created.");
}

const CSV_KEY = "csvContent";
export function click() {
    log("Downloading csv file...");
    const csvContent = encodeURI(window.sessionStorage.getItem(CSV_KEY));
    let link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "ig_insights.csv");
    document.body.appendChild(link); // Required for FF
    link.click(); // This will download the data file
    log("File downloaded.");
}

export function createDownloadButton(table) {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += table.join('\n');
    window.sessionStorage.setItem(CSV_KEY, csvContent);
    const downloadButton = document.createElement('button');
    downloadButton.innerText = "Download Results";
    downloadButton.onclick = click;
    const downloadDiv = document.querySelector('#download');
    while(downloadDiv.firstChild) {
        downloadDiv.removeChild(downloadDiv.lastChild);
    }
    downloadDiv.appendChild(downloadButton);
}