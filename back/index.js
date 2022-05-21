const app = require("./src/app.js");

app.listen( process.env.PORT || 3001, () => {
      console.log("CORS enabled / Server listening on port 3001 . . .");
    });