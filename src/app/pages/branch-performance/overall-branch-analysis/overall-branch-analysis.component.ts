import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SignumCRMApiService } from 'src/app/services/signum-crmapi.service';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
@Component({
  selector: 'app-overall-branch-analysis',
  templateUrl: './overall-branch-analysis.component.html',
  styleUrls: ['./overall-branch-analysis.component.scss']
})
export class OverallBranchAnalysisComponent implements OnInit {
  model: any = {}
  branchResults: any = [];
  monthResults: any = []
  selectedChart: any;
  savedTemplateDatas: any;
  isChartSelected: boolean = false;
  isLoading: boolean = false;
  TIME_PERIOD_ACCESS:any = localStorage.getItem('TIME_PERIOD_ACCESS') ? localStorage.getItem('TIME_PERIOD_ACCESS') : 'ALL'
  tabledata: any[] = [
    {id: 'MOE',name: 175,id1: '44.5',GM: '44.5%'},
    {id: 'DM ',name: 175,id1: '44.5',GM: '44.5%'},
    {id: 'MOH',name: 175,id1: '44.5',GM: '44.5%'},
    {id: 'NKM',name: 175,id1: '44.5',GM: '44.5%'},
    {id: 'NKM',name: 175,id1: '44.5',GM: '44.5%'},
  ]
  yearData:any = localStorage.getItem('TIME_PERIOD_ACCESS')?.split(',')
  yearFiltered:any = '2023'
  constructor(
    private eventService: EventService,
    private dataService: SignumCRMApiService,
    private commonService: CommonServiceService,
  ) {
    this.savedTemplateDatas = localStorage.getItem('TEMPLATE_NAME')
  }

