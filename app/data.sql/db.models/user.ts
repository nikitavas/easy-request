import * as SequelizeStatic from 'sequelize';
import { DataTypes, Sequelize, Instance } from 'sequelize';
import { User } from '../../contracts/user';

export interface UserInstance extends Instance<User> {
    dataValues: User;
}
export default function (sequelize: Sequelize, dataTypes: DataTypes):
    SequelizeStatic.Model<UserInstance, User> {
    const Users = sequelize.define<UserInstance, User>('user', {
        id: { type: dataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        email: { type: dataTypes.STRING, allowNull: false },
        first_name: { type: dataTypes.STRING, allowNull: false },
        last_name: { type: dataTypes.STRING },
        full_name: { type: dataTypes.STRING },
        image_url: { type: dataTypes.STRING, allowNull: true },
        sign_in_count: { type: dataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        last_sign_in_at: { type: dataTypes.DATE },
        about: dataTypes.TEXT,
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
                name: 'index_users_on_email',
                fields: ['email']
            }],
            timestamps: true,
            underscored: true,
        }
        ,

    );

    return Users;
}
