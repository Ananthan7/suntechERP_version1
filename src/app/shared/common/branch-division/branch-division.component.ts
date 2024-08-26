import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from '../../data/master-find-model';

@Component({
  selector: 'app-branch-division',
  templateUrl: './branch-division.component.html',
  styleUrls: ['./branch-division.component.scss']
})
export class BranchDivisionComponent implements OnInit {
  selectedModal: NgbModalRef | undefined;
  @ViewChild('master_search') master_search: any;
  @Output() newRowClick = new EventEmitter();
  @Input() MasterSearch!: MasterSearchModel;
  subscriptions$!: Subscription;
  isLoading: boolean = false;
  BranchDataSource: any[] = [];
  dataSourceHead: any[] = [];
  showFilterRow: boolean = true;
  currentFilter: any;



  //PAGINATION
  totalItems: number = 1000; // Total number of items
  pageSize: number = 10; // Number of items per page
  pageIndex: number = 1; // Current page index

  
  constructor( private toastr: ToastrService,  private commonService: CommonServiceService,
    private dataService: SuntechAPIService, private modalService: NgbModal,) { }

  ngOnInit(){
    this.getAPIData()
  }

  openMasterSearch() {
    this.selectedModal = this.modalService.open(this.master_search, {
      size: 'lg',
      backdrop: true,
      keyboard: false,
      //  windowClass: 'modal-full-width'
    });
  }

  nextPage() {
    if ((this.pageIndex + 1) * this.pageSize < this.totalItems) {
      this.pageIndex = this.pageIndex + 1;
      this.getAPIData(this.pageIndex);
    }
  }
  previousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      if (this.BranchDataSource.length > 10) {
        this.BranchDataSource.splice(this.BranchDataSource.length - this.pageSize, this.pageSize);
      }
    }
  }
  handleRowClick(event: any) {
    this.newRowClick.emit(event.data)
    this.close()
  }
  onCheckboxChange(data: any){
    console.log(data)
  }




  close() {
    this.selectedModal?.dismiss()
  }
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
        this.BranchDataSource = result.dynamicData[0]
        
        this.dataSourceHead = Object.keys(this.BranchDataSource[0]);
        this.dataSourceHead.unshift(this.dataSourceHead.pop())
      } else {
        this.toastr.error('Data Not Available')
      }
    })
  }
  
  ngOnDestroy(): void {
    this.subscriptions$ && this.subscriptions$.unsubscribe()
  }

  // Its a POST API 
  // http://94.200.156.234:85/api/BranchDivisonSelector?DBBranch=MOE
  // {
  //   "strUserName": "VASANT",
  //   "strDivisionMS": "M",
  //   "strLoginBranch": "MOE"
  // }
  getAPIData(pageIndex?: number) {

    const payload = {
      strUserName: 'VASANT',
      strDivisionMS: 'S',
      strLoginBranch: 'MOE'
    };
    let dbBranch = 'MOE';
    this.isLoading = true;
    this.dataService.BranchDivisionPostDynamicAPI(payload).subscribe((response) => {
      this.isLoading = false;
      console.log('branch division API call data', response)
      if (response.dynamicData[0]) {
        this.BranchDataSource = response.dynamicData[0]

        if (this.BranchDataSource.length > 0) {
          this.BranchDataSource = [...this.BranchDataSource, ...response.dynamicData[0]];
        } else {
          this.BranchDataSource = response.dynamicData[0];
          this.nextPage()
        }
        this.dataSourceHead = Object.keys(this.BranchDataSource[0]);
        this.dataSourceHead.unshift(this.dataSourceHead.pop())
      } else {
        this.toastr.error('Data Not Available')
      }
    },
    error => {
      console.error('Error occurred:', error);
    })
  }




}
