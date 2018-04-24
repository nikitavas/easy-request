import { NPMLoggingLevel } from 'winston';
import { Environment } from '../common/environments';
export const config = require('nconf');
const path = require('path');

config
    // 1. Command-line arguments
    .argv()
    // 2. Environment variables
    .env([
        'NODE_ENV',
        'PORT',
        'APP_CORS_ORIGIN',
        'AUTHORIZATION_TOKEN_SECRET',
        'LOG_LEVEL'
    ])
    // 3. Config file
    .file({ file: path.join(__dirname, '../app-config.json') })
    // 4. Defaults
    .defaults({
        PORT: 5000,
        DAAS_CORS_ORIGIN: '*',
        // Set secret keys
        AUTHORIZATION_TOKEN_SECRET: 'secretsecretsecret',
        DATABASE_URL: `postgres://postgres:postgres@localhost:5432/interviews_mess_dev`,
        PGSSL: false
    });

