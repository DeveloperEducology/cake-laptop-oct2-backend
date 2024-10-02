const mongoose = require("mongoose");

main().then((res) => console.log("db connected successfully..!!"));
main().catch((err) => console.log("db not connected...!!!", err));

async function main() {
  await mongoose.connect(
    "mongodb+srv://developercakexpress:rM0qpC8Xfmb2ZNaR@cluster0.7g8nb.mongodb.net/cake-express?retryWrites=true&w=majority"
  );
}
