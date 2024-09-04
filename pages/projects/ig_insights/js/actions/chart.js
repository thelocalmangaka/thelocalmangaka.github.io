import {CSV_KEY} from "../constants/table.js";

function createTotalInteractionsChart(csvObject) {
    let likesData = [];
    let commentsData = [];
    let savedData = [];
    let sharesData = [];
    let totalData = [];
    for (const row of csvObject) {
        if (row["Errors"]) {
            continue;
        }
        likesData.push({
            x: Date.parse(row["Timestamp"]),
            y: Number(row["Likes"]),
            link: row["Permalink"]
        });
        commentsData.push({
            x: Date.parse(row["Timestamp"]),
            y: Number(row["Comments"]),
            link: row["Permalink"]
        });
        savedData.push({
            x: Date.parse(row["Timestamp"]),
            y: Number(row["Saved"]),
            link: row["Permalink"]
        });
        sharesData.push({
            x: Date.parse(row["Timestamp"]),
            y: Number(row["Shares"]),
            link: row["Permalink"]
        });
        totalData.push({
            x: Date.parse(row["Timestamp"]),
            y: Number(row["Total Interactions"]),
            link: row["Permalink"]
        });
    }
    // Pop the total row
    likesData.pop();
    commentsData.pop();
    savedData.pop();
    sharesData.pop();
    totalData.pop();
    const pointEvents = {
        events: {
            click() {
                window.open(this.link, '_blank', 'location=yes,status=yes');
            }
        }
    };
    Highcharts.chart('igChartTotalInteractions', {
        chart: {
            type: 'spline',
            zooming: {
                type: 'x'
            }
        },
        title: {
            text: 'IGInsights: Total Interactions (Likes, Comments, Saved, Shares)'
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Timestamp'
            }
        },
        yAxis: {
            title: {
                text: 'Count (#)'
            },
            min: 0
        },
        series: [{
            name: 'Likes over Time',
            data: likesData,
            point: pointEvents
        },{
            name: 'Comments over Time',
            data: commentsData,
            point: pointEvents
        },{
            name: 'Saved over Time',
            data: savedData,
            point: pointEvents
        },{
            name: 'Shares over Time',
            data: sharesData,
            point: pointEvents
        },{
            name: 'Total Interactions over Time',
            data: totalData,
            point: pointEvents
        }]
    });
}

function createVideosChart(csvObject) {
    let viewsData = [];
    let replaysData = [];
    let playsData = [];
    let totalData = [];
    for (const row of csvObject) {
        if (row["Errors"] || row["Media Type"] !== "VIDEO") {
            continue;
        }
        viewsData.push({
            x: Date.parse(row["Timestamp"]),
            y: Number(row["Video Views"]),
            link: row["Permalink"]
        });
        replaysData.push({
            x: Date.parse(row["Timestamp"]),
            y: Number(row["Replays"]),
            link: row["Permalink"]
        });
        playsData.push({
            x: Date.parse(row["Timestamp"]),
            y: Number(row["Plays"]),
            link: row["Permalink"]
        });
        totalData.push({
            x: Date.parse(row["Timestamp"]),
            y: Number(row["Total Plays"]),
            link: row["Permalink"]
        });
    }
    // Pop the total row
    viewsData.pop();
    replaysData.pop();
    playsData.pop();
    totalData.pop();
    const pointEvents = {
        events: {
            click() {
                window.open(this.link, '_blank', 'location=yes,status=yes');
            }
        }
    };
    Highcharts.chart('igChartVideos', {
        chart: {
            type: 'spline',
            zooming: {
                type: 'x'
            }
        },
        title: {
            text: 'IGInsights: Video Trends (Video Views, Replays, Plays, Total Plays)'
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Timestamp'
            }
        },
        yAxis: {
            title: {
                text: 'Count (#)'
            },
            min: 0
        },
        series: [{
            name: 'Video Views over Time',
            data: viewsData,
            point: pointEvents
        },{
            name: 'Replays over Time',
            data: replaysData,
            point: pointEvents
        },{
            name: 'Plays over Time',
            data: playsData,
            point: pointEvents
        },{
            name: 'Total Plays over Time',
            data: totalData,
            point: pointEvents
        }]
    });
}

function createPostsChart(csvObject) {
    let followsData = [];
    let impressionsData = [];
    let profileActivityData = [];
    let profileVisitsData = [];
    for (const row of csvObject) {
        if (row["Errors"] || row["Media Type"] === "VIDEO") {
            continue;
        }
        followsData.push({
            x: Date.parse(row["Timestamp"]),
            y: Number(row["Follows"]),
            link: row["Permalink"]
        });
        impressionsData.push({
            x: Date.parse(row["Timestamp"]),
            y: Number(row["Impressions"]),
            link: row["Permalink"]
        });
        profileActivityData.push({
            x: Date.parse(row["Timestamp"]),
            y: Number(row["Profile Activity"]),
            link: row["Permalink"]
        });
        profileVisitsData.push({
            x: Date.parse(row["Timestamp"]),
            y: Number(row["Profile Visits"]),
            link: row["Permalink"]
        });
    }
    // Pop the total row
    followsData.pop();
    impressionsData.pop();
    profileActivityData.pop();
    profileVisitsData.pop();
    const pointEvents = {
        events: {
            click() {
                window.open(this.link, '_blank', 'location=yes,status=yes');
            }
        }
    };
    Highcharts.chart('igChartPosts', {
        chart: {
            type: 'spline',
            zooming: {
                type: 'x'
            }
        },
        title: {
            text: 'IGInsights: Post Trends (Follows, Impressions, Profile Activity, Profile Visits)'
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Timestamp'
            }
        },
        yAxis: {
            title: {
                text: 'Count (#)'
            },
            min: 0
        },
        series: [{
            name: 'Follows over Time',
            data: followsData,
            point: pointEvents
        },{
            name: 'Impressions over Time',
            data: impressionsData,
            point: pointEvents
        },{
            name: 'Profile Activity over Time',
            data: profileActivityData,
            point: pointEvents
        },{
            name: 'Profile Visits over Time',
            data: profileVisitsData,
            point: pointEvents
        }]
    });
}

function chart() {
    let csvString = window.sessionStorage.getItem(CSV_KEY);
    csvString = csvString.replace("data:text/csv;charset=utf-8,","");
    const csvObject = $.csv.toObjects(csvString);
    createTotalInteractionsChart(csvObject);
    createVideosChart(csvObject);
    createPostsChart(csvObject);
}

export function createChartButton() {
    const chartButton = document.createElement('button');
    chartButton.innerText = "Create Graphs";
    chartButton.onclick = chart;
    const chartDiv = document.querySelector('#createChart');
    while(chartDiv.firstChild) {
        chartDiv.removeChild(chartDiv.lastChild);
    }
    chartDiv.appendChild(chartButton);
}