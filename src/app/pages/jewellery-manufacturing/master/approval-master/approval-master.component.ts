import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-approval-master',
  templateUrl: './approval-master.component.html',
  styleUrls: ['./approval-master.component.scss']
})
export class ApprovalMasterComponent implements OnInit {
  @Input() content!: any; 
  tableData: any[] = [];
  selectedIndexes: any = [];
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
    LOAD_ONCLICK: true,
  }
  
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,
  ) { }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
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

  emailid(data:any,value: any){
    this.tableData[value.data.SRNO - 1].EMAIL_ID = data.target.value;
  }
  mobilenumber(data:any,value: any){
    this.tableData[value.data.SRNO - 1].MOBILE_NO = data.target.value;
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


    this.dataService.getDynamicAPI('ApprovalMaster/GetApprovalMasterDetail/'+this.content.APPR_CODE).subscribe((data) => {
      if (data.status == 'Success') {

        this.tableData = data.response.approvalDetails;
       

      }
    });
   
  }
  
  approvalMasterForm: FormGroup = this.formBuilder.group({
    code: ['',[Validators.required]],
    description: ['',[Validators.required]],
   
  });
  
  adddata() {
    if(this.approvalMasterForm.value.code != "" && this.approvalMasterForm.value.description != "")
    {
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
        "EMAIL_ID": "" ,
        "MOBILE_NO": "",

      };
      this.tableData.push(data);
      // this.approvalMasterForm.controls.code.setValue("");
      // this.approvalMasterForm.controls.description.setValue("");
  }
  else {
    this.toastr.error('Please Fill all Mandatory Fields')
  }
}

onSelectionChanged(event: any) {
  const values = event.selectedRowKeys;
  console.log(values);
  let indexes: Number[] = [];
  this.tableData.reduce((acc, value, index) => {
    if (values.includes(parseFloat(value.SRNO))) {
      acc.push(index);
    }
    return acc;
  }, indexes);
  this.selectedIndexes = indexes;
  console.log(this.selectedIndexes);
  
}

removedata(){
  console.log(this.selectedIndexes);

  if (this.selectedIndexes.length > 0) {
    this.tableData = this.tableData.filter((data, index) => !this.selectedIndexes.includes(index));
  } else {
    this.snackBar.open('Please select record', 'OK', { duration: 2000 }); // need proper err msg.
  }   
}


  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.approvalMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

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
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  update(){
    if (this.approvalMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'ApprovalMaster/UpdateApprovalMaster/'+this.content.APPR_CODE
    let postData = {
      "APPR_CODE": this.approvalMasterForm.value.code || "",
      "APPR_DESCRIPTION": this.approvalMasterForm.value.description || "",
      "MID": this.content.MID,
      "approvalDetails": this.tableData,  
    }

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
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
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  deleteRecord() {
    if (!this.content.MID) {
      Swal.fire({
        title: '',
        text: 'Please Select data to delete!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        let API = 'ApprovalMaster/DeleteApprovalMaster/' + this.content.APPR_CODE
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
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
                    this.close('reloadMainGrid')
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',
                  text: '',
                  icon: 'error',
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
              this.toastr.error('Not deleted')
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
