import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-component-master',
  templateUrl: './component-master.component.html',
  styleUrls: ['./component-master.component.scss']
})
export class ComponentMasterComponent implements OnInit {

  subscriptions: any;
  @Input() content!: any; 
  tableData: any[] = [];

  columnhead: any[] = ['Srno','Div.','Stock Code','Karat','Stock Type','Pcs','Wt/Ct','Color','Clarity','Shape','Sieve Std.','Description','Size','Process Transaction','Remarks',]
  columnhead2: any[] = ['',]
  selectedTabIndex = 0;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }
 
  ngOnInit(): void {
   
  }

  componentmasterForm: FormGroup = this.formBuilder.group({
    code: [""],
    codedes: [""],
    size_set : [""],
    size: [""],
    type : [""],
    category: [""],
    shape: [""],
    setting_type: [""],
    remarks : [""],
    height : [""],
    length  : [""],
    width  : [""],
    radious  : [""],
    process_seq : [""],
    cost_center  : [""],
  });
  
  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 30,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Category type',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  categoryCodeSelected(e:any){
    console.log(e);
    this.componentmasterForm.controls.category.setValue(e.CODE);
  }

  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  typeCodeSelected(e:any){
    console.log(e);
    this.componentmasterForm.controls.type.setValue(e.CODE);
  }
  
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  addTableData(){

  }

  deleteTableData(){


  }

 



  formSubmit(){
 
  }
  update(){
   
  }

}
