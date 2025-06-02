import { Joi, celebrate, Segments } from 'celebrate';


export const orderValidation = {

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



  getOrderByNumberCurrentUser: celebrate({
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

 
  updateOrder: celebrate({
    [Segments.PARAMS]: Joi.object({
      orderNumber: Joi.number().integer().min(1).required().messages({
        'number.base': 'Номер заказа должен быть числом.',
        'number.integer': 'Номер заказа должен быть целым числом.',
        'number.min': 'Номер заказа должен быть положительным.',
        'any.required': 'Номер заказа обязателен.',
      }),
    }).unknown(false),
    [Segments.BODY]: Joi.object({
      status: Joi.string().valid('new', 'pending', 'completed', 'cancelled').required().messages({
        'any.only': 'Статус заказа может быть только одним из: new, pending, completed, cancelled.',
        'any.required': 'Статус заказа обязателен.',
      }),
    }).min(1).unknown(false)
      .messages({
        'object.min': 'Тело запроса не может быть пустым.',
        'object.unknown': 'Недопустимое поле в теле запроса.',
      }),
  }),

  
  deleteOrder: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string().hex().length(24).required().messages({
        'string.base': 'ID заказа должен быть строкой.',
        'string.hex': 'ID заказа должен быть шестнадцатеричным.',
        'string.length': 'ID заказа должен содержать 24 символа.',
        'any.required': 'ID заказа обязателен.',
      }),
    }).unknown(false),
    [Segments.QUERY]: Joi.object().unknown(false), // Запрещает любые query-параметры для DELETE
    [Segments.BODY]: Joi.object().unknown(false), // Запрещает любое тело запроса для DELETE
  }),

};