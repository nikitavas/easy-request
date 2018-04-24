
import * as SequelizeStatic from 'sequelize';
import { QueryTypes, Sequelize, Instance, Transaction, UpdateOptions, IncludeOptions, FindOptions } from 'sequelize';
import * as moment from 'moment';
import { UserInstance } from './db.models/user';
import * as  DBSequelize from 'sequelize';
import * as PromiseBb from 'bluebird';
import { injectable, inject } from 'inversify';
import { container } from '../config/ioc-config';
import { Answer } from '../contracts/answer';
import { AnswerInstance } from './db.models/answer';


export interface AnswerModels {
    Answer: DBSequelize.Model<AnswerInstance, Answer>;
}

@injectable()
export class AnswerRepository {

    public models: AnswerModels = ({} as any);

    constructor(
        @inject('DmAdminDB') private _dbConnection: Sequelize,

    ) {
        this.models.Answer = this._dbConnection.import('./db.models/answer');
    }


    /**
     * Returns answer from DB by Id
     * @param id
     */
    public getAnswerById(id: string): Promise<Answer> {
        const promise = new Promise<Answer>((resolve: Function, reject: Function) => {
            return this.models.Answer.findById(id).then((answer) => {
                resolve(answer);
            }).catch((error: Error) => {
                reject(error);
            });
        });
        return promise;
    }

    /**
   * deletes answer from DB
   * @param id
   */
    public delete(id: string): PromiseBb<number> {
        return this.models.Answer.destroy({
            where: { id: id }
        });
    }


    /**
     * Returns all companies with all data
     */
    public getAnswers(): PromiseBb<Array<AnswerInstance>> {

        // const includeOpts: IncludeOptions = {
        //     as: 'companies',
        //     model: this.models.Answer,
        // };

        const findOpts: FindOptions = {
            // include: [includeOpts],
            order: ['created_at']
        };
        return this.models.Answer.findAll(findOpts);
    }

    /**
     * Create new answer
     * @param answer
     */
    public async create(answer: Answer): Promise<Answer> {

        const newAnswer = new Answer();
        Object.assign(newAnswer, answer);

        return this.models.Answer.create(newAnswer).then((newCreatedAnswer: any) => {
            return newCreatedAnswer;
        });
    }

    /**
     * Update answer
     * @param answer
     * @param answerFromDbId
     */
    public update(answer: Answer, answerFromDbId: number): PromiseBb<Array<any>> {
        const updateAnswer = new Answer();
        Object.assign(updateAnswer, answer);
        return this.models.Answer.update(updateAnswer, { where: { id: answerFromDbId } });
    }
}
