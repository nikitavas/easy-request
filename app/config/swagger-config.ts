const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = {
    'swagger': '2.0',
    info: {
        title: 'Interview mess',
        version: '1.0.0',
        description: 'Full api for Interview mess',
    },
    'produces': [
        'application/json'
    ],
    securityDefinitions: {
        jwt: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    },
    security: [
        { jwt: [] }
    ],
    definitions:
        {
            'User': {
                'type': 'object',
                'properties': {
                    'email': {
                        'type': 'string'
                    },
                    'first_name': {
                        'type': 'string'
                    },
                    'last_name': {
                        'type': 'string'
                    },
                    'about': {
                        'type': 'string'
                    }
                },
                'required': [
                    'email',
                    'first_name',
                    'last_name'
                ]
            },
            'Company': {
                'type': 'object',
                'properties': {
                    'title': {
                        'type': 'string'
                    }
                },
                'required': [
                    'title'
                ]
            },
            'Value': {
                'type': 'object',
                'properties': {
                    'id': {
                        'type': 'string'
                    },
                    'msg': {
                        'type': 'string'
                    }
                },
                'required': [
                    'id'
                ]
            }
        }
};
// Options for the swagger docs
const options = {
    swaggerDefinition: swaggerDefinition,
    apis: [__dirname + '/../controllers/**/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
