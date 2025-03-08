import React, { useState } from "react";
import Navbar from "./Navbar";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const Compare = () => {

  // ✅ Corrected Data
  const data = {
    Delhi: {
      state: "Delhi",
      annualAverage: 142.210,
      monthlyAverages: {
        January: { totalPower: 9.7 },
        February: { totalPower: 11.7 },
        March: { totalPower: 14.6 },
        April: { totalPower: 14.3 },
        May: { totalPower: 13.4 },
        June: { totalPower: 11.5 },
        July: { totalPower: 10.2 },
        August: { totalPower: 11.0 },
        September: { totalPower: 12.1 },
        October: { totalPower: 12.9 },
        November: { totalPower: 10.6 },
        December: { totalPower: 10.2 }
      }
    },

    Meghalaya: {
      state: "Meghalaya",
      annualAverage: 132.799,
      monthlyAverages: {
        January: { totalPower: 13.3 },
        February: { totalPower: 12.4 },
        March: { totalPower: 13.4 },
        April: { totalPower: 11.1},
        May: { totalPower: 9.9},
        June: { totalPower: 7.7 },
        July: { totalPower: 8.4 },
        August: { totalPower: 8.9 },
        September: { totalPower: 9.2 },
        October: { totalPower: 11.7 },
        November: { totalPower: 13.5 },
        December: { totalPower: 13.3}
      }
    },

    Banglore: {
      state: "Banglore",
      annualAverage: 157.133,
      monthlyAverages: {
        January: { totalPower: 16.2 },
        February: { totalPower: 15.4 },
        March: { totalPower: 16.6 },
        April: { totalPower: 14.8 },
        May: { totalPower: 13.6},
        June: { totalPower: 9.7 },
        July: { totalPower: 8.7 },
        August: { totalPower: 9.7 },
        September: { totalPower: 11.1 },
        October: { totalPower: 12.9 },
        November: { totalPower: 13.3 },
        December: { totalPower: 15.0 }
      }
    },

    Rajasthan: {
      state: "Rajasthan",
      annualAverage: 170.416,
      monthlyAverages: {
        January: { totalPower: 14.9 },
        February: { totalPower: 14.6 },
        March: { totalPower: 16.5 },
        April: { totalPower: 15.3 },
        May: { totalPower: 14.6 },
        June: { totalPower: 12.9 },
        July: { totalPower: 11.3 },
        August: { totalPower: 12.0 },
        September: { totalPower: 14.0 },
        October: { totalPower: 15.8 },
        November: { totalPower: 14.0 },
        December: { totalPower: 14.5 }
      }
    }
  };

  // ✅ States to store dropdown selection
  const [location1, setLocation1] = useState("");
  const [location2, setLocation2] = useState("");
  const [compare, setCompare] = useState(false);

  // ✅ Extract monthly data
  const getMonthlyPower = (location) =>
    Object.values(data[location].monthlyAverages).map(
      (month) => month.totalPower
    );

  // ✅ Extract annual power
  const getTotalPower = (location) => data[location].annualAverage;

  // ✅ Handle Compare Button
  const handleCompare = () => {
    if (!location1 || !location2) {
      alert("Please select both locations to compare.");
      return;
    }
    if (location1 === location2) {
      alert("Please select two different locations.");
      return;
    }
    setCompare(true);
  };

  // ✅ Month Labels
  const months = Object.keys(data.Delhi.monthlyAverages);

  return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Compare Two Locations</h2>

       
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", margin: "20px" }}>
          <select
          style={{borderRadius: "6px"}}
            value={location1}
            onChange={(e) => setLocation1(e.target.value)}
          >
            <option value="" disabled>Select Location 1</option>
            {Object.keys(data).map((loc) => (
              <option key={loc} value={loc}>{data[loc].state}</option>
            ))}
          </select>

          <h3>Vs</h3>

          <select
           style={{borderRadius: "6px"}}
            value={location2}
            onChange={(e) => setLocation2(e.target.value)}
          >
            <option value="" disabled>Select Location 2</option>
            {Object.keys(data).map((loc) => (
              <option key={loc} value={loc}>{data[loc].state}</option>
            ))}
          </select>
        </div>

        
        <button onClick={handleCompare} style={{
          padding: "10px 15px",
          marginTop: "15px",
          fontSize: "14px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}>Compare</button>

        {/* ✅ Graphs */}
        {compare && (
 <div style={{ marginTop: "50px", textAlign: "center" }}>
  
 {/* ✅ Monthly Power Comparison */}
 <h3>Monthly Power Comparison (MWh)</h3>
 <div style={{ width: "800px", margin: "auto" }}>
   <Bar
     data={{
       labels: months,
       datasets: [
         {
           label: `${data[location1].state} (MWh)`,
           data: getMonthlyPower(location1),
           backgroundColor: "rgba(54, 162, 235, 0.6)"
         },
         {
           label: `${data[location2].state} (MWh)`,
           data: getMonthlyPower(location2),
           backgroundColor: "rgba(255, 99, 132, 0.6)"
         }
       ]
     }}
     options={{
       responsive: true,
       scales: {
         y: {
           ticks: {
             callback: function (value) {
               return value + " MWh";
             }
           }
         }
       },
       plugins: {
         tooltip: {
           callbacks: {
             label: function (tooltipItem) {
               return tooltipItem.dataset.label + ": " + tooltipItem.raw + " MWh";
             }
           }
         }
       }
     }}
   />
 </div>

 {/* ✅ Annual Power Comparison */}
 <h3 style={{ marginTop: "50px" }}>Annual Power Comparison (MWh)</h3>
 <div style={{ width: "500px", margin: "auto" }}>
   <Bar
     data={{
       labels: ["Annual Power"],
       datasets: [
         {
           label: `${data[location1].state} (MWh)`,
           data: [getTotalPower(location1)],
           backgroundColor: "rgba(54, 162, 235, 0.6)"
         },
         {
           label: `${data[location2].state} (MWh)`,
           data: [getTotalPower(location2)],
           backgroundColor: "rgba(255, 99, 132, 0.6)"
         }
       ]
     }}
     options={{
       responsive: true,
       scales: {
         y: {
           ticks: {
             callback: function (value) {
               return value + " MWh";
             }
           }
         }
       },
       plugins: {
         tooltip: {
           callbacks: {
             label: function (tooltipItem) {
               return tooltipItem.dataset.label + ": " + tooltipItem.raw + " MWh";
             }
           }
         }
       }
     }}
   />
 </div>

</div>

          
        )}
      </div>
    </>
  );
};

export default Compare;
