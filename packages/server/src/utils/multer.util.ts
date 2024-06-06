import { Request, Response } from 'express';
import multer, { diskStorage, StorageEngine } from 'multer';
import { Config } from '../config';

export class MulterUtil {
  private static get storage(): StorageEngine {
    return diskStorage({
      destination: (req, file, cb) => {
        cb(null, Config.tmp);
      },

      filename: (req, file, cb) => {
        return cb(null, `${req.requestId}.mp4`);
      },
    });
  }

  public static async upload(req: Request, res: Response, filePath: string = 'file'): Promise<void> {
    return new Promise((resolve, reject) => {
      multer({ storage: MulterUtil.storage }).single(filePath)(req, res, (error: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(null);
        }
      });
    });
  }
}
