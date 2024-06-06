import express, { Application, Request, Response } from 'express';
import { mkdir, rm } from 'fs/promises';
import { Config } from './config';
import { Logger } from './logger';
import { MulterUtil } from './utils/multer.util';
import { FfmpegUtil } from './utils/ffmpeg.util';
import { v4 as uuid } from 'uuid';
import { join } from 'path';

const statusStore: Record<string, { status: 'error' | 'inProgress' | 'done' }> = {};

export class Main {
  private readonly application: Application = express();
  private readonly logger: Logger = new Logger('app:server');


  public async run(): Promise<void> {
    await this.initStorage();

    this.initMiddlewares();
    this.initRoutes();


    this.application.listen(Config.PORT, () => {
      this.logger.log(`Application run on port: ${Config.PORT}`);
    });
  }

  private async initStorage(): Promise<void> {
    await mkdir(Config.tmp, { recursive: true });
  }

  private initMiddlewares(): void {
    this.application.use(express.static('public'));
    this.application.use((req: Request, res: Response, next) => {
      res.header('Access-Control-Allow-Origin', '*');

      req.requestId = uuid();
      req.requestLogger = new Logger(req.requestId, this.logger);

      res.on('close', () => {
        req.requestLogger.log(`${req.method} ${res.statusCode} ${req.path}`);
      });

      next();
    });
  }

  private initRoutes(): void {
    this.application.post('/upload', this.fileUpload);
  }

  private async fileUpload(req: Request, res: Response): Promise<void> {

    await MulterUtil.upload(req, res);

    req.requestLogger.log('Video uploaded.');

    const { format: { duration }, streams } = await FfmpegUtil.ffprobe(req.file.path);

    const { height, width } = streams.find(stream => stream.codec_type === 'video');

    if (duration > 60 || width > 1024 || height > 724) {
      req.requestLogger.log('Unsupported video format.');

      await rm(`${req.requestId}.mp4`);

      res.status(400).send({
        message: 'Unsupported video format.',
      });

      return;
    }

    statusStore[req.requestId] = { status: 'inProgress' };

    res.status(200).send({ jobId: req.requestId });

    req.requestLogger.log('Start conversion to gif...');

    const inputFilePath: string = join(Config.tmp, `${req.requestId}.mp4`);
    const outputFilePath: string = join(Config.tmp, `${req.requestId}.gif`);

    await FfmpegUtil.ffmpegToGif(inputFilePath, outputFilePath)
      .then(() => {
        req.requestLogger.log('Completed conversion to gif.');
        statusStore[req.requestId].status = 'done';
      })
      .catch(({ message }) => {
        req.requestLogger.error(`Failed conversion to gif. Error: ${message}`);
        statusStore[req.requestId].status = 'error';
      });

    await rm(inputFilePath);
    req.requestLogger.log('Video was removed.');

    delete statusStore[req.requestId];
  }
}

new Main().run();
