import { Request, Response } from 'express';
import * as guardCall from 'express-jwt-permissions';
import { controller, httpPost, requestParam, queryParam, httpGet } from 'inversify-express-utils';
import * as jwt from 'express-jwt';
import { config } from '../config/app-config';
import { inject } from 'inversify';
import { BaseController } from './base-controller';
import { transformAndValidate } from 'class-transformer-validator';
import * as _ from 'lodash';
import { logger } from '../common/logger';
import { ExampleService } from '../services/example-service';
import { Value } from '../contracts/value';

@controller('/api/values')
export class ValuesController extends BaseController {

    constructor(
        @inject('ExampleService') private _service: ExampleService
    ) {
        super();
    }

    /**
     * @swagger
     * /api/values:
     *   get:
     *     summary: get example
     *     description: http get example
     *     parameters:
     *       - name: val1
     *         in: query
     *         required: true
     *         description: number describes
     *         type: number
     *       - name: val2
     *         in: query
     *         required: true
     *         type: number
     *     tags:
     *       - Values
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *          description: The sum of 2 values
     */
    @httpGet('/')
    public async getValues(
        @queryParam('val1') val1: number,
        @queryParam('val2') val2: number,
        request: Request,
        response: Response) {

        // do validations of input
        const sum = this._service.sum(Number(val1), Number(val2));
        response.json({ sum: sum });
    }

    /**
     * @swagger
     * /api/values/{id}:
     *   post:
     *     summary: Updates emails statues
     *     description: Will update winners status and audit status
     *     parameters:
     *       - name: Value
     *         in: body
     *         description: Personalization parameters
     *         schema:
     *           $ref: '#/definitions/Value'
     *       - name: token
     *         in: query
     *         required: false
     *         type: string
     *     tags:
     *       - Values
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *          description: The request was received
     */
    @httpPost('/:id')
    public async postAuthorizeValues(
        @requestParam('id') id: string,
        request: Request,
        response: Response) {

        // do validations of input
        let userInput: Value;
        try {
            userInput = await transformAndValidate(
                Value,
                request.body as object
            );
        } catch (errors) {
            this.badRequest(response, errors);
            return;
        }
        this._service.print(userInput);
        response.sendStatus(201);
    }
}
