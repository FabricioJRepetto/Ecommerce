const app = require("./src/app.js");
const PORT = 4000;
const { salesChecker, flashSales } = require('./src/jobs/salesMaker');

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
});

//: ---------------- START JOB
flashSales.start();
console.log(flashSales.running ? '# Cron Job (flashSales): Running.' : '# Cron Job (flashSales): Not executed.');
salesChecker();