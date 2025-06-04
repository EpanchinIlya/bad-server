import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
    
    windowMs:  30 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
})
