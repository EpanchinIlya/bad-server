import { Router } from 'express'
import { customerValidation } from '../middlewares/customersValidation'
import { Role } from '../models/user'
import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import auth, { roleGuardMiddleware } from '../middlewares/auth'

const customerRouter = Router()

customerRouter.get(
    '/',
    auth,
    customerValidation.getCustomers,
    roleGuardMiddleware(Role.Admin),
    getCustomers
)
customerRouter.get(
    '/:id',
    auth,
    customerValidation.getCustomerById,
    roleGuardMiddleware(Role.Admin),
    getCustomerById
)
customerRouter.patch(
    '/:id',
    auth,
    customerValidation.updateCustomer,
    roleGuardMiddleware(Role.Admin),
    updateCustomer
)
customerRouter.delete(
    '/:id',
    auth,
    customerValidation.deleteCustomer,
    roleGuardMiddleware(Role.Admin),
    deleteCustomer
)

export default customerRouter
