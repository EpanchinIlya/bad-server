import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import * as fs from 'fs'; 
import BadRequestError from '../errors/bad-request-error'


const MIN_FILE_SIZE = 2 * 1024; 

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (req.file && req.file.size < MIN_FILE_SIZE) {
            
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Ошибка при удалении маленького файла:', unlinkErr);
            });
            return res.status(400).json({
                success: false,
                message: `Файл слишком маленький. Минимальный размер: ${MIN_FILE_SIZE / 1024} KB.`,
            });
        }
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }
    try {
        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file?.filename}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        console.log("ошибка файла")
        return next(error)
    }
}

export default {}
