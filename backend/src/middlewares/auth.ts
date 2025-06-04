import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Model, Types } from 'mongoose'
import { celebrate, Joi, Segments } from 'celebrate'
import { ACCESS_TOKEN } from '../config'
import ForbiddenError from '../errors/forbidden-error'
import NotFoundError from '../errors/not-found-error'
import UnauthorizedError from '../errors/unauthorized-error'
import UserModel, { Role } from '../models/user'


// есть файл middlewares/auth.js, в нём мидлвэр для проверки JWT;

const auth = async (req: Request, res: Response, next: NextFunction) => {
    let payload: JwtPayload | null = null
    const authHeader = req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedError('Невалидный токен')
    }
    try {
        const accessTokenParts = authHeader.split(' ')
        const aTkn = accessTokenParts[1]
        payload = jwt.verify(aTkn, ACCESS_TOKEN.secret) as JwtPayload

        const user = await UserModel.findOne(
            {
                _id: new Types.ObjectId(payload.sub),
            },
            { password: 0, salt: 0 }
        )

        if (!user) {
            return next(new ForbiddenError('Нет доступа'))
        }
        res.locals.user = user

        return next()
    } catch (error) {
        if (error instanceof Error && error.name === 'TokenExpiredError') {
            return next(new UnauthorizedError('Истек срок действия токена'))
        }
        return next(new UnauthorizedError('Необходима авторизация'))
    }
}

export function roleGuardMiddleware(...roles: Role[]) {
    return (_req: Request, res: Response, next: NextFunction) => {
        if (!res.locals.user) {
            return next(new UnauthorizedError('Необходима авторизация'))
        }

        const hasAccess = roles.some((role) =>
            res.locals.user.roles.includes(role)
        )

        if (!hasAccess) {
            return next(new ForbiddenError('Доступ запрещен'))
        }

        return next()
    }
}

export function currentUserAccessMiddleware<T>(
    model: Model<T>,
    idProperty: string,
    userProperty: keyof T
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params[idProperty]

        if (!res.locals.user) {
            return next(new UnauthorizedError('Необходима авторизация'))
        }

        if (res.locals.user.roles.includes(Role.Admin)) {
            return next()
        }

        const entity = await model.findById(id)

        if (!entity) {
            return next(new NotFoundError('Не найдено'))
        }

        const userEntityId = entity[userProperty] as Types.ObjectId
        const hasAccess = new Types.ObjectId(res.locals.user.id).equals(
            userEntityId
        )

        if (!hasAccess) {
            return next(new ForbiddenError('Доступ запрещен'))
        }

        return next()
    }
}


export const authValidation = {
    login: celebrate({
        [Segments.BODY]: Joi.object({
            email: Joi.string().required().min(3).max(30).trim().messages({
                'string.base': 'Логин должен быть строкой.',
                'string.empty': 'Логин не может быть пустым.',
                'string.min': 'Логин должен содержать не менее {#limit} символов.',
                'string.max': 'Логин должен содержать не более {#limit} символов.',
                'any.required': 'Логин обязателен.',
            }),
            password: Joi.string().required().min(6).messages({
                'string.base': 'Пароль должен быть строкой.',
                'string.empty': 'Пароль не может быть пустым.',
                'string.min': 'Пароль должен содержать не менее {#limit} символов.',
                'any.required': 'Пароль обязателен.',
            }),
        })
            
            .unknown(false)
            .messages({
                'object.unknown': 'Недопустимое поле в теле запроса. Возможно, попытка инъекции.',
            }),
    }),
     register: celebrate({
        [Segments.BODY]: Joi.object({
            email: Joi.string().required().email().trim().messages({
                'string.base': 'Email должен быть строкой.',
                'string.empty': 'Email не может быть пустым.',
                'string.email': 'Email должен быть действительным адресом электронной почты.',
                'any.required': 'Email обязателен.',
            }),
            password: Joi.string().required().min(6).messages({
                'string.base': 'Пароль должен быть строкой.',
                'string.empty': 'Пароль не может быть пустым.',
                'string.min': 'Пароль должен содержать не менее {#limit} символов.',
                'any.required': 'Пароль обязателен.',
            }),

            name: Joi.string().required().min(2).max(100).trim().messages({
                'string.base': 'Имя должно быть строкой.',
                'string.empty': 'Имя не может быть пустым.',
                'string.min': 'Имя должно содержать не менее {#limit} символов.',
                'string.max': 'Имя должно содержать не более {#limit} символов.',
                'any.required': 'Имя обязательно.',
            }),
        })
           
            .unknown(false)
            .messages({
                'object.unknown': 'Недопустимое поле в теле запроса. Возможно, попытка инъекции.',
            }),
    }),
};





export default auth
