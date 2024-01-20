import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-priceschemes-master',
  templateUrl: './priceschemes-master.component.html',
  styleUrls: ['./priceschemes-master.component.scss']
})
export class PriceschemesMasterComponent implements OnInit {
  priceSchemaMasterForm!: FormGroup;
  @Input() content!: any;
  priceCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService

  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.setAllInitialValues();
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update();
      return;
    }
    if (!this.validateForm()) return;

    let API = 'PriceSchemeMaster/InsertPriceSchemeMaster';
    let postData = this.createPostData();

    try {
      this.dataService.postDynamicAPI(API, postData)
        .subscribe(
          result => this.handleApiResponse(result),
          err => {
            console.error('Error in formSubmit:', err);
            this.toastr.error('Error while submitting the form');
          }
        );
    } catch (error) {
      console.error('Error in formSubmit:', error);
      this.toastr.error('Error while submitting the form');
    }
  }

  update() {
    if (!this.validateForm()) return;

    let API = `PriceSchemeMaster/UpdatePriceSchemeMaster`;
    let postData = this.createPostData();

    try {
      this.dataService.putDynamicAPI(API, postData)
        .subscribe(
          result => this.handleApiResponse(result),
          err => {
            console.error('Error in update:', err);
            this.toastr.error('Error while updating the form');
          }
        );
    } catch (error) {
      console.error('Error in update:', error);
      this.toastr.error('Error while updating the form');
    }
  }

  deleteRecord() {
    try {
      if (!this.content.MID) {
        this.showInitialDeleteConfirmation();
        return;
      }

      this.confirmDeletion().then((result) => {
        if (result.isConfirmed) {
          let API = 'PriceSchemeMaster/DeletePriceSchemeMaster/' + this.priceSchemaMasterForm.value.priceCode;
          this.handleDeletion(API);
        }
      });
    } catch (error) {
      console.error('Error in deleteRecord:', error);
      this.toastr.error('Error while deleting the record');
    }
  }

  setAllInitialValues() {
    if (!this.content) return
    try {
      let API = `PriceSchemeMaster/GetPriceSchemeMasterList/${this.content.PRICE_CODE}`
      let Sub: Subscription = this.dataService.getDynamicAPI(API)
        .subscribe((result) => {
          if (result.response) {
            let data = result.response

            this.priceSchemaMasterForm.controls.priceCode.setValue(data.PRICE_CODE)
            this.priceSchemaMasterForm.controls.priceDescription.setValue(data.PRICE_DESCRIPTION)
            this.priceSchemaMasterForm.controls.price1.setValue(data.PRICE1)
            this.priceSchemaMasterForm.controls.price2.setValue(data.PRICE2)
            this.priceSchemaMasterForm.controls.price3.setValue(data.PRICE3)
            this.priceSchemaMasterForm.controls.price4.setValue(data.PRICE4)
            this.priceSchemaMasterForm.controls.price5.setValue(data.PRICE5)

          } else {
            this.commonService.toastErrorByMsgId('MSG1531')
          }
        }, err => {
          console.error('Error in setAllInitialValues:', err);
          this.commonService.toastErrorByMsgId('MSG1531')
        })
    }
    catch (error) {
      console.error('Error in setAllInitialValues:', error);
      this.commonService.toastErrorByMsgId('MSG1531');
    }
  }

  priceCodeSelected(e: any, controlName: string) {
    try {
      this.priceSchemaMasterForm.controls[controlName].setValue(e.PRICE_CODE);
    } catch (error) {
      console.error('Error in priceCodeSelected:', error);
    }
  }

  private initializeForm() {
    try {
      this.priceSchemaMasterForm = this.formBuilder.group({
        priceCode: ['', [Validators.required]],
        priceDescription: ['', [Validators.required]],
        price1: ['', [Validators.required]],
        price2: ['', [Validators.required]],
        price3: ['', [Validators.required]],
        price4: ['', [Validators.required]],
        price5: ['', [Validators.required]]
      })
    } catch (error) {
      console.error('Error in initializeForm:', error);
      this.toastr.error('Error while initializing the form');
    }
  }

  createPostData() {
    return {
      "PRICE_CODE": this.priceSchemaMasterForm.value.priceCode,
      "PRICE_DESCRIPTION": this.priceSchemaMasterForm.value.priceDescription,
      "PRICE1": this.priceSchemaMasterForm.value.price1,
      "PRICE2": this.priceSchemaMasterForm.value.price2,
      "PRICE3": this.priceSchemaMasterForm.value.price3,
      "PRICE4": this.priceSchemaMasterForm.value.price4,
      "PRICE5": this.priceSchemaMasterForm.value.price5,
      "MID": this.content ? this.content.MID : 0,
    };
  }

  handleApiResponse(result: any) {
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
            this.priceSchemaMasterForm.reset();
            this.close('reloadMainGrid');
          }
        });
      }
    } else {
      this.toastr.error('Not saved');
    }
  }

  showInitialDeleteConfirmation() {
    return Swal.fire({
      title: '',
      text: 'Please Select data to delete!',
      icon: 'error',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    });
  }

  confirmDeletion() {
    return Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    });
  }

  handleDeletion(API: any) {
    this.dataService.deleteDynamicAPI(API).subscribe((result) => {
      if (result && result.status == "Success") {
        this.handleSuccessResponse(result);
      } else {
        this.handleErrorResponse(result);
      }
    }, err => {
      console.error('Error in handleDeletion:', err);
      this.toastr.error('Error while deleting the record');
    });
  }

  handleSuccessResponse(result: any) {
    Swal.fire({
      title: result.message || 'Success',
      text: '',
      icon: 'success',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      if (result.value) {
        this.priceSchemaMasterForm.reset();
        this.close('reloadMainGrid');
      }
    });
  }

  handleErrorResponse(result: any) {
    Swal.fire({
      title: result?.message || 'Error please try again',
      text: '',
      icon: 'error',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      if (result.value) {
        this.priceSchemaMasterForm.reset();
        this.close();
      }
    });
  }

  validateForm() {
    if (this.priceSchemaMasterForm.invalid) {
      this.toastr.error('Select all required fields');
      return false;
    }
    return true;
  }

  close(data?: any) {
    try {
      this.activeModal.close(data);
    } catch (error) {
      console.error('Error in close:', error);
    }
  }

}
