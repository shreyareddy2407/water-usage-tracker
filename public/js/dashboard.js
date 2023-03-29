const headerDate = document.querySelector("#header-date");

// Create a new Date object with the current date and time
const currentDate = new Date();

// Format the date as desired (e.g. "March 28, 2023")
const formattedDate = currentDate.toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

// Set the text of the <p> tag to the formatted date
headerDate.textContent = formattedDate;

document
  .querySelector("#usage-form")
  .addEventListener("submit", function (event) {
    // event.preventDefault(); // Prevent the form from submitting normally
    // Code to send the form data to the backend using Axios goes here
    // const formData = new FormData();
    // // Append the values of the form fields to the FormData object
    // const inputs = document
    //   .querySelector("#usage-form")
    //   .querySelectorAll("input[type='number']");
    // inputs.forEach((input) => {
    //   formData.append(input.name, input.value);
    // });
    // formData.forEach((value, key) => {
    //   console.log("key %s: value %s", key, value);
    // });
    // axios
    //   .post("/api/usage/water/64138d4b8be7dba6a622dd1f", formData)
    //   .then(function (response) {
    //     // Code to handle a successful response from the backend goes here
    //     console.log(formData);
    //     console.log(response.data);
    //   })
    //   .catch(function (error) {
    //     // Code to handle an error response from the backend goes here
    //     console.error(error);
    //   });
  });

//popup toggle
const menu_toggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");

menu_toggle.addEventListener("click", () => {
  menu_toggle.classList.toggle("is-active");
  sidebar.classList.toggle("is-active");
});

// generating random data
async function generateData() {
  let labels;
  let data;

  try {
    const response = await axios.get(`/api/usage/daily/${userId}`);
    labels = Object.keys(response.data.data[0].usage);
    data = Object.values(response.data.data[0].usage);
  } catch (error) {
    console.error(error);
  }
  return {
    labels: labels,
    data: data,
  };
}

async function updateChart() {
  var myChart = null;
  const chartData = await generateData();
  if (myChart) {
    myChart.data.labels = chartData.labels;
    myChart.data.datasets[0].data = chartData.data;
    myChart.update();
  } else {
    console.log(chartData);
    var ctx = document.getElementById("myChart").getContext("2d");
    myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            data: chartData.data,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#8E44AD",
              "#2ECC71",
              "#F1C40F",
              "#3498DB",
              "#E74C3C",
              "#34495E",
              "#D35400",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          display: true,
          position: "right",
          labels: {
            fontColor: "black",
            fontSize: 12,
          },
        },
      },
    });
  }
}

updateChart();

var ctx = document.getElementById("myChart1").getContext("2d");
var myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [12, 19, 3],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  },
});

// Retrieve the monthly usage data from the server
const getData = async () => {
  const response = await fetch(`/api/usage/monthly/${userId}`);
  const data = await response.json();
  return data.data;
};

// const updateMonthlyUsageChart = async () => {
//   const monthlyUsageData = await getData();

//   const ctx = document.getElementById("myChart1").getContext("2d");
//   const myChart = new Chart(ctx, {
//     type: "line",
//     data: {
//       labels: monthlyUsageData.map((monthlyUsage) => {
//         return `${monthlyUsage.month}-${monthlyUsage.year}`;
//       }),
//       datasets: [
//         {
//           label: "Total Usage",
//           data: monthlyUsageData.map((monthlyUsage) => {
//             return monthlyUsage.totalUsage;
//           }),
//           backgroundColor: "rgba(255, 99, 132, 0.2)",
//           borderColor: "rgba(255, 99, 132, 1)",
//           borderWidth: 1,
//         },
//       ],
//     },
//     options: {
//       scales: {
//         yAxes: [
//           {
//             ticks: {
//               beginAtZero: true,
//             },
//           },
//         ],
//       },
//     },
//   });
// };

// updateMonthlyUsageChart();

// popup.js
const openPopupBtn = document.getElementById("open-popup-btn");
const closePopupBtn = document.getElementById("close-popup-btn");
const popup = document.getElementById("popup");
const popupForm = document.getElementById("popup-form");

openPopupBtn.addEventListener("click", () => {
  popup.style.display = "flex";
});

closePopupBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.style.display = "none";
  }
});

popupForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  // Add your form submission code here
  popup.style.display = "none";
});

//popup form
const editMaxUsageBtn = document.querySelector(".edit-max-usage-btn");
const popupMax = document.querySelector(".popupMax");
const closePopupMax = popupMax.querySelector(".close");

editMaxUsageBtn.addEventListener("click", () => {
  popupMax.style.display = "block";
});

closePopupMax.addEventListener("click", () => {
  popupMax.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === popupMax) {
    popupMax.style.display = "none";
  }
});

const getMaxUsage = async () => {
  const response = await axios.get(`/api/usage/maxUsage/${userId}`);
  const maxDailyEl = document.querySelector(".max-daily");
  const maxMonthlyEl = document.querySelector(".max-monthly");
  console.log(response);
  maxDailyEl.textContent = response.data.data.maxDaily + "L";
  maxMonthlyEl.textContent = response.data.data.maxMonthly + "L";
};

getMaxUsage();

const getDailyandMonthly = async () => {
  const daily = await axios.get(`/api/usage/daily/${userId}`);
  const month = await axios.get(`/api/usage/monthly/${userId}`);
  let arr = Object.values(daily.data.data[0].usage);
  const sum = arr
    .map((str) => parseInt(str))
    .reduce((total, num) => total + num, 0);

  let monthlyUsage = month.data.data.totalUsage;
  const a = document.querySelector(".dailyCalc");
  const b = document.querySelector(".monthCalc");
  a.textContent = sum + "L";
  b.textContent = monthlyUsage + "L";
};

getDailyandMonthly();
