import * as express from 'express';
import { Request, Response } from 'express';
import { controller, httpPost, requestParam, queryParam, httpGet, response, request, httpPut, httpDelete } from 'inversify-express-utils';
import { config } from '../config/app-config';
import { inject } from 'inversify';
import { BaseController } from './base-controller';
import * as _ from 'lodash';
import { UserRepository } from '../data.sql/user-repository';
import { transformAndValidate } from 'class-transformer-validator';
import * as jwtTool from 'jsonwebtoken';
import * as moment from 'moment';
import { Company } from '../contracts/company';
import { CompanyRepository } from '../data.sql/company-repository';


@controller('/api/companies')
export class CompaniesController extends BaseController {

    constructor(
        @inject('CompanyRepository') private _companyRepository: CompanyRepository) {
        super();
    }

    /**
     * @swagger
     * /api/companies:
     *   get:
     *     summary: Get all companies
     *     description: Get all companies
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: companieName
     *         in: query
     *         required: false
     *         type: string
     *     tags:
     *       - Companies
     *     responses:
     *       200:
     *         description: List of users
     *
     */
    @httpGet('/')
    public getAllCompanies(@request() req: express.Request, @response() res: express.Response) {
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
        this._companyRepository.getCompanies().then(companies => {
            res.json(companies);
        });
    }



    /**
     * @swagger
     * /api/companies/{companyId}:
     *   get:
     *     summary: Get a company by ID
     *     description: Get company by id
     *     produces:
     *       - application/json
     *     tags:
     *       - Companies
     *     parameters:
     *       - name: companyId
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Company
     *       500:
     *         description: Server error
     *
     */
    @httpGet('/:companyId')
    public async getCompanyById(@requestParam('companyId') companyId: string, @response() res: express.Response) {
        try {
            const company = await this._companyRepository.getCompanyById(companyId);
            if (company) {
                res.json(company);
            } else {
                res.status(404).send({
                    success: false,
                    message: `Company not found.`
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
     * /api/companies:
     *   post:
     *     summary: Create new company
     *     description: Create new company
     *     produces:
     *       - application/json
     *     tags:
     *       - Companies
     *     parameters:
     *       - name: Company
     *         in: body
     *         description: The pet JSON you want to post
     *         schema:
     *           $ref: '#/definitions/Company'
     *     responses:
     *       200:
     *         description: Created
     *       500:
     *         description: Server error
     *
     */
    @httpPost('/')
    public async createCompany(@request() req: express.Request, @response() res: express.Response) {
        const newCompany: Company = req.body;
        try {
            const createdUser = await this._companyRepository.create(newCompany);
            if (createdUser) {
                res.status(200).send({
                    success: true,
                    message: 'Company created',
                    company: createdUser
                });
            }
        } catch (errors) {
            res.status(500).send(errors.toString());
            return;
        }
    }



    /**
   * @swagger
   * /api/companies/{companyId}:
   *   put:
   *     summary: Update Company
   *     description: Update Company
   *     produces:
   *       - application/json
   *     tags:
   *       - Companies
   *     parameters:
   *       - name: companyId
   *         in: path
   *         required: true
   *         type: string
   *       - name: Company
   *         in: body
   *         description: The pet JSON you want to post
   *         schema:
   *           $ref: '#/definitions/Company'
   *     responses:
   *       200:
   *         description: Updated
   *       500:
   *         description: Server error
   *
   */
    @httpPut('/:companyId')
    public async updateCompany(
        @requestParam('companyId') companyId: string,
        @request() req: express.Request,
        @response() res: express.Response) {
        const updateCompany: Company = req.body;

        try {
            const company: Company = await this._companyRepository.update(updateCompany, Number(companyId));
            res.status(200).send({
                success: true,
                message: 'company updated',
                company: company
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
     * /api/companies/{companyId}:
     *   delete:
     *     summary: deletes copany
     *     description: deletes a copany by id, and all accosiated records
     *     produces:
     *       - application/json
     *     tags:
     *       - Companies
     *     parameters:
     *       - name: companyId
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
    @httpDelete('/:companyId')
    public async deleteCompany(
        @requestParam('companyId') companyId: string,
        @request() req: express.Request,
        @response() res: express.Response) {
        this._companyRepository.delete(companyId).then((effected: Number) => {
            if (effected) {
                res.status(200).send({
                    success: true,
                    message: 'Company deleted.'
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
                message: `company ${companyId} cannot be deleted : ${err}`
            });
        });
    }
}
