import { Logger } from './logger';

export {};

declare global {
  namespace Express {
    export interface Request {
      requestId: string;
      requestLogger: Logger;
    }
  }
}
