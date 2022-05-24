/* const app = require("./src/app.js");

app.listen( process.env.PORT || 3001, () => {
  console.log("CORS enabled / Server listening on port 3001 . . .");
}); */

//! ---------------- START SERVER
const app = require("./src/app.js");

app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
