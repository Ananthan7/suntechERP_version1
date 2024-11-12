import { Input, OnInit, Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import themes from 'devextreme/ui/themes';

@Component({
  selector: 'app-approval-master',
  templateUrl: './approval-master.component.html',
  styleUrls: ['./approval-master.component.scss']
})
export class ApprovalMasterComponent implements OnInit {


  @Input() content!: any;
  tableData: any[] = [];
  selectedIndexes: any = [];
  allMode: string;
  checkBoxesMode: string;
  isdiabled: boolean = true;
  private subscriptions: Subscription[] = [];
  viewMode: boolean = false;
  isDisabled: boolean = false;
  controlName: any;
  orgMessageCheckbox: any;
  userCodeEnable: boolean = false;
  editableMode: boolean = false;
  disable: boolean = false;
  userId: any
  editMode: boolean = false;
  codeEnable: boolean = false;


  // @ViewChild('codeInput')
  // codeInput!: ElementRef;

  // ngAfterViewInit(): void {
  //   this.codeInput.nativeElement.focus();
  // }





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



  approvalMasterForm: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required]],
    description: ['', [Validators.required]],
    ORG_MESSAGE: [false],
    EMAIL: [false],
    MOBILE_NO: [''],
    EMAIL_ID: [''],

  });


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
  ) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }


  ngOnInit(): void {
    this.renderer.selectRootElement('#code')?.focus();
    this.codeEnable = true;
    if (this.content?.FLAG) {
      this.setFormValues();
      if (this.content.FLAG == 'VIEW') {
        this.userCodeEnable = true;
        this.isDisabled = true;
        this.viewMode = true;
        // this.processMasterForm();
      } else if (this.content.FLAG == 'EDIT') {
        this.editableMode = true;
      } else if (this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteRecord()
      }
    }


  }




  setFormValues() {
    if (!this.content) return
    this.approvalMasterForm.controls.code.setValue(this.content.APPR_CODE)
    this.approvalMasterForm.controls.description.setValue(this.content.APPR_DESCRIPTION)
    this.dataService.getDynamicAPI('ApprovalMaster/GetApprovalMasterDetail/' + this.content.APPR_CODE)
      .subscribe((data) => {
        if (data.status == 'Success') {
          this.tableData = data.response.approvalDetails;
        }
      });
  }

  checkSpecialCharacters() {
    const nameRegexp: RegExp = /[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]/;
    if (nameRegexp.test(this.approvalMasterForm.value.description)) {
      this.approvalMasterForm.controls.description.setValue('');
    }
  }




  checkCodeExists(event: any) {
    if (this.content && this.content.FLAG == 'EDIT') {
      return; // Exit the function if in edit mode
    }

    if (event.target.value === '' || this.viewMode) {
      return; // Exit the function if the input is empty or in view mode
    }
    console.log('this w');
    
    const API = 'ApprovalMaster/CheckIfApprCodePresent/' + event.target.value;
    const sub = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.checkifExists) {
          Swal.fire({
            title: '',
            text: 'Code Already Exists!',
            icon: 'warning',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then(() => {
            // Clear the input value
            this.approvalMasterForm.controls.code.setValue('');
            this.renderer.selectRootElement('#code').focus();

          });
          this.commonService.toastErrorByMsgId('MSG1121')//Code Already Exists
        }else{
          this.codeEnable = false;
        }
      }, err => {
        this.approvalMasterForm.reset();

      });

    this.subscriptions.push(sub);

  }

  codeEnabledMetal() {
    if (this.approvalMasterForm.value.code == '') {
      this.codeEnable = true;
    }
    else {
      this.codeEnable = false;
    }
  }

  isNumeric(event: any) {
    return this.commonService.isNumeric(event);
  }

  enforceMaxLength(event: any) {
    if (event.target.value.length > 10) {
      event.target.value = event.target.value.slice(0, 10);
    }
  }


  // close(data?: any) {
  //   //TODO reset forms and data before closing
  //   this.activeModal.close(data);
  // }

  close(data?: any) {
    if (this.content && this.content.FLAG == 'VIEW'){
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    }
    )
  }

  userDataSelected(data: any, value: any, controlName: string) {
    let userData = [];
    userData = this.tableData.filter((item: any) => item.USER_CODE == data.UsersName)
    if (userData.length > 0) {
      this.commonService.toastErrorByMsgId('MSG1932')
    }
    else {
      console.log(value);
      console.log(data);
      this.tableData[value.data.SRNO - 1].USER_CODE = data.UsersName;
      this.userId = data.UsersName;
    }
  }

  typedataselected(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].APPR_TYPE = data.target.value;
  }

  Mandatorycheckevent(data: any, value: any) {
    // console.log(value);
    // console.log(data.target.checked);
    this.tableData[value.data.SRNO - 1].APPRREQUIRED = data.target.checked;
  }

  attachcheckevent(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].ATTACH_REQ = data.target.checked;
  }
  messagecheckevent(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].ORG_MESSAGE = data.target.checked;
    if (data.target.checked) {
      this.tableData[value.data.SRNO - 1].MOBILE_NO = ' ';
    } else {
      this.tableData[value.data.SRNO - 1].MOBILE_NO = '';
    }
  }
  emailcheckevent(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].EMAIL = data.target.checked;
    if (data.target.checked) {
      this.tableData[value.data.SRNO - 1].EMAIL_ID = ' ';
    } else {
      this.tableData[value.data.SRNO - 1].EMAIL_ID = '';
    }
  }
  systemcheckevent(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].SYS_MESSAGE = data.target.checked;
  }

  emailid(data: any, value: any) {
    if (!this.commonService.validateEmail(data.target.value)) {
      this.commonService.toastErrorByMsgId('MSG1332')
      return
    }

    this.tableData[value.data.SRNO - 1].EMAIL_ID = data.target.value;
  }
  mobilenumber(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].MOBILE_NO = data.target.value;
  }

  dataGridConfig = {
    columns: [
      {
        dataField: 'USER_CODE',
        caption: 'User Id',
        cellTemplate: 'usertemp',
        validationRules: [{ type: 'required', message: 'User Id is required' }]
      },
      // Other columns in your DataGrid
    ],
    // Other DataGrid configuration options
  };

  adddata() {


    if (this.approvalMasterForm.value.code == '') {
      this.commonService.toastErrorByMsgId('MSG3568')
    }

    if (this.approvalMasterForm.value.description == '') {
      this.commonService.toastErrorByMsgId('MSG3569')
    }


    const userCodeValue = this.approvalMasterForm.value.USER_CODE;
    const mobileCheck = this.approvalMasterForm.value.ORG_MESSAGE;
    const emailCheck = this.approvalMasterForm.value.EMAIL;
    const mobilenum = this.approvalMasterForm.value.MOBILE_NO || "";
    const emailId = this.approvalMasterForm.value.EMAIL_ID || "";


    if (this.approvalMasterForm.value.code !== "" && this.approvalMasterForm.value.description !== "") {
      let length = this.tableData.length;

      let srno = length + 1;
      let data = {
        "UNIQUEID": 12345,
        "APPR_CODE": "test",
        "SRNO": srno,
        "USER_CODE": userCodeValue,
        "APPR_TYPE": 0,
        "APPRREQUIRED": false,
        "ATTACH_REQ": false,
        "ORG_MESSAGE": mobileCheck,
        "EMAIL": emailCheck,
        "SYS_MESSAGE": false,
        "EMAIL_ID": emailId,
        "MOBILE_NO": mobilenum,
      };

      this.tableData.push(data);

      this.tableData.forEach((item, i) => {
        item.SRNO = i + 1;
        item.isDisabled = true;
      });

    }
    // else {
    //   this.toastr.error('Please Fill all Mandatory Fields');
    // }
  }




  onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    console.log(values);
    let indexes: Number[] = [];
    this.tableData.reduce((acc, value, index) => {
      if (values.includes(parseFloat(value.SRNO))) {
        acc.push(index);
        console.log(acc);

      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
    console.log(this.selectedIndexes);
  }


  removedata() {
    console.log(this.selectedIndexes);

    if (this.selectedIndexes.length > 0) {
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
          // Simulate deletion without using an actual API call
          if (this.tableData.length > 0) {
            this.tableData = this.tableData.filter((data, index) => !this.selectedIndexes.includes(index));
            this.snackBar.open('Data deleted successfully!', 'OK', { duration: 2000 });
            this.tableData.forEach((item: any, i: any) => {
              item.SRNO = i + 1;
            });

          } else {
            this.snackBar.open('No data to delete!', 'OK', { duration: 2000 });
          }
        }
      });
    } else {
      this.snackBar.open('Please select record', 'OK', { duration: 2000 });
    }
  }
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch`
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {

        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.approvalMasterForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          return
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')
      })
    this.subscriptions.push(Sub)
  }

  checkFinalApproval() {

    let final = []

    final = this.tableData.filter((item: any) => item.APPR_TYPE == '2')
    console.log(final);
    return final.length == 0


  }

  submitValidations(form: any) {
    if (this.content && this.content.FLAG == 'EDIT') {
      return; // Exit the function if in edit mode
    }

    console.log(this.userId);    

    if (this.commonService.nullToString(form.code) == '' && this.approvalMasterForm.invalid) {
      this.commonService.toastErrorByMsgId('MSG1124') //"Code cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.description) == '' && this.approvalMasterForm.invalid) {
      this.commonService.toastErrorByMsgId('MSG1193')//"description cannot be empty"
      return true
    }

    else if (this.userId == undefined) {
      console.log("In");
      // this.toastr.error('User Name Cannot be empty')MSG1933
      this.commonService.toastErrorByMsgId('MSG1933')//User Name Cannot be empty
      return true
      // return Swal.fire({
      //   title: '',
      //   text: 'User Name Cannot be empty',
      //   icon: 'error',
      //   confirmButtonColor: '#336699',
      //   confirmButtonText: 'Ok'
      // })
    }
    else if (this.checkFinalApproval()) {
      this.commonService.toastErrorByMsgId('MSG81520')//Final option should be selected
      return true
    }


    return false;
  }

  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      // Check if any input field is empty
      const isEmpty = this.tableData.some((item: any) => {
        return !item.MOBILE_NO.trim() || !item.EMAIL_ID.trim();
      });

      // Proceed with the update
      this.update();
      return;
    }

    if (this.submitValidations(this.approvalMasterForm.value)) return;

    let conditionMet = false;

    this.tableData.forEach((item: any, index: number) => {
      console.log(`Checking item at index ${index}:`, item);

      const orgMessageChecked = item.ORG_MESSAGE;
      const emailChecked = item.EMAIL;
      const mobileNo = item.MOBILE_NO;
      const emailId = item.EMAIL_ID;


      console.log('orgMessageChecked:', orgMessageChecked);
      console.log('emailChecked:', emailChecked);
      console.log('mobileNo:', mobileNo);
      console.log('emailId:', emailId);


      if (orgMessageChecked != '') {
        if (!mobileNo.trim()) {
          this.commonService.toastErrorByMsgId('MSG2480');
          conditionMet = true;
          return;
        }
      }

      if (emailChecked != '') {
        if (!emailId.trim()) {
          this.commonService.toastErrorByMsgId('MSG81478');
          conditionMet = true;
          return;
        }
      }
    });




    // if (this.approvalMasterForm.invalid) {
    //   this.toastr.error('Select all required fields');
    //   return;
    // }


    if (!conditionMet) {
      // Continue with the rest of your code for submission
      // if (this.checkFinalApproval()) {
      //   this.toastr.error('final optional should be selected');
      //   return;
      // }




      // Omit mobilenum and emailId from postData when mobileCheck or emailCheck is true
      const postData: any = {
        "APPR_CODE": this.approvalMasterForm.value.code || "",
        "APPR_DESCRIPTION": this.approvalMasterForm.value.description || "",
        "approvalDetails": this.tableData,
      };

      console.log(postData);

      let API = 'ApprovalMaster/InsertApprovalMaster';

      let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
        .subscribe((result) => {
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
          }
          else {
            this.commonService.toastErrorByMsgId('MSG3577')
          }
        }, err => {
          this.commonService.toastErrorByMsgId('MSG3577')
        })
      this.subscriptions.push(Sub);
    }
  }
  showSuccessDialog(message: string): void {
    Swal.fire({
      title: message,
      text: '',
      icon: 'success',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      this.afterSave(result.value)
    });
  }

  afterSave(value: any) {
    if (value) {
      this.approvalMasterForm.reset()
      this.tableData = []
      this.close('reloadMainGrid')
    }
  }


  // formSubmit() {
  //   if (this.checkFinalApproval()) {
  //     this.toastr.error('Final Approval Type Not Selected');
  //     return;
  //   }

  //   // Check if message template is true and mobile number is empty
  //   const messageTemplate = this.tableData.find(data => data.template === 'messagetemp');
  //   const mobileNumberData = this.tableData.find(data => data.template === 'mobilenumber');
  //   if (messageTemplate && messageTemplate.value && !mobileNumberData.value) {
  //     this.toastr.error('Mobile Number is required for Message Template');
  //     return;
  //   }

  //   // Check if email template is true and email ID is empty
  //   const emailTemplate = this.tableData.find(data => data.template === 'emailtemp');
  //   const emailIdData = this.tableData.find(data => data.template === 'emailid');
  //   if (emailTemplate && emailTemplate.value && !emailIdData.value) {
  //     this.toastr.error('Email ID is required for Email Template');
  //     return;
  //   }

  //   if (this.approvalMasterForm.invalid) {
  //     this.toastr.error('Select all required fields');
  //     return;
  //   }

  //   if (this.content && this.content.FLAG == 'EDIT') {
  //     this.update();
  //     return;
  //   }

  //   let API = 'ApprovalMaster/InsertApprovalMaster';
  //   let postData = {
  //     "APPR_CODE": this.approvalMasterForm.value.code || "",
  //     "APPR_DESCRIPTION": this.approvalMasterForm.value.description || "",
  //     "approvalDetails": this.tableData,
  //   };

  //   console.log(this.tableData);

  //   let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
  //     .subscribe((result) => {
  //       if (result.response) {
  //         if (result.status == "Success") {
  //           Swal.fire({
  //             title: result.message || 'Success',
  //             text: '',
  //             icon: 'success',
  //             confirmButtonColor: '#336699',
  //             confirmButtonText: 'Ok'
  //           }).then((result: any) => {
  //             if (result.value) {
  //               this.approvalMasterForm.reset();
  //               this.tableData = [];
  //               this.close('reloadMainGrid');
  //             }
  //           });
  //         }
  //       } else {
  //         this.toastr.error('Not saved');
  //       }
  //     }, err => alert(err));

  //   this.subscriptions.push(Sub);
  // }



  update() {
    if (this.submitValidations(this.approvalMasterForm.value)) return;

    let conditionMet = false;

    this.tableData.forEach((item: any, index: number) => {
      console.log(`Checking item at index ${index}:`, item);

      const orgMessageChecked = item.ORG_MESSAGE;
      const emailChecked = item.EMAIL;
      const mobileNo = item.MOBILE_NO;
      const emailId = item.EMAIL_ID;


      console.log('orgMessageChecked:', orgMessageChecked);
      console.log('emailChecked:', emailChecked);
      console.log('mobileNo:', mobileNo);
      console.log('emailId:', emailId);

      if (orgMessageChecked != '') {
        if (!mobileNo.trim()) {
          this.commonService.toastErrorByMsgId('MSG2480');
          conditionMet = true;
          return;
        }
      }

      if (emailChecked != '') {
        if (!emailId.trim()) {
          this.commonService.toastErrorByMsgId('MSG81478');
          conditionMet = true;
          return;
        }
      }
    });

    if (!conditionMet) {

      const API = 'ApprovalMaster/UpdateApprovalMaster/' + this.content.APPR_CODE;
      const postData = {
        "APPR_CODE": this.approvalMasterForm.value.code || "",
        "APPR_DESCRIPTION": this.approvalMasterForm.value.description || "",
        "MID": this.content.MID,
        "approvalDetails": this.tableData,
      };

      let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
        .subscribe((result) => {
          if (result.response) {
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
            }
          } else {
            this.commonService.toastErrorByMsgId('MSG3577')
          }
        }, err => {
          this.commonService.toastErrorByMsgId('MSG3577')
        })
      this.subscriptions.push(Sub)
    }
  }



  deleteRecord() {
    if (this.content && this.content.FLAG == 'VIEW') return
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
              this.commonService.toastErrorByMsgId('MSG1880')//Not deleted
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


