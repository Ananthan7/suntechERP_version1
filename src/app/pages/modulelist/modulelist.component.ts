import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Colors } from 'src/app/layouts/themes/_themeCode';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { IndexedApiService } from 'src/app/services/indexed-api.service';
import { IndexedDbService } from 'src/app/services/indexed-db.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-modulelist',
  templateUrl: './modulelist.component.html',
  styleUrls: ['./modulelist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModulelistComponent implements OnInit {
  //variables
  menuList: any[] = [];
  isLoading: boolean = false;
  currentBranch: any = localStorage.getItem('userbranch') || '';
  baseYear: any = localStorage.getItem('YEAR') || '';
  public colors = Colors;
  subscriptions$!: Subscription;
  constructor(
    private dataService: SuntechAPIService,
    public indexedApiService: IndexedApiService,
    public inDb: IndexedDbService,
    private ChangeDetector: ChangeDetectorRef,
    private commService: CommonServiceService
  ) {
    this.getModuleList()
    this.indexedApiService.setInitailLoadSetUp()
  }

  ngOnInit(): void {
    this.setSoldItemChart();
    this.setCollectionChart();
    this.getGenderwiseData();
    this.setVoctypeMaster();
    this.setCitywiseData();
    this.setSalesChart();
  }

  setVoctypeMaster() {
    let branch = localStorage.getItem('userbranch')
    this.inDb.getAllData('VocTypeMaster').subscribe((data) => {
      if (data.length == 0 || data.length == 1) {
        this.indexedApiService.getVocTypeMaster(branch);
      }
    });
  }
  imageUrlMap: any = {
    1: '../../assets/images/lp-icons/newIcons/Retail.svg',
    2: '../../assets/images/lp-icons/newIcons/bullion.svg',
    4: '../../assets/images/lp-icons/newIcons/Refinery.svg',
    5: '../../assets/images/lp-icons/newIcons/Jewellery Manufacturing.svg',
    6: '../../assets/images/lp-icons/newIcons/componentwise.svg',
    7: '../../assets/images/lp-icons/newIcons/Wholesale.svg',
    9: '../../assets/images/lp-icons/newIcons/Payroll.svg',
    10: '../../assets/images/lp-icons/newIcons/boiling.svg',
    11: '../../assets/images/lp-icons/newIcons/Repairing.svg',
    12: '../../assets/images/lp-icons/newIcons/catalogue.svg',
    13: '../../assets/images/lp-icons/newIcons/fixed assets.svg',
    14: '../../assets/images/lp-icons/newIcons/General.svg',
  };
  /**USE: get module list from API */
  getModuleList() {
    this.isLoading = true;
    let API = 'SuntechProdModuleMaster/GetProductModuleList'
    this.subscriptions$ = this.dataService.getDynamicAPICustom(API).subscribe((response: any) => {
      this.isLoading = false;
      if (response.status == 'Success') {
        this.menuList = response.response;
        this.menuList.push({
          MID: 15,
          MODULE_NAME: 'Addons',
          imageUrl: '../../assets/images/lp-icons/newIcons/add_ons.svg'
        });

        this.menuList.sort((a, b) => {
          const nameA = a.MODULE_NAME;
          const nameB = b.MODULE_NAME;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });

        this.menuList.forEach(data => {
          if (this.imageUrlMap[data.MID]) {
            data.imageUrl = this.imageUrlMap[data.MID];
          }
        });
        localStorage.setItem('MENU_LIST', JSON.stringify(this.menuList));
        this.ChangeDetector.detectChanges()
      } else {
        this.menuList = [];
      }
    }, err => {
      this.isLoading = false;
      alert(err)
    })
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe()
  }

  getCommonInput(): string {
    return JSON.stringify({
      "branch_code":this.currentBranch,
      "from_date": "",
      "to_date": "",
      "year": this.baseYear,
      "month_no": ""
    });
  }
  
  postDataToAPI(flag: string, successCallback: (result: any) => void) {
    let postData = {
      "SPID": "156",
      "parameter": {
        "flag": flag,
        "input": this.getCommonInput()
      }
    };
    return this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        if (result.status === "Success") {
          successCallback(result);
        }
      }, err => {
        this.commService.toastErrorByMsgId('MSG81451');
      });
  }
  
  processTopRecords(data: any[], labelField: string, valueField: string, topN: number = 5) {
    const sortedData = data.sort((a: any, b: any) => b[valueField] - a[valueField]).slice(0, topN);
    const labels = sortedData.map((item: any) => item[labelField]);
    const values = sortedData.map((item: any) => item[valueField]);
    return { labels, values };
  }
  
  storeChartData(key: string, labels: string[], datasets: any[]) {
    const chartData = { labels, datasets };
    localStorage.setItem(key, JSON.stringify(chartData));
  }
  
  setSoldItemChart() {
    this.postDataToAPI("Sales_product", (result) => {
      const combinedArray = this.combineByBrand(result.dynamicData[0]);
      const { labels, values } = this.processTopRecords(combinedArray, 'BRAND_CODE', 'NETVALUECC');
      
      const salesRevenue = {
        labels: labels,
        datasets: [
          {
            label: 'Sold Items',
            data: values,
            "backgroundColor": this.colors.lightThemeBar1,
            "borderColor": this.colors.lightThemeBar1,
            "pointBackgroundColor": this.colors.lightThemeBar1,
            "pointBorderColor": this.colors.lightThemeBar1,
            "pointHoverBackgroundColor": this.colors.lightThemeBar1,
            "pointHoverBorderColor": this.colors.lightThemeBar1,
          }
        ]
      };
  
      this.storeChartData('soldItemDetails', salesRevenue.labels, salesRevenue.datasets);
    });
  }
  
  setCollectionChart() {
    this.postDataToAPI("Sales_collection", (result) => {
      const { labels, values } = this.processTopRecords(result.dynamicData[0], 'COLLECTION', 'NETVALUECC');
  
      const collectionWiseRevenue = {
        labels: labels,
        datasets: [
          {
            label: 'Revenue',
            data: values,
            "backgroundColor": this.colors.lightThemeBar1,
            "borderColor": this.colors.lightThemeBar1,
            "pointBackgroundColor": this.colors.lightThemeBar1,
            "pointBorderColor": this.colors.lightThemeBar1,
            "pointHoverBackgroundColor": this.colors.lightThemeBar1,
            "pointHoverBorderColor": this.colors.lightThemeBar1,
          }
        ]
      };
  
      this.storeChartData('collectionWiseData', collectionWiseRevenue.labels, collectionWiseRevenue.datasets);
    });
  }
  
  getGenderwiseData() {
    this.postDataToAPI("Sales_division", (result) => {
      const { labels, values } = this.processTopRecords(result.dynamicData[0], 'GENDER', 'NETVALUECC');
      
      const backgroundColors = labels.map(label => label === 'Male' ? this.colors.lightThemeBar1 : this.colors.lightThemeBar2);
      const borderColors = labels.map(label => label === 'Male' ? this.colors.lightThemeBar1 : this.colors.lightThemeBar2);
  
      const divisionByGender = {
        labels: labels,
        datasets: [
          {
            label: 'Gender',
            data: values,
            "backgroundColor": backgroundColors,  
            "borderColor": borderColors,        
            "pointBackgroundColor": backgroundColors,
            "pointBorderColor": borderColors,
            "pointHoverBackgroundColor": backgroundColors,
            "pointHoverBorderColor": borderColors,
          }
        ]
      };
  
      this.storeChartData('divisionWiseData', divisionByGender.labels, divisionByGender.datasets);
    });
  }
  
  
  setCitywiseData() {
    this.postDataToAPI("CITYWISE", (result) => {
      const labels = result.dynamicData[0].map((item: any) => item.CITY);
      const cityWiseRevenue = result.dynamicData[0].map((item: any) => item.NETVALUECC);
  
      const salebyCityDetails = {
        labels: labels,
        datasets: [
          {
            data: cityWiseRevenue,
          }
        ]
      };
  
      this.storeChartData('salesbyCity', salebyCityDetails.labels, salebyCityDetails.datasets);
    });
  }
  
  setSalesChart() {
    this.postDataToAPI("Sales", (result) => {
      const months = result.dynamicData[0].map((item: any) => item.MONTH);
      const avgTransactionValues = result.dynamicData[0].map((item: any) => item.AVG_TRN_VALUE);
      const avgUnitCustomers = result.dynamicData[0].map((item: any) => item.AVG_UNIT_CUSTOMER);
      const avgUnitCustomersCount = result.dynamicData[0].map((item: any) => item.CUSTOMER_COUNT);
  
      const customerCountDetails = {
        labels: this.convertMonthNumbersToNames(months),
        datasets: [
          {
            label: 'Customers',
            data: avgUnitCustomersCount,
            "backgroundColor": this.colors.lightThemeBar1,  
            "borderColor": this.colors.lightThemeBar1,          
            "pointBackgroundColor": this.colors.lightThemeBar1,  
          }
        ]
      };
  
      const avgTransactionDetails = {
        labels: this.convertMonthNumbersToNames(months),
        datasets: [
          {
            label: 'Average Transaction Value',
            data: avgTransactionValues,
            "backgroundColor": this.colors.lightThemeBar1,  
            "borderColor": this.colors.lightThemeBar1,          
            "pointBackgroundColor": this.colors.lightThemeBar1,  
          },
          {
            label: 'Average Unit per Customer',
            data: avgUnitCustomers,
            "backgroundColor": this.colors.lightThemeBar2,  
            "borderColor": this.colors.lightThemeBar2,          
            "pointBackgroundColor": this.colors.lightThemeBar2,  
          }
        ]
      };
  
      const outofStockDetails = {
        labels: this.convertMonthNumbersToNames(months),
        datasets: [
          {
            label: 'Out Of Stock',
            data: avgTransactionValues,
            "backgroundColor": this.colors.lightThemeBar2,  
            "borderColor": this.colors.lightThemeBar1,          
            "pointBackgroundColor": this.colors.lightThemeBar2,
          }
        ]
      };
  
      this.storeChartData('outofStock', outofStockDetails.labels, outofStockDetails.datasets);
      this.storeChartData('avgTransaction', avgTransactionDetails.labels, avgTransactionDetails.datasets);
      this.storeChartData('customerCountChart', customerCountDetails.labels, customerCountDetails.datasets);
    });
  }
  
  convertMonthNumbersToNames(monthNumbers: number[]): string[] {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNumbers.map(month => monthNames[month - 1]);
  }
  
  combineByBrand(array: any[]): any[] {
    const result = array.reduce((acc, current) => {
      const existing = acc.find((item: any) => item.BRAND_CODE === current.BRAND_CODE);

      if (existing) {
        existing.NETVALUECC += current.NETVALUECC; 
      } else {
        acc.push({ ...current }); 
      }

      return acc;
    }, []);

    return result;
  }

}
