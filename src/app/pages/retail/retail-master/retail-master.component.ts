import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterGridComponent } from 'src/app/shared/common/master-grid/master-grid.component';
import { PosCustomerMasterMainComponent } from './pos-customer-master-main/pos-customer-master-main.component';
import { SchemeMasterComponent } from './scheme-master/scheme-master.component';
import { PosWalkinCustomerComponent } from './pos-walkin-customer/pos-walkin-customer.component';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Colors } from 'src/app/layouts/themes/_themeCode';


@Component({
  selector: 'app-retail-master',
  templateUrl: './retail-master.component.html',
  styleUrls: ['./retail-master.component.scss']
})
export class RetailMasterComponent implements OnInit {
  @ViewChild(MasterGridComponent) masterGridComponent?: MasterGridComponent;
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  //variables
  public colors = Colors;
  menuTitle: string = '';
  apiCtrl: any;
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];
  tableName: any;
  PERMISSIONS: any
  componentName: any;
  private componentDbList: any = {}
  componentSelected: any;
  isCustomerDashboard: boolean = false;
  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    // private ChangeDetector: ChangeDetectorRef, //to detect changes in dom
  ) {
    this.getMasterGridData()
    this.menuTitle = this.CommonService.getModuleName()
    this.componentName = this.CommonService.getFormComponentName();
  }

  ngOnInit(): void {
    if (localStorage.getItem('AddNewFlag') && localStorage.getItem('AddNewFlag') == '1') {
      this.openModalView('Sale')
      localStorage.removeItem('AddNewFlag')
    }
    this.setBarChartOptions();
  }


  /**USE: to get table data from API */
  getMasterGridData(data?: any) {
    if (data) {
      this.menuTitle = data.MENU_CAPTION_ENG;
      this.PERMISSIONS = data.PERMISSION;
    } else {
      this.menuTitle = this.CommonService.getModuleName();
      this.setDashboardLayout(this.menuTitle);

    }
    this.masterGridComponent?.getMasterGridData(data)
  }

  viewRowDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'VIEW'
    this.openModalView(str)
  }
  editRowDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'EDIT'
    this.openModalView(str)
  }
  //  open Jobcard in modal
  openModalView(data?: any) {
    if (data && data == 'Sale') {
      this.menuTitle = data
    }
    let contents: any;
    this.componentDbList = {
      'PosCustomerMaster': PosCustomerMasterMainComponent,
      'SchemeMasterComponent': SchemeMasterComponent,
      'PosWalkinCustomerComponent': PosWalkinCustomerComponent,

      // Add components and update in operationals > menu updation grid form component name
    }
    if (this.componentDbList[this.componentName]) {
      this.componentSelected = this.componentDbList[this.componentName]
    } else {
      this.CommonService.showSnackBarMsg('Module Not Created')
    }

    const modalRef: NgbModalRef = this.modalService.open(this.componentSelected, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'modal-full-width'
    });
    modalRef.result.then((result) => {
      if (result === 'reloadMainGrid') {
        this.getMasterGridData({ HEADER_TABLE: this.CommonService.getqueryParamTable() })
      }
    }, (reason) => {
      // Handle modal dismissal (if needed)
    });
    modalRef.componentInstance.content = data;
  }



  setChartConfig() {
    const articleSold: any = localStorage.getItem('soldItemDetails');
    const collectionbyRevenue: any = localStorage.getItem('collectionWiseData');
    const outofStock: any = localStorage.getItem('outofStock');
    const divisionWiseData: any = localStorage.getItem('divisionWiseData');
    const salebyCity: any = localStorage.getItem('salesbyCity');
    const customerCount: any = localStorage.getItem('customerCountChart');
    const averageTransaction: any = localStorage.getItem('avgTransaction');
    this.articleSoldDetails = JSON.parse(articleSold);
    this.salesbyDivisionDetails = JSON.parse(divisionWiseData);
    this.avgTransacUnitsData = JSON.parse(averageTransaction);
    this.outofStockDetails = JSON.parse(outofStock);
    this.monthlyCustomerDetails = JSON.parse(customerCount);
    this.salesbyCityDetails = JSON.parse(salebyCity);
    this.collectionByRevenue = JSON.parse(collectionbyRevenue);

  }

  setDashboardLayout(screen: any) {

    if (screen == "Customer Master") {
      this.isCustomerDashboard = true;
      this.setChartConfig();
    }

    else
      this.isCustomerDashboard = false;
    localStorage.setItem('screen', screen)
  }


  public collectionByRevenue: ChartConfiguration['data'] = {
    datasets: [
      {
        "data": [],
        "label": "Revenue",
        "backgroundColor": '#336699',
      }
    ],
    labels: []
  };

  public articleSoldDetails: ChartConfiguration['data'] = {
    datasets: [
      {
        "data": [],
        "label": "Sold Items",
        "backgroundColor": '#336699',
      }
    ],
    labels: []
  };



  public chartPlugins = [
    DataLabelsPlugin
  ];

  public doughnutChartType: ChartType = 'doughnut';
  public lineChartType: ChartType = 'line';
  public salesbyDivisionDetails: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };
  

  public avgTransacUnitsData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };
  public salesbyCityDetails: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      { data: [] },
    ],
  };
  public outofStockDetails: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };
  public monthlyCustomerDetails: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };

  public filledLineChartOptions: ChartConfiguration['options'];
  public barchartOptions: ChartConfiguration['options'];
  public transactionUnitLineOptions: ChartConfiguration['options'];
  public doughnutChartOptions: ChartConfiguration['options'];
  public commonBarchartOptions: ChartConfiguration['options'];
  public monthlyCustomerOptions: ChartConfiguration['options'];

  public ChartType: ChartType = 'bar';
  public barChartType: ChartType = 'bar';

  setBarChartOptions() {
    let layoutDataSet = this.getLayoutDataSet('light');

    this.transactionUnitLineOptions = this.createChartOptions(layoutDataSet, { curvedLine: true });

    this.filledLineChartOptions = this.createChartOptions(layoutDataSet, {
      curvedLine: true,  // Curved lines for filled chart
      fill: true,
      // backgroundColor: 'rgba(255, 99, 132, 0.2)',  // Area fill color with transparency
      // borderColor: 'rgba(255, 99, 132, 1)'         // Line color
    });
    this.barchartOptions = this.createChartOptions(layoutDataSet, { curvedLine: false, hideXAxisGrid: true, lineWidth: 0.3 });

    this.doughnutChartOptions = this.createDoughnutChartOptions(layoutDataSet);

    this.monthlyCustomerOptions = this.createChartOptions(layoutDataSet);

    this.commonBarchartOptions = this.createProductChartOptions(layoutDataSet);
  }

  private getLayoutDataSet(theme: 'light' | 'dark') {
    if (theme === 'dark') {
      return { gridLineColor: 'white', LabelColor: 'white', LegendColor: 'white' };
    } else {
      return { gridLineColor: 'grey', LabelColor: 'grey', LegendColor: 'grey' };
    }
  }

  private createChartOptions(layoutDataSet: any, options: any = {}): ChartConfiguration['options'] {
    return {
      responsive: true,
      scales: {
        y: {
          display: true,
          grid: {
            display: true,
            color: layoutDataSet.gridLineColor,
            lineWidth: options.lineWidth || 1
          },
          ticks: {
            color: layoutDataSet.LabelColor,
            callback: (value: any) => this.formatTickValue(value)
          }
        },
        x: {
          grid: {
            display: !options.hideXAxisGrid
          },
          ticks: {
            color: layoutDataSet.LabelColor,
          }
        },
      },
      elements: {
        line: {
          tension: options.curvedLine ? 0.5 : 0,
          fill: options.fill || false,
          backgroundColor: options.backgroundColor || undefined,
          borderColor: options.borderColor || undefined,
        },
        point: {
          radius: 4
        },
      },
      plugins: {
        legend: {
          display: true,
          align: 'center',
          position: 'bottom',
          labels: {
            color: layoutDataSet.LegendColor,
            boxWidth: 8,
            font: {
              size: 12,
            },
            padding: 5,
          },
        },
        datalabels: {
          color: layoutDataSet.LabelColor,
          anchor: 'end',
          align: 'end',
          font: {
            size: 10
          },
          padding: 5,
          formatter: (value: any) => this.formatTickValue(value)
        }
      }
    };
  }

  private createDoughnutChartOptions(layoutDataSet: any): ChartConfiguration['options'] {
    return {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: layoutDataSet.LabelColor,
            padding: 5,
          }
        }
      }
    };
  }

  private createProductChartOptions(layoutDataSet: any): ChartConfiguration['options'] {
    return {
      responsive: true,
      indexAxis: 'y',
      scales: {
        y: {
          grid: {
            display: true
          },
          ticks: {
            color: layoutDataSet.LabelColor,
          }
        },
        x: {
          display: true,
          grid: {
            display: true,
            color: layoutDataSet.gridLineColor,
            lineWidth: 0.3
          },
          ticks: {
            color: layoutDataSet.LabelColor,
            callback: (value: any) => this.formatTickValue(value)
          }
        }
      },
      elements: {
        point: {
          radius: 2
        }
      },
      plugins: {
        legend: {
          display: true,
          align: 'center',
          position: 'bottom',
          labels: {
            color: layoutDataSet.LegendColor,
            boxWidth: 7,
            font: {
              size: 12
            },
            padding: 5
          }
        },
        datalabels: {
          display: true,
          color: 'black',
          anchor: 'end',
          align: 'center',
          font: {
            size: 10
          },
          padding: 5,
          formatter: (value: any) => this.formatTickValue(value)
        }
      }
    };
  }

  private formatTickValue(value: any) {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(2).replace(/\.0$/, '') + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(2).replace(/\.0$/, '') + 'K';
    } else if (value < 1 && value > -1) {
      return value.toFixed(4);
    }
    return value;
  }



}
