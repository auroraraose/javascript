
import Chart from 'chart.js/auto';


const mychart = document.getElementById('myChart').getContext('2d');

const data = [10, 20, 30, 40, 50];

const myChart = new Chart(mychart, {
    type: 'bar', 
    data: {
        labels: ['Tessa', 'Vishal', 'Aarsh', 'Reckonsys', 'Vi'], 
        datasets: [{
            label: 'My Data', 
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)', 
            borderColor: 'rgba(75, 192, 192, 1)', 
            borderWidth: 1 
        }]
    },
    options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
});
