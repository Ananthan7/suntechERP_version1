import { Component, OnInit } from "@angular/core";
import { ChartConfiguration, ChartType } from "chart.js";
import { SignumCRMApiService } from "src/app/services/signum-crmapi.service";
import DataLabelsPlugin from "chartjs-plugin-datalabels";
import { ElementRef, ViewChild } from "@angular/core";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CommonServiceService } from "src/app/services/common-service.service";
import { EventService } from "src/app/core/services/event.service";

@Component({
  selector: "app-kpi-evolution",
  templateUrl: "./kpi-evolution.component.html",
  styleUrls: ["./kpi-evolution.component.scss"],
})
export class KpiEvolutionComponent implements OnInit {
  QQQrevenuefinalData: any[] = [];
  model: any = {};
  graphDatalabel: any[] = [];
  graphContent: string = "Year";
  QOQchartLabel: any[] = [];
  QOQchartData: any[] = [];
  selectedChart: string = "";
  isChartSelected: boolean = true;
  firstChartrow: boolean = true;
  secondChartrow: boolean = true;
  thirdChartrow: boolean = true;
  isLoading: boolean = false;
  yeardata: any;
  uniqueYearArray: any;
  chartLable: any;
  chartData: any;
  salesUnit: any;
  avprice: any;
  grossmargin: any;
  grossmarginPercent: any;
  totalcustomer: any;
  inventoryamount: any;
  inventoryonHand: any;
  store: any;
  chartDataQQQ: any[] = [];
  salesUnitQQQ: any;
  avpriceQQQ: any;
  grossmarginQQQ: any;
  grossmarginPercentQQQ: any;
  totalcustomerQQQ: any;
  inventoryamountQQQ: any;
  inventoryonHandQQQ: any;
  storeQQQ: any;
  dataMonth: any;
  uniqueBranchCode: any;
  branchcodeLength: any;
  LayoutMode: string = ''
  uniqueMonth: any;
  arrayYear: any = [];
  uniqueYearMonth: any;
  monthYtd: any = [];
  date = new Date();
  savedTemplateDatas: any = localStorage.getItem('TEMPLATE_NAME')
  TIME_PERIOD_ACCESS:any = localStorage.getItem('TIME_PERIOD_ACCESS') ? localStorage.getItem('TIME_PERIOD_ACCESS') : 'ALL'

  currentYear = this.date.getFullYear();
  tooltipItems: any = {};
  filters: any = {};
  constructor(
    private dataServe: SignumCRMApiService,
    private commonServe: CommonServiceService,
    private eventService: EventService
  ) {
    this.tooltipItems = this.commonServe.getTooltipDescription()
  }

