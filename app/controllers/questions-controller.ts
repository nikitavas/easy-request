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
import { Question } from '../contracts/question';
import { QuestionRepository } from '../data.sql/question-repository';


@controller('/api/questions')
export class QuestionsController extends BaseController {

    constructor(
        @inject('QuestionRepository') private _questionRepository: QuestionRepository) {
        super();
    }

    /**
     * @swagger
     * /api/questions:
     *   get:
     *     summary: Get all questions
     *     description: Get all questions
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: companieName
     *         in: query
     *         required: false
     *         type: string
     *     tags:
     *       - Questions
     *     responses:
     *       200:
     *         description: List of users
     *
     */
    @httpGet('/')
    public getAllQuestions(@request() req: express.Request, @response() res: express.Response) {
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
        this._questionRepository.getQuestions().then(questions => {
            res.json(questions);
        });
    }



    /**
     * @swagger
     * /api/questions/{questionId}:
     *   get:
     *     summary: Get a question by ID
     *     description: Get question by id
     *     produces:
     *       - application/json
     *     tags:
     *       - Questions
     *     parameters:
     *       - name: questionId
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Question
     *       500:
     *         description: Server error
     *
     */
    @httpGet('/:questionId')
    public async getQuestionById(@requestParam('questionId') questionId: string, @response() res: express.Response) {
        try {
            const question = await this._questionRepository.getQuestionById(questionId);
            if (question) {
                res.json(question);
            } else {
                res.status(404).send({
                    success: false,
                    message: `Question not found.`
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
     * /api/questions:
     *   post:
     *     summary: Create new question
     *     description: Create new question
     *     produces:
     *       - application/json
     *     tags:
     *       - Questions
     *     parameters:
     *       - name: Question
     *         in: body
     *         description: The pet JSON you want to post
     *         schema:
     *           $ref: '#/definitions/Question'
     *     responses:
     *       200:
     *         description: Created
     *       500:
     *         description: Server error
     *
     */
    @httpPost('/')
    public async createQuestion(@request() req: express.Request, @response() res: express.Response) {
        const newQuestion: Question = req.body;
        try {
            const createdUser = await this._questionRepository.create(newQuestion);
            if (createdUser) {
                res.status(200).send({
                    success: true,
                    message: 'Question created',
                    question: createdUser
                });
            }
        } catch (errors) {
            res.status(500).send(errors.toString());
            return;
        }
    }



    /**
   * @swagger
   * /api/questions/{questionId}:
   *   put:
   *     summary: Update Question
   *     description: Update Question
   *     produces:
   *       - application/json
   *     tags:
   *       - Questions
   *     parameters:
   *       - name: questionId
   *         in: path
   *         required: true
   *         type: string
   *       - name: Question
   *         in: body
   *         description: The pet JSON you want to post
   *         schema:
   *           $ref: '#/definitions/Question'
   *     responses:
   *       200:
   *         description: Updated
   *       500:
   *         description: Server error
   *
   */
    @httpPut('/:questionId')
    public async updateQuestion(
        @requestParam('questionId') questionId: string,
        @request() req: express.Request,
        @response() res: express.Response) {
        const updateQuestion: Question = req.body;

        try {
            const question = await this._questionRepository.update(updateQuestion, Number(questionId));
            res.status(200).send({
                success: true,
                message: 'question updated',
                question: question
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
     * /api/questions/{questionId}:
     *   delete:
     *     summary: Deletes question
     *     description: Deletes a question by id, and all accosiated records
     *     produces:
     *       - application/json
     *     tags:
     *       - Questions
     *     parameters:
     *       - name: questionId
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
    @httpDelete('/:questionId')
    public async deleteQuestion(
        @requestParam('questionId') questionId: string,
        @request() req: express.Request,
        @response() res: express.Response) {
        this._questionRepository.delete(questionId).then((effected: Number) => {
            if (effected) {
                res.status(200).send({
                    success: true,
                    message: 'Question deleted.'
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
                message: `question ${questionId} cannot be deleted : ${err}`
            });
        });
    }
}
