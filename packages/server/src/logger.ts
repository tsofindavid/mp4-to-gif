import debug, { Debugger } from 'debug';

export class Logger {
  private readonly debugError: Debugger;
  private readonly debugLog: Debugger;

  constructor(namespace: string, logger?: Logger) {
    if (logger) {
      this.debugLog = logger.debugLog.extend(`${namespace}`);
      this.debugError = logger.debugLog.extend(`${namespace}:error`);
    } else {
      this.debugLog = debug(`${namespace}`);
      this.debugError = debug(`${namespace}:error`);
    }

    this.debugLog.log = console.info.bind(console);
  }

  public log(message: string): void {
    this.debugLog(message);
  }

  public error(message: string): void {
    this.debugError(message);
  }

}
