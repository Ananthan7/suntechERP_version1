import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Console } from 'console';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transaction-reference-master',
  templateUrl: './transaction-reference-master.component.html',
  styleUrls: ['./transaction-reference-master.component.scss']
})
export class TransactionReferenceMasterComponent implements OnInit {
  BranchData:any=[];
  @Input() content!: any;
  unq_id: any;
  flag: any;
  dyndatas: any;
  private subscriptions: Subscription[] = [];
  viewOnly: boolean = false;
  curr_branch : any = localStorage.getItem('userbranch');
  disable_code:boolean = false;
  editMode:boolean = false;
  viewMode:boolean = false;
  prefixcode = new FormControl('');
  @ViewChild('ref_code') ref_codeInput!: ElementRef;
  statusList:any[]=[];





  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private commonService: CommonServiceService,
    private renderer: Renderer2

  ) { }

  transactionform: FormGroup = this.formBuilder.group({
    ref_code:['',[Validators.required]],
    client_name:['',[Validators.required]],
    client_name_desc:['',[Validators.required]],
    ref_date: [new Date()],
    status:[''],
  });

  clientnamedata: MasterSearchModel = {
    PAGENO: 3,
    RECORDS: 35,
    LOOKUPID: 95,
    ORDER_TYPE: 0,
    WHERECONDITION: "",
    SEARCH_FIELD: "",
    SEARCH_HEADING: "Client",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  } 


  clientcodeselect(e:any){
    console.log(e);
    this.transactionform.controls.client_name.setValue(e.ACCODE);
    this.transactionform.controls.client_name_desc.setValue(e.ACCOUNT_HEAD);

  }

  ngOnInit(): void {
    console.log(this.commonService.comboFilter);
    this.unq_id = this.content?.REF_CODE;
    this.flag = this.content?.FLAG;
    console.log(this.content)
    if(this.flag == 'EDIT'){
      this.disable_code = true;
    }else if(this.flag == 'VIEW'){
      this.viewMode = true;
    }
    this.initialController(this.flag, this.content);
    if (this?.flag == "EDIT" || this?.flag == 'VIEW') {
      this.detailsapi(this.unq_id);
    }
    this.statusList = this.getUniqueValues(
      this.commonService.getComboFilterByID("Reference Master Status"),
      "ENGLISH"
    );
    console.log(this.statusList);    
  }

  getUniqueValues(List: any[], field: string) {
    return List.filter(
      (item, index, self) =>
        index ===
        self.findIndex((t) => t[field] === item[field] && t[field] !== "")
    );
  }

  initialController(FLAG: any, DATA: any) {
    if (FLAG === "VIEW") {
      this.viewOnly = true;
      this.ViewController(DATA);
    }
    if (FLAG === "EDIT") {
      this.editController(DATA);
    }

    if (FLAG === "DELETE") {
      this.DeleteController(DATA);
    }
  }

  ngAfterViewInit() {
    if (this.ref_codeInput && this.flag == undefined) {
      this.ref_codeInput.nativeElement.focus();
    }
  }

  
  checkcode() {
    const CodeControl = this.transactionform.controls.ref_code;
    // console.log(CodeControl.value);
      this.renderer.selectRootElement('#ref_code')?.focus();

      
    if (!CodeControl.value || CodeControl.value.trim() === "") {
      this.commonService.toastErrorByMsgId('MSG1124');
      this.renderer.selectRootElement('#ref_code')?.focus();
    }else{
      if(this.flag == 'VIEW' || this.flag == 'EDIT'){
        return;
      }
      this.checkReferenceCode();
    }
  }

  async checkReferenceCode() {
    const code = this.transactionform.controls.ref_code.value;
  
    if (code !== "") {
      const API = `ReferenceNumberMaster/CheckIfRefCodePresent/${code}`;
  
      try {
        const result: any = await this.apiService.getDynamicAPI(API).toPromise();
        const code_exists = result.checkifExists;
  
        if (code_exists) {
          this.commonService.toastErrorByMsgId('MSG1121');
          this.transactionform.controls.ref_code.reset();
          this.renderer.selectRootElement('#ref_code')?.focus();
        } else {
          this.renderer.selectRootElement('#client_name')?.focus();
        }
      } catch (err) {
        console.error('Error occurred while checking reference code:', err);
      }
    }
  }

  
  editController(DATA: any) {
    this.ViewController(DATA);
  }
  detailsapi(fm_id: any) {
    if(this.flag == 'VIEW'){
      this.viewOnly = true;
    }

    let API = `ReferenceNumberMaster/GetReferenceNumberMasterDetailList/${this.unq_id}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.dyndatas = result.response;
        console.log(this.dyndatas);
        this.transactionform.controls.prefixcode.setValue(this.dyndatas?.REF_CODE);
        // this.flag = "EDIT";
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
    console.log(this.dyndatas?.PREFIX_CODE);
  }

  // checkcode() {
  //   let API = `ReferenceNumberMaster/GetReferenceNumberMasterDetailList/${this.unq_id}`;
  //   let Sub: Subscription = this.apiService.getDynamicAPI(API)
  //     .subscribe((result: any) => {
  //       this.dyndatas = result.response;
  //       console.log(this.dyndatas);
  //       this.transactionform.controls.prefixcode.setValue(this.dyndatas?.REF_CODE);
  //       // this.flag = "EDIT";
  //     }, (err: any) => {

  //     })
  //   this.subscriptions.push(Sub);
  //   console.log(this.dyndatas?.PREFIX_CODE);
  // }


  
  isexistingcode(){
    if(this.flag == 'VIEW' || this.flag == 'EDIT'){
      return;
    }
    let code = this.transactionform.controls.ref_code.value;
    if(code != ""){
      let API = `ReferenceNumberMaster/CheckIfRefCodePresent/${code}`;
      let Sub: Subscription = this.apiService.getDynamicAPI(API)
        .subscribe((result: any) => {
         let code_exists = result.checkifExists;
        //  console.log(code_exists);;
         if(code_exists == true){
           this.commonService.toastErrorByMsgId('MSG1121');
          this.transactionform.controls.ref_code.reset();
          this.renderer.selectRootElement('#ref_code')?.focus();
        }  
        }, (err: any) => {
  
        })
      this.subscriptions.push(Sub);
    }
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
        const API = `ReferenceNumberMaster/DeleteReferenceNumberMaster/${this.unq_id}`;
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
            error: (err: any) => {
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
        this.activeModal.close("");
      }
    });
  }

  ViewController(DATA: any) {
    console.log(this.viewOnly);
    this.transactionform.controls.ref_code.setValue(this.content?.REF_CODE);
    this.transactionform.controls.client_name.setValue(this.content?.PARTY_NAME);
    this.transactionform.controls.client_name_desc.setValue(this.content?.PARTY_HAED);
    this.transactionform.controls.ref_date.setValue(this.content?.REF_DATE);
    this.transactionform.controls.status.setValue(this.content?.STATUS);
  }

  formSubmit(){

    Object.keys(this.transactionform.controls).forEach((controlName) => {
      const control = this.transactionform.controls[controlName];
      if (control.validator && control.validator({} as AbstractControl)) {
        control.markAsTouched();
      }
    });

    const requiredFieldsInvalid = Object.keys(
      this.transactionform.controls
    ).some((controlName) => {
      const control = this.transactionform.controls[controlName];
      return control.hasError("required") && control.touched;
    });


    const postData = {
      "MID": 0,
      "REF_CODE": this.transactionform.controls.ref_code.value,//"string",
      "PARTY_NAME": this.transactionform.controls.client_name.value,//"string",
      "PARTY_HAED":this.transactionform.controls.client_name_desc.value,// "string",
      "REF_DATE": this.transactionform.controls.ref_date.value,//"2024-12-05T10:36:31.627Z",
      "STATUS": this.transactionform.controls.status.value ,//"string",
      "SYSTEM_DATE": new Date()// "2024-12-05T10:36:31.627Z"
    }

    // console.log(postData);return;

    if (this.flag === "EDIT") {
      let API = `ReferenceNumberMaster/UpdateReferenceNumberMaster/${this.unq_id}`;
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
      let API = `ReferenceNumberMaster/InsertReferenceNumberMaster`;
      let sub: Subscription = this.apiService
        .postDynamicAPI(API, postData)
        .subscribe((result) => {
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


  BranchDataSelected(event:any){

  }

}
