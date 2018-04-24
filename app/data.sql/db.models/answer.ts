import * as SequelizeStatic from 'sequelize';
import { DataTypes, Sequelize, Instance } from 'sequelize';
import { Answer } from '../../contracts/answer';

export interface AnswerInstance extends Instance<Answer> {
    dataValues: Answer;
}
export default function (sequelize: Sequelize, dataTypes: DataTypes):
    SequelizeStatic.Model<AnswerInstance, Answer> {
    const Companies = sequelize.define<AnswerInstance, Answer>('answer', {
        id: { type: dataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        body: dataTypes.TEXT,
        rating: dataTypes.INTEGER,
        user_id: {
            type: dataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        question_id: {
            type: dataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'questions',
                key: 'id'
            }
        }
    }, {
            indexes: [{
                unique: true,
                method: 'BTREE',
                name: 'index_answer_on_body',
                fields: ['body']
            }],
            timestamps: true,
            underscored: true,
        }
        ,

    );

    return Companies;
}
