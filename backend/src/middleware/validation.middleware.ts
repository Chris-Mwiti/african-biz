import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export const validationMiddleware = (type: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(type, req.body);
    validate(dto).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints || {})).join(', ');
        console.log(`validation error messages: ${message}`)
        res.status(400).json({ message });
      } else {
        req.body = dto;
        next();
      }
    });
  };
};
