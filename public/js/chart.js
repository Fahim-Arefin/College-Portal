const chartData = {
  labels: [
    "Subject 1",
    "Subject 2",
    "Subject 3",
    "Subject 4",
    "Subject 5",
    "Subject 6",
    "Subject 7",
    "Subject 8",
    "Subject 9",
    "Subject 10",
    "Subject 11",
  ],
  datasets: [
    {
      label: "Present",
      backgroundColor: "rgba(75, 192, 192, 0.5)",
      borderColor: "rgba(75, 192, 192, 1)",
      data: [20, 30, 25, 22, 17, 29, 31, 23, 18, 27, 19],
    },
    {
      label: "Absent",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      borderColor: "rgba(255, 99, 132, 1)",
      data: [5, 2, 7, 3, 8, 4, 1, 6, 9, 2, 7],
    },
  ],
};

const chartOptions = {
  responsive: true,
  legend: {
    display: true,
    position: "top",
    labels: {
      fontColor: "black",
      fontSize: 16,
    },
  },
  scales: {
    yAxes: [
      {
        ticks: {
          fontColor: "black",
          fontSize: 14,
          beginAtZero: true,
        },
        gridLines: {
          display: true,
          color: "#ddd",
        },
        scaleLabel: {
          display: true,
          labelString: "Number of Students",
          fontColor: "black",
          fontSize: 16,
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          fontColor: "black",
          fontSize: 14,
        },
        gridLines: {
          display: false,
        },
        scaleLabel: {
          display: true,
          labelString: "Subjects",
          fontColor: "black",
          fontSize: 16,
        },
      },
    ],
  },
};

const chart = new Chart(document.getElementById("attendance-chart"), {
  type: "bar",
  data: chartData,
  options: chartOptions,
});