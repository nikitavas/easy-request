import * as SequelizeStatic from 'sequelize';
import { DataTypes, Sequelize, Instance } from 'sequelize';
import { Company } from '../../contracts/company';

export interface CompanyInstance extends Instance<Company> {
    dataValues: Company;
}
export default function (sequelize: Sequelize, dataTypes: DataTypes):
    SequelizeStatic.Model<CompanyInstance, Company> {
    const Companies = sequelize.define<CompanyInstance, Company>('company', {
        id: { type: dataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title: dataTypes.TEXT
    }, {
            indexes: [{
                unique: true,
                method: 'BTREE',
                name: 'index_companies_on_title',
                fields: ['title']
            }],
            timestamps: true,
            underscored: true,
        }
        ,

    );

    return Companies;
}
