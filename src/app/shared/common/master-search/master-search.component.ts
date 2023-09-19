import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MasterSearchModel } from '../../data/master-find-model';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'master-search',
  templateUrl: './master-search.component.html',
  styleUrls: ['./master-search.component.scss']
})
export class MasterSearchComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid!: DxDataGridComponent;
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel
  @Output() newRowClick = new EventEmitter();
  @Input() MasterSearchData!: MasterSearchModel;
  searchFieldLabel: any;
  searchNameLabel: any;
  showFilterRow: boolean = true;
  showHeaderFilter: boolean = true;
  isLoading: boolean = false;
  currentFilter: any;

  alphabetSource: any[] =  ["A","B","C","D","E","F","G","H","I","J","K","L",
  "M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

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
    // this.getInitialValue()
    this.loadData();
  }
  alphabetClicked(item:any){
    this.MasterSearchData.SEARCH_VALUE = item;
    this.currentPage = 1
    this.loadData()
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
    let param = {
      "PAGENO": this.currentPage ? this.currentPage : this.MasterSearchData.PAGENO,
      "RECORDS": this.MasterSearchData.RECORDS,
      "LOOKUPID": this.MasterSearchData.LOOKUPID,
      "ORDER_TYPE": this.MasterSearchData.SEARCH_VALUE ? 1 : 0,
      "WHERECONDITION": this.MasterSearchData.WHERECONDITION || "",
      "searchField": this.MasterSearchData.SEARCH_FIELD || "",
      "searchValue": this.MasterSearchData.SEARCH_VALUE || ""
    }
    let APIS = 'MasterLookUp'
    this.isLoading = true;
    this.subscriptions$ = this.dataService.postDynamicAPI(APIS, param).subscribe((result) => {
      this.isLoading = false;
      if (result.dynamicData && result.dynamicData[0].length>0) {
        this.dataSource = result.dynamicData[0]
        let dataCount = result.dynamicData[1] || []
        this.totalItems = dataCount.COUNT

        this.dataSourceHead = Object.keys(this.dataSource[0]);
        this.currentPage++;
      }
      // else {
      //   this.toastr.error('Data Not Available')
      // }
    })

  }
  /**use: load datas on scroll */
  loadMoreData(currentPage?:number) {
    if(this.totalItems >= this.dataSource.length+1 && this.currentPage != currentPage) return
    let param = {
      "PAGENO": this.currentPage ? this.currentPage : this.MasterSearchData.PAGENO,
      "RECORDS": this.MasterSearchData.RECORDS,
      "LOOKUPID": this.MasterSearchData.LOOKUPID,
      "ORDER_TYPE": this.MasterSearchData.SEARCH_VALUE ? 1 : 0,
      "WHERECONDITION": this.MasterSearchData.WHERECONDITION || "",
      "searchField": this.MasterSearchData.SEARCH_FIELD || "",
      "searchValue": this.MasterSearchData.SEARCH_VALUE || "",
    }
    let APIS = 'MasterLookUp'
    this.isLoading = true;
    this.subscriptions$ = this.dataService.postDynamicAPI(APIS, param).subscribe((result) => {
      this.isLoading = false;
      if (result.dynamicData[0]) {
        this.dataSourceHead = Object.keys(this.dataSource[0]);
        this.dataSource = this.dataSource.concat(result.dynamicData[0]);
        
        this.currentPage++;
      } 
      // else {
      //   this.toastr.error('Data Not Available')
      // }
    })

  }

  showOverlayPanel(event: Event) {
    this.overlayPanel.show(event);
  }

  closeOverlayPanel() {
    this.overlayPanel.hide();
  }
  //handle Row Click of table
  handleRowClick(event: any) {
    this.newRowClick.emit(event)
    this.closeOverlayPanel()
  }
  //PAGINATION

  //search Value Change
  searchValueChange(event: any) {
    if (event.target.value == '') return
    let param = {
      "PAGENO": this.MasterSearchData.PAGENO,
      "RECORDS": this.MasterSearchData.RECORDS,
      "LOOKUPID": this.MasterSearchData.LOOKUPID,
      "searchField": this.MasterSearchData.SEARCH_FIELD || "",
      "searchValue": this.MasterSearchData.SEARCH_VALUE || ""
    }
    let APIS = 'MasterLookUp'
    this.isLoading = true;
    this.subscriptions$ = this.dataService.postDynamicAPI(APIS, param).subscribe((result) => {
      this.isLoading = false;
      if (result.dynamicData[0]) {
        this.dataSource = result.dynamicData[0]
        
        this.dataSourceHead = Object.keys(this.dataSource[0]);
      } 
      // else {
      //   this.toastr.error('Data Not Available')
      // }
    })
  }
  //number validation
  isNumeric(event: any) {
    return this.commonService.isNumeric(event);
  }
  /**USE: close modal window */
  close() {

  }
  //unsubscriptions of streams
  ngOnDestroy(): void {
    this.subscriptions$ && this.subscriptions$.unsubscribe()
  }

}
