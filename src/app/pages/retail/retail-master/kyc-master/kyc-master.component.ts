import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { log } from 'console';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kyc-master',
  templateUrl: './kyc-master.component.html',
  styleUrls: ['./kyc-master.component.scss']
})
export class KycMasterComponent implements OnInit {
  @Input() content!: any;
  maindetails:any=[];
  viewMode:boolean = false;
  data: any;
  flag:any;
  kyc_id:any;
  private subscriptions: Subscription[] = [];
  viewOnly:boolean = false;
  dyndatas:any;
  disable_code:boolean = false;
  editMode:boolean = false;


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private commonService: CommonServiceService,
    private renderer: Renderer2

  ) { }

  kycform: FormGroup = this.formBuilder.group({
    mid: [""],
    kyccode: [""],
    kyccodedesc: [""],
    transactionlimit: [""],
   
  });

  ngOnInit(): void {
    console.log(this.content);
    this.flag = this.content?.FLAG;
    if(this.flag == 'EDIT'){
      this.disable_code = true;
      this.editMode = true;
    }
    if(this.flag == 'VIEW'){
      this.viewOnly =true;
      this.viewMode = true;
    }
    this.kyc_id = this.content?.KYC_CODE;
    console.log(this.kyc_id);
    this.kycform.controls.kyccode.setValue(this.content?.KYC_CODE);
    this.kycform.controls.kyccodedesc.setValue(this.content?.KYC_DESC);
    this.kycform.controls.transactionlimit.setValue(this.content?.KYC_TRANSLIMIT);
    this.initialController(this.flag, this.content);
    if (this?.flag == "EDIT" || this?.flag == 'VIEW') {
      this.detailsapi(this.kyc_id);
    }
  }

  
  checkcode() {
    const kyc_code = this.kycform.controls.kyccode;
    if (!kyc_code.value || kyc_code.value.trim() === "") {
      this.commonService.toastErrorByMsgId('MSG1124');
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
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
    // console.log(this.dyndatas.FA_CATEGORY);
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
        this.flag = "VIEW";
      }
    });
  }


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

  formSubmit(){

    const postData = {
      "MID": 0,
      "KYC_CODE":  this.kycform.controls.kyccode.value,
      "KYC_DESC":  this.kycform.controls.kyccodedesc.value,
      "KYC_TRANSLIMIT":  this.kycform.controls.transactionlimit.value,
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
        .subscribe((result:any) => {
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

  addTableData(){
    if(this.kycform.controls.kyccode.value == ""){
      Swal.fire({
        title: 'Error',
        text: 'Code Cannot be Empty',
      });
    }else if(this.kycform.controls.kyccodedesc.value == ""){
      Swal.fire({
        title: 'Error',
        text: 'Description Cannot be Empty',
      });
    }else{

      let srno = this.maindetails.length;
      srno+=1;

      // let data = {
      //   "SRNO": srno,
      //   "DOC_TYPE" : "",
      //   "DOC_DESC" : ""
      // }

      let data = {
        "UNIQUEID": srno ,
        "KYC_DETCODE": "",
        "KYC_SRNO": srno,
        "KYC_DOCTYPE": "",
        "KYC_DOCDESC": ""
      }
      this.maindetails.push(data);
      
    }

  }

  deleteTableData(){
    if (this.maindetails.length > 0) {
      this.maindetails.pop(); 
    }
  }

}
