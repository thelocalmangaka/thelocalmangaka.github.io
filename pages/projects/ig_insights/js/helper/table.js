import {INSIGHT, INSIGHT_KEYS, MEDIA_TYPE} from "../constants/facebook.js";
import {getError, hasError, log} from "./log.js";
import {CSV_KEY, TABLE_COLUMNS, TABLE_MAP} from "../constants/table.js";

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

function createRow(insight) {
    let row = `${insight.id},${insight.media_type}`
    for (const key of INSIGHT_KEYS) {
        if (insight[key] === null || insight[key] === undefined) {
            row += ',0';
        } else if (key === INSIGHT.TOTAL_WATCH_TIME) {
            const millis = insight[key];
            const seconds = millis / parseFloat("1000");
            const minutes = seconds / parseFloat("60");
            const hours = minutes / parseFloat("60");
            row += `,${hours.toFixed(3)}`;
        } else {
            row += `,${insight[key]}`;
        }
    }
    row += `,${insight.username},${insight.timestamp},${insight.permalink},${insight.errors}`;
    return row;
}

export function createTotal(insights) {
    // Initialize totals
    let totalInsight = {};
    for (const key of INSIGHT_KEYS) {
        totalInsight[key] = 0;
    }
    for (const insight of insights) {
        for (const key of INSIGHT_KEYS) {
            if (insight[key] === null || insight[key] === undefined) {
            } else if (key === INSIGHT.TOTAL_WATCH_TIME) {
                const millis = insight[key];
                const seconds = millis / parseFloat("1000");
                const minutes = seconds / parseFloat("60");
                const hours = minutes / parseFloat("60");
                totalInsight[key] += hours;
            } else {
                totalInsight[key] += insight[key];
            }
        }
    }
    return totalInsight;
}

export function createTable(insights, totalInsight) {
    log("Creating table...");
    let table = [];
    // Create header
    let header = TABLE_COLUMNS.join(',');
    table.push(header);
    // Stringify each row, while summing to total
    for (const insight of insights) {
        table.push(createRow(insight));
    }
    // Append total
    let totalInsightString = "Total:, ALL";
    for (const key of INSIGHT_KEYS) {
        if (key === INSIGHT.TOTAL_WATCH_TIME) {
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

function addCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getTimeBreakdown(totalHours) {
    let hours = Math.floor(totalHours);
    const hoursDiff = totalHours - hours;
    const minutes = Math.floor(hoursDiff * 60);
    const minutesDiff =  hoursDiff * 60 - minutes;
    const seconds = Math.floor(minutesDiff * 60);
    const secondsDiff = minutesDiff * 60 - seconds;
    const millis = Math.floor(secondsDiff * 1000);

    let days = 0;
    let years = 0;
    if (hours > 24) {
        days = Math.floor(hours / 24);
        hours = hours % 24;
        if (days > 365) {
            years = Math.floor(days / 365);
            days = days % 365;
        }
    }
    if (years > 0) {
        return `${addCommas(years)}y ${days}d  ${hours}h ${minutes}m ${seconds}s ${millis}ms`;
    } else if (days > 0) {
        return `${days}d  ${hours}h ${minutes}m ${seconds}s ${millis}ms`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s ${millis}ms`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s ${millis}ms`;
    } else if (seconds > 0) {
        return `${seconds}s ${millis}ms`;
    } else {
        return `${millis}ms`;
    }
}

export function createTotalHtml(totalInsight) {
    const totalElement = document.querySelector('#total');
    const likes = addCommas(totalInsight[INSIGHT.LIKES]);
    const comments = addCommas(totalInsight[INSIGHT.COMMENTS]);
    const saves = addCommas(totalInsight[INSIGHT.SAVED]);
    const shares = addCommas(totalInsight[INSIGHT.SHARES]);
    const plays = addCommas(totalInsight[INSIGHT.TOTAL_PLAYS]);
    const timeBreakdown = getTimeBreakdown(totalInsight[INSIGHT.TOTAL_WATCH_TIME]);
    totalElement.innerHTML = `You have ${likes} likes, ${comments} comments, ${saves} saves, and ${shares} shares!<br/>
        You also have ${plays} plays and ${timeBreakdown} of watch time!`;
}

export function createAverageHtml(totalInsight, insightCount) {
    const averageElement = document.querySelector('#average');
    if (insightCount === 0) {
        averageElement.innerHTML = "";
        return;
    }
    const likes = addCommas(Math.round(totalInsight[INSIGHT.LIKES] / insightCount));
    const comments = addCommas(Math.round(totalInsight[INSIGHT.COMMENTS] / insightCount));
    const saves = addCommas(Math.round(totalInsight[INSIGHT.SAVED] / insightCount));
    const shares = addCommas(Math.round(totalInsight[INSIGHT.SHARES] / insightCount));

    averageElement.innerHTML = `Over ${insightCount} posts, that's an average of<br/>
        ${likes} likes, ${comments} comments, ${saves} saves, and ${shares} shares per post!<br/>`;
}

export function createVideoAverageHtml(totalInsight, insights) {
    const averageElement = document.querySelector('#videoAverage');
    let videoCount = 0;
    for (const insight of insights) {
        if (insight.media_type === MEDIA_TYPE.VIDEO) {
            videoCount += 1;
        }
    }
    if (videoCount === 0) {
        averageElement.innerHTML = "";
        return;
    }
    const averagePlays = addCommas(Math.round(totalInsight[INSIGHT.TOTAL_PLAYS] / videoCount));

    const timeBreakdown = getTimeBreakdown(totalInsight[INSIGHT.TOTAL_WATCH_TIME] / videoCount);
    const viewBreakdown = getTimeBreakdown(totalInsight[INSIGHT.TOTAL_WATCH_TIME] / totalInsight[INSIGHT.TOTAL_PLAYS]);
    averageElement.innerHTML = `Over ${videoCount} videos, that's an average of<br/>
        ${averagePlays} plays and ${timeBreakdown} per video<br/>
        and ${viewBreakdown} per view!`;
}

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