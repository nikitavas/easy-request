
import * as SequelizeStatic from 'sequelize';
import { QueryTypes, Sequelize, Instance, Transaction, UpdateOptions, IncludeOptions, FindOptions } from 'sequelize';
import * as moment from 'moment';
import { UserInstance } from './db.models/user';
import * as  DBSequelize from 'sequelize';
import * as PromiseBb from 'bluebird';
import { injectable, inject } from 'inversify';
import { container } from '../config/ioc-config';
import { Question } from '../contracts/question';
import { QuestionInstance } from './db.models/question';
import { AnswerInstance } from './db.models/answer';
import { Answer } from '../contracts/answer';
import { AnswerRepository } from './answer-repository';


export interface QuestionModels {
    Question: DBSequelize.Model<QuestionInstance, Question>;
}

@injectable()
export class QuestionRepository {

    public models: QuestionModels = ({} as any);

    constructor(
        @inject('DmAdminDB') private _dbConnection: Sequelize,
        @inject('AnswerRepository') private _answerRepository: AnswerRepository,

    ) {
        this.models.Question = this._dbConnection.import('./db.models/question');
        // this._answerRepository.models.Answer.belongsTo(this.models.Question, { foreignKey: 'question_id' });
        this.models.Question.hasMany(this._answerRepository.models.Answer, { foreignKey: 'question_id' });
    }


    /**
     * Returns question from DB by Id
     * @param id
     */
    public getQuestionById(id: string): Promise<Question> {
        const promise = new Promise<Question>((resolve: Function, reject: Function) => {
            return this.models.Question.findById(id).then((question) => {
                resolve(question);
            }).catch((error: Error) => {
                reject(error);
            });
        });
        return promise;
    }

    /**
   * deletes question from DB
   * @param id
   */
    public delete(id: string): PromiseBb<number> {
        return this.models.Question.destroy({
            where: { id: id }
        });
    }


    /**
     * Returns all companies with all data
     */
    public getQuestions(): PromiseBb<Array<QuestionInstance>> {

        const includeOpts: IncludeOptions = {
            // as: 'companies',
            model: this._answerRepository.models.Answer,
        };

        const findOpts: FindOptions = {
            include: [includeOpts],
            order: ['title']
        };
        return this.models.Question.findAll(findOpts);
    }

    /**
     * Create new question
     * @param question
     */
    public async create(question: Question): Promise<Question> {

        const newQuestion = new Question();
        Object.assign(newQuestion, question);

        return this.models.Question.create(newQuestion).then((newCreatedQuestion: any) => {
            return newCreatedQuestion;
        });
    }

    /**
     * Update question
     * @param question
     * @param questionFromDbId
     */
    public update(question: Question, questionFromDbId: number): PromiseBb<Array<any>> {
        const updateQuestion = new Question();
        Object.assign(updateQuestion, question);
        return this.models.Question.update(updateQuestion, { where: { id: questionFromDbId } });
    }
}
