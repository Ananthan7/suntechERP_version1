import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MasterSearchModel } from '../../data/master-find-model';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { DxDataGridComponent } from 'devextreme-angular';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'master-search',
  templateUrl: './master-search.component.html',
  styleUrls: ['./master-search.component.scss']
})
export class MasterSearchComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true }) dataGrid!: DxDataGridComponent;
  @ViewChild('overlayPanel') overlayPanels!: OverlayPanel
  @ViewChild('dropdown') dropDown!: NgbDropdown;
  @Output() newRowClick = new EventEmitter();
  @Input() MasterSearchData!: MasterSearchModel;
  searchFieldLabel: any;
  searchNameLabel: any;
  showFilterRow: boolean = true;
  showHeaderFilter: boolean = true;
  isLoading: boolean = false;
  currentFilter: any;

  alphabetSource: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  dataSource: any[] = [];
  dataSourceHead: any[] = [];
  subscriptions$!: Subscription;

  //lazyload
  data: any[] = [];
  pageSize = 10;
  currentPage = 1;
  totalItems: number = 0;
  constructor(
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
  ) {
  }
  ngOnInit(): void {
    if (!this.MasterSearchData?.LOAD_ONCLICK) {
      this.loadData();
    }
  }
  getAPIValue() {
    let API: string = this.MasterSearchData.API_VALUE || ''
    this.commonService.toastSuccessByMsgId('MSG81447');
    this.subscriptions$ = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        console.log(result);
        if (result.response) {
          this.dataSourceHead = this.MasterSearchData.SEARCH_FIELD?.split(',').map(item => item.trim()) || []
          this.dataSource = result.response
          this.dataSourceAlteration()//for adding changes in grid values
        } else {
          this.dataSourceHead = []
          this.dataSource = []
          this.closeOverlayPanel()
          this.toastr.error('Data Not Available')
        }
      }, err => alert(err))
  }

  alphabetClicked(item: any) {
    this.MasterSearchData.SEARCH_VALUE = item;
    this.currentPage = 1
    this.searchValueChange()
  }
  @HostListener('scroll', ['$event'])
  onScrollTable(event: any) {
    const container = event.target;
    const scrollPosition = container.scrollTop + container.clientHeight;
    // const isAtBottom = scrollPosition >= container.scrollHeight  - 4;
    if (scrollPosition >= container.scrollHeight - 1) {
      this.loadMoreData(this.currentPage);
    }
  }
  /**use: first call to load data */
  loadData() {
    this.dataSource = []
    if (this.MasterSearchData?.API_VALUE && this.MasterSearchData?.API_VALUE != '') {
      this.getAPIValue()
      return
    }
    if (!this.MasterSearchData) return
    let param = {
      "PAGENO": this.MasterSearchData.PAGENO,
      "RECORDS": this.MasterSearchData.RECORDS,
      "LOOKUPID": this.MasterSearchData.LOOKUPID,
      "ORDER_TYPE": this.MasterSearchData.SEARCH_VALUE ? 1 : 0,
      "WHERECONDITION": this.MasterSearchData.WHERECONDITION,
      "searchField": this.MasterSearchData.SEARCH_FIELD,
      "searchValue": this.MasterSearchData.SEARCH_VALUE
    }
    let APIS = 'MasterLookUp'
    this.isLoading = true;
    this.subscriptions$ = this.dataService.postDynamicAPI(APIS, param).subscribe((result) => {
      this.isLoading = false;
      if (result.dynamicData && result.dynamicData[0].length > 0) {
        this.dataSource = result.dynamicData[0];
        if (this.dataSource[0]) this.dataSourceHead = Object.keys(this.dataSource[0]);
        let dataCount = result.dynamicData[1];
        if (dataCount) this.totalItems = this.commonService.emptyToZero(dataCount[0]?.COUNT)
        // if(this.dataSource[0]) this.dataSourceHead = Object.keys(this.dataSource[0]);
        this.currentPage++;
      }
      // else {
      //   this.toastr.error('Data Not Available')
      // }
    })

  }
  setPostdata() {
    return {
      "PAGENO": this.currentPage ? this.currentPage : this.MasterSearchData.PAGENO,
      "RECORDS": this.MasterSearchData.RECORDS,
      "LOOKUPID": this.MasterSearchData.LOOKUPID,
      "ORDER_TYPE": this.f2Flag ? 0 : 1,
      "WHERECONDITION": this.MasterSearchData.WHERECONDITION,
      "searchField": this.MasterSearchData.SEARCH_FIELD,
      "searchValue": this.MasterSearchData.SEARCH_VALUE,
    }
  }
  /**use: load datas on scroll */
  loadMoreData(currentPage?: number) {
    if (this.MasterSearchData.FRONTENDFILTER) return;
    if (this.totalItems >= this.dataSource.length + 1 && this.currentPage != currentPage) return
    let param = this.setPostdata()
    let APIS = 'MasterLookUp'
    this.isLoading = true;
    this.subscriptions$ = this.dataService.postDynamicAPI(APIS, param).subscribe((result) => {
      this.isLoading = false;
      if (result.dynamicData[0]) {
        this.dataSourceHead = Object.keys(this.dataSource[0]);
        this.dataSource = this.dataSource.concat(result.dynamicData[0]);
        this.dataSourceAlteration()
        this.currentPage++;
      }
      // else {
      //   this.toastr.error('Data Not Available')
      // }
    })

  }
  dataSourceAlteration() {
    if (this.MasterSearchData.LOOKUPID == 8) {
      this.dataSource.forEach((item: any) => {
        item.CONV_RATE = this.commonService.decimalQuantityFormat(item.CONV_RATE, 'RATE')
      })
    }
    //continue adding with conditions
  }
  showOverlayPanel(event?: Event) {
    if (this.MasterSearchData?.LOAD_ONCLICK) {
      this.loadData();
    }
    if (this.MasterSearchData?.SEARCH_VALUE) {
      this.loadData();
    }
    this.overlayPanels.show(event);
  }
  onHidePanel() {
    if (this.MasterSearchData.SEARCH_VALUE != '') {
      this.currentPage = 1
      this.MasterSearchData.LOAD_ONCLICK = true
    }
    this.MasterSearchData.PAGENO = 1
    this.MasterSearchData.SEARCH_VALUE = ''
  }
  closeOverlayPanel() {
    if (this.MasterSearchData.SEARCH_VALUE != '') {
      this.currentPage = 1
      this.MasterSearchData.LOAD_ONCLICK = true
    }
    this.MasterSearchData.PAGENO = 1
    this.MasterSearchData.SEARCH_VALUE = ''
    this.overlayPanels.hide();
    // this.dropDown.close()
  }
  dorpdownToggle(event: any) {
    if (!event) {
      if (this.MasterSearchData.SEARCH_VALUE != '') {
        // this.currentPage = 1
        this.MasterSearchData.LOAD_ONCLICK = true
      }
    }
    this.currentPage = 1
    this.MasterSearchData.PAGENO = 1
    this.MasterSearchData.SEARCH_VALUE = ''
  }
  //handle Row Click of table
  handleRowClick(event: any) {
    this.newRowClick.emit(event)
    this.closeOverlayPanel()
    // this.dropDown.close()
  }
  // searchItems(array:any, searchValue: string) {
  //   let keyName:any = Object.keys(array[0])
  //   return array.filter((item:any) =>{
  //     for (const key in item){
  //       if(item[key].lowe.includes(searchValue)){
  //         return true;
  //       }
  //     }
  //   });
  // }

  //search Value Change
  searchValueChange(event?: any) {
    this.currentPage = 1
    let param = this.setPostdata()
    this.isLoading = true;
    this.subscriptions$ = this.dataService.postDynamicAPI('MasterLookUp', param).subscribe((result) => {
      this.isLoading = false;
      let data = result.dynamicData[0]
      if (data && data.length > 0) {
        this.dataSource = result.dynamicData[0]
        this.dataSourceHead = Object.keys(this.dataSource[0]);
        if (this.MasterSearchData.FRONTENDFILTER && this.MasterSearchData.SEARCH_VALUE != '') {
          this.dataSource = this.commonService.searchStartsWithItemsInArray(this.dataSource, this.MasterSearchData.SEARCH_VALUE)
          this.dataSourceHead = Object.keys(this.dataSource[0]);
          return
        }
      } else {
        this.commonService.toastErrorByMsgId('No data found')
        this.MasterSearchData.SEARCH_VALUE = ''
      }
    })
  }
  isNumber(value: string): boolean {
    let bol = /^\d+(\.\d+)?$/.test(value);
    return bol;
  }
  //number validation
  isNumeric(event: any) {
    return this.commonService.isNumeric(event);
  }
  /**USE: close modal window */
  close() {

  }
  f2Flag = false;
  SearchPlaceholder:string = 'Search StartsWith';
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Check if the pressed key is Enter
    if (event.key != 'F2') return
    this.f2Flag = !this.f2Flag
    this.SearchPlaceholder = this.f2Flag ? 'Search AnyWhere' : 'Search StartsWith'
  }
  //unsubscriptions of streams
  ngOnDestroy(): void {
    this.subscriptions$ && this.subscriptions$.unsubscribe()
  }

}
