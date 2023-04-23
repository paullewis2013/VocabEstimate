const ipcRenderer = require('electron').ipcRenderer;

var result

async function init(){
    result = await ipcRenderer.invoke('get-result', '')
    console.log(result)

    document.getElementById("result").innerText = "Raw score: "+ result.sumKnown + "/" + result.sampleSize;
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
    
    var ctx = document.getElementById('myChart').getContext('2d');

    let labels = []
    let start = 1
    for(let i = 0; i < result.sampleMeans.length; i++){
        labels.push("[" + start + " - " + Math.floor(start + result.bracketSizes[i] - 1) + "]")
        start += Math.floor(result.bracketSizes[i])
    }


    // let errorBars = {}
    // for(let i = 0; i < result.sampleMeans.length; i++){

    //     errorBars.push({
    //         "plus": result.confidenceInterval[i], "minus": result.confidenceInterval[i],
    //     })
    // }

    var distributionData = {
        labels: labels,
        datasets: [{
          label: 'Distribution',
          data: result.sampleMeans,
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        //   errorBars: errorBars,
        }]
      };
      
    var distributionOptions = {
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Bracket'
                }
            }],
            
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 1,
                    callback: function(value) {
                        return value * 100 + '%'; // Add the '%' symbol to the tick label
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Percentage Recognized'
                }
            }]
        },
        responsive: true,
    };
      
    var distributionChart = new Chart(ctx, {
        type: 'line',
        data: distributionData,
        options: distributionOptions,
    });
}