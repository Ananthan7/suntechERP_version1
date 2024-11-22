import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tds-master',
  templateUrl: './tds-master.component.html',
  styleUrls: ['./tds-master.component.scss']
})
export class TdsMasterComponent implements OnInit {

  @Input() content!: any;
  unq_id: any;
  BranchData:any=[];
  maindetails:any=[];
  private subscriptions: Subscription[] = [];
  viewOnly: boolean = false;
  viewMode: boolean = false;
  editMode: boolean = false;
  dyndatas: any;
  tds:any;
  flag: any;
  curr_branch :any = localStorage.getItem('userbranch');
  disable_code:boolean = false;

  


  constructor(
    private activeModal:NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private apiService: SuntechAPIService,

  ) { }

  ngOnInit(): void {
    this.flag = this.content?.FLAG;
    this.unq_id = this.content?.PREFIX_CODE;
    console.log(this.unq_id);
    console.log(this.content);
    this.flag = this.content?.TDS_CODE;
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

  tdsform: FormGroup = this.formBuilder.group({
    section_code:[''],
    financial_year:[''],
    description:[''],
    credit_ac:[''],
    debit_ac:[''],
    call:[''],
  })

  initialController(FLAG: any, DATA: any) {
    if (FLAG === "VIEW") {
      this.ViewController(DATA);
      this.viewMode = true;
    }
    if (FLAG === "EDIT") {
      this.editController(DATA);
      this.editMode = true;
      
    }

    if (FLAG === "DELETE") {
      this.DeleteController(DATA);
    }
  }

  editController(DATA: any) {
    this.ViewController(DATA);
  }

  ViewController(DATA: any) {
    this.tdsform.controls.section_code.setValue(this.content?.TDS_CODE);
    this.tdsform.controls.description.setValue(this.content?.TDS_DESCRIPTION);
    this.tdsform.controls.credit_ac.setValue(this.content?.CREDIT_AC_CODE);
    this.tdsform.controls.debit_ac.setValue(this.content?.DEBIT_AC_CODE);
    this.tdsform.controls.call.setValue(this.content?.ON_TAXABLEAMT);
    this.unq_id = this.content?.TDS_CODE;
  }

  detailsapi(fm_id: any) {
    this.viewOnly = true;

    let API = `TDSMaster/GetTDSHeaderAndDetails/${this.unq_id}/${this.curr_branch}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.dyndatas = result.response;
        console.log(this.dyndatas);
        this.flag = "EDIT";
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
    console.log(this.dyndatas.FA_CATEGORY);
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
        const API = `TDSMaster/DeleteTDSMaster/${this.unq_id}`;
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

  formSubmit() {

    const postData = {
      "TDS_CODE": this.tdsform.controls.section_code.value,
      "TDS_DESCRIPTION": this.tdsform.controls.description.value,
      "CREDIT_AC_CODE": this.tdsform.controls.credit_ac.value,
      "SYSTEM_DATE": new Date(),
      "MID": 0,
      "INDIVIDUAL_PER": 0,
      "COMPANY_PER": 0,
      "NOPAN_PER": 0,
      "DEBIT_AC_CODE":this.tdsform.controls.debit_ac.value,
      "BRANCH_CODE": "string",
      "TDS_LIMIT": 0,
      "ON_TAXABLEAMT": this.tdsform.controls.call.value,
      "INCLUDE_GST": true,
      "tdsDetails": [
        {
          "UNIQUE_ID": 0,
          "REFMID": 0,
          "EFFECT_FROM_DATE": "2024-11-18T06:34:50.057Z",
          "INDIVIDUAL_PER": 0,
          "COMPANY_PER": 0,
          "NOPAN_PER": 0,
          "TDS_CODE": "string",
          "SRNO": 0,
          "BRANCH_CODE": "string",
          "YEARCODE": "string",
          "TDS_LIMIT": 0,
          "ON_TAXABLEAMT": true,
          "INCLUDE_GST": true
        }
      ]
    }

    if (this.flag === "EDIT") {
      let API = `TDSMaster/UpdateSubLedger/${this.unq_id}`;
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
      let API = `TDSMaster/InsertTDSMaster`;
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

  
  BranchDataSelected(e:any){

  }

}
