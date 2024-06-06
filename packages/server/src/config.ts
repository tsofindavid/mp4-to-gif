import * as process from 'process';
import { join } from 'path';

export class Config {
  public static readonly PORT: number = +process.env.PORT || 3000;
  private static readonly NODE_ENV: string = process.env.NODE_ENV || 'production';
  private static readonly TMP_PATH: string = process.env.TMP_PATH;

  public static get tmp(): string {
    if (this.NODE_ENV !== 'production') {
      return join(process.cwd(), 'tmp');
    }

    if (this.TMP_PATH) {
      return this.TMP_PATH;
    }

    return '/home/node/tmp';
  }
}
