import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from '../../data/master-find-model';
import * as convert from 'xml-js';

@Component({
  selector: 'master-find-icon',
  templateUrl: './master-find-icon.component.html',
  styleUrls: ['./master-find-icon.component.scss']
})
export class MasterFindIconComponent implements OnInit {
  @ViewChild('master_search') master_search: any;
  selectedModal: NgbModalRef | undefined;

  @Output() newRowClick = new EventEmitter();
  @Input() MasterSearch!: MasterSearchModel;

  searchFieldLabel: any;
  searchNameLabel: any;
  showFilterRow: boolean = true;
  showHeaderFilter: boolean = true;
  isLoading: boolean = false;
  currentFilter: any;

  dataSource: any[] = [];
  dataSourceHead: any[] = [];
  subscriptions$!: Subscription;


  constructor(
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private modalService: NgbModal,
    // private ChangeDetector: ChangeDetectorRef, //to detect changes in dom
  ) {

  }

  ngOnInit(): void {
    this.getInitialValue()

  }

  openMasterSearch() {
    this.selectedModal = this.modalService.open(this.master_search, {
      size: 'lg',
      backdrop: true,
      keyboard: false,
      windowClass: 'modal-full-width'
    });

  }

  //handle Row Click of table
  handleRowClick(event: any) {
    this.newRowClick.emit(event.data)
    this.close()
  }

   //PAGINATION
   totalItems: number = 1000; // Total number of items
   pageSize: number = 10; // Number of items per page
   pageIndex: number = 1; // Current page index
 
   previousPage() {
     if (this.pageIndex > 0) {
       this.pageIndex = this.pageIndex - 1;
       if (this.dataSource.length > 10) {
         this.dataSource.splice(this.dataSource.length - this.pageSize, this.pageSize);
       }
     }
   }
   nextPage() {
     if ((this.pageIndex + 1) * this.pageSize < this.totalItems) {
       this.pageIndex = this.pageIndex + 1;
       this.getInitialValue(this.pageIndex);
     }
   }
  getInitialValue(pageIndex?: number) {
    // const options = { compact: true, ignoreComment: true, spaces: 4 };
    // let xmlData = convert.js2xml({ RFMTYPES: { RFMTYPE: this.dataForm.value } }, options);
    let param = {
      "PAGENO": pageIndex ? pageIndex : this.MasterSearch.PAGENO,
      "RECORDS": this.MasterSearch.RECORDS || 10,
      "LOOKUPID": this.MasterSearch.LOOKUPID || 2,
      "searchField": this.MasterSearch.SEARCH_FIELD || "",
      "searchValue": this.MasterSearch.SEARCH_VALUE || ""
    }
    let APIS = 'MasterLookUp'
    this.isLoading = true;
    this.subscriptions$ = this.dataService.postDynamicAPI(APIS, param).subscribe((result) => {
      this.isLoading = false;
      if (result.dynamicData[0]) {
        // if (this.MasterFindData.DB_FIELD_VALUE == 'ACCODE') {
        this.dataSource = result.dynamicData[0]

        if (this.dataSource.length > 0) {
          this.dataSource = [...this.dataSource, ...result.dynamicData[0]];
        } else {
          this.dataSource = result.dynamicData[0];
          this.nextPage()
        }
        this.dataSourceHead = Object.keys(this.dataSource[0]);
        this.dataSourceHead.unshift(this.dataSourceHead.pop())
      } else {
        this.toastr.error('Data Not Available')
      }
    })
  }

  //search Value Change
  searchValueChange(event: any) {
    if (event.target.value == '') return
    let param = {
      "PAGENO": this.MasterSearch.PAGENO,
      "RECORDS": this.MasterSearch.RECORDS,
      "LOOKUPID": this.MasterSearch.LOOKUPID,
      "searchField": this.MasterSearch.SEARCH_FIELD || "",
      "searchValue": event.target.value || ""
    }
    let APIS = 'MasterLookUp'
    this.isLoading = true;
    this.subscriptions$ = this.dataService.postDynamicAPI(APIS, param).subscribe((result) => {
      this.isLoading = false;
      if (result.dynamicData[0]) {
        // if (this.MasterFindData.DB_FIELD_VALUE == 'ACCODE') {
        this.dataSource = result.dynamicData[0]
        
        this.dataSourceHead = Object.keys(this.dataSource[0]);
        this.dataSourceHead.unshift(this.dataSourceHead.pop())
      } else {
        this.toastr.error('Data Not Available')
      }
    })
  }
  //number validation
  isNumeric(event: any) {
    return this.commonService.isNumeric(event);
  }
  /**USE: close modal window */
  close() {
    this.selectedModal?.dismiss()
  }
  //unsubscriptions of streams
  ngOnDestroy(): void {
    this.subscriptions$ && this.subscriptions$.unsubscribe()
  }
}