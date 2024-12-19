import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { log } from 'console';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kyc-master',
  templateUrl: './kyc-master.component.html',
  styleUrls: ['./kyc-master.component.scss']
})
export class KycMasterComponent implements OnInit {
  @Input() content!: any;
  maindetails: any = [];
  viewMode: boolean = false;
  data: any;
  flag: any;
  kyc_id: any;
  private subscriptions: Subscription[] = [];
  viewOnly: boolean = false;
  dyndatas: any;
  disable_code: boolean = false;
  editMode: boolean = false;
  prefixcode = new FormControl('');
  @ViewChild('kyccode') kyccodeInput!: ElementRef;
  doc_codes: any[] = [];



  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef

  ) { }

  kycform: FormGroup = this.formBuilder.group({
    mid: [""],
    kyccode: ["", [Validators.required]],
    kyccodedesc: ["", [Validators.required]],
    transactionlimit: [".000"],

  });

  kyccodetype: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 14,
    LOOKUPID: 160,
    ORDER_TYPE: 0,
    WHERECONDITION: "",
    SEARCH_FIELD: "",
    SEARCH_HEADING: 'Doc. Code',
    SEARCH_VALUE: "",
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  selectedcodetype(e: any, data: any) {
    const updatedSRNO = data.data.KYC_SRNO - 1;
    if (this.doc_codes.includes(e.GENMST_CODE)) {
      Swal.fire({
        title: 'Error',
        text: 'Duplicate Code',
      });
    } else {
      this.doc_codes.push(e.GENMST_CODE);
      this.maindetails[updatedSRNO].KYC_DOCTYPE = e.GENMST_CODE;
      this.maindetails[updatedSRNO].KYC_DOCDESC = e.GENMST_DESC;
    }
  }

  ngOnInit(): void {
    console.log(this.content);
    this.flag = this.content?.FLAG;
    if (this.flag == 'EDIT') {
      this.disable_code = true;
    }
    if (this.flag == 'VIEW') {
      this.viewOnly = true;
      this.viewMode = true;
    }
    if (this.flag == undefined) {
      this.kycform.controls.transactionlimit.setValue(".000");

    }

    this.initialController(this.flag, this.content);
    if (this?.flag == "EDIT" || this?.flag == 'VIEW') {
      console.log(this.kyc_id);
      this.kyc_id = this.content?.KYC_CODE;
      this.kycform.controls.kyccode.setValue(this.content?.KYC_CODE);
      this.kycform.controls.kyccodedesc.setValue(this.content?.KYC_DESC);
      this.kycform.controls.transactionlimit.setValue(this.content?.KYC_TRANSLIMIT);
      this.detailsapi(this.kyc_id);
    }
  }

  ngAfterViewInit() {

    if (this.kyccodeInput && this.flag == undefined) {
      this.kyccodeInput.nativeElement.focus();
    }
  }


  checkcode() {
    const kyc_code = this.kycform.controls.kyccode;
    if (!kyc_code.value || kyc_code.value.trim() === "") {
      this.commonService.toastErrorByMsgId('MSG1363');
      this.renderer.selectRootElement('#kyccode')?.focus();
    }
  }

  checkdesc() {
    const kyc_desc = this.kycform.controls.kyccodedesc;
    if (!kyc_desc.value || kyc_desc.value.trim() === "") {
      this.commonService.toastErrorByMsgId('MSG1193');
      this.renderer.selectRootElement('#kyccodedesc')?.focus();
    }
  }


  detailsapi(fm_id: any) {
    // this.viewOnly = true;

    let API = `KYCMaster/GetKYCMasterDetail/${this.kyc_id}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.dyndatas = result.response;
        console.log(this.dyndatas);
        // this.maindetails.push(...this.dyndatas?.Details)
        this.maindetails = [...this.maindetails, ...this.dyndatas?.Details];
        result.response.Details.forEach((e: any) => {
          this.doc_codes.push(e.KYC_DOCTYPE);
        });
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
    console.log(this.doc_codes);
    console.log(this.maindetails);
  }


  initialController(FLAG: any, DATA: any) {
    if (FLAG === "VIEW") {
      this.ViewController(DATA);
    }
    if (FLAG === "EDIT") {
      this.editController(DATA);
    }

    if (FLAG === "DELETE") {
      this.DeleteController(DATA);
    }
  }

  ViewController(DATA: any) {
    this.kycform.controls.kyccode.setValue(this.content?.KYC_CODE);
    this.kycform.controls.kyccodedesc.setValue(this.content?.KYC_DESC);
    this.kycform.controls.transactionlimit.setValue(this.content?.KYC_TRANSLIMIT);

    this.kycform.controls.transactionlimit.setValue(
      this.commonService.decimalQuantityFormat(
        this.commonService.emptyToZero(this.content?.KYC_TRANSLIMIT),
        "AMOUNT"
      )
    );
  }

  editController(DATA: any) {
    this.ViewController(DATA);
  }

  DeleteController(DATA?: any) {
    this.ViewController(DATA);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        const API = `KYCMaster/DeleteKYCMaster/${this.kyc_id}`;
        const Sub: Subscription = this.apiService
          .deleteDynamicAPI(API)
          .subscribe({
            next: (response: any) => {
              Swal.fire({
                title:
                  response.status === "Success"
                    ? "Deleted Successfully"
                    : "Not Deleted",
                icon: response.status === "Success" ? "success" : "error",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              });

              response.status === "Success"
                ? this.close("reloadMainGrid")
                : console.log("Delete Error");
            },
            error: (err) => {
              Swal.fire({
                title: "Error",
                text: "Failed to delete the item.",
                icon: "error",
                confirmButtonColor: "#d33",
              });
              console.error(err);
            },
          });
        this.subscriptions.push(Sub);
      } else {
        // this.flag = "VIEW";
        this.activeModal.close('');
      }
    });
  }


  close(data?: any) {
    if (data) {
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW') {
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

  formSubmit() {

    Object.keys(this.kycform.controls).forEach((controlName) => {
      const control = this.kycform.controls[controlName];
      if (control.validator && control.validator({} as AbstractControl)) {
        control.markAsTouched();
      }
    });

    const requiredFieldsInvalid = Object.keys(
      this.kycform.controls
    ).some((controlName) => {
      const control = this.kycform.controls[controlName];
      return control.hasError("required") && control.touched;
    });

    if (!requiredFieldsInvalid) {
      const postData = {
        "MID": 0,
        "KYC_CODE": this.kycform.controls.kyccode.value,
        "KYC_DESC": this.kycform.controls.kyccodedesc.value,
        "KYC_TRANSLIMIT": Number(this.kycform.controls.transactionlimit.value),
        "Details": this.maindetails
      }
      console.log(postData);

      if (this.flag === "EDIT") {
        let API = `KYCMaster/UpdateKYCMaster/${this.kyc_id}`;
        let sub: Subscription = this.apiService
          .putDynamicAPI(API, postData)
          .subscribe((result) => {
            if (result.status.trim() === "Success") {
              Swal.fire({
                title: "Success",
                text: result.message ? result.message : "Updated successfully!",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              });

              this.close("reloadMainGrid");
            } else {
              Swal.fire({
                title: "Failed",
                text: result.message ? result.message : "Failed!",
                icon: "error",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              });
            }
          });
      } else {
        let API = `KYCMaster/InsertKYCMaster`;
        let sub: Subscription = this.apiService
          .postDynamicAPI(API, postData)
          .subscribe((result: any) => {
            if (result.status.trim() === "Success") {
              Swal.fire({
                title: "Success",
                text: result.message ? result.message : "Inserted successfully!",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              });

              this.close("reloadMainGrid");
            } else {
              Swal.fire({
                title: "Failed",
                text: "Not Inserted Successfully",
                icon: "error",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              });
            }
          });
      }
    }

  }

  docType(data: any, event: any) {
    console.log('New Value:', event.target.value);
    console.log(data);
    const updatedSRNO = data.data.KYC_SRNO - 1;
    this.maindetails[updatedSRNO].KYC_DOCTYPE = event.target.value;
    console.log('Updated DOC_TYPE:', this.maindetails[updatedSRNO].KYC_DOCTYPE);
  }


  docTypeDes(data: any, event: any) {
    const updatedSRNO = data.data.KYC_SRNO - 1;
    this.maindetails[updatedSRNO].KYC_DOCDESC = event.target.value;

    console.log('Updated DOC_TYPE:', this.maindetails[updatedSRNO].KYC_DOCDESC);
  }

  addTableData() {
    if (this.kycform.controls.kyccode.value == "") {
      Swal.fire({
        title: 'Error',
        text: 'Code Cannot be Empty',
      });
    } else if (this.kycform.controls.kyccodedesc.value == "") {
      Swal.fire({
        title: 'Error',
        text: 'Description Cannot be Empty',
      });
    } else {

      let srno = this.maindetails.length;
      srno += 1;

      let data = {
        "UNIQUEID": srno,
        "KYC_DETCODE": "",
        "KYC_SRNO": srno,
        "KYC_DOCTYPE": "",
        "KYC_DOCDESC": ""
      }
      this.maindetails.push(data);
      this.cdr.detectChanges();

    }

  }

  deleteTableData() {
    if (this.maindetails.length > 0) {
      this.maindetails.pop();
    }
  }

}
