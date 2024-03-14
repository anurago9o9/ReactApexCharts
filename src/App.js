import './App.css';
import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios'; 

function App() {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    axios.get("https://checkinn.co/api/v1/int/requests")
      .then(response => {
        const { requests } = response.data;
        const requestsPerHotel = {};

        requests.forEach(request => {
          const hotelName = request.hotel.name;
          if (requestsPerHotel.hasOwnProperty(hotelName)) {
            requestsPerHotel[hotelName]++;
          } else {
            requestsPerHotel[hotelName] = 1;
          }
        });

        // Prepare data for chart
        const chartOptions = {
          chart: {
            id: "requests-line"
          },
          xaxis: {
            categories: Object.keys(requestsPerHotel)
          },
          yaxis: {
            min: 0,
            tickAmount: Object.keys(requestsPerHotel).length 
          }
        };

        const chartSeries = [
          {
            name: "Requests",
            data: Object.values(requestsPerHotel)
          }
        ];

        setChartData({ options: chartOptions, series: chartSeries });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {chartData && chartData.series && (
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="line"
            width="800"
          />
        )}
      </header>
    </div>
  );
}

export default App;
