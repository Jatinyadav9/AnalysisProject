import React, { useState } from "react";
import Navbar from "./Navbar";
import { Bar } from "react-chartjs-2";


const Home = () => {
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [response, setResponse] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState(null);

  // Function to format date as YYYYMMDD
  const getFormattedDate = (daysAgo = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().slice(0, 10).replace(/-/g, "");
  };

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setLocation((prevLocation) => ({
      ...prevLocation,
      [name]: value,
    }));
  };

  // Handle Date Selection
  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);

    // Update hourly data based on the selected date
    const selectedDayData = response.find((item) => item.date === date);
    if (selectedDayData) {
      setHourlyData(selectedDayData.hourlyIrradiance);
    }
  };

  // Fetch data from NASA API
  const fetchData = async () => {
    if (!location.latitude || !location.longitude) {
      alert("Please enter both latitude and longitude.");
      return;
    }

    const startDate = getFormattedDate(365);
    const endDate = getFormattedDate(365);

    location.latitude = parseInt(location.latitude);
    location.longitude = parseInt(location.longitude);

    const apiUrl = `https://power.larc.nasa.gov/api/temporal/hourly/point?start=${startDate}&end=${endDate}&latitude=${location.latitude}&longitude=${location.longitude}&community=ag&parameters=T2M,ALLSKY_SFC_SW_DWN,PRECTOTCORR,WS2M&format=json`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const rawData = data.properties.parameter;

      // Process Data (Calculate Daily Averages + Hourly Data)
      const dailyData = {};
      Object.keys(rawData.T2M).forEach((time) => {
        const date = time.substring(0, 8);
        const hour = time.substring(8, 10);

        if (!dailyData[date]) {
          dailyData[date] = {
            T2M: { sum: 0, count: 0 },
            ALLSKY_SFC_SW_DWN: { sum: 0, count: 0 },
            PRECTOTCORR: { sum: 0, count: 0 },
            WS2M: { sum: 0, count: 0 },
            hourlyIrradiance: Array(24).fill(0),
          };
        }

        // Temperature (T2M)
        if (rawData.T2M[time] !== -999) {
          dailyData[date].T2M.sum += rawData.T2M[time];
          dailyData[date].T2M.count++;
        }

        // Irradiance (ALLSKY_SFC_SW_DWN)
        if (rawData.ALLSKY_SFC_SW_DWN[time] !== -999) {
          dailyData[date].ALLSKY_SFC_SW_DWN.sum += rawData.ALLSKY_SFC_SW_DWN[time];
          dailyData[date].ALLSKY_SFC_SW_DWN.count++;

          // Store hourly irradiance
          dailyData[date].hourlyIrradiance[parseInt(hour)] = rawData.ALLSKY_SFC_SW_DWN[parseInt(time)];
        }

        // Precipitation (PRECTOTCORR)
        if (rawData.PRECTOTCORR[time] !== -999) {
          dailyData[date].PRECTOTCORR.sum += rawData.PRECTOTCORR[time];
          dailyData[date].PRECTOTCORR.count++;
        }

        // Wind Speed (WS2M)
        if (rawData.WS2M[time] !== -999) {
          dailyData[date].WS2M.sum += rawData.WS2M[time];
          dailyData[date].WS2M.count++;
        }
      });

      // Format Data
      const formattedData = Object.entries(dailyData).map(([date, values]) => ({
        date,
        averageTemperature: (values.T2M.sum / values.T2M.count).toFixed(2),
        averageIrradiance: (values.ALLSKY_SFC_SW_DWN.sum / values.ALLSKY_SFC_SW_DWN.count).toFixed(2),
        averagePrecipitation: (values.PRECTOTCORR.sum / values.PRECTOTCORR.count).toFixed(2),
        averageWindSpeed: (values.WS2M.sum / values.WS2M.count).toFixed(2),
        hourlyIrradiance: values.hourlyIrradiance,
      }));

      setResponse(formattedData);
      setSelectedDate(formattedData[0].date);
      setHourlyData(formattedData[0].hourlyIrradiance);
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
    }
  };

  return (
    <>

    <Navbar/>
       
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <div>
      <h2>Provide Your Longitude & Latitude</h2>
      <div> 
      <input
        type="number"
        name="latitude"
        value={location.latitude}
        onChange={handleChange}
        placeholder="Enter Latitude"
        style={{
          padding: "10px",
          margin: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <input
        type="number"
        name="longitude"
        value={location.longitude}
        onChange={handleChange}
        placeholder="Enter Longitude"
        style={{
          padding: "10px",
          margin: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      </div>
      

      <button
        onClick={fetchData}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Fetch Data
      </button>
      </div>

      <div style={{ textAlign: "center", marginTop: "60px" }}>

      {response.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <table border="1">
            <thead>
              <tr>
                <th>Date</th>
                <th>Avg Temp (°C)</th>
                <th>Avg Irradiance (W/m²)</th>
                <th>Avg Precipitation (mm)</th>
                <th>Avg Wind Speed (m/s)</th>
              </tr>
            </thead>
            <tbody>
              {response.map((item, index) => (
                <tr key={index}>
                  <td>{"3rd March 2024"}</td>
                  <td>{item.averageTemperature}°C</td>
                  <td>{item.averageIrradiance} W/m²</td>
                  <td>{item.averagePrecipitation} mm</td>
                  <td>{item.averageWindSpeed} m/s</td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
      )}


      {response.length> 0 && (

<div style={{ textAlign: "center", marginTop: "50px" }}>
<h3>Hourly Irradiance (W/m²)</h3>

<div style={{ width: "800px", margin: "auto" }}>
  <Bar
    data={{
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [
        {
          label: "Hourly Irradiance (W/m²)",
          data: hourlyData,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    }}
    options={{
      responsive: true,
      scales: {
        y: {
          ticks: {
            callback: function (value) {
              return value + " W/m²";
            },
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.dataset.label + ": " + tooltipItem.raw + " W/m²";
            },
          },
        },
      },
    }}
  />
</div>
</div>

      )}


      </div>
      
      
      </div>
    </>
  );
};

export default Home;
