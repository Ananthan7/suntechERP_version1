import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { Flag } from 'angular-feather/icons';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-buy-back-policy',
  templateUrl: './buy-back-policy.component.html',
  styleUrls: ['./buy-back-policy.component.scss']
})
export class BuyBackPolicyComponent implements OnInit {
  @ViewChild('overlaypolicycodeSearch') overlaypolicycodeSearch!: MasterSearchComponent;
  @Input() content!: any;

  tableData: any[] = [];
  private subscriptions: Subscription[] = [];
  selectedIndexes: any = [];
  viewMode: boolean = false;
  viewModeField: boolean = true;
  codeEnable: boolean = true;
  editMode: boolean = false;
  isDisableSaveBtn: boolean = false;
  currentDate: any = this.commonService.currentDate;
  percent:any;
  // divisionOptions: { DIVISION_CODE: string; DESCRIPTION: string }[] = [];
  divisionOptions: any[] = [];
  flag: any;
  @ViewChild("codeField") codeField!: ElementRef;
  isAllSelected:boolean = false;
  ALL_DIVISIONS_VALUE = 'ALL';


  policycodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 103,
    SEARCH_FIELD: '',
    SEARCH_HEADING: 'Policy Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
 
  buybackpolicy: FormGroup = this.formBuilder.group({
    policycode: [''],
    division: [''],
    dateFrom: [''],
    dateTo: [''],
    percentage: [''],
  });

