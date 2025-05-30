import { Joi, celebrate, Segments } from 'celebrate';

export const orderValidation = {
  // 1. Схема для GET /order/all (контроллер getOrders)
  getAllOrders: celebrate({
    [Segments.QUERY]: Joi.object({
      page: Joi.number().integer().min(1).optional().default(1),
      
      sortField: Joi.string().valid('createdAt', 'totalAmount', 'orderNumber').optional().default('createdAt'),
      sortOrder: Joi.string().valid('asc', 'desc').optional().default('desc'),
      status: Joi.string().valid('new', 'pending', 'completed', 'cancelled').optional(),
      totalAmountFrom: Joi.number().min(0).optional(),
      totalAmountTo: Joi.number().min(0).optional(),
      orderDateFrom: Joi.string().isoDate().optional(),
      orderDateTo: Joi.string().isoDate().optional(),
      search: Joi.string().trim().optional().allow(''),
      
      limit: Joi.number().integer().min(1).optional().default(10),
    }).unknown(false)
      .messages({
        'object.unknown': 'Недопустимый параметр запроса. Возможно, попытка инъекции.',
        'string.isoDate': 'Дата должна быть в формате ISO 8601 (например, YYYY-MM-DDTHH:mm:ss.sssZ).',
      }),
  }),

  // 2. Схема для GET /order/currentuser (контроллер getOrdersCurrentUser)
  getOrdersCurrentUser: celebrate({
    [Segments.QUERY]: Joi.object({
      search: Joi.string().trim().optional().allow(''), // search может быть пустой строкой
      page: Joi.number().integer().min(1).optional().default(1),
      limit: Joi.number().integer().min(1).optional().default(5),
    }).unknown(false) 
      .messages({
        'object.unknown': 'Недопустимый параметр запроса. Возможно, попытка инъекции.',
      }),
  }),

  // 3. Схема для GET /order/:orderNumber (контроллер getOrderByNumber)

  getOrderByNumber: celebrate({
    [Segments.PARAMS]: Joi.object({
      orderNumber: Joi.number().integer().min(1).required().messages({
        'number.base': 'Номер заказа должен быть числом.',
        'number.integer': 'Номер заказа должен быть целым числом.',
        'number.min': 'Номер заказа должен быть положительным.',
        'any.required': 'Номер заказа обязателен.',
      }),
    }).unknown(false), 
    [Segments.QUERY]: Joi.object().unknown(false), 
  }),

  // 4. Схема для GET /order/currentuser/:orderNumber (контроллер getOrderCurrentUserByNumber)
  // Здесь также orderNumber через params.
  getOrderByNumberCurrentUser: celebrate({
    [Segments.PARAMS]: Joi.object({
      orderNumber: Joi.number().integer().min(1).required().messages({
        'number.base': 'Номер заказа должен быть числом.',
        'number.integer': 'Номер заказа должен быть целым числом.',
        'number.min': 'Номер заказа должен быть положительным.',
        'any.required': 'Номер заказа обязателен.',
      }),
    }).unknown(false), // Запрещает любые другие параметры маршрута
    [Segments.QUERY]: Joi.object().unknown(false), // Запрещает любые query-параметры
  }),

};