import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-loyalty-card-master',
  templateUrl: './loyalty-card-master.component.html',
  styleUrls: ['./loyalty-card-master.component.scss']
})
export class LoyaltyCardMasterComponent implements OnInit {
  maindetails: any = [];
  @Input() content!: any;
  unq_id: any;
  flag: any;
  dyndatas: any;
  private subscriptions: Subscription[] = [];
  viewOnly: boolean = false;
  codeedit: boolean = false;
  curr_branch: any = localStorage.getItem('userbranch');
  disable_code: boolean = false;
  editMode: boolean = false;
  viewMode: boolean = false;
  last_points_to :any;



  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private commonService: CommonServiceService,
    private renderer: Renderer2

  ) { }

  loyaltycardform: FormGroup = this.formBuilder.group({
    code: ['',[Validators.required]],
    codedesc: ['',[Validators.required]],
    pointsfrom: ['',[Validators.required]],
    pointsto: ['',[Validators.required]],
    metaldiscount: [''],
    diamonddiscount: [''],
    pointexpdays: [''],
    sendmessage: [''],
    sendemail: [''],
    pointmulfact: [''],
  })

  ngOnInit(): void {
    console.log(this.content);
    this.unq_id = this.content?.CODE;
    console.log(this.unq_id);
    this.flag = this.content?.FLAG;
    if(this.flag == undefined){
      this.renderer.selectRootElement('#code').focus();
      this.togetlastpointsto();
    }
    if (this.flag == 'EDIT') {
      this.disable_code = true;
      this.codeedit = true;
      this.editMode = true;
    } else if (this.flag == 'VIEW') {
      this.viewMode = true;
      this.codeedit = true;
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
    this.loyaltycardform.controls.code.setValue(this.content?.CODE);

    // this.salespersontargetform.controls.dateto.setValue(this.content?.TO_DATE);
    this.loyaltycardform.controls.codedesc.setValue(this.content?.DESCRIPTION);
    this.loyaltycardform.controls.pointsfrom.setValue(this.content?.POINTS_FROM);
    this.loyaltycardform.controls.pointsto.setValue(this.content?.POINTS_TO);
    this.loyaltycardform.controls.pointexpdays.setValue(this.content?.POINT_EXP_DAYS);
    this.loyaltycardform.controls.pointmulfact.setValue(this.content?.POINT_CONV_PER);
    this.loyaltycardform.controls.sendmessage.setValue(this.content?.SEND_MSG);
    this.loyaltycardform.controls.sendemail.setValue(this.content?.SEND_EMAIL);

    this.loyaltycardform.controls.diamonddiscount.setValue(this.commonService.decimalQuantityFormat(
      this.commonService.emptyToZero(this.content?.DIA_DISCOUNT_PER), "AMOUNT"));
    this.loyaltycardform.controls.metaldiscount.setValue(this.commonService.decimalQuantityFormat(
      this.commonService.emptyToZero(this.content?.MTL_DISCOUNT_PER), "AMOUNT"));

  }

  detailsapi(fm_id: any) {
    if (this.flag == 'VIEW') {
      this.viewOnly = true;
    }

    let API = `LoyaltyCardMaster/GetLoyaltyCardMasterDetailWithCode/${this.unq_id}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.dyndatas = result.response;
        console.log(this.dyndatas);
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
  }

  togetlastpointsto(){
    let data :any;
    let API = `LoyaltyCardMaster/`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        data = result.response;
        data.forEach((e:any) => {
          this.last_points_to = e.POINTS_TO
        });
        console.log(this.last_points_to);
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
  }


  checkcode() {
    const CodeControl = this.loyaltycardform.controls.code;
    if (!CodeControl.value || CodeControl.value.trim() === "") {
      this.commonService.toastErrorByMsgId('MSG1124');
      this.renderer.selectRootElement('#code')?.focus();
    }
  }

  
  checkdesc() {
    const descControl = this.loyaltycardform.controls.codedesc;
    if (!descControl.value || descControl.value.trim() === "") {
      this.commonService.toastErrorByMsgId('MSG1193');
      this.renderer.selectRootElement('#codedesc')?.focus();
    }
  }

  checkvalue() {
    let points_from = this.loyaltycardform.controls.pointsfrom.value;
    let points_to = this.loyaltycardform.controls.pointsto.value;
    if (points_from >= points_to) {
        this.loyaltycardform.controls.pointsto.setErrors({ pointsToLower: true });
        this.renderer.selectRootElement('#pointsto')?.focus();
    } else {
        this.loyaltycardform.controls.pointsto.setErrors(null);
    }
  }

    check_greater(){
      let points_from = this.loyaltycardform.controls.pointsfrom.value;
      let points_to = this.loyaltycardform.controls.pointsto.value;
      
      if (this.last_points_to >= points_from) {
        this.loyaltycardform.controls.pointsfrom.setErrors({ pointsfromlower: true });
        this.renderer.selectRootElement('#pointsfrom')?.focus();
      }else  if (points_from >= points_to) {
        this.loyaltycardform.controls.pointsto.setErrors({ pointsToLower: true });
        this.renderer.selectRootElement('#pointsto')?.focus();
      } else {
        this.loyaltycardform.controls.pointsfrom.setErrors(null);
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
        const API = `LoyaltyCardMaster/DeleteLoyaltyCardMaster/${this.unq_id}`;
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

    const postData = {
      "MID": 0,
      "CODE": this.loyaltycardform.controls.code.value,
      "DESCRIPTION": this.loyaltycardform.controls.codedesc.value,
      "POINTS_FROM": this.loyaltycardform.controls.pointsfrom.value,
      "POINTS_TO": this.loyaltycardform.controls.pointsto.value,
      "MTL_DISCOUNT_PER": this.loyaltycardform.controls.metaldiscount.value || 0,
      "DIA_DISCOUNT_PER": this.loyaltycardform.controls.diamonddiscount.value || 0,
      "SEND_MSG": this.loyaltycardform.controls.sendmessage.value ? true : false,
      "SEND_EMAIL": this.loyaltycardform.controls.sendemail.value ? true : false,
      "POINT_EXP_DAYS": this.loyaltycardform.controls.pointexpdays.value || 0,
      "POINT_CONV_PER": this.loyaltycardform.controls.pointmulfact.value || 0,
      "PICTURE_NAME": "string"
    }

    // console.log(postData);return;

    if (this.flag === "EDIT") {
      let API = `LoyaltyCardMaster/UpdateLoyaltyCardMaster/${this.unq_id}`;
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
      let API = `LoyaltyCardMaster/InsertLoyaltyCardMaster`;
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

  BranchDataSelected(e: any) {

  }

}
