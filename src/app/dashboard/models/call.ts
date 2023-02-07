export class Call {
    key: number;
    data: Date;
    responseTime: number;
    error: boolean;

    constructor(_key: number, _data: Date, _responseTime: number, _error: boolean) {
      this.key = _key;
      this.data = _data;
      this.responseTime = _responseTime;
      this.error = _error;
    }
  }