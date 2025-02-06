import { Chart } from "chart.js/auto";

let marksChart: Chart | null = null; 

export function renderChart(labels: string[], marks: number[]) {
    const ctx = document.getElementById("marksChart") as HTMLCanvasElement;

    if (marksChart !== null) {
        marksChart.destroy();
    }

    // Create new chart
    marksChart = new Chart(ctx, {
      type: "bar",
      data: {
          labels: labels,
          datasets: [{
              label: "Student Marks",
              data: marks,
              backgroundColor: "teal"
          }]
      },
      options: {
          responsive: true,
          scales: {
              y: {
                  beginAtZero: true,
              }
          }
      }
  });
}
