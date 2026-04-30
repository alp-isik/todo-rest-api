const swaggerAutogen = require("swagger-autogen");

const doc = {
  info: {
    title: "Todo API",
    description: "REST API for a Todo application",
  },
  host: "localhost:3000",
};

const outputFile = "./swagger-output.json";
const routes = ["./app.js"];

swaggerAutogen()(outputFile, routes, doc);
