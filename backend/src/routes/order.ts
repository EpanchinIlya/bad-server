import { Router } from 'express'
import { orderValidation } from '../middlewares/breakingection'
import {
    createOrder,
    deleteOrder,
    getOrderByNumber,
    getOrderCurrentUserByNumber,
    getOrders,
    getOrdersCurrentUser,
    updateOrder,
} from '../controllers/order'
import { roleGuardMiddleware } from '../middlewares/auth'
import { validateOrderBody } from '../middlewares/validations'
import { Role } from '../models/user'


const orderRouter = Router()

orderRouter.post('/', validateOrderBody, createOrder)
orderRouter.get('/all', orderValidation.getAllOrders, getOrders)
orderRouter.get('/all/me', orderValidation.getOrdersCurrentUser, getOrdersCurrentUser)
orderRouter.get('/:orderNumber', orderValidation.getOrderByNumber, roleGuardMiddleware(Role.Admin), getOrderByNumber)
orderRouter.get('/me/:orderNumber', orderValidation.getOrderByNumberCurrentUser, getOrderCurrentUserByNumber)
orderRouter.patch('/:orderNumber', roleGuardMiddleware(Role.Admin), updateOrder)
orderRouter.delete('/:id', roleGuardMiddleware(Role.Admin), deleteOrder)

export default orderRouter
