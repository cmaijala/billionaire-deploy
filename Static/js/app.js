// Load the CSV data
function loadData(callback) {
  d3.csv("Resources/data_clean.csv").then(data => {
    callback(data);
  });
  //fetch('http://127.0.0.1:5000/api/v1.0/data')
  //.then(response => response.json())
  //.then(data => {
  //  console.log(data); // Do something with the received data
  //})
  //.catch(error => {
  //  console.error('Error:', error);
  //});
}

// Function to filter data based on category
function filterData(category, data) {
  if (category === "All Industries") {
    return data; // Return all data if "All" is selected
  }
  return data.filter(obj => obj.category === category);
}

// Function to initialize dropdown
function initDropdown(data) {
  const categories = [...new Set(data.map(obj => obj.category))]; // Unique categories
  const sortedCategories = ['All Industries', ...categories.sort()]; // Add "All" option

  const categoryDropdown = d3.select("#selDataset");
  categoryDropdown.html(""); // Clear existing options
  sortedCategories.forEach((category) => {
    categoryDropdown.append("option").text(category).property("value", category);
  });
}

// Build the demographic info panel
function buildMetadata(category, data) {
  const filteredData = filterData(category, data);

  const panel = d3.select("#billionaire-metadata");
  panel.html("");

  // Calculate total number of people in the selected category
  const totalPeople = filteredData.length;
  const totalBillionaires = data.length;
  const percentageInCategory = (totalBillionaires > 0) ? ((totalPeople / totalBillionaires) * 100).toFixed(2) : 0;
  const totalWealth = filteredData.reduce((acc, obj) => acc + +obj.finalWorth, 0);
  const averageWealth = (totalPeople > 0) ? (totalWealth / totalPeople).toFixed(2) : 0;
  const totalAge = filteredData.reduce((acc, obj) => acc + +obj.age, 0);
  const averageAge = (totalPeople > 0) ? (totalAge / totalPeople).toFixed(2) : 0;
  const wealthiestBillionaire = filteredData.sort((a, b) => b.finalWorth - a.finalWorth)[0];

  // Prepare fields to display
  const fieldsToDisplay = [
    `Total Number of Billionaires: ${totalPeople}`,
    `Percentage of Billionaires in this Industry: ${percentageInCategory}%`,
    `Average Wealth (in billions): ${averageWealth}`,
    `Average Age: ${averageAge}`,
    `Wealthiest Billionaire: ${wealthiestBillionaire ? `${wealthiestBillionaire.personName} with a net worth of ${wealthiestBillionaire.finalWorth} billion dollars` : "N/A"}`
  ];

// Display fields
fieldsToDisplay.forEach(field => {
  panel.append("h6").text(field);
});
}

function buildLegend() {
  const legendData = [
    { label: 'Self-made Female', color: '#FF9999' },
    { label: 'Self-made Male', color: '#66B3FF' },
    { label: 'Nepotistic Female', color: '#C0392B' },
    { label: 'Nepotistic Male', color: '#003366' }
  ];

  const legendPanel = d3.select("#billionaire-legend");
  legendPanel.html(""); // Clear previous content

  legendData.forEach(item => {
    const listItem = legendPanel.append("div").style("display", "flex").style("align-items", "center");

    // Append colored square
    listItem.append("span")
      .style("display", "inline-block")
      .style("width", "15px")
      .style("height", "15px")
      .style("background-color", item.color)
      .style("margin-right", "5px");

    // Append the label
    listItem.append("span").text(item.label);
  });
}

buildLegend();

// Function to build pie chart
function buildPie(category, data) {
  const filtInd = filterData(category, data);
  console.log('Filtered data length:', filtInd.length);

  // Separate the data by selfMade status and gender
  const selfFemale = filtInd.filter(person => person.selfMade === "True" && person.gender === 'F').length;
  const selfMale = filtInd.filter(person => person.selfMade === "True" && person.gender === 'M').length;
  const nepoFemale = filtInd.filter(person => person.selfMade === "False" && person.gender === 'F').length;
  const nepoMale = filtInd.filter(person => person.selfMade === "False" && person.gender === 'M').length;

  // Define colors for each segment
  const colors = ['#FF9999', '#66B3FF', '#C0392B', '#003366'];

  // Build a Pie Chart
  const pieData = [{
      values: [selfFemale, selfMale, nepoFemale, nepoMale],
      labels: ['Self-made Female', 'Self-made Male', 'Nepotistic Female', 'Nepotistic Male'],
      type: 'pie',
      marker: {
        colors: colors
      }
  }];

  const PieLayout = {
    title: {
      text: 'Earned Wealth and Gender',
      font: {
          size: 24, 
          family: 'Arial, sans-serif',
          color: '#000',
          weight: 'bold' 
      }
  }, 
      hoverinfo: 'label+percent',
      showlegend: false,
      width: 400,  
      height: 500, 
  };

  // Render the pie Chart
  Plotly.newPlot('pie', pieData, PieLayout);
};

