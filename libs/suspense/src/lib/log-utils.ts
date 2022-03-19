export class logger {
  static enableOnly = false;

  static log(...data: unknown[]) {
    if (!this.enableOnly) {
      console.log(...data);
    }
  }

  static error(...data: unknown[]) {
    if (!this.enableOnly) {
      console.error(...data);
    }
  }

  static only(...data: unknown[]) {
    console.log(...data);
  }
}
