import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import * as fs from 'fs'
import sharp from 'sharp'
import BadRequestError from '../errors/bad-request-error'

const MIN_FILE_SIZE = 2 * 1024

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.file || !req.file.size) {
            return next(new BadRequestError('Файл не загружен'))
        }

        if (req.file.size < MIN_FILE_SIZE) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr)
                    console.error(
                        'Ошибка при удалении маленького файла:',
                        unlinkErr
                    )
            })
            return next(
                new BadRequestError(
                    `Файл слишком маленький. Минимальный размер: ${MIN_FILE_SIZE / 1024} KB.`
                )
            )
        }
        const tempFilePath = req.file.path
        const metadata = await sharp(tempFilePath).metadata()

        console.log('Метаданные изображения:', metadata)
        if (metadata.width === undefined || metadata.height === undefined) {
            return next(
                new BadRequestError(
                    'Не удалось получить размеры изображения. Возможно, файл поврежден или не является изображением.'
                )
            )
        }
        if (
            !['jpeg', 'png', 'gif', 'webp'].includes(metadata.format as string)
        ) {
            return next(
                new BadRequestError(
                    `Недопустимый формат изображения: ${metadata.format}.`
                )
            )
        }

        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file?.filename}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}

// ==================

// // controllers/upload.ts (или где у вас обрабатывается загрузка)
// import { Request, Response } from 'express'
// import sharp from 'sharp' // Импортируем sharp
// import path from 'path'
// import fs from 'fs/promises' // Для работы с файловой системой

// export const uploadFile = async (req: Request, res: Response) => {
//     if (!req.file) {
//         return res.status(400).json({ message: 'Файл не загружен.' })
//     }

//     const originalFileName = req.file.originalname;
//     const tempFilePath = req.file.path; // Путь к временно сохраненному файлу Multer'ом

//     try {
//         // 1. Проверка метаданных и структуры изображения с помощью sharp
//         const metadata = await sharp(tempFilePath).metadata();

//         // Пример проверки метаданных:
//         console.log('Метаданные изображения:', metadata);
//         if (metadata.width === undefined || metadata.height === undefined) {
//             // Это может случиться, если файл не является корректным изображением
//             throw new Error('Не удалось получить размеры изображения. Возможно, файл поврежден или не является изображением.');
//         }
//         if (!['jpeg', 'png', 'gif', 'webp'].includes(metadata.format as string)) {
//              throw new Error(`Недопустимый формат изображения: ${metadata.format}.`);
//         }
//         if (metadata.size && metadata.size > 10 * 1024 * 1024) { // Максимум 10MB
//             throw new Error('Размер файла превышает допустимый лимит (10MB).');
//         }
//         // Можно также проверять exif-данные, если они присутствуют
//         // if (metadata.exif) {
//         //    console.log('EXIF data:', metadata.exif);
//         // }

//         // 2. Генерация уникального имени и перемещение файла
//         const ext = path.extname(originalFileName);
//         const uniqueSuffix = `<span class="math-inline">\{Date\.now\(\)\}\-</span>{Math.round(Math.random() * 1E9)}`;
//         const newFilename = `<span class="math-inline">\{uniqueSuffix\}</span>{ext}`;
//         const targetDir = path.join(__dirname, '../public/uploads'); // Новая папка для постоянного хранения
//         const targetPath = path.join(targetDir, newFilename);

//         // Убедимся, что целевая директория существует
//         await fs.mkdir(targetDir, { recursive: true });

//         // Перемещаем файл из временной директории в постоянную
//         await fs.rename(tempFilePath, targetPath);

//         // 3. Отправляем успешный ответ
//         res.status(200).json({
//             message: 'Файл успешно загружен и проверен!',
//             filename: newFilename,
//             filepath: `/uploads/${newFilename}`, // Путь для доступа с фронтенда
//             metadata: {
//                 width: metadata.width,
//                 height: metadata.height,
//                 format: metadata.format,
//                 size: metadata.size
//             }
//         });

//     } catch (error: any) {
//         console.error('Ошибка при обработке загруженного файла:', error.message);

//         // Удаляем временно сохраненный файл, если произошла ошибка
//         if (tempFilePath) {
//             try {
//                 await fs.unlink(tempFilePath);
//                 console.log('Временный файл удален:', tempFilePath);
//             } catch (unlinkError) {
//                 console.error('Ошибка при удалении временного файла:', unlinkError);
//             }
//         }

//         return res.status(400).json({ message: `Ошибка при обработке файла: ${error.message}` });
//     }
// }
