var xValues = ["Contraception", "Termination", "Pre-Natal Care"];
var yValues = [55, 39, 16];
var barColors = ["#1E3E48", "#1E3E48","#1E3E48",];

new Chart("myChart", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            },

            gridLines: {
                color: "rgba(0, 0, 0, 0)",
            }
        }],

        xAxes: [{
            gridLines: {
                color: "rgba(0, 0, 0, 0)",
            }
        }]
    }, 

    legend: {
        display: false
     },
     tooltips: {
        enabled: false
     },

    plugins: {
        title: {
            display: true,
            text: 'Service Distribution among users'
        },
    }
  }
});

