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
  selectedRowKeys: any[] = [];
  selectedDivisionKeys: any[]= [];
  selectedAreaKeys: any[]= [];
  selectedBcategKeys: any[] = [];

  selectedBranchData: any;
  selectedDivisionData: any;
  selectedAreaData: any;
  selectedBcategData: any;

  @Input() fetchData: any;

  @Input() branchView: boolean = true;
  @Input() divisionView: boolean = true;
  @Input() additionalFilterAreaView: boolean = true;
  @Input() additionalFilterBCategView: boolean = true;

  constructor(private toastr: ToastrService, private commonService: CommonServiceService,
    private dataService: SuntechAPIService, private modalService: NgbModal,) { }

  ngOnInit() {
    this.getAPIData()
  }

  async ngAfterViewInit() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('fetched branch data', this.fetchData)
    const selectedBranchKeys = this.BranchDataSource.filter(item => this.fetchData?.includes(item.BRANCH_CODE)).map(item => item);
    this.selectedRowKeys = selectedBranchKeys;

    const selectedDivisionKeys = this.divisionDataSource.filter(item => this.fetchData?.includes(item.DIVISION_CODE)).map(item => item);
    this.selectedDivisionKeys = selectedDivisionKeys;
    
    const selectedAreaKeys = this.areaDataSource.filter(item => this.fetchData?.includes(item.AREA_CODE)).map(item => item);
    this.selectedAreaKeys = selectedAreaKeys;

    const selectedBusinessCategoryKeys = this.businessCategDataSource.filter(item => this.fetchData?.includes(item.CATEGORY_CODE)).map(item => item);
    this.selectedBcategKeys = selectedBusinessCategoryKeys;

    //to bring the selected entries to top of the grid
    const selectedSet = new Set(this.selectedRowKeys.map(item => item.SRNO));
    this.BranchDataSource.sort((a, b) => {
      const aIsSelected = selectedSet.has(a.SRNO) ? 1 : 0;
      const bIsSelected = selectedSet.has(b.SRNO) ? 1 : 0;
      return bIsSelected - aIsSelected;
    });
    const selectedDivisionSet = new Set(this.selectedDivisionKeys.map(item => item.SRNO));
    this.divisionDataSource.sort((a, b) => {
      const aIsSelected = selectedDivisionSet.has(a.SRNO) ? 1 : 0;
      const bIsSelected = selectedDivisionSet.has(b.SRNO) ? 1 : 0;
      return bIsSelected - aIsSelected;
    });
    const selectedAreaSet = new Set(this.selectedAreaKeys.map(item => item.SRNO));
    this.areaDataSource.sort((a, b) => {
      const aIsSelected = selectedAreaSet.has(a.SRNO) ? 1 : 0;
      const bIsSelected = selectedAreaSet.has(b.SRNO) ? 1 : 0;
      return bIsSelected - aIsSelected;
    });
    const selectedBcategSet = new Set(this.selectedBcategKeys.map(item => item.SRNO));
    this.businessCategDataSource.sort((a, b) => {
      const aIsSelected = selectedBcategSet.has(a.SRNO) ? 1 : 0;
      const bIsSelected = selectedBcategSet.has(b.SRNO) ? 1 : 0;
      return bIsSelected - aIsSelected;
    });
  }

  openMasterSearch() {
    this.selectedModal = this.modalService.open(this.master_search, {
      size: 'xl',
      backdrop: true,
      keyboard: false,
      //  windowClass: 'modal-full-width'
    });

    // console.log('Branch selectedRowKeys', this.selectedRowKeys)
    // console.log('selected divison keys', this.selectedDivisionKeys)
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

  invokeselections(data: string){  
    if (data == 'businessCategory'){
      const BcategKeys = new Set(this.selectedBcategKeys.map(item => item.CATEGORY_CODE));
      const filteredArray = this.businessCategDataSource.filter(item => !BcategKeys.has(item.CATEGORY_CODE));
      this.selectedBcategKeys = filteredArray;
    }
    else if(data == 'Area'){
      const BcategKeys = new Set(this.selectedAreaKeys.map(item => item.AREA_CODE));
      const filteredArray = this.areaDataSource.filter(item => !BcategKeys.has(item.AREA_CODE));
      this.selectedAreaKeys = filteredArray;
    }
    else if(data == 'Division'){
      const BcategKeys = new Set(this.selectedDivisionKeys.map((item: any) => item.DIVISION_CODE));
      const filteredArray = this.divisionDataSource.filter(item => !BcategKeys.has(item.DIVISION_CODE));
      this.selectedDivisionKeys = filteredArray;
    }
    else if(data == 'Branch'){
      const BcategKeys = new Set(this.selectedRowKeys.map((item: any) => item.BRANCH_CODE));
      const filteredArray = this.BranchDataSource.filter(item => !BcategKeys.has(item.BRANCH_CODE));
      this.selectedRowKeys = filteredArray;
    }
  }

  onSelectionChanged(event: any) {
    this.selectedRowKeys= event.selectedRowKeys;
    this.selectedBranchData = event.selectedRowsData;
    // console.log('branch event',  this.selectedRowKeys)
    this.emitData()
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
    //  console.log('B categ event', event.selectedRowKeys)
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

  apply(){
    this.selectedModal?.dismiss()
    this.commonService.toastSuccessByMsgId('Success!', 'selections applied successfully');
  }
  ngOnDestroy(): void {
    this.subscriptions$ && this.subscriptions$.unsubscribe()
  }

  getAPIData(pageIndex?: number) {
    
    const payload = {
      strUserName: localStorage.getItem('username'),
      strDivisionMS: 'S',
      strLoginBranch: localStorage.getItem('userbranch')
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
