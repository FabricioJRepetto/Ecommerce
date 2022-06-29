const app = require("./src/app.js");
const PORT = 4000;
const CronJob = require('cron').CronJob;
const {salesMaker} = require('./src/jobs/salesMaker');

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

const flashSales = new CronJob('0 0 0 * * *', function() {
    salesMaker();
    console.log('New Flash Sales published.');
},
    null,
	false,
	'America/Sao_Paulo'
);
//: ---------------- START JOB
//flashSales.start();
console.log(flashSales.running ? '# Cron Job (flashSales): Running.' : '# Cron Job (flashSales): Not executed.');