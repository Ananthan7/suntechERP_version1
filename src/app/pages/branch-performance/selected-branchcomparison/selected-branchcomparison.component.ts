import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SignumCRMApiService } from 'src/app/services/signum-crmapi.service';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
@Component({
  selector: 'app-selected-branchcomparison',
  templateUrl: './selected-branchcomparison.component.html',
  styleUrls: ['./selected-branchcomparison.component.scss']
})
export class SelectedBranchcomparisonComponent implements OnInit {
  date = new Date();
  d = new Date(new Date().getFullYear(), 0, 1);
  currYtd = this.commonService.formatDate(this.d);
  currentDate = this.commonService.formatDate(this.date);
  isLoading: boolean = false;
  tableType: string = 'YTD'
  TIME_PERIOD_ACCESS:any = '2023';

  dataForm = this.fb.group({
    fromDate: [],
    ToDate: [],
  })
  tabledatas: any[] = []
  responsedata: any[] = []
  ytddata: any[] = []
  constructor(
    private fb: FormBuilder,
    private dataService: SignumCRMApiService,
    private commonService: CommonServiceService
  ) {
    /** form validations */
    this.dataForm.controls['fromDate'].setValue(this.currYtd)
    this.dataForm.controls['ToDate'].setValue(this.currentDate)
    this.getData()
  }

  ngOnInit(): void {
  }
  fdateChange(data: any) {
    this.dataForm.controls['fromDate'].setValue(data.target.value)
    this.getData()
  }
  tdateChange(data: any) {
    this.dataForm.controls['ToDate'].setValue(data.target.value)
    this.getData()
  }
  setYtdDate() {
    /** form validations */
    this.dataForm.controls['fromDate'].setValue(this.currYtd)
    this.dataForm.controls['ToDate'].setValue(this.currentDate)
    this.getData()
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
    this.commonService.exportExcel(this.tabledatas, 'BranchComparison');
  }
  // customizeText(data: any) {
  //   let num = Number(data.value).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  //   return num
  // }
  customizeText(data: any) {
    if ((data.value) >= 1000000) {
      return ((data.value) / 1000000).toFixed(3).replace(/\.0$/, '') + 'M';
    }
    if ((data.value) >= 1000) {
      return ((data.value) / 1000).toFixed(2).replace(/\.0$/, '') + 'K';
    }
    return (data.value.toFixed(2));
  }
 
