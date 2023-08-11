import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { ActiveElement, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { EventService } from 'src/app/core/services/event.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SignumCRMApiService } from 'src/app/services/signum-crmapi.service';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
@Component({
  selector: 'app-branchkey-metrics',
  templateUrl: './branchkey-metrics.component.html',
  styleUrls: ['./branchkey-metrics.component.scss']
})
export class BranchkeyMetricsComponent implements OnInit {
  model: any = {}
  tooltipItems: any = {}
  branchResults: any = [];
  monthResults: any = []
  selectedChart: any;
  savedTemplateDatas: any;
  isChartSelected: boolean = false;
  isLoading: boolean = false;
  salesperformanceForm: FormGroup;
  TIME_PERIOD_ACCESS:any = '2023'
  tabledata: any[] = [
    { id: 'CZZ', name: 175, id1: '44.5', GM: '44.5%' },
    { id: 'DM ', name: 175, id1: '44.5', GM: '44.5%' },
    { id: 'MOH', name: 175, id1: '44.5', GM: '44.5%' },
    { id: 'NKM', name: 175, id1: '44.5', GM: '44.5%' },
  ]
  topBottomData: any = [] = [
    { name: "Top", value: "Top" },
    { name: "Bottom", value: "Bottom" }
  ];

  revGpData: any = [] = [
    { name: "Revenue", value: "Revenue" },
    { name: "GP", value: "GP" },
    { name: "GP%", value: "GP%" },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private dataService: SignumCRMApiService,
    private commonService: CommonServiceService,
    public router: Router,
    private zone: NgZone
  ) {
    this.salesperformanceForm = this.formBuilder.group({
      topBottom: [null, [Validators.required]],
      flag: ['N', [Validators.required]],
      ProductsAttribute: ['', [Validators.required]],
      filterData: [null, [Validators.required]],
    });
    this.tooltipItems = this.commonService.getTooltipDescription()
    this.model.monthChartLabel = []
    this.model.branchChartLabel = []
    this.savedTemplateDatas = localStorage.getItem('TEMPLATE_NAME')
  }

  ngOnInit(): void {
    this.getLayoutMode() //set theme mode
    if(this.savedTemplateDatas == 'default'){
      this.getBranchKeyMatricsData()
    }
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
  changeGraphType2(type:any){
    this.lineChartType2 = type
  }
  /**purpose: set zoom view of chart */
  selectChartView(chartname: any) {
    this.isChartSelected = !this.isChartSelected;
    this.selectedChart = chartname
  }
  resetData() {
    this.model.revenueArray = []
    this.model.PY_revenueArray = []
    this.model.PY_revTargetArray = []
    this.model.CY_revTargetArray = []

    this.model.grossMarginArray = []
    this.model.PYgrossMargin = []
    this.model.PYgrossMarginTarget = []
    this.model.CYgrossMarginTarget = []

    this.model.QtySoldArray = []
    this.model.PY_QtySold = []
    this.model.PY_QtySoldTarget = []
    this.model.CY_QtySoldTarget = []

    this.model.COGSArray = []
    this.model.PY_COGSArray = []
    this.model.PY_COGSTarget = []
    this.model.CY_COGSTarget = []
  }
  /** get api data */
  getBranchKeyMatricsData() {
    let API = 'SignumReport/BranchPerformance/BranchKeyMetricsOverallVisual'
    let data = {
      "STRDIVISION": "ALL",
      "STRBRANCH": this.dataService.branchCode || 'ALL',
      "STRSALESMAN": "ALL",
      "STRYEAR": this.TIME_PERIOD_ACCESS,
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
        this.resetData()
        /**response.keyMetricsOverallVisual- result contains YTD data not grouped*/
        this.model.filterResp = response.dynamicData[0]
        this.model.filterResp.forEach((item: any) => {
          this.model.revenueArray.push(item.REVENUE)
          this.model.PY_revenueArray.push(item.PY_REVENUE)
          this.model.PY_revTargetArray.push(item.PY_REV_TARGET)
          this.model.CY_revTargetArray.push(item.CY_REV_TARGET)

          this.model.grossMarginArray.push(item.GROSS_MARGIN)
          this.model.PYgrossMargin.push(item.PY_GROSS_MARGIN)
          this.model.PYgrossMarginTarget.push(item.PY_GM_TARGET)
          this.model.CYgrossMarginTarget.push(item.CY_GM_TARGET)

          this.model.QtySoldArray.push(item.QUANTITY_SOLD)
          this.model.PY_QtySold.push(item.PY_QUANTITY_SOLD)
          this.model.PY_QtySoldTarget.push(item.PY_QTY_SOLD_TARGET)
          this.model.CY_QtySoldTarget.push(item.CY_QTY_SOLD_TARGET)

          this.model.COGSArray.push(item.COGS)
          this.model.PY_COGSArray.push(item.PY_COGS)
          this.model.PY_COGSTarget.push(item.PY_COGS_TARGET)
          this.model.CY_COGSTarget.push(item.CY_COGS_TARGET)
        });
        //finding color by comparing with previous year value
        this.model.revenueColor = this.numberColorFormat(this.model.revenueArray, this.model.PY_revenueArray)
        this.model.GMPercColor = this.numberColorFormat(this.model.grossMarginArray, this.model.PYgrossMargin)
        this.model.QtySoldColor = this.numberColorFormat(this.model.QtySoldArray, this.model.PY_QtySold)
        this.model.cogsColor = this.numberColorFormat(this.model.COGSArray, this.model.PY_COGSArray)

        this.model.sumOfrevenue = this.commonService.sumArray(this.model.revenueArray)
        this.model.sumOfPYrevenue = this.commonService.sumArray(this.model.PY_revenueArray)
        this.model.sumOfPY_revTarget = this.commonService.sumArray(this.model.PY_revTargetArray)
        this.model.sumOfCYrevTarget = this.commonService.sumArray(this.model.CY_revTargetArray)
        this.model.sumOfCYrevTargetPerc = Math.trunc((this.model.sumOfrevenue/this.model.sumOfCYrevTarget)*100)
        this.model.sumOfPYrevTargetPerc = Math.trunc((this.model.sumOfPYrevenue/this.model.sumOfPY_revTarget)*100)

        this.model.sumOfgrossMargin = this.commonService.sumArray(this.model.grossMarginArray)
        this.model.sumOfPYgrossMargin = this.commonService.sumArray(this.model.PYgrossMargin)
        this.model.sumOfPYgrossMarginTarget = this.commonService.sumArray(this.model.PYgrossMarginTarget)
        this.model.sumOfCYgrossMarginTarget = this.commonService.sumArray(this.model.CYgrossMarginTarget)
        this.model.sumOfCYgrossMarginPerc = Math.trunc((this.model.sumOfgrossMargin/this.model.sumOfCYgrossMarginTarget)*100)

        this.model.sumOfQtySold = this.commonService.sumArray(this.model.QtySoldArray)
        this.model.sumOfPY_QtySold = this.commonService.sumArray(this.model.PY_QtySold)
        this.model.sumOfPY_QtySoldTarget = this.commonService.sumArray(this.model.PY_QtySoldTarget)
        this.model.sumOfCY_QtySoldTarget = this.commonService.sumArray(this.model.CY_QtySoldTarget)

        this.model.sumOfCOGS = this.commonService.getCOGSvalue(this.model.grossMarginArray, this.model.revenueArray)
        this.model.sumOfPY_COGSArray = this.commonService.getCOGSvalue(this.model.PYgrossMargin,this.model.PY_revenueArray)
        this.model.sumOfPY_COGSTarget = this.commonService.getCOGSvalue(this.model.PYgrossMarginTarget,this.model.PY_revTargetArray)
        this.model.sumOfCY_COGSTarget = this.commonService.getCOGSvalue(this.model.CYgrossMarginTarget,this.model.CY_revTargetArray)

        this.model.GMpercentage = this.commonService.getGMPercentage(this.model.grossMarginArray, this.model.revenueArray)
        this.model.PYGMpercentage = this.commonService.getGMPercentage(this.model.PYgrossMargin, this.model.PY_revenueArray)
        this.model.PYGMpercentageTGT = this.commonService.getGMPercentage(this.model.PYgrossMarginTarget, this.model.PY_revTargetArray)
        this.model.CYGMpercentageTGT = this.commonService.getGMPercentage(this.model.CYgrossMarginTarget, this.model.CY_revTargetArray)
        
        //GROUP DATA BY BRANCH AND MONTH
        var branchResult: any = [];
        var monthResult: any = []
        this.model.filterResp.reduce(function (res: any, value: any) {
          if (!res[value.BRANCH]) {
            res[value.BRANCH] = {
              BRANCH: value.BRANCH,
              REVENUE: 0,
              GROSS_MARGIN: 0,
              GROSS_MARGIN_PERC: 0
            };
            branchResult.push(res[value.BRANCH])
          }
          if (!res[value.MONTH]) {
            res[value.MONTH] = {
              MONTH: value.MONTH,
              MONTHNO: Number(value.MONTHNO),
              REVENUE: 0,
              GROSS_MARGIN: 0
            };
            monthResult.push(res[value.MONTH])
          }
          res[value.BRANCH].REVENUE += value.REVENUE;
          res[value.BRANCH].GROSS_MARGIN += value.GROSS_MARGIN;
          res[value.BRANCH].GROSS_MARGIN_PERC += value.GROSS_MARGIN_PERC;
          res[value.MONTH].REVENUE += value.REVENUE;
          res[value.MONTH].GROSS_MARGIN += value.GROSS_MARGIN;
          return res;
        }, {});
        this.branchResults = branchResult.sort((a: any, b: any) => b.REVENUE - a.REVENUE );
        this.monthResults = monthResult.sort((a: any, b: any) => a.MONTHNO - b.MONTHNO);
        
        //grid view headers
        this.model.branchGridHeader = ['BRANCH','REVENUE','GROSS MARGIN']
        this.model.monthGridHeader = ['MONTH','REVENUE','GROSS MARGIN']

        this.model.branchChartLabel = []
        this.model.branchRevenue = []
        this.model.branchGM = []
        this.model.branchGMPERC = []
        this.model.monthChartLabel = []
        this.model.monthRevenue = []
        this.model.monthGM = []
        
        this.branchResults.forEach((item: any) => {
          this.model.branchChartLabel.push(item.BRANCH)
          this.model.branchRevenue.push(Math.trunc(item.REVENUE))
          this.model.branchGM.push(Math.trunc(item.GROSS_MARGIN))
          this.model.branchGMPERC.push(Math.trunc(item.GROSS_MARGIN_PERC))
        })
        this.monthResults.forEach((item: any) => {
          this.model.monthChartLabel.push(item.MONTH)
          this.model.monthRevenue.push(Math.trunc(item.REVENUE))
          this.model.monthGM.push(Math.trunc(item.GROSS_MARGIN))
        })
        
        this.lineChartData.labels = this.model.branchChartLabel;
        this.lineChartData.datasets[0].data = this.model.branchRevenue;
        this.lineChartData.datasets[1].data = this.model.branchGM;
        // this.lineChartData.datasets[2].data = this.model.branchGMPERC;

        this.monthChartData.labels = this.model.monthChartLabel;
        this.monthChartData.datasets[0].data = this.model.monthRevenue;
        this.monthChartData.datasets[1].data = this.model.monthGM;
      } else {
        alert('server error')
      }

    }).catch((err:any)=>{
      alert(err)
    })
  }
  setTemplateData(data:any){
    this.savedTemplateDatas = data.istemplateSaved ? data.templateName : null
  }
  resetChartData() {
    this.model.monthChartLabel = []
    this.model.branchChartLabel = []
  }
  /**purpose: filter data from api with selected filters */
  dataToFilter(filters: any) {
    this.resetChartData();
    if (filters.salesmanSelected) {
      filters.salesmanSelected.forEach((item: any, index: any) => {
        item = item.split(" ")[0]
        filters.salesmanSelected[index] = item
      })
    }
    this.setTemplateData(filters)
    let API = 'SignumReport/BranchPerformance/BranchKeyMetricsOverallVisual'
    let data = {
      "STRDIVISION": filters.divisionSelect && filters.divisionSelect != "" ? filters.divisionSelect.toString() : 'ALL',
      "STRBRANCH": filters.branchSelected && filters.branchSelected != "" ? filters.branchSelected.toString() : this.dataService.branchCode,
      "STRSALESMAN": filters.salesmanSelected && filters.salesmanSelected != "" ? filters.salesmanSelected.toString() : "ALL",
      "STRYEAR": filters.yearSelected && filters.yearSelected != "" ? filters.yearSelected.toString() : this.TIME_PERIOD_ACCESS,
      "STRQUARTER": filters.quarterSelected && filters.quarterSelected != "" ? filters.quarterSelected.toString() : "ALL",
      "STRMONTH": filters.monthSelected && filters.monthSelected != "" ? filters.monthSelected.toString() : "ALL",
      "STRFROMDATE": filters.fromDate && filters.fromDate != "" ? filters.fromDate.toString() : "ALL",
      "STRTODATE": filters.toDate && filters.toDate != "" ? filters.toDate.toString() : "ALL",
      "STRBRANDCODE": filters.Brand && filters.Brand != "" ? filters.Brand.toString() : "ALL",
      "STRCOLLECTION": filters.Collection && filters.Collection != "" ? filters.Collection.toString() : "ALL",
      "STRSUBCOLLECTION": filters.SubCollection && filters.SubCollection != "" ? filters.SubCollection.toString() : "ALL",
      "STRCATEGORY": filters.Category && filters.Category != "" ? filters.Category.toString() : "ALL",
      "STRTYPE": filters.Type && filters.Type != "" ? filters.Type.toString() : "ALL",
      "STRSETTING": filters.Setting && filters.Setting != "" ? filters.Setting.toString() : "ALL",
      "STRSTONETYPELOOK": filters.StoneTypeLook && filters.StoneTypeLook != "" ? filters.StoneTypeLook.toString() : "ALL",
      "STRSHAPE": filters.Shape && filters.Shape != "" ? filters.Shape.toString() : "ALL",
      "STRFLUOR": filters.Fluor && filters.Fluor != "" ? filters.Fluor.toString() : "ALL",
      "STRSUPPLIERREFERENCE": filters.SupplierReference && filters.SupplierReference != "" ? filters.SupplierReference.toString() : "ALL",
      "STRSUPPLIERCODE": filters.SupplierCode && filters.SupplierCode != "" ? filters.SupplierCode.toString() : "ALL",
      "STRSELLINGPRICERANGE": filters.SellingPriceRange && filters.SellingPriceRange != "" ? filters.SellingPriceRange.toString() : "ALL"
    }
    this.isLoading = true;
    this.dataService.postDynamicAPI(API, data).then((response: any) => {
      this.isLoading = false;
      if (response) {
        this.resetData()
        /**response.keyMetricsOverallVisual- result contains YTD data not grouped*/
        this.model.filterResp = response.dynamicData[0]
        this.model.filterResp.forEach((item: any) => {
          this.model.revenueArray.push(item.REVENUE)
          this.model.PY_revenueArray.push(item.PY_REVENUE)
          this.model.PY_revTargetArray.push(item.PY_REV_TARGET)
          this.model.CY_revTargetArray.push(item.CY_REV_TARGET)

          this.model.grossMarginArray.push(item.GROSS_MARGIN)
          this.model.PYgrossMargin.push(item.PY_GROSS_MARGIN)
          this.model.PYgrossMarginTarget.push(item.PY_GM_TARGET)
          this.model.CYgrossMarginTarget.push(item.CY_GM_TARGET)

          this.model.QtySoldArray.push(item.QUANTITY_SOLD)
          this.model.PY_QtySold.push(item.PY_QUANTITY_SOLD)
          this.model.PY_QtySoldTarget.push(item.PY_QTY_SOLD_TARGET)
          this.model.CY_QtySoldTarget.push(item.CY_QTY_SOLD_TARGET)

          this.model.COGSArray.push(item.COGS)
          this.model.PY_COGSArray.push(item.PY_COGS)
          this.model.PY_COGSTarget.push(item.PY_COGS_TARGET)
          this.model.CY_COGSTarget.push(item.CY_COGS_TARGET)
        });
        //finding color by comparing with previous year value
        this.model.revenueColor = this.numberColorFormat(this.model.revenueArray, this.model.PY_revenueArray)
        this.model.GMPercColor = this.numberColorFormat(this.model.grossMarginArray, this.model.PYgrossMargin)
        this.model.QtySoldColor = this.numberColorFormat(this.model.QtySoldArray, this.model.PY_QtySold)
        this.model.cogsColor = this.numberColorFormat(this.model.COGSArray, this.model.PY_COGSArray)

        this.model.sumOfrevenue = this.commonService.sumArray(this.model.revenueArray)
        this.model.sumOfPYrevenue = this.commonService.sumArray(this.model.PY_revenueArray)
        this.model.sumOfPY_revTarget = this.commonService.sumArray(this.model.PY_revTargetArray)
        this.model.sumOfCYrevTarget = this.commonService.sumArray(this.model.CY_revTargetArray)

        this.model.sumOfgrossMargin = this.commonService.sumArray(this.model.grossMarginArray)
        this.model.sumOfPYgrossMargin = this.commonService.sumArray(this.model.PYgrossMargin)
        this.model.sumOfPYgrossMarginTarget = this.commonService.sumArray(this.model.PYgrossMarginTarget)
        this.model.sumOfCYgrossMarginTarget = this.commonService.sumArray(this.model.CYgrossMarginTarget)

        this.model.sumOfQtySold = this.commonService.sumArray(this.model.QtySoldArray)
        this.model.sumOfPY_QtySold = this.commonService.sumArray(this.model.PY_QtySold)
        this.model.sumOfPY_QtySoldTarget = this.commonService.sumArray(this.model.PY_QtySoldTarget)
        this.model.sumOfCY_QtySoldTarget = this.commonService.sumArray(this.model.CY_QtySoldTarget)

        this.model.sumOfCOGS = this.commonService.getCOGSvalue(this.model.grossMarginArray, this.model.revenueArray)
        this.model.sumOfPY_COGSArray = this.commonService.getCOGSvalue(this.model.PYgrossMargin,this.model.PY_revenueArray)
        this.model.sumOfPY_COGSTarget = this.commonService.getCOGSvalue(this.model.PYgrossMarginTarget,this.model.PY_revTargetArray)
        this.model.sumOfCY_COGSTarget = this.commonService.getCOGSvalue(this.model.CYgrossMarginTarget,this.model.CY_revTargetArray)

        this.model.GMpercentage = this.commonService.getGMPercentage(this.model.grossMarginArray, this.model.revenueArray)
        this.model.PYGMpercentage = this.commonService.getGMPercentage(this.model.PYgrossMargin, this.model.PY_revenueArray)
        this.model.PYGMpercentageTGT = this.commonService.getGMPercentage(this.model.PYgrossMarginTarget, this.model.PY_revTargetArray)
        this.model.CYGMpercentageTGT = this.commonService.getGMPercentage(this.model.CYgrossMarginTarget, this.model.CY_revTargetArray)
        
        //GROUP DATA BY BRANCH AND MONTH
        var branchResult: any = [];
        var monthResult: any = []
        this.model.filterResp.reduce(function (res: any, value: any) {
          if (!res[value.BRANCH]) {
            res[value.BRANCH] = {
              BRANCH: value.BRANCH,
              REVENUE: 0,
              GROSS_MARGIN: 0,
              GROSS_MARGIN_PERC: 0
            };
            branchResult.push(res[value.BRANCH])
          }
          if (!res[value.MONTH]) {
            res[value.MONTH] = {
              MONTH: value.MONTH,
              MONTHNO: Number(value.MONTHNO),
              REVENUE: 0,
              GROSS_MARGIN: 0
            };
            monthResult.push(res[value.MONTH])
          }
          res[value.BRANCH].REVENUE += value.REVENUE;
          res[value.BRANCH].GROSS_MARGIN += value.GROSS_MARGIN;
          res[value.BRANCH].GROSS_MARGIN_PERC += value.GROSS_MARGIN_PERC;
          res[value.MONTH].REVENUE += value.REVENUE;
          res[value.MONTH].GROSS_MARGIN += value.GROSS_MARGIN;
          return res;
        }, {});
        this.branchResults = branchResult.sort((a: any, b: any) => b.REVENUE - a.REVENUE );
        this.monthResults = monthResult.sort((a: any, b: any) => a.MONTHNO - b.MONTHNO);
        
        //grid view headers
        this.model.branchGridHeader = ['BRANCH','REVENUE','GROSS MARGIN']
        this.model.monthGridHeader = ['MONTH','REVENUE','GROSS MARGIN']

        this.model.branchChartLabel = []
        this.model.branchRevenue = []
        this.model.branchGM = []
        this.model.branchGMPERC = []
        this.model.monthChartLabel = []
        this.model.monthRevenue = []
        this.model.monthGM = []
        
        this.branchResults.forEach((item: any) => {
          this.model.branchChartLabel.push(item.BRANCH)
          this.model.branchRevenue.push(Number(item.REVENUE.toFixed(1)))
          this.model.branchGM.push(Number(item.GROSS_MARGIN.toFixed(1)))
          this.model.branchGMPERC.push(Number(item.GROSS_MARGIN_PERC.toFixed(1)))
        })
        this.monthResults.forEach((item: any) => {
          this.model.monthChartLabel.push(item.MONTH)
          this.model.monthRevenue.push(Number(item.REVENUE.toFixed(1)))
          this.model.monthGM.push(Number(item.GROSS_MARGIN.toFixed(1)))
        })
        
        this.lineChartData.labels = this.model.branchChartLabel;
        this.lineChartData.datasets[0].data = this.model.branchRevenue;
        this.lineChartData.datasets[1].data = this.model.branchGM;
        // this.lineChartData.datasets[2].data = this.model.branchGMPERC;

        this.monthChartData.labels = this.model.monthChartLabel;
        this.monthChartData.datasets[0].data = this.model.monthRevenue;
        this.monthChartData.datasets[1].data = this.model.monthGM;
      } else {
        alert('server error')
      }

    }).catch((err:any)=>{
      alert('Data Not Available'+ err)
    })
  }

  numberColorFormat(sumarray: any, PYarray: any) {
    if (this.commonService.sumArray(sumarray) > this.commonService.sumArray(PYarray)) {
      return true
    } else {
      return false
    }
  }
  
  


  /**chart declarations */
  public lineChartType: ChartType = 'bar';
  public lineChartType2: ChartType = 'bar';
  public doughnutChartType: ChartType = 'doughnut';

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        "data": [],
        "label": "Revenue",
        "backgroundColor": '#336699',
        "borderColor": '#336699',
      },
      {
        "data": [],
        "label": "Gross Margin",
        "backgroundColor": '#3599CC',
        "borderColor": '#3599CC',
      },
      // {
      //   "data": [],
      //   "label": "GrossMargin%",
      //   "backgroundColor": '#000',
      //   "borderColor": '#000',
      //   "type": "line",
      // }
    ],
    labels: []
  };

  public monthChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        "data": [],
        "label": "Revenue",
        "backgroundColor": '#336699',
        "borderColor": '#336699',
      },
      {
        "data": [],
        "label": "Gross Margin",
        "backgroundColor": '#3599CC',
        "borderColor": '#3599CC',
      }
    ],
    labels: []
  };

  public doughnutChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        "data": [10, 22, 20, 12],
        "label": "Revenue",
        "backgroundColor": ['#336699', '#1BB2FF', '#0D96FA', '#3599CC'],
      }

    ],
    labels: ['P1', 'P2', 'P3', 'P4']
  };

  // line chart  options
  public lineChartOptions: ChartConfiguration['options'];
  public monthChartOptions: ChartConfiguration['options'];

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
    this.lineChartOptions = {
      onClick: (
        event: ChartEvent,
        elements: ActiveElement[]
        // chart: Chart<'bar'>
      ) => {
        if (elements[0]) {
          this.zone.run(() => {
            this.router.navigate(['/branchperformance/SelectedBranch/', this.lineChartData.labels![elements[0].index]]);

          });
        }
      },
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
            // color: layoutDataSet.LegendColor,
            boxWidth: 7,
            font: {
              size: 10
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
    //chartoption change
    this.monthChartOptions = {
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
            // color: layoutDataSet.LegendColor,
            boxWidth: 7,
            font: {
              size: 10
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
