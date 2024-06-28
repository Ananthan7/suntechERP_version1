import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'auth-checker',
  templateUrl: './auth-checker.component.html',
  styleUrls: ['./auth-checker.component.scss']
})
export class AuthCheckerComponent implements OnInit {
  @Output() authSubmit = new EventEmitter();
  @ViewChild('userAuthModal') public userAuthModal!: NgbModal;
  reasonMaster: any = [];
  reasonMasterOptions!: Observable<any[]>;
  modalReferenceUserAuth!: NgbModalRef;
  private subscriptions: Subscription[] = [];

  authForm: FormGroup = this.formBuilder.group({
    // username: [localStorage.getItem('username'), Validators.required],
    password: ['', Validators.required],
    // reason: ['', Validators.required],
    reason: ['', [Validators.required, this.autoCompleteValidator(() => this.reasonMaster, 'CODE')]],
    description: ['', Validators.required],
  });

  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
  }
  reseForm() {
    this.authForm.controls.password.setValue('')
    this.authForm.controls.reason.setValue('')
    this.authForm.controls.description.setValue('')
  }
  openAuthModal() {
    this.reseForm()
    this.getReasonMasters()
    return new Promise((resolve) => {
      this.modalReferenceUserAuth = this.modalService.open(
        this.userAuthModal,
        {
          size: "lg",
          backdrop: true,
          keyboard: false,
          windowClass: "modal-full-width",
        }
      );
      this.modalReferenceUserAuth.result.then((result) => {
        if (result) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
        (reason) => {
          resolve(false);

        }
      );
    });
  }

  reasonSelected(e: any) {
    console.log(e);
    
    this.authForm.controls.reason.setValue(e.CODE);
    this.authForm.controls.description.setValue(e.DESCRIPTION);
  }


  getReasonMasters() {

    console.log(this.CommonService.reasonMasterList, 'reasonMasterList');
    this.reasonMaster = this.CommonService.reasonMasterList;
    this.reasonMasterOptions = this.authForm.controls.reason.valueChanges.pipe(
      startWith(''),
      map((value) =>
        this._filterMasters(this.reasonMaster, value, 'CODE', 'DESCRIPTION')
      )
    );
  }
  private _filterMasters(
    arrName: any,
    value: string,
    optVal1: any,
    optVal2: any = null
  ): any[] {
    const filterValue = (value || '').toLowerCase();
    return arrName.filter(
      (option: any) =>
        option[optVal1].toLowerCase().includes(filterValue) ||
        option[optVal2].toLowerCase().includes(filterValue)
    );
  }
  // submit function input flag is for validate pswd before submit
  submitAuth(flag?:any) {
    if(!this.authForm.value.reason && !flag){
      this.CommonService.toastErrorByMsgId('Reason required')
      return
    }
    if (!this.authForm.invalid || flag) {
      let API = 'ValidatePassword/ValidateEditDelete';
      const postData = {
        // "Username": this.authForm.value.username,
        "Username": localStorage.getItem('username') || '',
        "Password": this.authForm.value.password
      };
      let sub: Subscription = this.dataService.postDynamicAPICustom(API, postData).subscribe((resp: any) => {
        if (resp.status == 'Success') {
          if(!flag){
            this.CommonService.EditDetail.REASON =  this.authForm.value.reason
            this.CommonService.EditDetail.DESCRIPTION =  this.authForm.value.description
            this.CommonService.EditDetail.PASSWORD =  this.authForm.value.password
            this.modalReferenceUserAuth.close(true);
            this.authSubmit.emit('Success')
            this.authForm.reset();
          }
        } else {
          this.CommonService.showSnackBarMsg(resp.message)
          this.authForm.controls.password.setValue('')
        }
      });
      this.subscriptions.push(sub)
    } else {
      this.CommonService.showSnackBarMsg('Please fill all fields')
    }

  }

  changeReason(e: any) {
    this.authForm.controls.reason.setValue(e.CODE);
    const res = this.reasonMaster.filter((data: any) => data.CODE == e.CODE)
    let description = res.length > 0 ? res[0]['DESCRIPTION'] : '';
    this.authForm.controls.description.setValue(description);
  }
  autoCompleteValidator(optionsProvider: any, field: any = null) {
    return (control: AbstractControl) => {
      const options = optionsProvider();
      const inputValue = control.value;
      if (!options || !Array.isArray(options)) {
        return null;
      }
      if (field == null) {
        if (control.value && options.length > 0 && !options.includes(control.value)) {
          return { notInOptions: true };
        }
      } else {
        if (inputValue && options.length > 0 && !options.some(option => option[field] === inputValue)) {
          return { notInOptions: true };
        }
      }
      return null;
    };
  }
  ngOnDestroy() {
    this.reseForm()
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.subscriptions = []; // Clear the array
    }
  }


}
