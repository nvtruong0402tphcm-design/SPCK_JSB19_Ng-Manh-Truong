const fs = require("fs");
const path = require("path");

const mockDir = __dirname;

const db = {
    products: require("./data/products.json"),
    users: require("./data/users.json"),
    orders: require("./data/orders.json"),
    news: require("./data/news.json")
};

fs.writeFileSync(
    path.join(mockDir, "db.json"),
    JSON.stringify(db, null, 2)
);

console.log("Mock database generated!");