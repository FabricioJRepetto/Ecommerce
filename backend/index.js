//! ---------------- START SERVER
const app = require("./src/app.js");

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
