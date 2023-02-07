import { Call } from "./call";

export class AggregatedData {
    time: number;
    totalResponseTime: number;
    totalResponses: number;
    totalErrors: number;
    calls: Call[];

    constructor(_time: number, _totalResponseTime: number, __totalResponses: number,
      _totalErrors: number, _calls: Call[]) {
      this.time = _time;
      this.totalResponseTime = _totalResponseTime;
      this.totalResponses = __totalResponses;
      this.totalErrors = _totalErrors;
      this.calls = _calls;
    }
  }