  ngOnInit(): void {
    this.getLayoutMode() //theme layoutmode
    if (this.savedTemplateDatas == 'default') {
      this.getChartData("Year");
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
      pdf.save("KpiEvolution.pdf");
    });
  }

  exportbtnClick() {
    this.commonServe.exportExcel(this.model.responseData, 'KpiEvolution ' + this.graphContent);
  }

  //testing purpose
  downloadCanvas(event: any) {
    // get the `<a>` element from click event
    var anchor = event.target;
    // get the canvas, I'm getting it by tag name, you can do by id
    // and set the href of the anchor to the canvas dataUrl
    anchor.href = document.getElementsByTagName("canvas")[0].toDataURL();
    // set the anchors 'download' attibute (name of the file to be downloaded)
    anchor.download = "test.png";
  }
  /**purpose: reset to first view*/
  resetAll() {
    this.getChartData("Year");
    this.isChartSelected = true;
    this.selectedChart = "";
    this.firstChartrow = true;
    this.secondChartrow = true;
    this.thirdChartrow = true;
  }
  /**purpose: To view only selected chart in content section*/
  selectChartView(param: string) {
    if (param) this.selectedChart = param;
    this.isChartSelected = false;
    if (
      param &&
      (param == "Revenue" ||
        param == "SalesUnit" ||
        param == "AverageSellingPrice")
    ) {
      this.secondChartrow = false;
      this.thirdChartrow = false;
    } else if (
      param &&
      (param == "GrossMargin" ||
        param == "GrossMarginPerc" ||
        param == "Customers")
    ) {
      this.thirdChartrow = false;
      this.firstChartrow = false;
    } else if (
      param &&
      (param == "Inventory" || param == "InventoryQuantity" || param == "STOR")
    ) {
      this.firstChartrow = false;
      this.secondChartrow = false;
    } else if (param == 'All') {
      this.firstChartrow = true;
      this.secondChartrow = true;
      this.thirdChartrow = true;
    }
  }
  /**purpose: reset chart data variabels*/
  resetChartData() {
    this.lineChartType = "bar";
    this.lineChartType2 = "bar";
    this.lineChartType3 = "bar";
    this.lineChartType4 = "bar";
    this.lineChartType5 = "bar";
    this.lineChartType6 = "bar";
    this.lineChartType7 = "bar";
    this.lineChartType8 = "bar";
    this.lineChartType9 = "bar";
    this.graphDatalabel = [];
    this.QOQchartLabel = [];
    this.model.responseData = [];
    this.model.graphRevenueResponse = [];
    this.model.qtySoldResponse = [];
    this.model.avgsellingprice = [];
    this.model.GrossMarginData = [];
    this.model.GrossMarginPercData = [];
    this.model.NumofCustomersData = [];
    this.model.InventoryAmountData = [];
    this.model.InventoryQuantityData = [];
    this.model.stor = [];
    this.firstChartrow = true;
    this.secondChartrow = true;
    this.thirdChartrow = true;
    this.isChartSelected = true;
    this.selectedChart = ''


  }
  /**purpose: get chart data from api */
  getChartData(value: string) {
    this.resetChartData();
    this.graphContent = value;
    this.isLoading = true;
    let API = 'SignumReport/KPIEvolution/KPIEvolutionAllDataBranchwiseVisual'
    let data = {
      "STRDIVISION": this.filters.divisionSelect && this.filters.divisionSelect != "" ? this.filters.divisionSelect.toString() : 'ALL',
      "STRBRANCH": this.filters.branchSelected && this.filters.branchSelected != "" ? this.filters.branchSelected.toString() : this.dataServe.branchCode,
      "STRSALESMAN": this.filters.salesmanSelected && this.filters.salesmanSelected != "" ? this.filters.salesmanSelected.toString() : "ALL",
      "STRYEAR": this.filters.yearSelected && this.filters.yearSelected != "" ? this.filters.yearSelected.toString() : this.TIME_PERIOD_ACCESS,
      "STRQUARTER": this.filters.quarterSelected && this.filters.quarterSelected != "" ? this.filters.quarterSelected.toString() : "ALL",
      "STRMONTH": this.filters.monthSelected && this.filters.monthSelected != "" ? this.filters.monthSelected.toString() : "ALL",
      "STRFROMDATE": this.filters.fromDate && this.filters.fromDate != "" ? this.filters.fromDate.toString() : "ALL",
      "STRTODATE": this.filters.toDate && this.filters.toDate != "" ? this.filters.toDate.toString() : "ALL",
      "STRBRANDCODE": this.filters.Brand && this.filters.Brand != "" ? this.filters.Brand.toString() : "ALL",
      "STRCOLLECTION": this.filters.Collection && this.filters.Collection != "" ? this.filters.Collection.toString() : "ALL",
      "STRSUBCOLLECTION": this.filters.SubCollection && this.filters.SubCollection != "" ? this.filters.SubCollection.toString() : "ALL",
      "STRCATEGORY": this.filters.Category && this.filters.Category != "" ? this.filters.Category.toString() : "ALL",
      "STRTYPE": this.filters.Type && this.filters.Type != "" ? this.filters.Type.toString() : "ALL",
      "STRSETTING": this.filters.Setting && this.filters.Setting != "" ? this.filters.Setting.toString() : "ALL",
      "STRSTONETYPELOOK": this.filters.StoneTypeLook && this.filters.StoneTypeLook != "" ? this.filters.StoneTypeLook.toString() : "ALL",
      "STRSHAPE": this.filters.Shape && this.filters.Shape != "" ? this.filters.Shape.toString() : "ALL",
      "STRFLUOR": this.filters.Fluor && this.filters.Fluor != "" ? this.filters.Fluor.toString() : "ALL",
      "STRSUPPLIERREFERENCE": this.filters.SupplierReference && this.filters.SupplierReference != "" ? this.filters.SupplierReference.toString() : "ALL",
      "STRSUPPLIERCODE": this.filters.SupplierCode && this.filters.SupplierCode != "" ? this.filters.SupplierCode.toString() : "ALL",
      "STRSELLINGPRICERANGE": this.filters.SellingPriceRange && this.filters.SellingPriceRange != "" ? this.filters.SellingPriceRange.toString() : "ALL"
    }
    this.dataServe.postDynamicAPI(API, data).then((response: any) => {
      this.isLoading = false;
      if (response.status == "Success" && response) {
        this.model.responseData = response.dynamicData[0];
        this.model.AlldataResponse = response.dynamicData[0];
        if(this.model.responseData.length == 0){
          alert('Data Not Available')
          return
        }
        //QOQ checking
        if (value != "QOQ") {

          //sorting labels wise data
          if (value == "Month") {
            this.dataMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];
            this.uniqueYearArray = [...new Set(this.model.responseData.map((item: any) => item.MONTH))];
            this.uniqueYearArray.sort((a: any, b: any) => {
              return this.dataMonth.indexOf(a) - this.dataMonth.indexOf(b);
            });
          } else if (value == "YTD") {
            this.uniqueYearArray = [...new Set(this.model.responseData.map((item: any) => item.YEAR))];
            let dataYear: any = this.uniqueYearArray.pop();
            this.arrayYear.push(dataYear);
            //this.uniqueYearMonth = [...new Set(this.model.responseData.map((item: any) => item.MONTH))];
          } else if (value == "Quarter") {
            this.uniqueYearArray = [...new Set(this.model.responseData.map((item: any) => item.QUARTER))];
          } else if (value == "Year") {
            this.uniqueYearArray = [...new Set(this.model.responseData.map((item: any) => item.YEAR))];
            this.uniqueYearArray.sort();
            this.uniqueBranchCode = [...new Set(this.model.responseData.map((item: any) => item.BRANCH))];
            this.branchcodeLength = this.uniqueBranchCode.length;
            this.dataMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];
            this.uniqueMonth = [...new Set(this.model.responseData.map((item: any) => item.MONTH))];
            this.uniqueMonth.sort((a: any, b: any) => {
              return this.dataMonth.indexOf(a) - this.dataMonth.indexOf(b);
            });

          } else {
            this.uniqueYearArray = [...new Set(this.model.responseData.map((item: any) => item.TIME_PERIOD_VALUE))];
          }
          //data grouping using reduce
          var YEARResult: any = []
          var MONTHResult: any = []
          var QUARTERResult: any = []
          this.model.responseData.reduce(function (res: any, value: any) {
            if (!res[value.YEAR]) {
              res[value.YEAR] = {
                YEAR: value.YEAR,
                REVENUE: 0,
                GROSS_MARGIN: 0,
                GROSS_MARGIN_PERC: [[], []],
                QUANTITY_SOLD: 0,
                AVERAGE_SELLING_PRICE: 0,
                TOTAL_CUSTOMERS: 0,
                ON_HAND_INVENTORY_AMOUNT: 0,
                ON_HAND_INVENTORY_QUANTITY: 0,
                STOR: [],
                COGS: 0,
              };
              YEARResult.push(res[value.YEAR])
            }
            if (!res[value.MONTH]) {
              res[value.MONTH] = {
                MONTH: value.MONTH,
                MONTHNO: Number(value.MONTHNO),
                REVENUE: 0,
                GROSS_MARGIN: 0,
                GROSS_MARGIN_PERC: [[], []],
                QUANTITY_SOLD: 0,
                AVERAGE_SELLING_PRICE: 0,
                TOTAL_CUSTOMERS: 0,
                ON_HAND_INVENTORY_AMOUNT: 0,
                ON_HAND_INVENTORY_QUANTITY: 0,
                STOR: [],
                COGS: 0,
              };
              MONTHResult.push(res[value.MONTH])
            }
            if (!res[value.QUARTER]) {
              res[value.QUARTER] = {
                QUARTER: value.QUARTER,
                REVENUE: 0,
                GROSS_MARGIN: 0,
                GROSS_MARGIN_PERC: [[], []],
                QUANTITY_SOLD: 0,
                AVERAGE_SELLING_PRICE: 0,
                TOTAL_CUSTOMERS: 0,
                ON_HAND_INVENTORY_AMOUNT: 0,
                ON_HAND_INVENTORY_QUANTITY: 0,
                STOR: [],
                COGS: 0,
              };
              QUARTERResult.push(res[value.QUARTER])
            }
            res[value.YEAR].REVENUE += value.REVENUE;
            res[value.YEAR].GROSS_MARGIN += value.GROSS_MARGIN;
            res[value.YEAR].GROSS_MARGIN_PERC[0].push(value.GROSS_MARGIN)
            res[value.YEAR].GROSS_MARGIN_PERC[1].push(value.REVENUE)
            res[value.YEAR].QUANTITY_SOLD += value.QUANTITY_SOLD;
            res[value.YEAR].AVERAGE_SELLING_PRICE += value.AVERAGE_SELLING_PRICE;
            res[value.YEAR].TOTAL_CUSTOMERS += value.TOTAL_CUSTOMERS;
            res[value.YEAR].ON_HAND_INVENTORY_AMOUNT += value.ON_HAND_INVENTORY_AMOUNT;
            res[value.YEAR].ON_HAND_INVENTORY_QUANTITY += value.ON_HAND_INVENTORY_QUANTITY;
            res[value.YEAR].STOR.push(value.STOR);
            res[value.YEAR].COGS += value.COGS;
            res[value.MONTH].REVENUE += value.REVENUE;
            res[value.MONTH].GROSS_MARGIN += value.GROSS_MARGIN;
            res[value.MONTH].GROSS_MARGIN_PERC[0].push(value.GROSS_MARGIN)
            res[value.MONTH].GROSS_MARGIN_PERC[1].push(value.REVENUE)
            res[value.MONTH].QUANTITY_SOLD += value.QUANTITY_SOLD;
            res[value.MONTH].AVERAGE_SELLING_PRICE += value.AVERAGE_SELLING_PRICE;
            res[value.MONTH].TOTAL_CUSTOMERS += value.TOTAL_CUSTOMERS;
            res[value.MONTH].ON_HAND_INVENTORY_AMOUNT += value.ON_HAND_INVENTORY_AMOUNT;
            res[value.MONTH].ON_HAND_INVENTORY_QUANTITY += value.ON_HAND_INVENTORY_QUANTITY;
            res[value.MONTH].STOR.push(value.STOR);
            res[value.MONTH].COGS += value.COGS;
            res[value.QUARTER].REVENUE += value.REVENUE;
            res[value.QUARTER].GROSS_MARGIN += value.GROSS_MARGIN;
            res[value.QUARTER].GROSS_MARGIN_PERC[0].push(value.GROSS_MARGIN)
            res[value.QUARTER].GROSS_MARGIN_PERC[1].push(value.REVENUE)
            res[value.QUARTER].QUANTITY_SOLD += value.QUANTITY_SOLD;
            res[value.QUARTER].AVERAGE_SELLING_PRICE += value.AVERAGE_SELLING_PRICE;
            res[value.QUARTER].TOTAL_CUSTOMERS += value.TOTAL_CUSTOMERS;
            res[value.QUARTER].ON_HAND_INVENTORY_AMOUNT += value.ON_HAND_INVENTORY_AMOUNT;
            res[value.QUARTER].ON_HAND_INVENTORY_QUANTITY += value.ON_HAND_INVENTORY_QUANTITY;
            res[value.QUARTER].STOR.push(value.STOR);
            res[value.QUARTER].COGS += value.COGS;
            return res;
          }, {});

          //data grouping MONTH wise
          if (value == "Month") {
            MONTHResult = MONTHResult.sort((a: any, b: any) => a.MONTHNO - b.MONTHNO);
            MONTHResult.forEach((element: any) => {
              element.AVERAGE_SELLING_PRICE = Math.trunc(element.REVENUE / element.QUANTITY_SOLD)
              element.GROSS_MARGIN_PERC = this.commonServe.sumArray(element.GROSS_MARGIN_PERC[0]) / this.commonServe.sumArray(element.GROSS_MARGIN_PERC[1]) * 100
              element.GROSS_MARGIN_PERC = Math.trunc(element.GROSS_MARGIN_PERC)
              element.STOR = this.commonServe.avgOfArray(element.STOR)
            })
            this.graphDatalabel = MONTHResult.map((item: any) => item.MONTH)
            this.model.tabledata = MONTHResult;
            this.model.tabledata.forEach((element: any) => {
              element.year = element.MONTH
              element.revenue = element.REVENUE
              element.salesunit = element.QUANTITY_SOLD
              element.avprice = element.AVERAGE_SELLING_PRICE
              element.grossmargin = element.GROSS_MARGIN
              element.grossmarginpercent = element.GROSS_MARGIN_PERC
              element.totalcustomer = element.TOTAL_CUSTOMERS
              element.inventoryamount = element.ON_HAND_INVENTORY_AMOUNT
              element.invqty = element.ON_HAND_INVENTORY_QUANTITY
              element.store = element.STOR
            });

            this.chartData = MONTHResult.map((item: any) => item.REVENUE)
            this.salesUnit = MONTHResult.map((item: any) => Math.trunc(item.QUANTITY_SOLD))
            this.avprice = MONTHResult.map((item: any) => item.AVERAGE_SELLING_PRICE)
            this.grossmargin = MONTHResult.map((item: any) => item.GROSS_MARGIN)
            this.grossmarginPercent = MONTHResult.map((item: any) => item.GROSS_MARGIN_PERC)
            this.totalcustomer = MONTHResult.map((item: any) => item.TOTAL_CUSTOMERS)
            this.inventoryamount = MONTHResult.map((item: any) => item.ON_HAND_INVENTORY_AMOUNT)
            this.inventoryonHand = MONTHResult.map((item: any) => item.ON_HAND_INVENTORY_QUANTITY)
            this.store = MONTHResult.map((item: any) => item.STOR)
          }
          //YTD data grouping
          if (value == "YTD") {
            //filter current year data
            let ytdData = this.model.responseData.filter((element: any) => element.YEAR == this.currentYear.toString())
            //data grouping  month wise
            var ytdMONTHResult: any = []
            ytdData.reduce(function (res: any, value: any) {
              if (!res[value.MONTH]) {
                res[value.MONTH] = {
                  MONTH: value.MONTH,
                  MONTHNO: Number(value.MONTHNO),
                  REVENUE: 0,
                  GROSS_MARGIN: 0,
                  GROSS_MARGIN_PERC: [[], []],
                  QUANTITY_SOLD: 0,
                  AVERAGE_SELLING_PRICE: 0,
                  TOTAL_CUSTOMERS: 0,
                  ON_HAND_INVENTORY_AMOUNT: 0,
                  ON_HAND_INVENTORY_QUANTITY: 0,
                  STOR: [],
                  COGS: 0,
                };
                ytdMONTHResult.push(res[value.MONTH])
              }
              res[value.MONTH].REVENUE += value.REVENUE;
              res[value.MONTH].GROSS_MARGIN += value.GROSS_MARGIN;
              res[value.MONTH].GROSS_MARGIN_PERC[0].push(value.GROSS_MARGIN)
              res[value.MONTH].GROSS_MARGIN_PERC[1].push(value.REVENUE)
              res[value.MONTH].QUANTITY_SOLD += value.QUANTITY_SOLD;
              res[value.MONTH].AVERAGE_SELLING_PRICE += value.AVERAGE_SELLING_PRICE;
              res[value.MONTH].TOTAL_CUSTOMERS += value.TOTAL_CUSTOMERS;
              res[value.MONTH].ON_HAND_INVENTORY_AMOUNT += value.ON_HAND_INVENTORY_AMOUNT;
              res[value.MONTH].ON_HAND_INVENTORY_QUANTITY += value.ON_HAND_INVENTORY_QUANTITY;
              res[value.MONTH].STOR.push(value.STOR);
              res[value.MONTH].COGS += value.COGS;
              return res;
            }, {});
            ytdMONTHResult.forEach((element: any) => {
              element.AVERAGE_SELLING_PRICE = Math.trunc(element.REVENUE / element.QUANTITY_SOLD)
              element.GROSS_MARGIN_PERC = this.commonServe.sumArray(element.GROSS_MARGIN_PERC[0]) / this.commonServe.sumArray(element.GROSS_MARGIN_PERC[1]) * 100
              element.GROSS_MARGIN_PERC = Math.trunc(element.GROSS_MARGIN_PERC)
              element.STOR = (element.REVENUE - element.GROSS_MARGIN)/element.ON_HAND_INVENTORY_AMOUNT
            })
            ytdMONTHResult = ytdMONTHResult.sort((a: any, b: any) => a.MONTHNO - b.MONTHNO);
            this.graphDatalabel = ytdMONTHResult.map((item: any) => item.MONTH)

            this.model.tabledata = ytdMONTHResult
            this.model.tabledata.forEach((element: any) => {
              element.year = element.MONTH
              element.revenue = element.REVENUE
              element.salesunit = element.QUANTITY_SOLD
              element.avprice = element.AVERAGE_SELLING_PRICE
              element.grossmargin = element.GROSS_MARGIN
              element.grossmarginpercent = element.GROSS_MARGIN_PERC
              element.totalcustomer = element.TOTAL_CUSTOMERS
              element.inventoryamount = element.ON_HAND_INVENTORY_AMOUNT
              element.invqty = element.ON_HAND_INVENTORY_QUANTITY
              element.store = element.STOR
            });
            this.chartData = ytdMONTHResult.map((item: any) => item.REVENUE)
            this.salesUnit = ytdMONTHResult.map((item: any) => Math.trunc(item.QUANTITY_SOLD))
            this.avprice = ytdMONTHResult.map((item: any) => item.AVERAGE_SELLING_PRICE)
            this.grossmargin = ytdMONTHResult.map((item: any) => item.GROSS_MARGIN)
            this.grossmarginPercent = ytdMONTHResult.map((item: any) => item.GROSS_MARGIN_PERC)
            this.totalcustomer = ytdMONTHResult.map((item: any) => item.TOTAL_CUSTOMERS)
            this.inventoryamount = ytdMONTHResult.map((item: any) => item.ON_HAND_INVENTORY_AMOUNT)
            this.inventoryonHand = ytdMONTHResult.map((item: any) => item.ON_HAND_INVENTORY_QUANTITY)
            this.store = ytdMONTHResult.map((item: any) => item.STOR)
          }
          // year data grouping
          if (value == "Year") {
            YEARResult.sort((a: any, b: any) => a.YEAR - b.YEAR)
            //GROUP DATA BY YEAR
            YEARResult.forEach((element: any) => {
              element.AVERAGE_SELLING_PRICE = Math.trunc(element.REVENUE / element.QUANTITY_SOLD)
              element.GROSS_MARGIN_PERC = this.commonServe.sumArray(element.GROSS_MARGIN_PERC[0]) / this.commonServe.sumArray(element.GROSS_MARGIN_PERC[1]) * 100
              element.GROSS_MARGIN_PERC = Math.trunc(element.GROSS_MARGIN_PERC)
              element.STOR = this.commonServe.avgOfArray(element.STOR)
            })
            this.graphDatalabel = this.uniqueYearArray

            this.model.tabledata = YEARResult
            this.model.tabledata.forEach((element: any) => {
              element.year = element.YEAR
              element.revenue = element.REVENUE
              element.salesunit = element.QUANTITY_SOLD
              element.avprice = element.AVERAGE_SELLING_PRICE
              element.grossmargin = element.GROSS_MARGIN
              element.grossmarginpercent = element.GROSS_MARGIN_PERC
              element.totalcustomer = element.TOTAL_CUSTOMERS
              element.inventoryamount = element.ON_HAND_INVENTORY_AMOUNT
              element.invqty = element.ON_HAND_INVENTORY_QUANTITY
              element.store = element.STOR
            });
            this.chartData = YEARResult.map((item: any) => item.REVENUE)
            this.salesUnit = YEARResult.map((item: any) => Math.trunc(item.QUANTITY_SOLD))
            this.avprice = YEARResult.map((item: any) => item.AVERAGE_SELLING_PRICE)
            this.grossmargin = YEARResult.map((item: any) => item.GROSS_MARGIN)
            this.grossmarginPercent = YEARResult.map((item: any) => item.GROSS_MARGIN_PERC)
            this.totalcustomer = YEARResult.map((item: any) => item.TOTAL_CUSTOMERS)
            this.inventoryamount = YEARResult.map((item: any) => item.ON_HAND_INVENTORY_AMOUNT)
            this.inventoryonHand = YEARResult.map((item: any) => item.ON_HAND_INVENTORY_QUANTITY)
            this.store = YEARResult.map((item: any) => item.STOR)
          }
          //Quarter wise grouping
          if (value == "Quarter") {
            QUARTERResult.forEach((element: any) => {
              element.AVERAGE_SELLING_PRICE = Math.trunc(element.REVENUE / element.QUANTITY_SOLD)
              element.GROSS_MARGIN_PERC = this.commonServe.sumArray(element.GROSS_MARGIN_PERC[0]) / this.commonServe.sumArray(element.GROSS_MARGIN_PERC[1]) * 100
              element.GROSS_MARGIN_PERC = Math.trunc(element.GROSS_MARGIN_PERC)
              element.STOR = this.commonServe.avgOfArray(element.STOR)
            })
            QUARTERResult = QUARTERResult.sort((a: any, b: any) => a.QUARTER - b.QUARTER);
            this.graphDatalabel = QUARTERResult.map((item: any) => "Q" + item.QUARTER)
            this.model.tabledata = QUARTERResult;
            this.model.tabledata.forEach((element: any) => {
              element.year = element.QUARTER
              element.revenue = element.REVENUE
              element.salesunit = element.QUANTITY_SOLD
              element.avprice = element.AVERAGE_SELLING_PRICE
              element.grossmargin = element.GROSS_MARGIN
              element.grossmarginpercent = element.GROSS_MARGIN_PERC
              element.totalcustomer = element.TOTAL_CUSTOMERS
              element.inventoryamount = element.ON_HAND_INVENTORY_AMOUNT
              element.invqty = element.ON_HAND_INVENTORY_QUANTITY
              element.store = element.STOR
            });

            this.chartData = QUARTERResult.map((item: any) => item.REVENUE)
            this.salesUnit = QUARTERResult.map((item: any) => Math.trunc(item.QUANTITY_SOLD))
            this.avprice = QUARTERResult.map((item: any) => item.AVERAGE_SELLING_PRICE)
            this.grossmargin = QUARTERResult.map((item: any) => item.GROSS_MARGIN)
            this.grossmarginPercent = QUARTERResult.map((item: any) => item.GROSS_MARGIN_PERC)
            this.totalcustomer = QUARTERResult.map((item: any) => item.TOTAL_CUSTOMERS)
            this.inventoryamount = QUARTERResult.map((item: any) => item.ON_HAND_INVENTORY_AMOUNT)
            this.inventoryonHand = QUARTERResult.map((item: any) => item.ON_HAND_INVENTORY_QUANTITY)
            this.store = QUARTERResult.map((item: any) => item.STOR)
          }

          this.model.graphRevenueResponse = this.chartData;
          this.model.qtySoldResponse = this.salesUnit;
          this.model.avgsellingprice = this.avprice;
          this.model.GrossMarginData = this.grossmargin;
          this.model.GrossMarginPercData = this.grossmarginPercent;
          this.model.NumofCustomersData = this.totalcustomer;
          this.model.InventoryAmountData = this.inventoryamount;
          this.model.InventoryQuantityData = this.inventoryonHand;
          this.model.stor = this.store;

          this.lineChartData.labels = this.graphDatalabel;
          this.lineChartData.datasets[0].data = this.model.graphRevenueResponse;
          this.SalesChartData.labels = this.graphDatalabel;
          this.SalesChartData.datasets[0].data = this.model.qtySoldResponse;
          this.avgSellPriceChartData.labels = this.graphDatalabel;
          this.avgSellPriceChartData.datasets[0].data =
            this.model.avgsellingprice;
          this.GrossMarginChartData.labels = this.graphDatalabel;
          this.GrossMarginChartData.datasets[0].data =
            this.model.GrossMarginData;
          this.GrossMarginPercChartData.labels = this.graphDatalabel;
          this.GrossMarginPercChartData.datasets[0].data =
            this.model.GrossMarginPercData;
          this.NumofCustomersData.labels = this.graphDatalabel;
          this.NumofCustomersData.datasets[0].data =
            this.model.NumofCustomersData;
          this.InventoryAmountData.labels = this.graphDatalabel;
          this.InventoryAmountData.datasets[0].data =
            this.model.InventoryAmountData;
          this.InventoryQuantityData.labels = this.graphDatalabel;
          this.InventoryQuantityData.datasets[0].data =
            this.model.InventoryQuantityData;
          this.storChartData.labels = this.graphDatalabel;
          this.storChartData.datasets[0].data = this.model.stor;
        }
        //QOQ grouping
        if (value == "QOQ") {

          this.model.responseData.sort((a: any, b: any) => a.YEAR - b.YEAR)
          this.uniqueYearArray = [...new Set(this.model.responseData.map((item: any) => item.YEAR))];
          //Group objects by multiple key in array of objects then sum up their values
          let helper: any = {};
          let brand_year_result = this.model.responseData.reduce(function (r: any, o: any) {
            let key = o.YEAR + '-' + o.QUARTER;
            if (!helper[key]) {
              helper[key] = Object.assign({}, o); // create a copy of o
              r.push(helper[key]);
            } else {
              helper[key].REVENUE += o.REVENUE;
              helper[key].QUANTITY_SOLD += o.QUANTITY_SOLD;
              helper[key].AVERAGE_SELLING_PRICE += o.AVERAGE_SELLING_PRICE;
              helper[key].GROSS_MARGIN += o.GROSS_MARGIN;
              helper[key].TOTAL_CUSTOMERS += o.TOTAL_CUSTOMERS;
              helper[key].ON_HAND_INVENTORY_AMOUNT += o.ON_HAND_INVENTORY_AMOUNT;
              helper[key].ON_HAND_INVENTORY_QUANTITY += o.ON_HAND_INVENTORY_QUANTITY;
              helper[key].STOR += o.STOR;
            }
            return r;
          }, []);
          brand_year_result = brand_year_result.sort((a: any, b: any) => a.QUARTER - b.QUARTER)
          let finalGroupeddata: any[] = []
          this.model.stackYearLabel = [...new Set(brand_year_result.map((item: any) => item.YEAR))]
          //data grouping to obj format
          this.model.stackYearLabel.forEach((item: any) => {
            let arrs: any = {}
            let it: any = []
            brand_year_result.forEach((element: any) => {
              if (element.YEAR == item) {
                it.push({
                  year: element.YEAR,
                  quarter: Number(element.QUARTER),
                  revenue: element.REVENUE,
                  salesquantity: Math.trunc(element.QUANTITY_SOLD),
                  averageprice: (element.REVENUE / element.QUANTITY_SOLD),
                  grossmargin: element.GROSS_MARGIN,
                  grosspercentage: Math.trunc((element.GROSS_MARGIN / element.REVENUE) * 100),
                  customer: Math.trunc(element.TOTAL_CUSTOMERS),
                  inventoryamount: element.ON_HAND_INVENTORY_AMOUNT,
                  invqty: Math.trunc(element.ON_HAND_INVENTORY_QUANTITY),
                  store: element.STOR,
                })
                arrs = {
                  year: element.YEAR,
                  data: it
                }
              }
            });
            finalGroupeddata.push(arrs)
          });

          this.QOQchartLabel = this.uniqueYearArray;
          this.lineChartDataQOQ.labels = this.QOQchartLabel;
          this.SalesChartDataQOQ.labels = this.QOQchartLabel;
          this.avgSellPriceChartDataQOQ.labels = this.QOQchartLabel;
          this.GrossMarginChartDataQOQ.labels = this.QOQchartLabel;
          this.GrossMarginPercChartDataQOQ.labels = this.QOQchartLabel;
          this.NumofCustomersDataQOQ.labels = this.QOQchartLabel;
          this.InventoryAmountDataQOQ.labels = this.QOQchartLabel;
          this.InventoryQuantityDataQOQ.labels = this.QOQchartLabel;
          this.storChartDataQOQ.labels = this.QOQchartLabel;

          this.model.tabledata = []
          this.lineChartDataQOQ.datasets[0].data = []
          this.SalesChartDataQOQ.datasets[0].data = []
          this.avgSellPriceChartDataQOQ.datasets[0].data = []
          this.GrossMarginChartDataQOQ.datasets[0].data = []
          this.GrossMarginPercChartDataQOQ.datasets[0].data = []
          this.NumofCustomersDataQOQ.datasets[0].data = []
          this.InventoryAmountDataQOQ.datasets[0].data = []
          this.InventoryQuantityDataQOQ.datasets[0].data = []
          this.storChartDataQOQ.datasets[0].data = []
          this.lineChartDataQOQ.datasets[1].data = []
          this.SalesChartDataQOQ.datasets[1].data = []
          this.avgSellPriceChartDataQOQ.datasets[1].data = []
          this.GrossMarginChartDataQOQ.datasets[1].data = []
          this.GrossMarginPercChartDataQOQ.datasets[1].data = []
          this.NumofCustomersDataQOQ.datasets[1].data = []
          this.InventoryAmountDataQOQ.datasets[1].data = []
          this.InventoryQuantityDataQOQ.datasets[1].data = []
          this.storChartDataQOQ.datasets[1].data = []
          this.lineChartDataQOQ.datasets[2].data = []
          this.SalesChartDataQOQ.datasets[2].data = []
          this.avgSellPriceChartDataQOQ.datasets[2].data = []
          this.GrossMarginChartDataQOQ.datasets[2].data = []
          this.GrossMarginPercChartDataQOQ.datasets[2].data = []
          this.NumofCustomersDataQOQ.datasets[2].data = []
          this.InventoryAmountDataQOQ.datasets[2].data = []
          this.InventoryQuantityDataQOQ.datasets[2].data = []
          this.storChartDataQOQ.datasets[2].data = []
          this.lineChartDataQOQ.datasets[3].data = []
          this.SalesChartDataQOQ.datasets[3].data = []
          this.avgSellPriceChartDataQOQ.datasets[3].data = []
          this.GrossMarginChartDataQOQ.datasets[3].data = []
          this.GrossMarginPercChartDataQOQ.datasets[3].data = []
          this.NumofCustomersDataQOQ.datasets[3].data = []
          this.InventoryAmountDataQOQ.datasets[3].data = []
          this.InventoryQuantityDataQOQ.datasets[3].data = []
          this.storChartDataQOQ.datasets[3].data = []

          finalGroupeddata.forEach((element: any) => {
            element.data.forEach((value: any) => {
              this.model.tabledata.push(value);
              if (value.year == element.year && value.quarter == 1) {
                this.lineChartDataQOQ.datasets[0].data.push(value.revenue);

                this.SalesChartDataQOQ.datasets[0].data.push(Math.trunc(value.salesquantity));
                this.avgSellPriceChartDataQOQ.datasets[0].data.push(value.averageprice);
                this.GrossMarginChartDataQOQ.datasets[0].data.push(value.grossmargin);
                this.GrossMarginPercChartDataQOQ.datasets[0].data.push(value.grosspercentage);
                this.NumofCustomersDataQOQ.datasets[0].data.push(value.customer);
                this.InventoryAmountDataQOQ.datasets[0].data.push(value.inventoryamount);
                this.InventoryQuantityDataQOQ.datasets[0].data.push(value.invqty);
                this.storChartDataQOQ.datasets[0].data.push(value.store);
              }
              if (value.year == element.year && value.quarter == 2) {
                this.lineChartDataQOQ.datasets[1].data.push(value.revenue);
                this.SalesChartDataQOQ.datasets[1].data.push(Math.trunc(value.salesquantity));
                this.avgSellPriceChartDataQOQ.datasets[1].data.push(value.averageprice);
                this.GrossMarginChartDataQOQ.datasets[1].data.push(value.grossmargin);
                this.GrossMarginPercChartDataQOQ.datasets[1].data.push(value.grosspercentage);
                this.NumofCustomersDataQOQ.datasets[1].data.push(value.customer);
                this.InventoryAmountDataQOQ.datasets[1].data.push(value.inventoryamount);
                this.InventoryQuantityDataQOQ.datasets[1].data.push(value.invqty);
                this.storChartDataQOQ.datasets[1].data.push(value.store);
              }
              if (value.year == element.year && value.quarter == 3) {
                this.lineChartDataQOQ.datasets[2].data.push(value.revenue);
                this.SalesChartDataQOQ.datasets[2].data.push(Math.trunc(value.salesquantity));
                this.avgSellPriceChartDataQOQ.datasets[2].data.push(value.averageprice);
                this.GrossMarginChartDataQOQ.datasets[2].data.push(value.grossmargin);
                this.GrossMarginPercChartDataQOQ.datasets[2].data.push(value.grosspercentage);
                this.NumofCustomersDataQOQ.datasets[2].data.push(value.customer);
                this.InventoryAmountDataQOQ.datasets[2].data.push(value.inventoryamount);
                this.InventoryQuantityDataQOQ.datasets[2].data.push(value.invqty);
                this.storChartDataQOQ.datasets[2].data.push(value.store);
              }
              if (value.year == element.year && value.quarter == 4) {
                this.lineChartDataQOQ.datasets[3].data.push(value.revenue);
                this.SalesChartDataQOQ.datasets[3].data.push(Math.trunc(value.salesquantity));
                this.avgSellPriceChartDataQOQ.datasets[3].data.push(value.averageprice);
                this.GrossMarginChartDataQOQ.datasets[3].data.push(value.grossmargin);
                this.GrossMarginPercChartDataQOQ.datasets[3].data.push(value.grosspercentage);
                this.NumofCustomersDataQOQ.datasets[3].data.push(value.customer);
                this.InventoryAmountDataQOQ.datasets[3].data.push(value.inventoryamount);
                this.InventoryQuantityDataQOQ.datasets[3].data.push(value.invqty);
                this.storChartDataQOQ.datasets[3].data.push(value.store);
              }
            });
          });
        }
      } else {
        alert(response.message);
      }
    });
  }
  setTemplateData(data: any) {
    this.savedTemplateDatas = data.istemplateSaved ? data.templateName : null
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
    this.filters = filters
    this.getChartData(this.graphContent)
  }
  /**purpose: refresh button click */
  refreshBtnClick() {
    this.getChartData("Year");
  }

  dynamicFiltering(dataArr: any, elementArr: any) {
    let finalArr: any = []
    elementArr.forEach((element: any) => {
      dataArr.forEach((item: any, index: number) => {
        Object.values(item).forEach((it: any) => {
          if (it == element) {
            finalArr.push(item)
          }
        })
      });
    })
    return finalArr
  }

  /**purpose: set chart options */
  getLayoutMode() {
    let layoutmode = document.body.getAttribute('data-layout-mode');
    if (layoutmode) {
      this.LayoutMode = layoutmode;
      this.setChartOptions(layoutmode)
    }
    // event to get selected mode from rightsidebar
    this.eventService.subscribe('changeMode', (mode) => {
      if (mode) {
        this.LayoutMode = mode;
        this.setChartOptions(mode)
      }
    });
  }
  formatDecimal(number: any, decimalPlaces: any) {
    const multiplier = Math.pow(10, decimalPlaces);
    const roundedValue = Math.floor(number * multiplier) / multiplier;
    return roundedValue.toFixed(decimalPlaces);
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
                // Convert to millions
                const millions = value / 1000000;
                const decimalPlaces = 2
                const multiplier = Math.pow(10, decimalPlaces);
                const roundedValue = Math.floor(millions * multiplier) / multiplier;
                return roundedValue.toFixed(decimalPlaces) + "M";
              } else if (value >= 1000) {
                // Convert to thousands
                const thousands = value / 1000;
                const decimalPlaces = 1
                const multiplier = Math.pow(10, decimalPlaces);
                const roundedValue = Math.floor(thousands * multiplier) / multiplier;
                return roundedValue.toFixed(decimalPlaces) + "K";
              }
              if (value < 1000 && value > 1) {
                return Math.trunc(value);
              }
              if (value < 1 && value > -1) {
                return value.toFixed(4);
              }
              if (!value) {
                return 0
              }
              return value.toFixed(1);;
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: layoutDataSet.LabelColor,
          }
        },
      },
      elements: {
        point: {
          radius: 2,
        },
      },

      plugins: {
        legend: {
          display: true,
          align: "end",
          labels: {
            color: layoutDataSet.LegendColor,
            boxWidth: 0,
            font: {
              size: 9,
            },
            padding: 5,
          },
        },
        datalabels: {
          color: layoutDataSet.LabelColor,
          anchor: "end",
          align: "end",
          font: {
            size: this.graphContent != "QOQ" ? 10 : 4,
          },
          padding: 5,
          formatter: function (value: any) {
            if (value >= 1000000) {
              // Convert to millions
              const millions = value / 1000000;
              const decimalPlaces = 2
              const multiplier = Math.pow(10, decimalPlaces);
              const roundedValue = Math.floor(millions * multiplier) / multiplier;
              return roundedValue.toFixed(decimalPlaces) + "M";
            } else if (value >= 1000) {
              // Convert to thousands
              const thousands = value / 1000;
              const decimalPlaces = 1
              const multiplier = Math.pow(10, decimalPlaces);
              const roundedValue = Math.floor(thousands * multiplier) / multiplier;
              return roundedValue.toFixed(decimalPlaces) + "K";
            }
            if (value < 1000 && value > 1) {
              return Math.trunc(value);
            }
            if (value < 1 && value > -1) {
              return value.toFixed(4);
            }
            if (!value) {
              return 0
            }
            return value.toFixed(1);
          },
        },
      }
    };

    //chartoption change GM %
    this.GMPlineChartOptions = {
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
              return value + '%'
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
        tooltip: {
          callbacks: {
            label: function (context: any) {
              let label = context.dataset.label || '';

              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null || (context.parsed.y >= 10 && context.parsed.y <= 100)) {
                label += (context.parsed.y) + '%';
              }
              return label;
            }
          }
        },
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
            return value + '%'
          }
        }
      }
    };
  }

  /**purpose: graph type change selection */
  changeGraphType(type: any) {
    this.lineChartType = type;
  }
  changeGraphType2(type: any) {
    this.lineChartType2 = type;
  }
  changeGraphType3(type: any) {
    this.lineChartType3 = type;
  }
  changeGraphType4(type: any) {
    this.lineChartType4 = type;
  }
  changeGraphType5(type: any) {
    this.lineChartType5 = type;
  }
  changeGraphType6(type: any) {
    this.lineChartType6 = type;
  }
  changeGraphType7(type: any) {
    this.lineChartType7 = type;
  }
  changeGraphType8(type: any) {
    this.lineChartType8 = type;
  }
  changeGraphType9(type: any) {
    this.lineChartType9 = type;
  }

  // line chart  options
  public lineChartOptions: ChartConfiguration["options"];
  public GMPlineChartOptions: ChartConfiguration["options"];
  public barChartPlugins = [DataLabelsPlugin];

  public lineChartType: ChartType = "bar";
  public lineChartType2: ChartType = "bar";
  public lineChartType3: ChartType = "bar";
  public lineChartType4: ChartType = "bar";
  public lineChartType5: ChartType = "bar";
  public lineChartType6: ChartType = "bar";
  public lineChartType7: ChartType = "bar";
  public lineChartType8: ChartType = "bar";
  public lineChartType9: ChartType = "bar";

  /**purpose: chart declarations setup starts from here */
  // Revenue ChartData ChartConfiguration
  public lineChartData: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "Revenue",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
    ],
    labels: [],
  };

  public lineChartDataQOQ: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "Quarter 1",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
      {
        data: [],
        label: "Quarter 2",
        backgroundColor: "#7dcfb6",
        borderColor: "#7dcfb6",
        pointBackgroundColor: "#7dcfb6",
        pointBorderColor: "#7dcfb6",
        pointHoverBackgroundColor: "#7dcfb6",
        pointHoverBorderColor: "#7dcfb6",
      },
      {
        data: [],
        label: "Quarter 3",
        backgroundColor: "#b9d6f2",
        borderColor: "#b9d6f2",
        pointBackgroundColor: "#b9d6f2",
        pointBorderColor: "#b9d6f2",
        pointHoverBackgroundColor: "#b9d6f2",
        pointHoverBorderColor: "#b9d6f2",
      },
      {
        data: [],
        label: "Quarter 4",
        backgroundColor: "#adf7b6",
        borderColor: "#adf7b6",
        pointBackgroundColor: "#adf7b6",
        pointBorderColor: "#adf7b6",
        pointHoverBackgroundColor: "#adf7b6",
        pointHoverBorderColor: "#adf7b6",
      },
    ],
    labels: [],
  };
  // SalesChartData ChartConfiguration
  public SalesChartData: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "Sales Unit",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
    ],
    labels: [],
  };
  public SalesChartDataQOQ: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "Quarter 1",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
      {
        data: [],
        label: "Quarter 2",
        backgroundColor: "#7dcfb6",
        borderColor: "#7dcfb6",
        pointBackgroundColor: "#7dcfb6",
        pointBorderColor: "#7dcfb6",
        pointHoverBackgroundColor: "#7dcfb6",
        pointHoverBorderColor: "#7dcfb6",
      },
      {
        data: [],
        label: "Quarter 3",
        backgroundColor: "#b9d6f2",
        borderColor: "#b9d6f2",
        pointBackgroundColor: "#b9d6f2",
        pointBorderColor: "#b9d6f2",
        pointHoverBackgroundColor: "#b9d6f2",
        pointHoverBorderColor: "#b9d6f2",
      },
      {
        data: [],
        label: "Quarter 4",
        backgroundColor: "#adf7b6",
        borderColor: "#adf7b6",
        pointBackgroundColor: "#adf7b6",
        pointBorderColor: "#adf7b6",
        pointHoverBackgroundColor: "#adf7b6",
        pointHoverBorderColor: "#adf7b6",
      },
    ],
    labels: [],
  };
  //Average selling price chart config
  public avgSellPriceChartData: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "Average SellingPrice",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
    ],
    labels: [],
  };
  public avgSellPriceChartDataQOQ: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "Quarter 1",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
      {
        data: [],
        label: "Quarter 2",
        backgroundColor: "#7dcfb6",
        borderColor: "#7dcfb6",
        pointBackgroundColor: "#7dcfb6",
        pointBorderColor: "#7dcfb6",
        pointHoverBackgroundColor: "#7dcfb6",
        pointHoverBorderColor: "#7dcfb6",
      },
      {
        data: [],
        label: "Quarter 3",
        backgroundColor: "#b9d6f2",
        borderColor: "#b9d6f2",
        pointBackgroundColor: "#b9d6f2",
        pointBorderColor: "#b9d6f2",
        pointHoverBackgroundColor: "#b9d6f2",
        pointHoverBorderColor: "#b9d6f2",
      },
      {
        data: [],
        label: "Quarter 4",
        backgroundColor: "#adf7b6",
        borderColor: "#adf7b6",
        pointBackgroundColor: "#adf7b6",
        pointBorderColor: "#adf7b6",
        pointHoverBackgroundColor: "#adf7b6",
        pointHoverBorderColor: "#adf7b6",
      },
    ],
    labels: [],
  };
  //gross marin chart config
  public GrossMarginChartData: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "Gross Margin",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
    ],
    labels: [],
  };
  public GrossMarginChartDataQOQ: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "Quarter 1",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
      {
        data: [],
        label: "Quarter 2",
        backgroundColor: "#7dcfb6",
        borderColor: "#7dcfb6",
        pointBackgroundColor: "#7dcfb6",
        pointBorderColor: "#7dcfb6",
        pointHoverBackgroundColor: "#7dcfb6",
        pointHoverBorderColor: "#7dcfb6",
      },
      {
        data: [],
        label: "Quarter 3",
        backgroundColor: "#b9d6f2",
        borderColor: "#b9d6f2",
        pointBackgroundColor: "#b9d6f2",
        pointBorderColor: "#b9d6f2",
        pointHoverBackgroundColor: "#b9d6f2",
        pointHoverBorderColor: "#b9d6f2",
      },
      {
        data: [],
        label: "Quarter 4",
        backgroundColor: "#adf7b6",
        borderColor: "#adf7b6",
        pointBackgroundColor: "#adf7b6",
        pointBorderColor: "#adf7b6",
        pointHoverBackgroundColor: "#adf7b6",
        pointHoverBorderColor: "#adf7b6",
      },
    ],
    labels: [],
  };
  // GrossMarginPerc ChartData ChartConfiguration

  public GrossMarginPercChartData: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "Gross Margin %",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
    ],
    labels: [],
  };
  public GrossMarginPercChartDataQOQ: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "Quarter 1",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
      {
        data: [],
        label: "Quarter 2",
        backgroundColor: "#7dcfb6",
        borderColor: "#7dcfb6",
        pointBackgroundColor: "#7dcfb6",
        pointBorderColor: "#7dcfb6",
        pointHoverBackgroundColor: "#7dcfb6",
        pointHoverBorderColor: "#7dcfb6",
      },
      {
        data: [],
        label: "Quarter 3",
        backgroundColor: "#b9d6f2",
        borderColor: "#b9d6f2",
        pointBackgroundColor: "#b9d6f2",
        pointBorderColor: "#b9d6f2",
        pointHoverBackgroundColor: "#b9d6f2",
        pointHoverBorderColor: "#b9d6f2",
      },
      {
        data: [],
        label: "Quarter 4",
        backgroundColor: "#adf7b6",
        borderColor: "#adf7b6",
        pointBackgroundColor: "#adf7b6",
        pointBorderColor: "#adf7b6",
        pointHoverBackgroundColor: "#adf7b6",
        pointHoverBorderColor: "#adf7b6",
      },
    ],
    labels: [],
  };

  //NumofCustomers Data config
  public NumofCustomersData: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "Number of Customers",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
    ],
    labels: [],
  };
  public NumofCustomersDataQOQ: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "Quarter 1",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
      {
        data: [],
        label: "Quarter 2",
        backgroundColor: "#7dcfb6",
        borderColor: "#7dcfb6",
        pointBackgroundColor: "#7dcfb6",
        pointBorderColor: "#7dcfb6",
        pointHoverBackgroundColor: "#7dcfb6",
        pointHoverBorderColor: "#7dcfb6",
      },
      {
        data: [],
        label: "Quarter 3",
        backgroundColor: "#b9d6f2",
        borderColor: "#b9d6f2",
        pointBackgroundColor: "#b9d6f2",
        pointBorderColor: "#b9d6f2",
        pointHoverBackgroundColor: "#b9d6f2",
        pointHoverBorderColor: "#b9d6f2",
      },
      {
        data: [],
        label: "Quarter 4",
        backgroundColor: "#adf7b6",
        borderColor: "#adf7b6",
        pointBackgroundColor: "#adf7b6",
        pointBorderColor: "#adf7b6",
        pointHoverBackgroundColor: "#adf7b6",
        pointHoverBorderColor: "#adf7b6",
      },
    ],
    labels: [],
  };

  //Inventory Amount data config
  public InventoryAmountData: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "On Hand Inventory Amount",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
    ],
    labels: [],
  };
  public InventoryAmountDataQOQ: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "Quarter 1",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
      {
        data: [],
        label: "Quarter 2",
        backgroundColor: "#7dcfb6",
        borderColor: "#7dcfb6",
        pointBackgroundColor: "#7dcfb6",
        pointBorderColor: "#7dcfb6",
        pointHoverBackgroundColor: "#7dcfb6",
        pointHoverBorderColor: "#7dcfb6",
      },
      {
        data: [],
        label: "Quarter 3",
        backgroundColor: "#b9d6f2",
        borderColor: "#b9d6f2",
        pointBackgroundColor: "#b9d6f2",
        pointBorderColor: "#b9d6f2",
        pointHoverBackgroundColor: "#b9d6f2",
        pointHoverBorderColor: "#b9d6f2",
      },
      {
        data: [],
        label: "Quarter 4",
        backgroundColor: "#adf7b6",
        borderColor: "#adf7b6",
        pointBackgroundColor: "#adf7b6",
        pointBorderColor: "#adf7b6",
        pointHoverBackgroundColor: "#adf7b6",
        pointHoverBorderColor: "#adf7b6",
      },
    ],
    labels: [],
  };

  //Inventory quantity data config
  public InventoryQuantityData: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "On Hand Inventory Quantity",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
    ],
    labels: [],
  };
  public InventoryQuantityDataQOQ: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "Quarter 1",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
      {
        data: [],
        label: "Quarter 2",
        backgroundColor: "#7dcfb6",
        borderColor: "#7dcfb6",
        pointBackgroundColor: "#7dcfb6",
        pointBorderColor: "#7dcfb6",
        pointHoverBackgroundColor: "#7dcfb6",
        pointHoverBorderColor: "#7dcfb6",
      },
      {
        data: [],
        label: "Quarter 3",
        backgroundColor: "#b9d6f2",
        borderColor: "#b9d6f2",
        pointBackgroundColor: "#b9d6f2",
        pointBorderColor: "#b9d6f2",
        pointHoverBackgroundColor: "#b9d6f2",
        pointHoverBorderColor: "#b9d6f2",
      },
      {
        data: [],
        label: "Quarter 4",
        backgroundColor: "#adf7b6",
        borderColor: "#adf7b6",
        pointBackgroundColor: "#adf7b6",
        pointBorderColor: "#adf7b6",
        pointHoverBackgroundColor: "#adf7b6",
        pointHoverBorderColor: "#adf7b6",
      },
    ],
    labels: [],
  };

  //stor chart data config
  public storChartData: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "STOR",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
    ],
    labels: [],
  };

  public storChartDataQOQ: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "Quarter 1",
        backgroundColor: "#3599CC",
        borderColor: "#3599CC",
        pointBackgroundColor: "#3599CC",
        pointBorderColor: "#3599CC",
        pointHoverBackgroundColor: "#3599CC",
        pointHoverBorderColor: "#3599CC",
      },
      {
        data: [],
        label: "Quarter 2",
        backgroundColor: "#7dcfb6",
        borderColor: "#7dcfb6",
        pointBackgroundColor: "#7dcfb6",
        pointBorderColor: "#7dcfb6",
        pointHoverBackgroundColor: "#7dcfb6",
        pointHoverBorderColor: "#7dcfb6",
      },
      {
        data: [],
        label: "Quarter 3",
        backgroundColor: "#b9d6f2",
        borderColor: "#b9d6f2",
        pointBackgroundColor: "#b9d6f2",
        pointBorderColor: "#b9d6f2",
        pointHoverBackgroundColor: "#b9d6f2",
        pointHoverBorderColor: "#b9d6f2",
      },
      {
        data: [],
        label: "Quarter 4",
        backgroundColor: "#adf7b6",
        borderColor: "#adf7b6",
        pointBackgroundColor: "#adf7b6",
        pointBorderColor: "#adf7b6",
        pointHoverBackgroundColor: "#adf7b6",
        pointHoverBorderColor: "#adf7b6",
      },
    ],
    labels: [],
  };


}
function indexOf(element: any) {
  throw new Error("Function not implemented.");
}

