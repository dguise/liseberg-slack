const fetch = require("node-fetch");

const path = process.env.slack_path;

appStart();

setInterval(getCapacity, 5 * 60 * 1000);
setInterval(displayCapacity, 60 * 60 * 1000);
displayCapacity();
getCapacity();

let prevDates = [];

async function getCapacity() {
  const res = await fetch(
    "https://www.liseberg.se/sv/api/capacity?from=2021-07-21&to=2021-07-23"
  );
  const json = await res.json();

  json.dates.forEach((d) => {
    const date = new Date(d.date);
    const day = `${date.getDate()} / ${date.getMonth() + 1}`;

    if (d.capacity > 0) {
      alertSlackAboutTime(`:sunny: ${day} - (${d.capacity})`);
    }
    if (d.eveningCapacity > 0) {
      alertSlackAboutTime(`:crescent_moon: ${day} - (${d.eveningCapacity})`);
    }
  });
}

async function displayCapacity() {
  const res = await fetch(
    "https://www.liseberg.se/sv/api/capacity?from=2021-07-21&to=2021-07-23"
  );
  const json = await res.json();
  let message = ":exclamation: Hourly capacity check! \r\n ";
  json.dates.forEach((d) => {
    const date = new Date(d.date);
    const day = `${date.getDate()}/${date.getMonth() + 1}`;

    let capacityDiff = 0;
    let eveningCapacityDiff = 0;

    if (prevDates.length > 0) {
      const prevDate = prevDates.find((x) => x.date == d.date);
      capacityDiff = Math.abs(d.capacity - prevDate.capacity);
      eveningCapacityDiff = Math.abs(
        d.eveningCapacity - prevDate.eveningCapacity
      );
    }

    message += `:sunny: ${day} (${d.capacity}) `;
    if (capacityDiff > 0) {
      message += ` :chart_with_downwards_trend: ${capacityDiff} diff!`;
    }
    message += "\r\n";
    message += `:crescent_moon: ${day} (${d.eveningCapacity})`;
    if (eveningCapacityDiff > 0) {
      message += ` :chart_with_downwards_trend: ${$eveningCapacityDiff} diff!`;
    }
    message += "\r\n";
    message += `\r\n `;
  });
  slack(message);
  prevDates = json.dates;
}

function alertSlackAboutTime(day) {
  slack("Emil " + day);
}

function appStart() {
  slack(":robot_face: Liseberg listener started. Slack integration working.");
}

function slack(message) {
  return fetch(`https://hooks.slack.com/services/${path}`, {
    method: "post",
    body: JSON.stringify({
      text: message,
    }),
  });
}
