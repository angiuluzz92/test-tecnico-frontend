import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AggregatedData } from './models/aggregatedData';
import { Call } from './models/call';

const httpOptions = {
  headers: new HttpHeaders({
    'accept':  'application/json',
    'x-api-key':  'BigProfiles-API',
    'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  baseUrl: string = 'http://localhost:8000/api/v1';

  constructor(private _http: HttpClient) { }

  Ingest(Key: number, Message: string): Observable<any> {
    let url = this.baseUrl + '/ingest';
    let body = {
      key: Key,
      payload: Message,
    };
    
    return this._http.post(url, body, httpOptions);
  }

  Retrieve(dataInizio: Date, dataFine:Date) : Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('x-api-key', 'BigProfiles-API');

    return this._http.get(this.baseUrl + '/retrieve?date_from=' + dataInizio.toString + '&date_to=' + dataFine.toString, {headers});
  }

  RetrieveMock(dataInizio: Date, dataFine:Date) : AggregatedData {
    var temp_dataInizio: Date = new Date(dataInizio);
    var temp_calls: Call[] = [];
    var diff =(dataFine.getTime() - dataInizio.getTime()) / 1000;
    diff /= 60;
    var diffMinutes = Math.abs(Math.round(diff));
    
    for (let i = 0; i < diffMinutes; i++) {
      var totCalls = Math.floor(Math.random() * 40) + 1;
      
      for (let j = 0; j < totCalls; j++) {
        temp_calls.push(
            {
              'key': Math.floor(Math.random() * 6) + 1,
              'data':  new Date(dataInizio.getTime() + i*60000),
              'responseTime': Math.floor(Math.random() * 20) + 1,
              'error': Math.random() < 0.5
            }
          );
      }
      temp_dataInizio.setDate( dataInizio.getDate() + 1 );
    }
    var aggregatedData: AggregatedData = new AggregatedData(
        Math.floor(Math.random() * 20) + 1,
        temp_calls.map(item => item.responseTime).reduce((prev, next) => prev + next),
        temp_calls.filter(x => x.error == false).length,
        temp_calls.filter(x => x.error == true).length,
        temp_calls
      );

      return aggregatedData;
  }
}
