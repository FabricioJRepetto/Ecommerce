const app = require("./src/app.js");
const PORT = process.env.PORT;
const { salesChecker, flashSales } = require('./src/jobs/salesMaker');
const { deliveryGuy, deliveryUpdater } = require('./src/jobs/deliveryGuy');

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
});

//: ---------------- START JOB
flashSales.start();
console.log(flashSales.running ? '# Cron Job (flashSales): Running.' : '# Cron Job (flashSales): Not executed.');
salesChecker();

deliveryUpdater.start();
console.log(deliveryUpdater.running ? '# Cron Job (deliveryUpdater): Running.' : '# Cron Job (flashSales): Not executed.');
deliveryGuy();
