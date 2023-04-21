const ipcRenderer = require('electron').ipcRenderer;

var result

async function init(){
    result = await ipcRenderer.invoke('get-result', '')
    console.log(result)

    document.getElementById("result").innerText = result.sumKnown + "/" + result.sampleSize;
    document.getElementById("estimate").innerText = "Estimate of " + result.vocabEstimate + 
        " words known ± " +  (result.sum95).toFixed(2) + " with " + confidence + "% confidence";

    updateChart()
}
init()

function restartButton(){
    ipcRenderer.send('reset', '')
    window.location.href = "../index.html"
}

var confidence = 0.95

function changeConfidence(){
    var confidence = document.getElementById("confidence-interval").value
    console.log(confidence)

    var confidenceSum;

    switch(confidence){
        case "90":
            confidenceSum = result.sum90
            break;
        case "95":
            confidenceSum = result.sum95
            break;
        case "99":
            confidenceSum = result.sum99
            break;
    }

    document.getElementById("estimate").innerText = "Estimate of " + result.vocabEstimate + 
        " words known ± " +  (confidenceSum).toFixed(2) + " with " + confidence + "% confidence";
}

var confidenceInterval = document.getElementById("confidence-interval").value;

function updateChart(){
    // Define the data for the histogram
    var histogramData = {
        label: 'Distribution',
        data: [
            {x: 0, y: 5},
            {x: 10, y: 10},
            {x: 20, y: 20},
            {x: 30, y: 30},
            {x: 40, y: 20},
            {x: 50, y: 10},
            {x: 60, y: 5},
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Set the fill color of the bars
        borderColor: 'rgba(54, 162, 235, 1)', // Set the border color of the bars
        borderWidth: 1 // Set the width of the border of the bars
    };
    
    // Define the data for the line chart
    var lineData = {
        label: 'Mean',
        data: [
            {x: 25, y: 0},
            {x: 25, y: 35},
        ],
        borderColor: 'rgba(255, 99, 132, 1)', // Set the color of the line
        borderWidth: 1 // Set the width of the line
    };
  
    // Define the options for the chart
    var chartOptions = {
        scales: {
        xAxes: [{
            type: 'linear',
            position: 'bottom',
            scaleLabel: {
                display: true,
                labelString: 'Total Words Known'
            }
        }],
        yAxes: [{
            type: 'linear',
            position: 'left',
            scaleLabel: {
                display: true,
                labelString: 'Likelihood %'
            }
        }]
        }
    };
  
    // Create the chart
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
        datasets: [histogramData, lineData]
        },
        options: chartOptions
    });
  
}
    
//     var ctx = document.getElementById('myChart').getContext('2d');

//     var data = {
//         labels: ['90%', '95%', '99%'],
//         datasets: [{
//             label: 'My Dataset',
//             data: [result.vocabEstimate, result.vocabEstimate, result.vocabEstimate],
//             borderWidth: 1,
//             errorBars: {
//                 "90%": {"plus": result.vocabEstimate * result.confidence90, "minus": result.vocabEstimate * result.confidence90},
//                 "95%": {"plus": result.vocabEstimate * result.confidence95, "minus": result.vocabEstimate * result.confidence95},
//                 "99%": {"plus":  result.vocabEstimate * result.confidence99, "minus": result.vocabEstimate * result.confidence99},
//             },
//             errorBarColor: 'rgba(255, 0, 0, 0.5)' // Set the color for the error bars
//         }]
//     };

//     var options = {
//         scales: {
//             yAxes: [{
//                 ticks: {
//                     beginAtZero: true
//                 }
//             }]
//         }
//     };

//     var myChart = new Chart(ctx, {
//         type: 'line',
//         data: data,
//         options: options
//     });
// }