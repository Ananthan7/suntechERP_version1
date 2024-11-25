import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subledger-prefix-master',
  templateUrl: './subledger-prefix-master.component.html',
  styleUrls: ['./subledger-prefix-master.component.scss']
})
export class SubledgerPrefixMasterComponent implements OnInit {

  @Input() content!: any;
  unq_id: any;
  flag: any;
  dyndatas: any;
  BranchData: MasterSearchModel = {};
  private subscriptions: Subscription[] = [];
  viewOnly: boolean = false;
  curr_branch : any = localStorage.getItem('userbranch');
  disable_code:boolean = false;
  editMode:boolean = false;
  viewMode:boolean = false;





  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private commonService: CommonServiceService,
    private renderer: Renderer2




  ) { }

  prefixmasterform: FormGroup = this.formBuilder.group({
    prefixcode: ["",[Validators.required]],
    prefixcodedesc: ["",[Validators.required]],
    last_no: ["0000",[Validators.required]],
  });

  codeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION='S'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  isexistingcode(){
    if(this.flag == 'VIEW' || this.flag == 'EDIT'){
      return;
    }
    let code = this.prefixmasterform.controls.prefixcode.value;
    if(code != ""){
      let API = `PrefixMaster/CheckIfPrefixCodePresent/${code}`;
      let Sub: Subscription = this.apiService.getDynamicAPI(API)
        .subscribe((result: any) => {
         let code_exists = result.checkifExists;
         console.log(code_exists);;
         if(code_exists == true){
           this.commonService.toastErrorByMsgId('MSG1121');
          this.prefixmasterform.controls.prefixcode.reset();
          this.renderer.selectRootElement('#prefixcodeInput')?.focus();
        }  
        }, (err: any) => {
  
        })
      this.subscriptions.push(Sub);
    }
  }

  checkcode() {
    const prefixCodeControl = this.prefixmasterform.controls.prefixcode;
    if (!prefixCodeControl.value || prefixCodeControl.value.trim() === "") {
      this.commonService.toastErrorByMsgId('MSG1124');
      this.renderer.selectRootElement('#prefixcodeInput')?.focus();
    }
  }

  checkdesc() {
    const prefixCodeControl = this.prefixmasterform.controls.prefixcodedesc;
    if (!prefixCodeControl.value || prefixCodeControl.value.trim() === "") {
      this.commonService.toastErrorByMsgId('MSG1193');
      this.renderer.selectRootElement('#prefixdescInput')?.focus();
    }
  }



  ngOnInit(): void {
    console.log(this.content);
    // this.unq_id = this.content?.MID;
    this.unq_id = this.content?.PREFIX_CODE;
    console.log(this.unq_id);
    this.flag = this.content?.FLAG;
    if(this.flag == 'EDIT'){
      this.disable_code = true;
      this.editMode = true;
    }else if(this.flag == 'VIEW'){
      this.viewMode = true;
    }
    this.initialController(this.flag, this.content);
    if (this?.flag == "EDIT" || this?.flag == 'VIEW') {
      this.detailsapi(this.unq_id);
    }
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

  editController(DATA: any) {
    this.ViewController(DATA);
  }

  ViewController(DATA: any) {
    console.log(this.viewOnly);
    this.prefixmasterform.controls.prefixcode.setValue(this.content?.PREFIX_CODE);
    this.prefixmasterform.controls.prefixcodedesc.setValue(this.content?.DESCRIPTION);
    this.prefixmasterform.controls.last_no.setValue(this.content?.LAST_NO);
  }

  detailsapi(fm_id: any) {
    if(this.flag == 'VIEW'){
      this.viewOnly = true;
    }

    let API = `PrefixMaster/GetPrefixMasterDetail/${this.unq_id}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.dyndatas = result.response;
        console.log(this.dyndatas);
        this.prefixmasterform.controls.prefixcode.setValue(this.dyndatas?.PREFIX_CODE);
        // this.flag = "EDIT";
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
    console.log(this.dyndatas?.PREFIX_CODE);
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
        const API = `PrefixMaster/DeletePrefixMaster/${this.unq_id}`;
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
        this.flag = "VIEW";
      }
    });
  }

  formSubmit() {

    const postData = {
      "PREFIX_CODE": this.prefixmasterform.controls.prefixcode.value,
      "DESCRIPTION": this.prefixmasterform.controls.prefixcodedesc.value,
      "LAST_NO": this.prefixmasterform.controls.last_no.value,
      "CURRENCY_CODE": "" ,//"stri",
      "CONV_RATE": 0,
      "COST_CODE":  "" ,//"string",
      "CATEGORY_CODE":  "" ,//"string",
      "SUBCATEGORY_CODE":  "" ,//"string",
      "BRAND_CODE": this.curr_branch,
      "TYPE_CODE":  "" ,//"string",
      "COUNTRY_CODE":  "" ,//"string",
      "MID": 0,
      "DIVISION":  "" ,//"s",
      "SYSTEM_DATE":  new Date(),//"2024-11-18T08:34:11.298Z",
      "PM_BRANCHCODE":  "" ,//"string",
      "JOB_PREFIX": true,
      "SETREF_PREFIX": true,
      "BRANCH_CODE":  "" ,//"string",
      "BOIL_PREFIX": true,
      "SCHEME_PREFIX": true,
      "UDF1":  "" ,//"string",
      "UDF2":  "" ,//"string",
      "UDF3":  "" ,//"string",
      "UDF4": "" ,// "string",
      "UDF5":  "" ,//"string",
      "UDF6": "" ,// "string",
      "UDF7":  "" ,//"string",
      "UDF8":  "" ,//"string",
      "UDF9":  "" ,//"string",
      "UDF10":  "" ,//"string",
      "UDF11":  "" ,//"string",
      "UDF12":  "" ,//"string",
      "UDF13":  "" ,//"string",
      "UDF14":  "" ,//"string",
      "UDF15":  "" ,//"string",
      "TAG_WT": 0,
      "COMP_PREFIX": true,
      "DESIGN_PREFIX": true,
      "REFINE_PREFIX": true,
      "SUBLEDGER_PREFIX": true,
      "SUFFIX_CODE": "" ,// "stri",
      "HSN_CODE": "" ,// "string"
    }

    if (this.flag === "EDIT") {
      let API = `PrefixMaster/UpdatePrefixMaster/${this.unq_id}`;
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
      let API = `PrefixMaster/InsertPrefixMaster`;
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

  // close(data?: any) {
  //   // this.activeModal.close(data);
  //   if(this.flag == undefined || this.flag == 'EDIT'){
  //     Swal.fire({
  //       title: 'Do you want to exit?',
  //       text: '',
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Yes!',
  //       cancelButtonText: 'No'
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         this.activeModal.close(data);
  //       }
  //     });
  //   }else{
  //     this.activeModal.close(data);
  //   }
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

}
