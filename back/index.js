const app = require("./src/app.js");
//const { db } = require("./src/db.js");

// db.sync({ force: false }).then(
//   () => {
//     console.log("Conection with DB: OK");
//     app.listen( process.env.PORT || 3001, () => {
//       console.log("CORS enabled / Server listening on port 3001 . . .");
//     });
//   },
//   err => {
//     console.error(err);
//   }
// );
let casa = 5;
app.listen( process.env.PORT || 3001, () => {
      console.log("CORS enabled / Server listening on port 3001 . . .");
    });