import { Joi, celebrate, Segments } from 'celebrate'

export const customerValidation = {
    getCustomers: celebrate({
        [Segments.QUERY]: Joi.object({
            page: Joi.number().integer().min(1).optional().default(1),
            limit: Joi.number().integer().min(1).optional().default(10),
            sortField: Joi.string()
                .valid(
                    'createdAt',
                    'totalAmount',
                    'orderCount',
                    'lastOrderDate',
                    'name',
                    'email'
                )
                .optional()
                .default('createdAt'),
            sortOrder: Joi.string()
                .valid('asc', 'desc')
                .optional()
                .default('desc'),

            registrationDateFrom: Joi.string().isoDate().optional(),
            registrationDateTo: Joi.string().isoDate().optional(),
            lastOrderDateFrom: Joi.string().isoDate().optional(),
            lastOrderDateTo: Joi.string().isoDate().optional(),

            totalAmountFrom: Joi.number().min(0).optional(),
            totalAmountTo: Joi.number().min(0).optional(),
            orderCountFrom: Joi.number().integer().min(0).optional(),
            orderCountTo: Joi.number().integer().min(0).optional(),

            search: Joi.string().trim().optional().allow(''),
        })
            .unknown(false)
            .messages({
                'object.unknown':
                    'Недопустимый параметр запроса. Возможно, попытка инъекции.',
                'string.isoDate':
                    'Дата должна быть в формате ISO 8601 (например, YYYY-MM-DDTHH:mm:ss.sssZ).',
                'number.base': 'Поле должно быть числом.',
                'number.integer': 'Поле должно быть целым числом.',
                'number.min': 'Значение поля не может быть отрицательным.',
            }),
    }),

    getCustomerById: celebrate({
        [Segments.PARAMS]: Joi.object({
            id: Joi.string().hex().length(24).required().messages({
                'string.base': 'ID клиента должен быть строкой.',
                'string.hex': 'ID клиента должен быть шестнадцатеричным.',
                'string.length': 'ID клиента должен содержать 24 символа.',
                'any.required': 'ID клиента обязателен.',
            }),
        }).unknown(false),
        [Segments.QUERY]: Joi.object().unknown(false),
    }),

    updateCustomer: celebrate({
        [Segments.PARAMS]: Joi.object({
            id: Joi.string().hex().length(24).required().messages({
                'string.base': 'ID клиента должен быть строкой.',
                'string.hex': 'ID клиента должен быть шестнадцатеричным.',
                'string.length': 'ID клиента должен содержать 24 символа.',
                'any.required': 'ID клиента обязателен.',
            }),
        }).unknown(false),
        [Segments.BODY]: Joi.object({
            name: Joi.string().trim().min(2).max(100).optional(),
            email: Joi.string().email().optional(),
            role: Joi.string().valid('customer', 'admin').optional(),
        })
            .min(1)
            .unknown(false)
            .messages({
                'object.min':
                    'Тело запроса не может быть пустым для обновления клиента.',
                'object.unknown': 'Недопустимое поле в теле запроса.',
                'string.min':
                    'Поле "{#label}" должно содержать как минимум {#limit} символа.',
                'string.max':
                    'Поле "{#label}" не должно превышать {#limit} символов.',
                'string.email':
                    'Поле "{#label}" должно быть действительным адресом электронной почты.',
            }),
    }),

    deleteCustomer: celebrate({
        [Segments.PARAMS]: Joi.object({
            id: Joi.string().hex().length(24).required().messages({
                'string.base': 'ID клиента должен быть строкой.',
                'string.hex': 'ID клиента должен быть шестнадцатеричным.',
                'string.length': 'ID клиента должен содержать 24 символа.',
                'any.required': 'ID клиента обязателен.',
            }),
        }).unknown(false),
        [Segments.QUERY]: Joi.object().unknown(false), // Запрещает любые query-параметры для DELETE
        [Segments.BODY]: Joi.object().unknown(false), // Запрещает любое тело запроса для DELETE
    }),
}
