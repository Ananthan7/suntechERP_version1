import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { EventService } from 'src/app/core/services/event.service';
@Component({
  selector: 'app-sales-monitoring',
  templateUrl: './sales-monitoring.component.html',
  styleUrls: ['./sales-monitoring.component.scss']
})
export class SalesMonitoringComponent implements OnInit {
  value: number = 50;

  constructor(
    private eventService: EventService,
  ) { }

  ngOnInit(): void {
    this.getLayoutMode() //set theme mode
  }

  /**chart declarations */
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        "data": [20, 10, 25, 22, 12, 20, 16, 25, 22, 12, 20, 16, 25, 22, 12],
        "label": "aa",
        "backgroundColor": '#3599CC',
        "borderColor": '#3599CC',
        "pointBackgroundColor": '#fff',
        "pointBorderColor": '#3599CC',
        "pointHoverBackgroundColor": '#3599CC',
        "pointHoverBorderColor": '#3599CC',
        "borderWidth": 1
      },
      {
        "data": [10, 7, 16, 8, 11, 12, 21, 14, 16, 12, 20, 16, 11, 13, 11],
        "label": "aa",
        "backgroundColor": '#3599CC',
        "borderColor": '#3599CC',
        "pointBackgroundColor": '#fff',
        "pointBorderColor": '#3599CC',
        "pointHoverBackgroundColor": '#3599CC',
        "pointHoverBorderColor": '#3599CC',
        "borderWidth": 1
      }
    ],
    labels: ['2018', '', '', '2019', '', '', '2020', '', '', '2021', '', '', '', '', '2022']
  };

  // line chart  options
  public lineChartOptions: ChartConfiguration['options'];

  public barChartPlugins = [
    DataLabelsPlugin
  ];
  /**purpose: set chart options */
  getLayoutMode() {
    let layoutmode = document.body.getAttribute('data-layout-mode');
    if (layoutmode) {
      this.setChartOptions(layoutmode)
    }
    // event to get selected mode from rightsidebar
    this.eventService.subscribe('changeMode', (mode) => {
      if (mode) {
        this.setChartOptions(mode)
      }
    });
  }
  /**purpose: set chart options on selected layout mode */
  setChartOptions(layoutmode: any) {
    let layoutDataSet: any = {}
    if (layoutmode == "dark") {
      layoutDataSet.gridLineColor = 'white'
      layoutDataSet.LabelColor = 'white'
      layoutDataSet.LegendColor = '#03273c'
    } else if (layoutmode == 'light') {
      layoutDataSet.gridLineColor = 'grey'
      layoutDataSet.LabelColor = 'grey'
      layoutDataSet.LegendColor = 'white'
    }

    this.lineChartOptions = {
      responsive: true,
      scales: {
        y: {
          display: true,
          grid: {
            display: true,
            color: layoutDataSet.gridLineColor,
            lineWidth: 0.3
            // drawTicks: false
          },
          ticks: {
            color: layoutDataSet.LabelColor,
            // Include a dollar sign in the ticks
            callback: function (value: any, index, ticks) {
              if (value >= 1000000) {
                return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
              }
              if (value >= 1000) {
                return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
              }
              return (value);
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: layoutDataSet.LabelColor,
          }
        },
      },
      elements: {
        point: {
          radius: 2
        },
      },

      plugins: {
        legend: {
          display: true,
          align: 'end',
          labels: {
            color: layoutDataSet.LegendColor,
            boxWidth: 0,
            font: {
              size: 9
            },
            padding: 5,
          }
        },
        datalabels: {
          color: layoutDataSet.LabelColor,
          anchor: 'end',
          align: 'end',
          font: {
            size: 10
          },
          padding: 5,
          formatter: function (value: any) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            }
            if (value >= 1000) {
              return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
            }
            return (value);
          }
        }
      }
    };

  }
}
