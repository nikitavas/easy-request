import { injectable } from 'inversify';
import { config } from '../config/app-config';
import { logger } from '../common/logger';
import { Value } from '../contracts/value';

@injectable()
export class ExampleService {
    constructor() {
    }
    public print(val: Value): void {
        console.warn(val.msg, val);
    }
    public sum(val: number, val2: number) {
        return val + val2;
    }
}
