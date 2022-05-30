require("dotenv").config();
const mongoose = require("mongoose");
const { DB_URL } = process.env;

const clientDb = mongoose.connect(
  DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Mongoose connected");
  }
);

module.exports = clientDb;

/* const clientDb = mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((m) => {
    console.log("Db connected");
    return m.connection.getClient();
  });

module.exports = clientDb;
 */
