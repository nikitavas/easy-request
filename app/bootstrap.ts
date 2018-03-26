import 'reflect-metadata';
import * as express from 'express';
import * as uuid from 'uuid/v4';
import * as bodyParser from 'body-parser';
import { config } from './config/app-config';
import { swaggerSpec } from './config/swagger-config';
import * as cors from 'cors';
import * as swaggerUi from 'swagger-ui-express';
import { logger } from './common/logger';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './config/ioc-config';
import { Environment } from './common/environments';

// create server
const server = new InversifyExpressServer(container);

server.setConfig((application) => {
    // [START setup] ===
    // =============================================================================
    application.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
        const start = process.hrtime();
        res.locals.requestId = uuid();
        res.header('app-request-id', res.locals.requestId);
        next();

        // didn't find another way to execute something
        // after controller's being called
        const send = res.send;
        res.send = function (body?: any) {
            const end = process.hrtime(start);
            const response = send.call(this, body);
            logger.info('Request served', {
                status: res.statusCode,
                requestId: res.locals.requestId,
                uri: `${req.method}: ${req.url}`,
                user: req['user'] ? req['user'].name : 'anonymous',
                serveTime: +(end[0] + (end[1] / 1e9)).toFixed(4)
            });
            return response;
        };
    });

    const corsOptions = {
        origin: config.get('DAAS_CORS_ORIGIN'),
        optionsSuccessStatus: 200
    };



    application.use(bodyParser.urlencoded({ extended: true }));
    application.use(bodyParser.json());
    application.use(cors(corsOptions));

    application.use('/app', express.static('./public'));
    const sessionConfig = {
        resave: false,
        saveUninitialized: false,
        secret: config.get('SECRET_COOKIE'),
        signed: true
    };
});

server.setErrorConfig((application) => {

    // Setup routes
    // =============================================================================
    application.use('/', [swaggerUi.serve], swaggerUi.setup(swaggerSpec));

    // Basic 404 handler
    application.use((req, res) => {
        res.status(404).send('Not Found');
    });

    // Basic error handler
    application.use((err, req, res, next) => {
        logger.error('An unhandled exception occurred', err);
        const status = err.status || 500;
        res.status(status).send(application.settings.env === Environment.PROD ? 'Unhandled error' : err.message);
    });
});
const app = server.build();

// START THE SERVER5
// =============================================================================
app.listen(config.get('PORT'));
console.warn(`app started and listening on port : ${config.get('PORT')}`);

module.exports = app; // for integration testing
