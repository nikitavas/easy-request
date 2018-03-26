import { Container } from 'inversify';
import { interfaces, TYPE } from 'inversify-express-utils';
import { Sequelize } from 'sequelize';
import { config } from './app-config';
import { Environment } from '../common/environments';
import { tagParameter } from 'inversify/dts/annotation/decorator_utils';
import * as fs from 'fs';
import { ValuesController } from '../controllers/values-controller';
import { ExampleService } from '../services/example-service';

// set up container
export const container = new Container();

container.bind<interfaces.Controller>(TYPE.Controller).to(ValuesController).whenTargetNamed('ValuesController');

container.bind<ExampleService>('ExampleService').to(ExampleService).inSingletonScope();