// Function to build the bar chart
function buildCharts(category, data) {
  const filteredData = filterData(category, data);

  // Sort by finalWorth in descending order and take the top 10
  const topTen = filteredData.sort((a, b) => b.finalWorth - a.finalWorth).slice(0, 10);
  const personNames = topTen.map(obj => obj.personName);
  const personCountries = topTen.map(obj => obj.country);
  const netWorths = topTen.map(obj => +obj.finalWorth);
  const personIndustry = topTen.map(obj => obj.industries);
  const personSource = topTen.map(obj => obj.source);

  // Assign colors based on self-made status and gender
  const colors = topTen.map(person => {
    if (person.selfMade === "True" && person.gender === 'F') return '#FF9999';
    if (person.selfMade === "True" && person.gender === 'M') return '#66B3FF';
    if (person.selfMade === "False" && person.gender === 'F') return '#C0392B';
    if (person.selfMade === "False" && person.gender === 'M') return '#003366';
  });

  // Create a formatted text array for hover info
  const textLabels = topTen.map((person, index) => `${personNames[index]}<br>Net Worth: ${netWorths[index]} billion<br>Country: ${personCountries[index]}
        <br>Industry: ${personIndustry[index]}<br>Source of Wealth: ${personSource[index]}`);

  // For the Bar Chart
  const barData = [{
    type: 'bar',
    x: personNames, 
    y: netWorths,
    text: textLabels,
    hoverinfo: 'text',
    marker: {
      color: colors
    },
    orientation: 'v'
  }];

  const barLayout = {
    title: {
      text: 'Top 10 Billionaires by Net Worth',
      font: {
          size: 24, 
          family: 'Arial, sans-serif',
          color: '#000',
          weight: 'bold' 
      }
  },
    xaxis: { title: 'Billionaire', automargin: true },
    yaxis: { title: 'Net Worth (in billions)' },
    width: 800,  
    height: 600, 
};

  // Render the Bar Chart
  Plotly.newPlot('bar', barData, barLayout);
}

// Function to build the scatter chart
function buildScatter(category, data) {
  const filteredData = filterData(category, data);
  const validData = filteredData.filter(person => person.age && +person.age > 0);
  const ages = [];
  const wealths = [];
  const colors = [];
  const names = [];
  const countries = [];

  validData.forEach(person => {
      ages.push(+person.age);
      wealths.push(+person.finalWorth);
      names.push(person.personName);
      countries.push(person.country)
      if (person.selfMade === "True" && person.gender === 'F') colors.push('#FF9999');
      if (person.selfMade === "True" && person.gender === 'M') colors.push('#66B3FF');
      if (person.selfMade === "False" && person.gender === 'F') colors.push('#C0392B');
      if (person.selfMade === "False" && person.gender === 'M') colors.push('#003366');
  });

  const scatterData = [{
    x: ages,
    y: wealths,
    mode: 'markers',
    type: 'scatter',
    marker: {
        size: 10,
        color: colors,
        line: { width: 1 }
    },
    text: ages.map((age, index) => `Name: ${names[index]}<br>Country: ${countries[index]}<br>Age: ${age}<br>Wealth: $${wealths[index]} billion`), // Custom hover text
    hoverinfo: 'text' // Display only the text on hover
}];

  const scatterLayout = {
    title: {
      text: `Age vs. Wealth in ${category}`,
      font: {
          size: 24, 
          family: 'Arial, sans-serif',
          color: '#000',
          weight: 'bold' 
      }
  }, 
    xaxis: { title: 'Age' },
    yaxis: { 
        title: 'Wealth (in billions)',
        type: 'log' // Logarithmic scale for y-axis
    },
    showlegend: false,
    hovermode: 'closest',
    width: 750,  
    height: 500, 
  };

  // Render the scatter chart
  Plotly.newPlot('scatter-plot', scatterData, scatterLayout);
}

