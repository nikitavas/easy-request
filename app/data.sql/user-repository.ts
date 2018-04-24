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
// import { Role } from '../contracts/role';
// import { GetUsersRequest } from '../contracts/get-users-request';

export interface UserModels {
    User: DBSequelize.Model<UserInstance, User>;
    Company: DBSequelize.Model<CompanyInstance, Company>;
}

@injectable()
export class UserRepository {

    public models: UserModels = ({} as any);

    constructor(
        @inject('DmAdminDB') private _dbConnection: Sequelize,

    ) {
        this.models.User = this._dbConnection.import('./db.models/user');
        this.models.Company = this._dbConnection.import('./db.models/company');
        this.models.User.belongsTo(this.models.Company, { foreignKey: 'company_id', as: 'companies' });
    }
    /**
     * Returns user from DB by email
     * @param email
     */
    public getUserByEmail(email: string): Promise<User> {
        email = email.toLowerCase();
        const promise = new Promise<User>((resolve: Function, reject: Function) => {
            return this.models.User.findOne({
                where: { email: email }
            }).then((user) => {
                const resolv = user ? user.dataValues : null;
                resolve(resolv);
            }).catch((error: Error) => {
                reject(error);
            });
        });
        return promise;
    }

    /**
     * Returns user from DB by Id
     * @param id
     */
    public getUserById(id: string): Promise<User> {
        const promise = new Promise<User>((resolve: Function, reject: Function) => {
            return this.models.User.findById(id).then((user) => {
                resolve(user);
            }).catch((error: Error) => {
                reject(error);
            });
        });
        return promise;
    }

    /**
   * deletes user from DB
   * @param id
   */
    public delete(id: string): PromiseBb<number> {
        return this.models.User.destroy({
            where: { id: id }
        });
    }

    /**
     * Returns effected row number - nik
     * @param user
     */
    public async createOrUpdate(user: UserGoogle | User): Promise<User> {
        const newUser = new User();
        newUser.full_name = user.displayName;
        newUser.first_name = user.displayName.split(' ')[0];
        newUser.last_name = (user.displayName.split(' ')[1]) || '';
        newUser.provider = 'gmail';
        newUser.image_url = user.image;
        newUser.encrypted_password = '';

        const userFromDb = await this.getUserByEmail(user.email);
        if (!userFromDb) {
            newUser.email = user.email;
            newUser.sign_in_count = 1;
            newUser.last_sign_in_at = <any>SequelizeStatic.fn('NOW');
            const userInst: any = await this.models.User.create(newUser);
            return userInst;
        } else {
            newUser.last_sign_in_at = <any>SequelizeStatic.fn('NOW');
            newUser.sign_in_count = userFromDb.sign_in_count + 1;
            const userInst = await this.models.User.update(newUser, {
                where: { email: user.email },
                returning: true
            });
            console.log('Updating user', userInst);
            return userInst[1][0].dataValues;
        }
    }

    /**
     * Returns all users with all data
     */
    public getUsers(): PromiseBb<Array<UserInstance>> {

        const includeOpts: IncludeOptions = {
            as: 'companies',
            model: this.models.Company,
        };

        const findOpts: FindOptions = {
            include: [includeOpts],
            order: ['first_name', 'last_name']
        };
        return this.models.User.findAll(findOpts);
    }

    /**
     * Create new user
     * @param user
     */
    public async create(user: User): Promise<User> {
        if (user.email) { user.email = user.email.toLowerCase(); };
        const newUser = new User();
        Object.assign(newUser, user);
        if (newUser.first_name || newUser.last_name) {
            newUser.full_name = newUser.first_name + ' ' + newUser.last_name;
        }
        newUser.provider = 'gmail';
        newUser.encrypted_password = '';
        return this._dbConnection.transaction((t) => {
            return this.models.User.create(newUser, { transaction: t }).then((updatedUser: any) => {
                // if (newUser.roles) {
                //     return updatedUser.setRoles(newUser.roles, { transaction: t }).then((r) => updatedUser);
                // } else {
                return updatedUser;
                // }
            });
        });
    }

    /**
     * Update user
     * @param user
     * @param userFromDbId
     */
    public update(user: User, userFromDbId: number): PromiseBb<User> {
        if (user.email) { user.email = user.email.toLowerCase(); };
        const updateUser = new User();
        Object.assign(updateUser, user);
        if (updateUser.first_name || updateUser.last_name) {
            updateUser.full_name = updateUser.first_name + ' ' + updateUser.last_name;
        }

        return this.models.User.findById(userFromDbId).then((userFromDb: any) => {
            return userFromDb.update(user).then(async (updatedUser) => {
                // if (user.roles) {
                //     await updatedUser.setRoles(user.roles);
                // }
                return updatedUser.dataValues;
            });
        });
    }
}
