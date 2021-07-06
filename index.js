const fetch = require("node-fetch");

const path = process.env.slack_path;

appStart();

setInterval(getCapacity, 5 * 60 * 1000);
getCapacity();

async function getCapacity() {
  console.log(Math.floor(Math.random() * 10) + " Scanning...");
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
