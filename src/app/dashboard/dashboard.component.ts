import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DashboardService } from './dashboard.service';
import { AggregatedData } from './models/aggregatedData';
import { Call } from './models/call';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  showGraphs: boolean = false;
  dataInizio: any;
  dataFine: any;

  numChiamateTotali: number = 0;
  chiamateTotali: string = "Chiamate Totali: " + this.numChiamateTotali;

  numErroriTotali: number = 0;
  erroriTotali: string = "Errori Totali: " + this.numErroriTotali;

  numtempoResiduoMedio: number = 0;
  tempoResiduoMedio: string = "Tempo Residuo Medio: " + this.numtempoResiduoMedio;

  elencoChiamate: Call[] = [];
  graficoChiamate: any[] = [];
  graficoPercentualeErrori: any[] = [];
  graficoDistribuzioneValori: any[] = [];

  constructor(private _service: DashboardService){}

  ngOnInit(): void {

  }

  getServerData(){
    var retrieveData;
    
    this._service.Retrieve(this.dataInizio, this.dataFine).subscribe(res => {
      retrieveData = res
      //associare i dati alle variabili corrispondenti per mostrarle sul frontend
    }, err => {
      //TODO gestire errore del servizio
    });
  }

  getServerDataMock(){
    var retrieveData: AggregatedData = this._service.RetrieveMock(this.dataInizio, this.dataFine);

    this.numChiamateTotali = retrieveData.totalResponses;
    this.chiamateTotali = "Chiamate Totali: " + this.numChiamateTotali;
    this.numErroriTotali = retrieveData.totalErrors;
    this.erroriTotali = "Errori Totali: " + this.numErroriTotali;
    this.numtempoResiduoMedio = retrieveData.totalResponseTime;
    this.tempoResiduoMedio = "Tempo Residuo Medio: " + this.numtempoResiduoMedio;
    
    this.buildGraphs(retrieveData);
    this.showGraphs = true;
    this.elencoChiamate = retrieveData.calls.reverse().slice(0, 10);
  }

  buildGraphs(retrieveData: AggregatedData)
  {
    //grafico a torta
    this.graficoPercentualeErrori = 
    [
      {
        'name': "Inseriti", 
        'value': retrieveData.totalResponses
      },
      {
        'name': "Errori", 
        'value': retrieveData.totalErrors
      }
    ];

    //grafico a distribuzione per key
      this.graficoDistribuzioneValori = 
      [
        {
          'name': "1",
          'value': retrieveData.calls.filter(x => x.key == 1).length,
        },
        {
          'name': "2",
          'value': retrieveData.calls.filter(x => x.key == 2).length,
        },
        {
          'name': "3",
          'value': retrieveData.calls.filter(x => x.key == 3).length,
        },
        {
          'name': "4",
          'value': retrieveData.calls.filter(x => x.key == 4).length,
        },
        {
          'name': "5",
          'value': retrieveData.calls.filter(x => x.key == 5).length,
        },
        {
          'name': "6",
          'value': retrieveData.calls.filter(x => x.key == 6).length,
        }
      ];

    //grafico a linee temporali
    var chiamatePerMinuto: Date[] = [];
    chiamatePerMinuto.push(retrieveData.calls[0].data);
    var currentMinuto: number = chiamatePerMinuto[0].getMinutes();
    var currentChiamate: number = 0;
    var currentSeries: any[] = [];

    retrieveData.calls.forEach(function(e, idx, array){
      if(e.data.getMinutes() == currentMinuto)
      {
        currentChiamate++;
      }
      else
      {
        currentSeries.push({
          'name': e.data.toLocaleTimeString(),
          'value': currentChiamate
        });
        currentChiamate = 0;
        currentMinuto++;
      }

      if (idx + 1 === array.length){ 
        //last iteration
        currentSeries.push({
          'name': e.data.toLocaleTimeString(),
          'value': currentChiamate
        });
        currentChiamate = 0;
        currentMinuto++;
    }
    });

    this.graficoChiamate = [
      {name: "Chiamate nel tempo",
      series: currentSeries}
    ];
  }

  addEventInizio(type: string, event: MatDatepickerInputEvent<Date>) {
    this.dataInizio = event.value;
  }

  addEventFine(type: string, event: MatDatepickerInputEvent<Date>) {
    this.dataFine = event.value;
  }  
}
