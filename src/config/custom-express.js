const express = require("express");
const app = express();

const bodyParser = require('body-parser');

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

var swaggerDefinition = {
    info: {
      title: 'Aula Pos Graduacao Unyleya API',
      version: '1.0.0',
      description: 'Demonstrating how to describe a RESTful API with Swagger',
    },
    host: 'localhost:3001',
    basePath: '/',
  };
  
var options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['../app/rotas/rotas.js'],
};
  
const specs = swaggerJsdoc(options);

app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

const rotas = require("../app/rotas/rotas");
rotas(app);

module.exports = app;