  getData() {
    this.tabledatas = []

    let fromd = new Date(this.dataForm.value.fromDate)
    let tod = new Date(this.dataForm.value.ToDate)
    let fromDate = this.commonService.formatDate(fromd)
    let toDate = this.commonService.formatDate(tod)
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
    this.dataService.postDynamicAPI(API, data)
      .then((response: any) => {
        this.isLoading = false
        if (!response.dynamicData[0]) {
          alert(response.message)
          return
        }
        this.responsedata = response.dynamicData[0].filter((item: any) => item.BRANCH != '')

        //GROUP DATA BY BRANCH AND MONTH
        var branchResult: any = [];
        this.responsedata.reduce(function (res: any, value: any) {
          if (!res[value.BRANCH]) {
            res[value.BRANCH] = {
              BRANCH: value.BRANCH,
              YEAR: value.YEAR,
              REVENUE: 0,
              PY_REVENUE: 0,
              REV_INC_DEC: 0,
              REV_INC_DEC_PERC: 0,
              GROSS_MARGIN: 0,
              PY_GROSS_MARGIN: 0,
              GM_INC_DEC: 0,
              GM_INC_DEC_PERC: 0,
              GROSS_MARGIN_PERC: [[], []],
              PY_GROSS_MARGIN_PERC: [[], []],
              GM_PERC_INC_DEC: 0,
              GM_PERC_INC_DEC_PERC: 0,
              QUANTITY_SOLD: 0,
              PY_QUANTITY_SOLD: 0,
              QTY_INC_DEC: 0,
              QTY_INC_DEC_PERC: 0,
              TOTAL_CUSTOMERS: 0,
              PY_TOTAL_CUSTOMERS: 0,
              CUST_INC_DEC: 0,
              CUST_INC_DEC_PERC: 0,
            };
            branchResult.push(res[value.BRANCH])
          }
          res[value.BRANCH].REVENUE += value.REVENUE;
          res[value.BRANCH].PY_REVENUE += value.PY_REVENUE;
          // res[value.BRANCH].REV_INC_DEC += value.REV_INC_DEC;
          // res[value.BRANCH].REV_INC_DEC_PERC += value.REV_INC_DEC_PERC;
          res[value.BRANCH].GROSS_MARGIN += value.GROSS_MARGIN;
          res[value.BRANCH].PY_GROSS_MARGIN += value.PY_GROSS_MARGIN;
          // res[value.BRANCH].GM_INC_DEC += value.GM_INC_DEC;
          // res[value.BRANCH].GM_INC_DEC_PERC += value.GM_INC_DEC_PERC;
          res[value.BRANCH].GROSS_MARGIN_PERC[0].push(value.GROSS_MARGIN);
          res[value.BRANCH].GROSS_MARGIN_PERC[1].push(value.REVENUE);
          res[value.BRANCH].PY_GROSS_MARGIN_PERC[0].push(value.PY_GROSS_MARGIN);
          res[value.BRANCH].PY_GROSS_MARGIN_PERC[1].push(value.PY_REVENUE);
          // res[value.BRANCH].GM_PERC_INC_DEC += value.GM_PERC_INC_DEC;
          // res[value.BRANCH].GM_PERC_INC_DEC_PERC += value.GM_PERC_INC_DEC_PERC;
          res[value.BRANCH].QUANTITY_SOLD += value.QUANTITY_SOLD;
          res[value.BRANCH].PY_QUANTITY_SOLD += value.PY_QUANTITY_SOLD;
          // res[value.BRANCH].QTY_INC_DEC += value.QTY_INC_DEC;
          // res[value.BRANCH].QTY_INC_DEC_PERC += value.QTY_INC_DEC_PERC;
          res[value.BRANCH].TOTAL_CUSTOMERS += value.TOTAL_CUSTOMERS;
          res[value.BRANCH].PY_TOTAL_CUSTOMERS += value.PY_TOTAL_CUSTOMERS;
          // res[value.BRANCH].CUST_INC_DEC += value.CUST_INC_DEC;
          // res[value.BRANCH].CUST_INC_DEC_PERC += value.CUST_INC_DEC_PERC;
          return res;
        }, {});
        
        branchResult.forEach((element: any) => {
          element.GROSS_MARGIN_PERC = this.commonService.sumArray(element.GROSS_MARGIN_PERC[0]) / this.commonService.sumArray(element.GROSS_MARGIN_PERC[1]) * 100
          element.PY_GROSS_MARGIN_PERC = this.commonService.sumArray(element.PY_GROSS_MARGIN_PERC[0]) / this.commonService.sumArray(element.PY_GROSS_MARGIN_PERC[1]) * 100
          element.GROSS_MARGIN_PERC = Number(element.GROSS_MARGIN_PERC.toFixed(2))
          element.PY_GROSS_MARGIN_PERC = Number(element.PY_GROSS_MARGIN_PERC.toFixed(2))
          if (element.PY_REVENUE != 0) {
            element.REV_INC_DEC = (Number((element.REVENUE - element.PY_REVENUE).toFixed(2)))
            element.REV_INC_DEC_PERC = (Number((element.REV_INC_DEC / element.PY_REVENUE * 100).toFixed(2)))
          } else {
            element.REV_INC_DEC = 0
            element.REV_INC_DEC_PERC = 0
          }

          if (element.PY_GROSS_MARGIN != 0) {
            element.GM_INC_DEC = (Number((element.GROSS_MARGIN - element.PY_GROSS_MARGIN).toFixed(2)))
            element.GM_INC_DEC_PERC = (Number((element.GM_INC_DEC / element.PY_GROSS_MARGIN * 100).toFixed(2)))
            element.GM_PERC_INC_DEC_PERC = (Number((element.GM_PERC_INC_DEC / element.PY_GROSS_MARGIN_PERC * 100).toFixed(2)))
          } else {
            element.GM_INC_DEC = 0
            element.GM_INC_DEC_PERC = 0
          }
          if (element.PY_QUANTITY_SOLD != 0) {
            element.QTY_INC_DEC = (Number((element.QUANTITY_SOLD - element.PY_QUANTITY_SOLD).toFixed(2)))
            element.QTY_INC_DEC_PERC = (Number((element.QTY_INC_DEC / element.PY_QUANTITY_SOLD * 100).toFixed(2)))
          } else {
            element.QTY_INC_DEC = 0
            element.QTY_INC_DEC_PERC = 0
          }
          if (element.PY_TOTAL_CUSTOMERS != 0) {
            element.CUST_INC_DEC = (Number((element.TOTAL_CUSTOMERS - element.PY_TOTAL_CUSTOMERS).toFixed(2)))
            element.CUST_INC_DEC_PERC = (Number((element.CUST_INC_DEC / element.PY_TOTAL_CUSTOMERS * 100).toFixed(2)))
          } else {
            element.CUST_INC_DEC = 0
            element.CUST_INC_DEC_PERC = 0
          }
        });
        console.log(branchResult);
        
        this.tabledatas = branchResult;
        this.ytddata = branchResult;
      })
      .catch((err:any)=>{
        alert(err)
      })
  }
}
