import { Container } from 'inversify';
import { interfaces, TYPE } from 'inversify-express-utils';
import { Sequelize } from 'sequelize';
import * as DBSequelize from 'sequelize';
import { config } from './app-config';
import { Environment } from '../common/environments';
import { tagParameter } from 'inversify/dts/annotation/decorator_utils';
import * as fs from 'fs';
import { ExampleService } from '../services/example-service';
import { UserRepository } from '../data.sql/user-repository';
import { CompanyRepository } from '../data.sql/company-repository';
import '../controllers';

// set up container
export const container = new Container();

container.bind<UserRepository>('UserRepository').to(UserRepository).inSingletonScope();
container.bind<CompanyRepository>('CompanyRepository').to(CompanyRepository).inSingletonScope();

container.bind<ExampleService>('ExampleService').to(ExampleService).inSingletonScope();

container.bind<Sequelize>('DmAdminDB').toDynamicValue(() => {
    return new DBSequelize(config.get('DATABASE_URL'), {
        dialect: 'postgres',
        dialectOptions: {
            ssl: JSON.parse(config.get('PGSSL'))
        }
    });
}).inSingletonScope();

container.bind('startupTasks').toDynamicValue((ctx) => {
    const ur = ctx.container.get('UserRepository');
    return [
        ctx.container.get<Sequelize>('DmAdminDB').sync()
    ];
});
