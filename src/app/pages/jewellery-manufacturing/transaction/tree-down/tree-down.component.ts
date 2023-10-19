import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tree-down',
  templateUrl: './tree-down.component.html',
  styleUrls: ['./tree-down.component.scss']
})
export class TreeDownComponent implements OnInit {


  user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'User',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  userDataSelected(value: any) {
    console.log(value);
       this.castingTreeDownFrom.controls.userName.setValue(value.UsersName);
  }

  ProcessCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  ProcessCodeSelected(e:any){
    console.log(e);
    this.castingTreeDownFrom.controls.processcode.setValue(e.Process_Code);
  }

  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  WorkerCodeSelected(e:any){
    console.log(e);
    this.castingTreeDownFrom.controls.workercode.setValue(e.WORKER_CODE);
  }

 karatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 84,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  karatCodeSelected(e:any){
    console.log(e);
    this.castingTreeDownFrom.controls.workercode.setValue(e.KARAT_CODE);
  }

  colorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  colorCodeSelected(e:any){
    console.log(e);
    this.castingTreeDownFrom.controls.color.setValue(e.CODE);
  }

  cylinderCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  cylinderCodeSelected(e:any){
    console.log(e);
    this.castingTreeDownFrom.controls.color.setValue(e.CODE);
  }
  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,   
  ) { }

  ngOnInit(): void {
  }


  close(data?: any) {
    this.activeModal.close(data);
  }
  columnhead:any[] = ['Job Code','Unique job ID','Design Code','Gross Wt.','Metal Wt','Stone Wt','RCVD Gross Weight','RCVD Metal Weight','Process code','Worker Code',];


  castingTreeDownFrom: FormGroup = this.formBuilder.group({

  });
  formSubmit() {

  }

}