function buildBubble(category, data) {
  const filtInd = filterData(category, data);
  console.log('Filtered data length:', filtInd.length);

  // Filter out entries with null latitude or longitude
  const validData = filtInd.filter(d => d.country_lat !== null && d.country_long !== null);
  console.log('Valid data length:', validData.length);

  // Extracting latitude, longitude, and countries
  let latitudes = validData.map(d => d.country_lat);
  console.log('Latitude:', latitudes);
  let longitudes = validData.map(d => d.country_long);
  console.log('Longitude:', longitudes);
  let countries = validData.map(d => d.country);
  console.log('Countries:', countries);

  // Create a map to calculate counts, total net worth, and find the richest billionaire
  const countryStats = {};

  validData.forEach(person => {
    const country = person.country;
    const netWorth = +person.finalWorth;

    if (!countryStats[country]) {
      countryStats[country] = {
        count: 0,
        totalNetWorth: 0,
        richest: { name: person.personName, netWorth: netWorth },
        lat: person.country_lat, // Store latitude
        lon: person.country_long  // Store longitude
      };
    }

    countryStats[country].count += 1;
    countryStats[country].totalNetWorth += netWorth;

    if (netWorth > countryStats[country].richest.netWorth) {
      countryStats[country].richest = { name: person.personName, netWorth: netWorth };
    }
  });

  // Prepare data for the bubble chart
  const countrys = Object.keys(countryStats);
  const billionaireCounts = countrys.map(c => countryStats[c].count);
  const averageNetWorth = countrys.map(c => countryStats[c].totalNetWorth / countryStats[c].count);
  const richestBillionaire = countrys.map(c => countryStats[c].richest.name);
  const latitudesFinal = countrys.map(c => countryStats[c].lat); // Get latitudes from countryStats
  const longitudesFinal = countrys.map(c => countryStats[c].lon); // Get longitudes from countryStats

  // Calculate radius for bubbles
  const radius = billionaireCounts.map(x => Math.sqrt(x) * 5);

  // Create hover text
  let hoverText = countrys.map((c, i) => 
    `Country: ${c}<br>` +
    `Number of Billionaires: ${billionaireCounts[i]}<br>` +
    `Average Net Worth: $${averageNetWorth[i].toFixed(2)} billion<br>` +
    `Richest Billionaire: ${richestBillionaire[i]}`
  );
  
// Assuming you have the original radius array calculated
const maxRadius = Math.max(...radius);
const normalizedColors = radius.map(r => r / maxRadius); // Normalize for colorscale

// Define the color scale from blue to red
const colorScale = [
    [0, 'orange'],     // Lowest value
    [1, 'green']       // Highest value
];

// Build a Bubble Chart
let bubbleMap = {
    type: 'scatter',
    x: longitudesFinal, // Use filtered longitudes
    y: latitudesFinal,  // Use filtered latitudes
    mode: 'markers',
    marker: {
        size: radius, // Keep the original radius for marker size
        color: normalizedColors, // Use normalized values for colorscale
        colorscale: colorScale,  // Apply the color scale
        opacity: 0.75,
    },
    text: hoverText,
    hoverinfo: 'text'
};

  let bubbleLayout = {
    title: {
      text: 'Billionaires by Country',
      font: {
          size: 24, 
          family: 'Arial, sans-serif',
          color: '#000',
          weight: 'bold' 
      }
  }, 
    xaxis: { title: 'Longitude', range: [-180, 180], fixedrange: true  },
    yaxis: { title: 'Latitude', range: [-90, 90], fixedrange: true  },
    showlegend: false,
    height: 700,
    width: 1200,
    responsive: false,
    aspectRatio: 2,
    hovermode: 'closest',
    dragmode: false, 
    images: [{
      source: "Resources/world_map_equirectangular_projection.png",
      width: 1440,
      height: 720,
      x: 0,
      y: 0,
      xref: "paper",
      yref: "paper",
      sizex: 1,
      sizey: 1,
      xanchor: "left",
      yanchor: "bottom",
      opacity: 1,
      layer: "below"
    }],
  };

  // Render the Bubble Chart
  Plotly.newPlot('bubble', [bubbleMap], bubbleLayout);
}

// Function to run on page load
function init() {
  loadData(data => {
    initDropdown(data); // Initialize dropdown with data
    const firstCategory = d3.select("#selDataset").property("value");
    buildCharts(firstCategory, data);
    buildMetadata(firstCategory, data);
    buildPie(firstCategory, data);
    buildBubble(firstCategory, data);
    buildScatter(firstCategory, data); 
  });
}

// Function for event listener
function optionChanged(newCategory) {
  loadData(data => {
    buildCharts(newCategory, data);
    buildMetadata(newCategory, data);
    buildPie(newCategory, data);
    buildBubble(newCategory, data);
    buildScatter(newCategory, data); 
  });
}

// Initialize the dashboard
init();
