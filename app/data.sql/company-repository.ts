import { User } from '../contracts/user';
import * as SequelizeStatic from 'sequelize';
import { QueryTypes, Sequelize, Instance, Transaction, UpdateOptions, IncludeOptions, FindOptions } from 'sequelize';
import { UserGoogle } from '../contracts/user-google';
import * as moment from 'moment';
import { UserInstance } from './db.models/user';
import * as  DBSequelize from 'sequelize';
import * as PromiseBb from 'bluebird';
import { injectable, inject } from 'inversify';
import { UserRoleRepository } from './user-role-repository';
import { RoleRepository } from './role-repository';
import { container } from '../config/ioc-config';
import { Company } from '../contracts/company';
import { CompanyInstance } from './db.models/company';


export interface CompanyModels {
    Company: DBSequelize.Model<CompanyInstance, Company>;
}

@injectable()
export class CompanyRepository {

    public models: CompanyModels = ({} as any);

    constructor(
        @inject('DmAdminDB') private _dbConnection: Sequelize,

    ) {
        this.models.Company = this._dbConnection.import('./db.models/company');
    }


    /**
     * Returns company from DB by Id
     * @param id
     */
    public getCompanyById(id: string): Promise<Company> {
        const promise = new Promise<Company>((resolve: Function, reject: Function) => {
            return this.models.Company.findById(id).then((company) => {
                resolve(company);
            }).catch((error: Error) => {
                reject(error);
            });
        });
        return promise;
    }

    /**
   * deletes company from DB
   * @param id
   */
    public delete(id: string): PromiseBb<number> {
        return this.models.Company.destroy({
            where: { id: id }
        });
    }


    /**
     * Returns all companies with all data
     */
    public getCompanies(): PromiseBb<Array<CompanyInstance>> {

        // const includeOpts: IncludeOptions = {
        //     as: 'companies',
        //     model: this.models.Company,
        // };

        const findOpts: FindOptions = {
            // include: [includeOpts],
            order: ['title']
        };
        return this.models.Company.findAll(findOpts);
    }

    /**
     * Create new company
     * @param company
     */
    public async create(company: Company): Promise<Company> {

        const newCompany = new Company();
        Object.assign(newCompany, company);

        return this.models.Company.create(newCompany).then((newCreatedCompany: any) => {
            return newCreatedCompany;
        });
    }

    /**
     * Update user
     * @param user
     * @param userFromDbId
     */
    public update(company: Company, companyFromDbId: number): PromiseBb<Array<any>> {
        const updateCompany = new Company();
        Object.assign(updateCompany, company);
        return this.models.Company.update(updateCompany, { where: { id: companyFromDbId } });
    }
}
