import * as SequelizeStatic from 'sequelize';
import { DataTypes, Sequelize, Instance } from 'sequelize';
import { Question } from '../../contracts/question';

export interface QuestionInstance extends Instance<Question> {
    dataValues: Question;
}
export default function (sequelize: Sequelize, dataTypes: DataTypes):
    SequelizeStatic.Model<QuestionInstance, Question> {
    const Companies = sequelize.define<QuestionInstance, Question>('question', {
        id: { type: dataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title: dataTypes.TEXT,
        body: dataTypes.TEXT,
        company_name: dataTypes.TEXT,
        difficulty: dataTypes.INTEGER,
        user_id: {
            type: dataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        company_id: {
            type: dataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'companies',
                key: 'id'
            }
        }
    }, {
            indexes: [{
                unique: true,
                method: 'BTREE',
                name: 'index_questions_on_title',
                fields: ['title']
            }],
            timestamps: true,
            underscored: true,
        }
        ,

    );

    return Companies;
}
