import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SignumCRMApiService } from 'src/app/services/signum-crmapi.service';
import { ActiveElement, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { EventService } from 'src/app/core/services/event.service';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
@Component({
  selector: 'app-selected-branch',
  templateUrl: './selected-branch.component.html',
  styleUrls: ['./selected-branch.component.scss']
})
export class SelectedBranchComponent implements OnInit {
  branch: any = '';
  value: number = 50;
  model: any = {}
  isLoading: boolean = false;
  selectedChart: any;
  isChartSelected: boolean = false;
  tabledata: any[] = [
    { id: 'Brand 1', name: 175, id1: '44.5', GM: '44.5%' },
    { id: 'Brand 2 ', name: 175, id1: '44.5', GM: '44.5%' },
    { id: 'Brand 3', name: 175, id1: '44.5', GM: '44.5%' },
    { id: 'Brand 4', name: 175, id1: '44.5', GM: '44.5%' },
  ]
  constructor(
    public route: ActivatedRoute,
    private dataService: SignumCRMApiService,
    private commonService: CommonServiceService,
    private eventService: EventService,
    public router: Router,
  ) {
    this.branch = this.route.snapshot.paramMap.get('branch')
    this.getBranchKeyMatricsData(this.branch)
  }

  ngOnInit(): void {
    this.getLayoutMode() //set theme mode
  }
  backBtnClick(){
    console.log('btn clicked');
    this.router.navigate(['/branchperformance/branchkeymetrics/']);
  }
  @ViewChild("content", { static: true }) el!: ElementRef<HTMLImageElement>;
  exportPdf() {
    html2canvas(this.el.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg");
      const pdf = new jsPDF({
        orientation: "portrait",
      });
      const imageProps = pdf.getImageProperties(imgData);
      const pdfw = pdf.internal.pageSize.getWidth();
      const pdfh = (imageProps.height * pdfw) / imageProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfw, pdfh);
      pdf.save("screen.pdf");
    });
  }
  /**purpose: refresh button click */
  refreshBtnClick() {
    console.log('btn clicked');
  }

  exportbtnClick() {
    this.commonService.exportExcel(this.model.filterResp, 'BranchKeyMetrics');
  }

  changeGraphType(type:any){
    this.lineChartType = type
  }
  /**purpose: set zoom view of chart */
  selectChartView(chartname: any) {
    this.isChartSelected = !this.isChartSelected;
    this.selectedChart = chartname
  }
  /** get api data */
  getBranchKeyMatricsData(branch: any) {
    let API = 'SignumReport/BranchPerformance/BranchKeyMetricsOverallVisual'
    let data = {
      "STRDIVISION": "ALL",
      "STRBRANCH": branch || 'ALL',
      "STRSALESMAN": "ALL",
      "STRYEAR": "ALL",
      "STRQUARTER": "ALL",
      "STRMONTH": "ALL",
      "STRFROMDATE": "ALL",
      "STRTODATE": "ALL",
      "STRBRANDCODE": "ALL",
      "STRCOLLECTION": "ALL",
      "STRSUBCOLLECTION": "ALL",
      "STRCATEGORY": "ALL",
      "STRTYPE": "ALL",
      "STRSETTING": "ALL",
      "STRSTONETYPELOOK": "ALL",
      "STRSHAPE": "ALL",
      "STRFLUOR": "ALL",
      "STRSUPPLIERREFERENCE": "ALL",
      "STRSUPPLIERCODE": "ALL",
      "STRSELLINGPRICERANGE": "ALL"
    }
    this.isLoading = true;
    this.dataService.postDynamicAPI(API, data).then((response: any) => {
      this.isLoading = false;
      if (response) {
        this.model.filterResp = response.dynamicData[1]
        this.model.revenueArray = []
        this.model.grossMarginArray = []
        this.model.avgSellPrice = []
        let currentQuarterArr:any = this.model.filterResp.filter((item: any,index:any) => index == this.model.filterResp.length - 1)
        let currentQuarter:any = currentQuarterArr ? currentQuarterArr[0].QUARTER : 0
        
        this.model.filterResp.forEach((item: any,index:any) => {
          if(currentQuarter == item.QUARTER){
            this.model.revenueArray.push(item.REVENUE)
            this.model.grossMarginArray.push(item.GROSS_MARGIN)
          }
          this.model.avgSellPrice.push(Math.trunc(item.REVENUE / item.QUANTITY_SOLD))
        });
        this.model.sumOfrevenue = this.commonService.sumArray(this.model.revenueArray)
        this.model.sumOfavgSellPrice = this.commonService.avgOfArray(this.model.avgSellPrice)

        this.model.GMpercentage = this.formattedSumOfGM(this.model.grossMarginArray, this.model.revenueArray)
        //GROUP DATA BY BRANCH AND MONTH
        var SALESMANResult: any = [];
        this.model.filterResp.reduce(function (res: any, value: any) {
          if (!res[value.SALESMAN]) {
            res[value.SALESMAN] = {
              SALESMAN: value.SALESMAN,
              REVENUE: 0,
              CY_REV_TARGET: 0,
              QUANTITY_SOLD: 0,
              AVERAGE_SELLING_PRICE: []
            };
            SALESMANResult.push(res[value.SALESMAN])
          }
          res[value.SALESMAN].REVENUE += value.REVENUE;
          res[value.SALESMAN].CY_REV_TARGET += value.CY_REV_TARGET;
          res[value.SALESMAN].QUANTITY_SOLD += value.QUANTITY_SOLD;
          res[value.SALESMAN].AVERAGE_SELLING_PRICE.push(value.AVERAGE_SELLING_PRICE);
          return res;
        }, {});
        

        SALESMANResult.forEach((item: any, index: any) => {
          item.QUANTITY_SOLD = Math.trunc(item.QUANTITY_SOLD)
          item.AVERAGE_SELLING_PRICE = Math.trunc(item.REVENUE / item.QUANTITY_SOLD)
          item.REVENUE_PERC = Math.trunc(item.REVENUE / item.CY_REV_TARGET * 100)
          item.AVG_SELL_VALUE = Math.trunc((item.REVENUE / item.QUANTITY_SOLD) * 100)
          item.CY_REV_TARGET = item.CY_REV_TARGET;
          item.AVGSELLPRICE = item.AVERAGE_SELLING_PRICE;
        })
        
        this.model.salesManData = SALESMANResult ? SALESMANResult : []
        SALESMANResult = SALESMANResult.sort((a:any,b:any)=> b.AVERAGE_SELLING_PRICE - a.AVERAGE_SELLING_PRICE)
        this.model.salesManHeader = ['SALESMAN','AVERAGE SELLING PRICE']
        this.lineChartData.labels =  SALESMANResult.map((item: any) => item.SALESMAN);
        this.lineChartData.datasets[0].data = SALESMANResult.map((item: any) => item.AVERAGE_SELLING_PRICE);
        // this.branchResults = branchResult
      }
    })
    .catch((err:any)=>{
      alert(err)
    });
    
  }
  customizeText(data: any) {
    if (data.value >= 1000000) {
      // Convert to millions
      const millions = data.value / 1000000;
      const decimalPlaces = 2
      const multiplier = Math.pow(10, decimalPlaces);
      const roundedValue = Math.floor(millions * multiplier) / multiplier;
      return roundedValue.toFixed(decimalPlaces) + "M";
    } else if (data.value >= 1000) {
      // Convert to thousands
      const thousands = data.value / 1000;
      const decimalPlaces = 1
      const multiplier = Math.pow(10, decimalPlaces);
      const roundedValue = Math.floor(thousands * multiplier) / multiplier;
      return roundedValue.toFixed(decimalPlaces) + "K";
    } 
    return (data.value.toString());
  }
  formattedSumOfGM(grossMarginArray: any, revArray: any) {
    let sumdata: any = this.commonService.sumArray(grossMarginArray) / this.commonService.sumArray(revArray) * 100
    sumdata = sumdata.toFixed(1)
    return sumdata
  }

  /**chart declarations */
  public lineChartType: ChartType = 'bar';

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        "data": [],
        "label": "AverageSellingPrice",
        "backgroundColor": '#336699',
        "borderColor": '#336699',
      }
    ],
    labels: []
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
    //chartoption change
    //chartoption change
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
