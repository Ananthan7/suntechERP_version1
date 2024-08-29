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
  divisionDataSource: any[] = [];
  areaDataSource: any[] = [];
  businessCategDataSource: any[] = [];
  dataSourceHead: any[] = [];
  showFilterRow: boolean = true;
  currentFilter: any;
  viewMode: boolean = false;
  checkedItems: any[] = [];

  //PAGINATION
  totalItems: number = 1000; // Total number of items
  pageSize: number = 10; // Number of items per page
  pageIndex: number = 1; // Current page index

  @Input() existingData: any;
  selectedRowKeys: number[] = [];
  selectedDivisionKeys: number[]= [];
  selectedAreaKeys: any[]= [];
  selectedBcategKeys: any[] = [];

  selectedBranchData: any;
  selectedDivisionData: any;
  selectedAreaData: any;
  selectedBcategData: any;
  
  constructor(private toastr: ToastrService, private commonService: CommonServiceService,
    private dataService: SuntechAPIService, private modalService: NgbModal,) { }

  ngOnInit() {
    this.getAPIData()
  }

  openMasterSearch() {
    this.selectedModal = this.modalService.open(this.master_search, {
      size: 'xl',
      backdrop: true,
      keyboard: false,
      //  windowClass: 'modal-full-width'
    });

    console.log('Branch selectedRowKeys', this.selectedRowKeys)
    console.log('selected divison keys', this.selectedDivisionKeys)
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
  // handleRowClick(event: any) {
  //   this.newRowClick.emit(event.data)
  //   // this.close()
  // }
  onCheckboxChange(event: any, data: any) {
    data.data.checked = event.checked
    let checkedItems: any[] = [];
    let checkedDivisionItems: any[] = [];
    checkedItems = this.BranchDataSource.filter(item => item.checked)
    checkedDivisionItems = this.divisionDataSource.filter(item => item.checked)

    let checkedAreaItems: any[] = [];
    let checkedB_categoryItems: any[] = [];
    checkedAreaItems = this.areaDataSource.filter(item => item.checked)
    checkedB_categoryItems = this.businessCategDataSource.filter(item => item.checked)
    const uniqueArray = Array.from(new Set([
      ...this.BranchDataSource,
      ...this.divisionDataSource,
      ...this.areaDataSource,
      ...this.businessCategDataSource
    ]));
    // console.log(uniqueArray)
    this.newRowClick.emit(uniqueArray)
  }


  onSelectionChanged(event: any) {
    this.selectedRowKeys= event.selectedRowKeys;
    this.selectedBranchData = event.selectedRowsData;
    // console.log('branch event',  this.selectedRowKeys)
    this.emitData()
    // this.newRowClick.emit(event.selectedRowsData)
  }

  onDivisionSelection(event: any){
    this.selectedDivisionKeys = event.selectedRowKeys;
    this.selectedDivisionData = event.selectedRowsData;
    // console.log('division event', event.selectedRowKeys)
    this.emitData()
  }

  onAreaSelection(event: any){
    this.selectedAreaKeys = event.selectedRowKeys;
    this.selectedAreaData = event.selectedRowsData;
    // console.log('area event', event.selectedRowKeys)
    this.emitData()
  }

  onBcategSelection(event: any){
    this.selectedBcategKeys = event.selectedRowKeys;
    this.selectedBcategData = event.selectedRowsData;
     console.log('B categ event', event.selectedRowKeys)
     this.emitData()
  }

  emitData() {
    this.newRowClick.emit({
      selectedRowKeys: this.selectedRowKeys,
      selectedDivisionKeys: this.selectedDivisionKeys,
      selectedAreaKeys: this.selectedAreaKeys,
      selectedBcategKeys : this.selectedBcategKeys,

      BranchData: this.selectedBranchData,
      DivisionData: this.selectedDivisionData,
      AreaData: this.selectedAreaData,
      BusinessCategData: this.selectedBcategData
    });
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

        this.divisionDataSource = result.dynamicData[1]
        this.dataSourceHead = []
        this.dataSourceHead = Object.keys(this.divisionDataSource[0]);
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

    this.isLoading = true;

    this.dataService.postDynamicAPI('BranchDivisonSelector', payload).subscribe((response) => {
      this.isLoading = false;
      console.log('branch division API call data', response);

      this.BranchDataSource = response.dynamicData[0] || [];

      this.divisionDataSource = response.dynamicData[1] || [];
      this.areaDataSource = response.dynamicData[2] || [];
      this.businessCategDataSource = response.dynamicData[3] || [];

      if (this.BranchDataSource.length > 0) {
        this.dataSourceHead = Object.keys(this.BranchDataSource[0]);
        this.dataSourceHead.unshift(this.dataSourceHead.pop());
      } else {
        this.toastr.error('Data Not Available');
      }
    },
      error => {
        console.error('Error occurred:', error);
      });
  }





}