  ngOnInit(): void {
    if(this.savedTemplateDatas == 'default'){
    this.getAPIData()
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
  yearFilterChange(data:any){
    this.yearFiltered = data
    this.dataToFilter({yearSelected: data})
  }
  /**purpose: refresh button click */
  refreshBtnClick() {
    console.log('btn clicked');
  }

  exportbtnClick() {
    this.commonService.exportExcel(this.model.filterResp, 'OverallBranchAnalysis');
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
    } else if (data.value <= 1000 && data.value >= 1){
      return (Math.trunc(data.value)).toString();
    }
    return (data.value.toString());
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
    this.model.filterResp = []
  }
  /** get api data */
  getAPIData() {
    let API = 'SignumReport/BranchPerformance/BranchKeyMetricsOverallVisual'
    let data = {
      "STRDIVISION": "ALL",
      "STRBRANCH": this.dataService.branchCode || 'ALL',
      "STRSALESMAN": "ALL",
      "STRYEAR": this.yearFiltered,
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

        this.model.sumOfQtySold = this.commonService.sumArray(this.model.QtySoldArray)
        this.model.sumOfPY_QtySold = this.commonService.sumArray(this.model.PY_QtySold)
        this.model.sumOfPY_QtySoldTarget = this.commonService.sumArray(this.model.PY_QtySoldTarget)
        this.model.sumOfCY_QtySoldTarget = this.commonService.sumArray(this.model.CY_QtySoldTarget)

        this.model.sumOfCOGS = this.commonService.getCOGSvalue(this.model.grossMarginArray,this.model.revenueArray)
        this.model.sumOfPY_COGSArray = this.commonService.getCOGSvalue(this.model.PYgrossMargin,this.model.PY_revenueArray)
        this.model.sumOfPY_COGSTarget = this.commonService.getCOGSvalue(this.model.PYgrossMarginTarget,this.model.PY_revTargetArray)
        this.model.sumOfCY_COGSTarget = this.commonService.getCOGSvalue(this.model.CYgrossMarginTarget,this.model.CY_revTargetArray)

        this.model.GMpercentage = this.commonService.getGMPercentage(this.model.grossMarginArray, this.model.revenueArray)
        this.model.PYGMpercentage = this.commonService.getGMPercentage(this.model.PYgrossMargin, this.model.PY_revenueArray)
        this.model.PYGMpercentageTGT = this.commonService.getGMPercentage(this.model.PYgrossMarginTarget, this.model.PY_revTargetArray)
        this.model.CYGMpercentageTGT = this.commonService.getGMPercentage(this.model.CYgrossMarginTarget, this.model.CY_revTargetArray)
        
        var branchResult: any = [];
        this.model.filterResp.reduce(function (res: any, value: any) {
          if (!res[value.BRANCH]) {
            res[value.BRANCH] = {
              BRANCH: value.BRANCH,
              YEAR: value.YEAR,
              REVENUE: 0,
              PY_REVENUE: 0,
              GROSS_MARGIN: 0,
              PY_GROSS_MARGIN: 0,
              QUANTITY_SOLD: 0,
              PY_QUANTITY_SOLD: 0,
              COGS: 0,
              PY_COGS: 0,
            };
            branchResult.push(res[value.BRANCH])
          }
          res[value.BRANCH].REVENUE += value.REVENUE;
          res[value.BRANCH].PY_REVENUE += value.PY_REVENUE;
          res[value.BRANCH].GROSS_MARGIN += value.GROSS_MARGIN;
          res[value.BRANCH].PY_GROSS_MARGIN += value.PY_GROSS_MARGIN;
          res[value.BRANCH].QUANTITY_SOLD += value.QUANTITY_SOLD;
          res[value.BRANCH].PY_QUANTITY_SOLD += value.PY_QUANTITY_SOLD;
          res[value.BRANCH].COGS += value.COGS;
          res[value.BRANCH].PY_COGS += value.PY_COGS;
          return res;
        }, {});
        this.branchResults = branchResult.sort((a: any, b: any) => b.REVENUE - a.REVENUE);
       
      } else {
        alert('server error')
      }

    }).catch((err:any)=>{
      alert('Data Not Available' +err)
    })
  }
  setTemplateData(data:any){
    // this.savedTemplateDatas = data.istemplateSaved ? data.templateName : null
  }
  /**purpose: filter data from api with selected filters */
  dataToFilter(filters: any) {
    this.resetData();
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
      "STRYEAR": filters.yearSelected && filters.yearSelected != "" ? filters.yearSelected.toString() : this.yearFiltered,
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

        this.model.sumOfCOGS = this.commonService.getCOGSvalue(this.model.grossMarginArray,this.model.revenueArray)
        this.model.sumOfPY_COGSArray = this.commonService.getCOGSvalue(this.model.PYgrossMargin,this.model.PY_revenueArray)
        this.model.sumOfPY_COGSTarget = this.commonService.getCOGSvalue(this.model.PYgrossMarginTarget,this.model.PY_revTargetArray)
        this.model.sumOfCY_COGSTarget = this.commonService.getCOGSvalue(this.model.CYgrossMarginTarget,this.model.CY_revTargetArray)

        this.model.GMpercentage = this.commonService.getGMPercentage(this.model.grossMarginArray, this.model.revenueArray)
        this.model.PYGMpercentage = this.commonService.getGMPercentage(this.model.PYgrossMargin, this.model.PY_revenueArray)
        this.model.PYGMpercentageTGT = this.commonService.getGMPercentage(this.model.PYgrossMarginTarget, this.model.PY_revTargetArray)
        this.model.CYGMpercentageTGT = this.commonService.getGMPercentage(this.model.CYgrossMarginTarget, this.model.CY_revTargetArray)
        
        var branchResult: any = [];
        this.model.filterResp.reduce(function (res: any, value: any) {
          if (!res[value.BRANCH]) {
            res[value.BRANCH] = {
              BRANCH: value.BRANCH,
              YEAR: value.YEAR,
              REVENUE: 0,
              PY_REVENUE: 0,
              GROSS_MARGIN: 0,
              PY_GROSS_MARGIN: 0,
              QUANTITY_SOLD: 0,
              PY_QUANTITY_SOLD: 0,
              COGS: 0,
              PY_COGS: 0,
            };
            branchResult.push(res[value.BRANCH])
          }
          res[value.BRANCH].REVENUE += value.REVENUE;
          res[value.BRANCH].PY_REVENUE += value.PY_REVENUE;
          res[value.BRANCH].GROSS_MARGIN += value.GROSS_MARGIN;
          res[value.BRANCH].PY_GROSS_MARGIN += value.PY_GROSS_MARGIN;
          res[value.BRANCH].QUANTITY_SOLD += value.QUANTITY_SOLD;
          res[value.BRANCH].PY_QUANTITY_SOLD += value.PY_QUANTITY_SOLD;
          res[value.BRANCH].COGS += value.COGS;
          res[value.BRANCH].PY_COGS += value.PY_COGS;
          return res;
        }, {});
        this.branchResults = branchResult.sort((a: any, b: any) => b.REVENUE - a.REVENUE);
       
      } else {
        alert('server error')
      }

    }).catch((err:any)=>{
      alert('Data Not Available' +err)
    })
  }

  numberColorFormat(sumarray: any, PYarray: any) {
    if (this.commonService.sumArray(sumarray) > this.commonService.sumArray(PYarray)) {
      return true
    } else {
      return false
    }
  }

  formattedSumOfGM(grossMarginArray: any, revArray: any) {
    let sumdata: any = this.commonService.sumArray(grossMarginArray) / this.commonService.sumArray(revArray) * 100
    sumdata = sumdata.toFixed(2)
    return Number(sumdata)
  }
}