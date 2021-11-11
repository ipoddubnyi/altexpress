import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export function Validate<T extends Validator>(type: new() => T): any {
    const v = new type();
    return v.validate.bind(v);
}

export class Validator {
    protected async run(req: Request): Promise<void> {}

    public async validate(req: Request, res: Response, next: NextFunction): Promise<any> {
        await this.run(req);

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
    
        const extractedErrors: object[] = [];
        errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
    
        //return res.status(400).json({ errors: result.array() });
        return res.status(422).json({
            errors: extractedErrors
        });
    }
}
