import * as express from 'express';
import { Request, Response } from 'express';
import { controller, httpPost, requestParam, queryParam, httpGet, response, request, httpPut, httpDelete } from 'inversify-express-utils';
import { config } from '../config/app-config';
import { inject } from 'inversify';
import { BaseController } from './base-controller';
import * as _ from 'lodash';
import { transformAndValidate } from 'class-transformer-validator';
import * as jwtTool from 'jsonwebtoken';
import * as moment from 'moment';
import { Answer } from '../contracts/answer';
import { AnswerRepository } from '../data.sql/answer-repository';


@controller('/api/answers')
export class AnswersController extends BaseController {

    constructor(
        @inject('AnswerRepository') private _answerRepository: AnswerRepository) {
        super();
    }

    /**
     * @swagger
     * /api/answers:
     *   get:
     *     summary: Get all answers
     *     description: Get all answers
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: companieName
     *         in: query
     *         required: false
     *         type: string
     *     tags:
     *       - Answers
     *     responses:
     *       200:
     *         description: List of users
     *
     */
    @httpGet('/')
    public getAllAnswers(@request() req: express.Request, @response() res: express.Response) {
        // let parameters: GetUsersRequest;
        // try {
        //     parameters = await transformAndValidate(
        //         GetUsersRequest,
        //         req.query as object
        //     );
        // } catch (errors) {
        //     return this.badRequest(res, errors);
        // }
        // res.set('Content-Type', 'text/plain');

        // // res.set('Content-Type', 'text/plain');
        // res.write('aaaaaa');
        // res.end();// res.json({});
        this._answerRepository.getAnswers().then(answers => {
            res.json(answers);
        });
    }



    /**
     * @swagger
     * /api/answers/{answerId}:
     *   get:
     *     summary: Get a answer by ID
     *     description: Get answer by id
     *     produces:
     *       - application/json
     *     tags:
     *       - Answers
     *     parameters:
     *       - name: answerId
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Answer
     *       500:
     *         description: Server error
     *
     */
    @httpGet('/:answerId')
    public async getAnswerById(@requestParam('answerId') answerId: string, @response() res: express.Response) {
        try {
            const answer = await this._answerRepository.getAnswerById(answerId);
            if (answer) {
                res.json(answer);
            } else {
                res.status(404).send({
                    success: false,
                    message: `Answer not found.`
                });
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                message: `${error}`
            });
        }
    }
    /**
     * @swagger
     * /api/answers:
     *   post:
     *     summary: Create new answer
     *     description: Create new answer
     *     produces:
     *       - application/json
     *     tags:
     *       - Answers
     *     parameters:
     *       - name: Answer
     *         in: body
     *         description: The pet JSON you want to post
     *         schema:
     *           $ref: '#/definitions/Answer'
     *     responses:
     *       200:
     *         description: Created
     *       500:
     *         description: Server error
     *
     */
    @httpPost('/')
    public async createAnswer(@request() req: express.Request, @response() res: express.Response) {
        const newAnswer: Answer = req.body;
        try {
            const createdUser = await this._answerRepository.create(newAnswer);
            if (createdUser) {
                res.status(200).send({
                    success: true,
                    message: 'Answer created',
                    answer: createdUser
                });
            }
        } catch (errors) {
            res.status(500).send(errors.toString());
            return;
        }
    }



    /**
   * @swagger
   * /api/answers/{answerId}:
   *   put:
   *     summary: Update Answer
   *     description: Update Answer
   *     produces:
   *       - application/json
   *     tags:
   *       - Answers
   *     parameters:
   *       - name: answerId
   *         in: path
   *         required: true
   *         type: string
   *       - name: Answer
   *         in: body
   *         description: The pet JSON you want to post
   *         schema:
   *           $ref: '#/definitions/Answer'
   *     responses:
   *       200:
   *         description: Updated
   *       500:
   *         description: Server error
   *
   */
    @httpPut('/:answerId')
    public async updateAnswer(
        @requestParam('answerId') answerId: string,
        @request() req: express.Request,
        @response() res: express.Response) {
        const updateAnswer: Answer = req.body;

        try {
            const answer = await this._answerRepository.update(updateAnswer, Number(answerId));
            res.status(200).send({
                success: true,
                message: 'answer updated',
                answer: answer
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Please contact administrators.',
                error: error
            });
        }
    }

    /**
     * @swagger
     * /api/answers/{answerId}:
     *   delete:
     *     summary: Deletes answer
     *     description: Deletes a answer by id, and all accosiated records
     *     produces:
     *       - application/json
     *     tags:
     *       - Answers
     *     parameters:
     *       - name: answerId
     *         in: path
     *         required: true
     *         type: integer
     *     responses:
     *       204:
     *         description: deleted successfully
     *       500:
     *         description: Server error
     *
     */
    @httpDelete('/:answerId')
    public async deleteAnswer(
        @requestParam('answerId') answerId: string,
        @request() req: express.Request,
        @response() res: express.Response) {
        this._answerRepository.delete(answerId).then((effected: Number) => {
            if (effected) {
                res.status(200).send({
                    success: true,
                    message: 'Answer deleted.'
                });
            } else {
                res.status(400).send({
                    success: false,
                    message: 'Arguments are invalid.'
                });
            }
        }).catch((err: Error) => {
            res.status(500).send({
                success: false,
                message: `answer ${answerId} cannot be deleted : ${err}`
            });
        });
    }
}
