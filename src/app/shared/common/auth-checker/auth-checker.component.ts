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
  ) { }

  ngOnInit(): void {
    this.getReasonMasters()
  }
  openAuthModal() {
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
          console.log("Result :", result);
          resolve(true);
        } else {
          resolve(false);
        }
      },
        (reason) => {
          console.log(`Dismissed ${reason}`);
          resolve(false);

        }
      );
    });
  }

  reasonSelected(e: any) {
    this.authForm.controls.reason.setValue(e.DESCRIPTION);
    this.authForm.controls.description.setValue(e.DESCRIPTION);
  }


  getReasonMasters() {
    let API = `GeneralMaster/GetGeneralMasterList/reason%20master`
    this.dataService.getDynamicAPI(API).
      subscribe(data => {

        if (data.status == "Success") {
          this.reasonMaster = data.response;
          this.reasonMasterOptions = this.authForm.controls.reason.valueChanges.pipe(
            startWith(''),
            map((value) =>
              this._filterMasters(this.reasonMaster, value, 'CODE', 'DESCRIPTION')
            )
          );
          console.log(this.reasonMasterOptions);
        } else {
          this.reasonMaster = [];
        }

      });

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

  submitAuth() {
    if (!this.authForm.invalid) {
      let API = 'ValidatePassword/ValidateEditDelete';
      const postData = {
        // "Username": this.authForm.value.username,
        "Username": localStorage.getItem('username') || '',
        "Password": this.authForm.value.password
      };
      let sub: Subscription = this.dataService.postDynamicAPI(API, postData).subscribe((resp: any) => {
        if (resp.status == 'Success') {
          this.modalReferenceUserAuth.close(true);
          this.authSubmit.emit('Success')
          this.authForm.reset();
        } else {
          this.CommonService.showSnackBarMsg(resp.message)
        }
      });


    } else {
      this.CommonService.showSnackBarMsg('Please fill all fields')
    }

  }

  changeReason(e: any) {
    console.log(e);
    const res = this.reasonMaster.filter((data: any) => data.CODE == e.value)
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


}
