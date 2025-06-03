import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { join } from 'path'
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





        // cb(
        //     null,
        //     join(
        //         __dirname,
        //         process.env.UPLOAD_PATH_TEMP
        //             ? `../public/${process.env.UPLOAD_PATH_TEMP}`
        //             : '../public'
        //     )
        // )
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(null, file.originalname)
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }

    return cb(null, true)
}

export default multer({ storage, fileFilter })




