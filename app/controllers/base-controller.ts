import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { injectable } from 'inversify';
import * as guardCall from 'express-jwt-permissions';

@injectable()
export class BaseController {
    protected static guard = guardCall({
        permissionsProperty: 'scopes'
    });
    protected badRequest(response: Response, errors: string);
    protected badRequest(response: Response, errors: string | ValidationError[]) {
        response.status(400);
        if (typeof errors === 'string') {
            response.send({ errors: errors });
        } else {
            response.send(
                {
                    errors:
                    errors.map(error => {
                        return {
                            property: error.property,
                            value: error.value,
                            errors: (<any>Object).keys(error.constraints).map((k) => error.constraints[k])
                        };
                    })
                }
            );
        }
    }

    protected notFound(response: Response, message: string) {
        response.status(404).send({
            success: false,
            message: message
        });
    }
}
