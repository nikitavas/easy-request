import * as express from 'express';
import { Request, Response } from 'express';
import { controller, httpPost, requestParam, queryParam, httpGet, response, request, httpPut, httpDelete } from 'inversify-express-utils';
import { config } from '../config/app-config';
import { inject } from 'inversify';
import { BaseController } from './base-controller';
import * as _ from 'lodash';
import { UserRepository } from '../data.sql/user-repository';
import { User } from '../contracts/user';

import { transformAndValidate } from 'class-transformer-validator';

import * as jwtTool from 'jsonwebtoken';
import * as moment from 'moment';


@controller('/api/users')
export class UsersController extends BaseController {

    constructor(
        @inject('UserRepository') private _userRepository: UserRepository) {
        super();
    }

    /**
     * @swagger
     * /api/users:
     *   get:
     *     summary: Get all users
     *     description: Get all users
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: roleName
     *         in: query
     *         required: false
     *         type: string
     *     tags:
     *       - Users
     *     responses:
     *       200:
     *         description: List of users
     *
     */
    @httpGet('/')
    public getAllUsers(@request() req: express.Request, @response() res: express.Response) {
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
        this._userRepository.getUsers().then(users => {
            res.json(users);
        });
    }

    /**
     * @swagger
     * /api/users/session:
     *   get:
     *     summary: return user session
     *     description: return user session
     *     produces:
     *       - application/json
     *     tags:
     *       - Users
     *     responses:
     *       200:
     *         description: user session
     *
     */
    @httpGet('/session')
    public async getUserSession(@request() req: Request, @response() res: express.Response) {
        if (res.locals.user) {
            const out = JSON.parse(JSON.stringify(res.locals.user));
            res.json(out);
        } else {
            res.json({ success: false, message: 'Something went wrong.' });
        }
    }

    /**
     * @swagger
     * /api/users/{userId}:
     *   get:
     *     summary: Get a user by ID
     *     description: Get user by id
     *     produces:
     *       - application/json
     *     tags:
     *       - Users
     *     parameters:
     *       - name: userId
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: User
     *       500:
     *         description: Server error
     *
     */
    @httpGet('/:userId')
    public async getUserById(@requestParam('userId') userId: string, @response() res: express.Response) {
        try {
            const user = await this._userRepository.getUserById(userId);
            if (user) {
                res.json(user);
            } else {
                res.status(404).send({
                    success: false,
                    message: `User not found.`
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
     * /api/users:
     *   post:
     *     summary: Create new user
     *     description: Create new user
     *     produces:
     *       - application/json
     *     tags:
     *       - Users
     *     parameters:
     *       - name: User
     *         in: body
     *         description: The pet JSON you want to post
     *         schema:
     *           $ref: '#/definitions/User'
     *     responses:
     *       200:
     *         description: Created
     *       500:
     *         description: Server error
     *
     */
    @httpPost('/')
    public async createUser(@request() req: express.Request, @response() res: express.Response) {
        const newUser: User = req.body;
        try {
            const createdUser = await this._userRepository.create(newUser);
            if (createdUser) {
                res.status(200).send({
                    success: true,
                    message: 'User created',
                    user: createdUser
                });
            }
        } catch (errors) {
            res.status(500).send(errors.toString());
            return;
        }
    }



    /**
   * @swagger
   * /api/users/{userId}:
   *   put:
   *     summary: Update user
   *     description: Update user
   *     produces:
   *       - application/json
   *     tags:
   *       - Users
   *     parameters:
   *       - name: userId
   *         in: path
   *         required: true
   *         type: string
   *       - name: User
   *         in: body
   *         description: The pet JSON you want to post
   *         schema:
   *           $ref: '#/definitions/User'
   *     responses:
   *       200:
   *         description: Updated
   *       500:
   *         description: Server error
   *
   */
    @httpPut('/:userId')
    public async updateUser(
        @requestParam('userId') userId: string,
        @request() req: express.Request,
        @response() res: express.Response) {
        const updateUser: User = req.body;

        try {
            const user: User = await this._userRepository.update(updateUser, Number(userId));
            res.status(200).send({
                success: true,
                message: 'User updated',
                user: user
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
     * /api/users/{userId}:
     *   delete:
     *     summary: deletes user
     *     description: deletes a user by id, and all accosiated records
     *     produces:
     *       - application/json
     *     tags:
     *       - Users
     *     parameters:
     *       - name: userId
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
    @httpDelete('/:userId')
    public async deleteUser(
        @requestParam('userId') userId: string,
        @request() req: express.Request,
        @response() res: express.Response) {
        this._userRepository.delete(userId).then((effected: Number) => {
            if (effected) {
                res.status(200).send({
                    success: true,
                    message: 'User deleted.'
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
                message: `user ${userId} cannot be deleted : ${err}`
            });
        });
    }
}
