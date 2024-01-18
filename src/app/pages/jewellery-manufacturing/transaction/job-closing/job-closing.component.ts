import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-job-closing',
  templateUrl: './job-closing.component.html',
  styleUrls: ['./job-closing.component.scss']
})
export class JobClosingComponent implements OnInit {
  
  tableData: any[] = [];  
  columnheadItemDetails:any[] = ['  ',];
  divisionMS: any = 'ID';
  currentDate = new FormControl(new Date());
  text="Sales Order";
  checked:boolean = true

  

  constructor(private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,) { }

    
  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  change(event:any){
    console.log(event);
    this.text = event.target.value;
    if(event.target.checked == true){
       this.text="Non Sales Order";
    }else{
      this.text="Sales Order";
    }
  }
 
  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Party',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  partyCodeSelected(e:any){
    console.log(e);
    this.jobCloseingFrom.controls.party_code.setValue(e.ACCODE);
  }

  jobCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job Number',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  jobCodeSelected(e:any){
    console.log(e);
    this.jobCloseingFrom.controls.job_no.setValue(e.job_number);
  }

  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'WORKER',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  workerCodeSelected(e:any){
    console.log(e);
    this.jobCloseingFrom.controls.worker.setValue(e.WORKER_CODE);
  }

  reasonCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 10,
    SEARCH_FIELD: 'DESCRIPTION',
    SEARCH_HEADING: 'Reason',
    SEARCH_VALUE: '',
    WHERECONDITION: "DESCRIPTION<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  reasonCodeSelected(e:any){
    console.log(e);
    this.jobCloseingFrom.controls.reason.setValue(e.DESCRIPTION);
  }

  MetalLocCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 155,
    SEARCH_FIELD: 'Location',
    SEARCH_HEADING: 'Metal Location',
    SEARCH_VALUE: '',
    WHERECONDITION: "Location<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  MetalLocCodeSelected(e:any){
    console.log(e);
    this.jobCloseingFrom.controls.metal_loc.setValue(e.Location);
  }

  StoneLocCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 155,
    SEARCH_FIELD: 'Location',
    SEARCH_HEADING: 'Stone Location',
    SEARCH_VALUE: '',
    WHERECONDITION: "Location<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  StoneLocCodeSelected(e:any){
    console.log(e);
    this.jobCloseingFrom.controls.stone_loc.setValue(e.Location);
  }

  UserCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'User',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UserCodeSelected(e:any){
    console.log(e);
    this.jobCloseingFrom.controls.user_name.setValue(e.SALESPERSON_CODE);
  }

  jobCloseingFrom: FormGroup = this.formBuilder.group({
      vocType: ['JBC', [Validators.required]],
      vocNum: ['1', [Validators.required]],
      vocdate: [new Date(),],
      user_name: ['',],
      party_code: ['',],
      job_no: ['',],
      worker: ['',],
      reason : ['',],
      stone_loc: ['', [Validators.required]],
      metal_loc: ['', [Validators.required]], 
      doc_ref: ['',], 
      remarks: ['',], 
  });



  formSubmit(){

  }
}