  @ViewChild('codeInput')
  codeInput!: ElementRef;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,
    private renderer: Renderer2,

  ) { }

  ngOnInit(): void {
    this.flag = this.content
    ? this.content.FLAG
    : (this.content = { FLAG: "ADD" }).FLAG;


    this.viewModeField = true;
    this.getDivisionOptions();
    console.log(this.content);
    if (this.content?.FLAG) {
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
       this.setFormValues();
      } else if (this.content.FLAG == 'EDIT') {
        this.viewMode = false;
        this.editMode = true;
       this.setFormValues();
      } else if (this.content?.FLAG == 'DELETE') {
        this.viewMode = true;
        this.delete()
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.flag === "ADD") {
      this.codeField.nativeElement.focus();
    }
  }
  // getDivisionOptions(): void {

  //   let API = 'BuyBackPolicyMaster/GetbuybackpolicyDivisondropdownList';
  //   let Sub: Subscription = this.dataService.getDynamicAPI(API)
  //   .subscribe((result) => {
  //     this.divisionOptions = result.response;
  //   }, err => {
  //     this.commonService.closeSnackBarMsg()
  //     this.commonService.toastErrorByMsgId('MSG1531')
  //   })
  // this.subscriptions.push(Sub)
  // }


  // getDivisionOptions(): void {
  //   const API = 'BuyBackPolicyMaster/GetbuybackpolicyDivisondropdownList';

  //   const sub = this.dataService.getDynamicAPI(API).subscribe(
  //     (result) => {
  //       if (result?.response) {
  //         this.divisionOptions = result.response;
  //       } else {
  //         this.commonService.toastErrorByMsgId('MSG1531');
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching division options:', error);
  //       this.commonService.toastErrorByMsgId('MSG1531');
  //     }
  //   );

  //   this.subscriptions.push(sub);
  // }


  // getDivisionOptions() {
  //   const API = 'BuyBackPolicyMaster/GetbuybackpolicyDivisondropdownList';
  //   const Sub: Subscription = this.dataService.getDynamicAPI(API)
  //       .subscribe(
  //           (result: any) => {
  //               console.log(result);
  //               if (result?.dynamicData?.length) {
  //                   // Filter out the empty option or use it for "Select All"
  //                   this.divisionOptions = result.dynamicData[0].filter(
  //                       (option: any) => option.DIVISION_CODE.trim() !== ""
  //                   );
  
  //                   // Prepend "Select All" as the first option
  //                   this.divisionOptions.unshift({
  //                       DIVISION_CODE: this.ALL_DIVISIONS_VALUE,
  //                       DESCRIPTION: "Select All",
  //                   });
  
  //                   const diaDivisionControl = this.buybackpolicy?.get('division');
  //                   if (diaDivisionControl) {
  //                       const allDivisionCodes = this.divisionOptions.map(option => option.DIVISION_CODE);
  //                       // Optionally pre-select all options
  //                       // diaDivisionControl.setValue(allDivisionCodes);
  //                   }
  //               }
  //           },
  //           (err: any) => {
  //               console.error('Error fetching division values:', err);
  //           }
  //       );
  //   this.subscriptions.push(Sub);
  // }

  getDivisionOptions() {
    const API = 'BuyBackPolicyMaster/GetbuybackpolicyDivisondropdownList';
    const Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe(
        (result: any) => {
            if (result?.response?.length) {
                // Filter valid divisions
                this.divisionOptions = result.response.filter(
                    (option: any) => option.DIVISION_CODE.trim() !== ""
                );

                // Add "Select All" at the top
                this.divisionOptions.unshift({
                    DIVISION_CODE: this.ALL_DIVISIONS_VALUE,
                    DESCRIPTION: "Select All",
                });

                // Safely update the form control after data is processed
                setTimeout(() => {
                    const diaDivisionControl = this.buybackpolicy?.get('division');
                    if (diaDivisionControl) {
                        // Optionally initialize with no selections or all selected
                        diaDivisionControl.setValue([]);
                    }
                });
            }
        },
        (err: any) => {
            console.error('Error fetching division values:', err);
        }
    );
    this.subscriptions.push(Sub);
}



  // onSelectionChange(event: MatSelectChange) {
  //   const diaDivisionControl = this.buybackpolicy?.get('division');
  //   const selectedValues = event.value;
  
  //   if (!diaDivisionControl) {
  //       return;
  //   }
  
  //   if (selectedValues.includes(this.ALL_DIVISIONS_VALUE)) {
  //       if (!this.isAllSelected) {
  //           // Select all divisions
  //           this.isAllSelected = true;
  //           diaDivisionControl.setValue(this.divisionOptions.map(option => option.DIVISION_CODE));
  //       } else {
  //           // Deselect all divisions
  //           this.isAllSelected = false;
  //           diaDivisionControl.setValue([]);
  //       }
  //   } else {
  //       this.isAllSelected = selectedValues.length === this.divisionOptions.length - 1; // Exclude "Select All"
  //   }
  // }


  onSelectionChange(event: MatSelectChange) {
    const diaDivisionControl = this.buybackpolicy?.get('division');
    const selectedValues = event.value;

    if (!diaDivisionControl) {
        return;
    }

    if (selectedValues.includes(this.ALL_DIVISIONS_VALUE)) {
        if (!this.isAllSelected) {
            // Select all divisions except "Select All"
            this.isAllSelected = true;
            diaDivisionControl.setValue(
                this.divisionOptions.map(option => option.DIVISION_CODE).filter(code => code !== this.ALL_DIVISIONS_VALUE)
            );
        } else {
            // Deselect all divisions
            this.isAllSelected = false;
            diaDivisionControl.setValue([]);
        }
    } else {
        // Update the "isAllSelected" state based on the selection
        this.isAllSelected = selectedValues.length === this.divisionOptions.length - 1; // Exclude "Select All"
    }
}


  inputValidate(event: any) {
    if (event.target.value != '') {
      this.isDisableSaveBtn = true;
    } else {
      this.isDisableSaveBtn = false;
    }
  }

  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.buybackpolicy.controls.dateFrom.setValue(new Date(date))
    }
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.buybackpolicy.controls.dateTo.setValue(new Date(date))
    }
  }


  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.buybackpolicy.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          this.openOverlay(FORMNAME, event);
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    }

    setFormValues() {
      if (!this.content) return

      let API = 'BuyBackPolicyMaster/GetBuyBackPolicyDetail/' + this.content.BBPOLICY_CODE;
      let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()

        this.buybackpolicy.controls.policycode.setValue(this.content.BBPOLICY_CODE);
        this.buybackpolicy.controls.division.setValue(this.content.BBPOLICY_DESCRIPTION.split(','));
        this.buybackpolicy.controls.dateFrom.setValue(result.response.SYSTEM_DATE);
        this.buybackpolicy.controls.percentage.setValue(result.response.Details[0].REFUND_PER);
        this.buybackpolicy.controls.dateTo.setValue(result.response.Details[0].END_DATE);

      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)

    console.log(this.percent);
  
    }
  

  setPostData() {
    return {
        "BBPOLICY_CODE": this.commonService.nullToString(this.buybackpolicy.value.policycode),
        "BBPOLICY_DESCRIPTION": this.commonService.nullToString(this.buybackpolicy.value.division.join(',')),
        "SYSTEM_DATE": this.buybackpolicy.value.dateFrom,
        "MID":this.commonService.emptyToZero(this.content?.MID),
        "Details": [
          {
            "BBPOLICY_CODE": this.commonService.nullToString(this.buybackpolicy.value.policycode),
            "SRNO": 0,
            "START_DATE": this.buybackpolicy.value.dateFrom,
            "END_DATE": this.buybackpolicy.value.dateTo,
            "DIV_CODE": this.commonService.nullToString(this.buybackpolicy.value.division),
            "REFUND_PER": this.commonService.emptyToZero(this.buybackpolicy.value.percentage),
            "NARRATION": "string",
            "UNIQUEID": 0
          }
        ]
    }
  }

  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }

    let API = 'BuyBackPolicyMaster/InsertBuyBackPolicy';
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData).subscribe(
      (result) => {
        console.log('result', result)
        if (result.response) {
          if (result.status == 'Success') {
            Swal.fire({
              title: 'Saved Successfully',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok',
            }).then((result: any) => {
              if (result.value) {
                this.buybackpolicy.reset();
                this.tableData = [];
                this.close('reloadMainGrid');
              }
            });
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub);
  }

  // close(data?: any) {
  //   //TODO reset forms and data before closing
  //   this.activeModal.close(data);
  // }

  close(data?: any) {
    if (data){
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
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
 

  policycodeSelected(e: any) {
    console.log(e);
    this.buybackpolicy.controls.policycode.setValue(e.FYEARCODE);
  }

  update() {

    let API = 'BuyBackPolicyMaster/UpdateBuyBackPolicy/' + this.buybackpolicy.value.policycode;
    let postData = this.setPostData()

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
                this.buybackpolicy.reset();
                this.tableData = [];
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

  /**USE: delete Melting Type From Row */
  delete() {
    if (this.content && this.content.FLAG == 'VIEW') return
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
        let API = 'BuyBackPolicyMaster/DeleteBuyBackPolicy/' + this.buybackpolicy.value.policycode;
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
                    this.buybackpolicy.reset()
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
                    this.buybackpolicy.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
      else
      {
        this.close('reloadMainGrid')
      }
    });
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }


  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case 'policycode':
        this.overlaypolicycodeSearch.showOverlayPanel(event);
        break;
      default:
    }
  }


  openOverlay(FORMNAME: string, event: any) {
    switch (FORMNAME) {
      case 'policycode':
        this.overlaypolicycodeSearch.showOverlayPanel(event);
        break;
      default:
        console.warn(`Unknown FORMNAME: ${FORMNAME}`);
        break;
    }
  }

}
