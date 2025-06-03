import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import path, { join } from 'path'
import * as fs from 'fs'; 

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {


        const uploadDir = join(
            __dirname, 
            process.env.UPLOAD_PATH_TEMP
                ? `../public/${process.env.UPLOAD_PATH_TEMP}`
                : '../public' 
        );

       
        fs.mkdir(uploadDir, { recursive: true }, (err) => {
            if (err) {
                console.error('Ошибка при создании директории:', err);   
                return cb(err, ''); 
            }
            cb(null, uploadDir);
        });
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        
        const ext = path.extname(file.originalname)
        const uniqueSuffix = `${Date.now()  }-${  Math.round(Math.random() * 1E9)}`
        const newFilename = uniqueSuffix + ext
        cb(null, newFilename)
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024; 
const MIN_FILE_SIZE = 2 * 1024; 

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }

     if (file.size < MIN_FILE_SIZE) {
         if (file.size < MIN_FILE_SIZE) {
             return cb(new Error(`Файл слишком маленький. Минимальный размер: ${MIN_FILE_SIZE / 1024} KB.`));
}
    }

    return cb(null, true)
}

export default multer({ storage, limits: { fileSize: MAX_FILE_SIZE }, fileFilter })




