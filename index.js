const express = require('express');
const bodyParser = require('body-parser');
const issueRoutes = require('./app/routes/issue');
const journalRoutes = require('./app/routes/journal');
const jwtRoutes = require('./app/routes/jwt');
const appConfig = require('./app/config/app.config');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger_output.json');

const app = express();

app.use(bodyParser.json());
app.use(`/api/v${appConfig.api.nuVersion}/issue`, issueRoutes);
app.use(`/api/v${appConfig.api.nuVersion}/journal`, journalRoutes);
app.use(`/api/v${appConfig.api.nuVersion}/`, jwtRoutes);
app.use(`/swagger/v${appConfig.api.nuVersion}/`, swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(`${appConfig.server.port}`, () => {

    // eslint-disable-next-line no-console
    console.log(`Express running at localhost:${appConfig.server.port}.`);

  });
