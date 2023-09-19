import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approval-master',
  templateUrl: './approval-master.component.html',
  styleUrls: ['./approval-master.component.scss']
})
export class ApprovalMasterComponent implements OnInit {
  @Input() content!: any; 
  tableData: any[] = [];
  private subscriptions: Subscription[] = [];
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
  }
  
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  close() {
    //TODO reset forms and data before closing
    this.activeModal.close();
  }

  userDataSelected(data: any,value: any) {
    console.log(value);
    console.log(data);
   
    this.tableData[value.data.SRNO - 1].USER_CODE = data.UsersName;
    //this.stonePrizeMasterForm.controls.sleve_set.setValue(data.CODE)
  }

  typedataselected(data:any,value: any){
    this.tableData[value.data.SRNO - 1].APPR_TYPE = data.target.value;
  }

  Mandatorycheckevent(data:any,value: any){
      // console.log(value);
    // console.log(data.target.checked);
    this.tableData[value.data.SRNO - 1].APPRREQUIRED = data.target.checked; 
  }

  attachcheckevent(data:any,value: any){
    this.tableData[value.data.SRNO - 1].ATTACH_REQ = data.target.checked;
  }
  messagecheckevent(data:any,value: any){
    this.tableData[value.data.SRNO - 1].ORG_MESSAGE = data.target.checked;
  }
  emailcheckevent(data:any,value: any){ 
  this.tableData[value.data.SRNO - 1].EMAIL = data.target.checked;
  }
  systemcheckevent(data:any,value: any){
    this.tableData[value.data.SRNO - 1].SYS_MESSAGE = data.target.checked;
  }

  ngOnInit(): void {
    console.log(this.content);
    if(this.content){
      this.setFormValues()
    }
  }

  setFormValues() {
    if(!this.content) return
    this.approvalMasterForm.controls.code.setValue(this.content.APPR_CODE)
    this.approvalMasterForm.controls.description.setValue(this.content.APPR_DESCRIPTION)
   
  }
  
  approvalMasterForm: FormGroup = this.formBuilder.group({
    code: [''],
    description: [''],
   
  });
  adddata() {
      let length = this.tableData.length;
      let srno = length + 1;
      let data =  {
        "UNIQUEID": 12345,
        "APPR_CODE": "test",
        "SRNO": srno,
        "USER_CODE": "",
        "APPR_TYPE": "",
        "APPRREQUIRED": false,
        "ATTACH_REQ": false,
        "ORG_MESSAGE": false,
        "EMAIL": false,
        "SYS_MESSAGE": false,
        "EMAIL_ID": "test",
        "MOBILE_NO": "1234567890"
      };
      this.tableData.push(data);
  }
  removedata(){
    this.tableData.pop();
  }
  formSubmit(){
    let API = 'ApprovalMaster/InsertApprovalMaster'
    let postData = {
      "APPR_CODE": this.approvalMasterForm.value.code || "",
      "APPR_DESCRIPTION": this.approvalMasterForm.value.description || "",
      "approvalDetails": this.tableData,
      
    }

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.approvalMasterForm.reset()
                this.tableData = []
                this.close()
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
