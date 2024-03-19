import { Component, ComponentFactory, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { AlloyAllocationComponent } from 'src/app/pages/jewellery-manufacturing/transaction/cad-processing/alloy-allocation/alloy-allocation.component';

@Component({
  selector: 'app-diamond-branch-transfer-in-auto-repair',
  templateUrl: './diamond-branch-transfer-in-auto-repair.component.html',
  styleUrls: ['./diamond-branch-transfer-in-auto-repair.component.scss']
})
export class DiamondBranchTransferInAutoRepairComponent implements OnInit {
  @Input() content!: any;
  @Input()
  selectedIndex!: number | null;
  tableData: any[] = [];  
  tableDatas: any[] = [];  
  firstTableWidth : any;
  secondTableWidth : any;
  columnheadItemDetails:any[] = ['Sr.No','Div','Description','Remarks','Pcs','Gr.Wt','Repair Type','Type'];
  columnheadItemDetails1:any[] = ['Comp Code','Description','Pcs','Size Set','Size Code','Type','Category','Shape','Height','Width','Length','Radius','Remarks'];
  divisionMS: any = 'ID';
  columnheadItemDetails2:any[] = ['Repair Narration']
  branchCode?: String;
  yearMonth?: String;
  currentDate = new FormControl(new Date());
  isdisabled:boolean=true;
  private subscriptions: Subscription[] = [];
  table: any;
  status: boolean= true;
  viewMode: boolean = false;
  selectedTabIndex = 0;
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  formattedTime: any;
  maxTime: any;
  standTime: any;
  // setAllInitialValues: any;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }


  ngOnInit(): void {
   
  }

  diamondBranchTransferinAutoRepairForm: FormGroup = this.formBuilder.group({

    voctype:[''],
    vocNo:[''],
    Branch:[''],
    enteredBy:[''],
    Currency:[''],
    CurrencyDesc:[''],
    vocDate1:[''],
    status:[''],
    CreditDays:[''],
    vocDate2:[''],
    location:[''],
    narration:[''],
    stateCode:[''],
    taxCode:[''],
    type:[''],
    RefNo:[''],
    FullChecked:[''],
    FullChecked1:[''],
    Total:[''],
    Total1:[''],
    TotalFC:[''],
    TotalCC:[''],
    TotalGST:[''],
    zerothAmtFC:[''],
    Gross:[''],
    Gross1:[''],

  });


  branchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'BRANCH CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  branchCodeSelected(e: any) {
    console.log(e);
    this.diamondBranchTransferinAutoRepairForm.controls.Branch.setValue(e.BRANCH_CODE);
  }

  enteredByCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'User Name ',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  enteredByCodeSelected(e: any) {
    console.log(e);
    this.diamondBranchTransferinAutoRepairForm.controls.enteredBy.setValue(e.UsersName);
  }

  stateCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 48,
    SEARCH_FIELD: 'STATE_CODE',
    SEARCH_HEADING: 'STATE CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "STATE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stateCodeSelected(e: any) {
    console.log(e);
    this.diamondBranchTransferinAutoRepairForm.controls.stateCode.setValue(e.STATE_CODE);
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

 
  adddata() {

   
}


adddatas() {
 
}


removedata(){
  this.tableData.pop();
}

removedatas(){
  this.tableDatas.pop();
}



  formSubmit() {
 
  }

  updateMeltingType() {
   
      
    }
      /**USE: delete Melting Type From Row */
  deleteMeltingType() {
  
   
  }
 
  openaddalloyallocation() {
    const modalRef: NgbModalRef = this.modalService.open(AlloyAllocationComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  deleteTableData(){
 
    
  }

}
