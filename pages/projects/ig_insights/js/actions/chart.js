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
    // NOTE: video_views deprecated after v21.0
    // let viewsData = [];
    // NOTE: clips_replays_count, plays, ig_reels_aggregated_all_plays_count deprecated after v22.0
    // let replaysData = [];
    // let playsData = [];
    // let totalData = [];
    let viewsData = [];
    for (const row of csvObject) {
        if (row["Errors"] || row["Media Type"] !== "VIDEO") {
            continue;
        }
        // NOTE: video_views deprecated after v21.0
        // viewsData.push({
        //     x: Date.parse(row["Timestamp"]),
        //     y: Number(row["Video Views"]),
        //     link: row["Permalink"]
        // });
        // NOTE: clips_replays_count, plays, ig_reels_aggregated_all_plays_count deprecated after v22.0
        // replaysData.push({
        //     x: Date.parse(row["Timestamp"]),
        //     y: Number(row["Replays"]),
        //     link: row["Permalink"]
        // });
        // playsData.push({
        //     x: Date.parse(row["Timestamp"]),
        //     y: Number(row["Plays"]),
        //     link: row["Permalink"]
        // });
        // totalData.push({
        //     x: Date.parse(row["Timestamp"]),
        //     y: Number(row["Total Plays"]),
        //     link: row["Permalink"]
        // });
        viewsData.push({
            x: Date.parse(row["Timestamp"]),
            y: Number(row["Views"]),
            link: row["Permalink"]
        });
    }
    // Pop the total row
    // NOTE: video_views deprecated after v21.0
    // viewsData.pop();
    // NOTE: clips_replays_count, plays, ig_reels_aggregated_all_plays_count deprecated after v22.0
    // replaysData.pop();
    // playsData.pop();
    // totalData.pop();
    viewsData.pop();
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
            // NOTE: video_views deprecated after v21.0
            // text: 'IGInsights: Video Trends (Video Views, Replays, Plays, Total Plays)'
            // NOTE: clips_replays_count, plays, ig_reels_aggregated_all_plays_count deprecated after v22.0
            // text: 'IGInsights: Video Trends (Replays, Plays, Total Plays)'
            text: 'IGInsights: Video Trends (Views)'
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
        // NOTE: video_views deprecated after v21.0
        // series: [{
        //     name: 'Video Views over Time',
        //     data: viewsData,
        //     point: pointEvents
        // },{
        // NOTE: clips_replays_count, plays, ig_reels_aggregated_all_plays_count deprecated after v22.0
        // series: [{
        //     name: 'Replays over Time',
        //     data: replaysData,
        //     point: pointEvents
        // },{
        //     name: 'Plays over Time',
        //     data: playsData,
        //     point: pointEvents
        // },{
        //     name: 'Total Plays over Time',
        //     data: totalData,
        //     point: pointEvents
        // }]
        series: [{
            name: 'Views over Time',
            data: viewsData,
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

export function createCharts() {
    let csvString = window.sessionStorage.getItem(CSV_KEY);
    csvString = csvString.replace("data:text/csv;charset=utf-8,","");
    const csvObject = $.csv.toObjects(csvString);
    createTotalInteractionsChart(csvObject);
    createVideosChart(csvObject);
    createPostsChart(csvObject);
}

// export function createChartButton() {
//     const chartButton = document.createElement('button');
//     chartButton.innerText = "Create Graphs";
//     chartButton.onclick = createCharts;
//     const chartDiv = document.querySelector('#createChart');
//     while(chartDiv.firstChild) {
//         chartDiv.removeChild(chartDiv.lastChild);
//     }
//     chartDiv.appendChild(chartButton);
// }