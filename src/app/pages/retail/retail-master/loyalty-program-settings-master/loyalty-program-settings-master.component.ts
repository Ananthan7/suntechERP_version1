import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-loyalty-program-settings-master',
  templateUrl: './loyalty-program-settings-master.component.html',
  styleUrls: ['./loyalty-program-settings-master.component.scss']
})
export class LoyaltyProgramSettingsMasterComponent implements OnInit {

  BranchData: any = [];
  maindetails: any = [];
  maindetails2: any = [];
  division_values: any;
  viewMode: boolean = false;
  modalReference!: NgbModalRef;
  @Input() content!: any;
  unq_id: any;
  flag: any;
  dyndatas: any;
  private subscriptions: Subscription[] = [];
  viewOnly: boolean = false;
  codeedit: boolean = false;
  curr_branch: any = localStorage.getItem('userbranch');
  curr_user: any = localStorage.getItem('username');
  disable_code: boolean = false;
  editMode: boolean = false;
  disadd_btn: boolean = true;
  dropdownvalues:any[]=[];


  loyaltysettingform: FormGroup = this.formBuilder.group({
    code: [''],
    codedesc: [''],
    division: [''],
    divisions: [''],
    group1: [''],
    group1search: [''],
    group2: [''],
    group2search: [''],
    group3: [''],
    group3search: [''],
    standardamt1: [''],
    standardamt2: [''],
    standardamt3: [''],
    standardamt4: [''],
    redeem: [''],
    no_redeem_points: [''],
    calculate_points: [''],
    reference1: [''],
    subreference: [''],
  })


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private apiService: SuntechAPIService,
    private commonService: CommonServiceService,
    private renderer: Renderer2

  ) { }


  ngOnInit(): void {
    console.log(this.content);
    this.unq_id = this.content?.CODE;
    console.log(this.unq_id);
    this.flag = this.content?.FLAG;

    this.division_values = this.getUniqueValues(
      this.commonService.getComboFilterByID("division"),
      "ENGLISH"
    );


    console.log(this.division_values)
    this.getdropdownvalues();

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

  editController(DATA: any) {
    this.ViewController(DATA);
  }


  ViewController(DATA: any) {
    console.log(this.viewOnly);
    this.loyaltysettingform.controls.code.setValue(this.content?.CODE);

    // this.salespersontargetform.controls.dateto.setValue(this.content?.TO_DATE);
    this.loyaltysettingform.controls.codedesc.setValue(this.content?.DESCRIPTION);
    this.loyaltysettingform.controls.calculate_points.setValue(this.content?.DONT_CAL_POINTS);
    this.loyaltysettingform.controls.no_redeem_points.setValue(this.content?.STD_AMT_REDEEMPOINT);

    this.loyaltysettingform.controls.reference1.setValue(this.commonService.decimalQuantityFormat(
      this.commonService.emptyToZero(this.content?.FIRST_REF_PER), "METAL"));
    this.loyaltysettingform.controls.subreference.setValue(this.commonService.decimalQuantityFormat(
      this.commonService.emptyToZero(this.content?.STD_REF_PER), "METAL"));
    this.loyaltysettingform.controls.standardamt1.setValue(this.commonService.decimalQuantityFormat(
      this.commonService.emptyToZero(this.content?.STD_AMT_PERPOINT), "METAL"));

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

  getdropdownvalues() {
    if (this.flag == 'VIEW') {
      this.viewOnly = true;
    }

    let API = `LoyaltySettingMaster/GetLoyaltySettingGroupDropdown`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
       if(result.status == 'Success'){
        this.dropdownvalues = result.response;
       }
      }, (err: any) => {

      })
    this.subscriptions.push(Sub);
  }

  isexistingcode() {
    if (this.flag == 'VIEW' || this.flag == 'EDIT') {
      return;
    }
    let curr_code = this.loyaltysettingform.controls.code.value;
    if (curr_code != "") {
      let API = `LoyaltySettingMaster/CheckIfLoyaltySettingCodePresent/${curr_code}`;
      let Sub: Subscription = this.apiService.getDynamicAPI(API)
        .subscribe((result: any) => {
          let code_exists = result.checkifExists;
          console.log(code_exists);;
          if (code_exists == true) {
            this.commonService.toastErrorByMsgId('MSG1121');
            this.loyaltysettingform.controls.code.reset();
            this.renderer.selectRootElement('#code')?.focus();
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
        const API = `LoyaltySettingMaster/DeleteLoyaltySettingMaster/${this.unq_id}`;
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
      "CODE": this.loyaltysettingform.controls.code.value,
      "DESCRIPTION": this.loyaltysettingform.controls.codedesc.value,
      "ALL_DIVISION": "string",
      "FILTER1": "string",
      "FILTER2": "string",
      "FILTER3": "string",
      "ALL_GRP1": "string",
      "ALL_GRP2": "string",
      "ALL_GRP3": "string",
      "STD_AMT_PERPOINT": this.loyaltysettingform.controls.standardamt1.value,
      "CREATED_BY": this.curr_user,
      "CREATED_ON": new Date(),
      "FILTERFILED1": "string",
      "FILTERFILED2": "string",
      "FILTERFILED3": "string",
      "DONT_CAL_POINTS": this.loyaltysettingform.controls.calculate_points.value ? true : false,
      "STD_AMT_REDEEMPOINT": this.loyaltysettingform.controls.redeem.value,
      "NO_POINTSSLAB": this.loyaltysettingform.controls.no_redeem_points.value ? true : false,
      "FIRST_REF_PER": this.loyaltysettingform.controls.reference1.value,
      "STD_REF_PER": this.loyaltysettingform.controls.subreference.value,
      "Detail": [
        {
          "SLNO": 0,
          "REFMID": 0,
          "CODE": "string",
          "DIA_OR_MTL": "string",
          "DIVISIONS": "string",
          "INVFILT1_VALUES": "string",
          "INVFILT2_VALUES": "string",
          "INVFILT3_VALUES": "string",
          "INVFILT1_FIELD": "string",
          "INVFILT2_FIELD": "string",
          "INVFILT3_FIELD": "string",
          "AMOUNT_SPENT": 0
        }
      ]
    }

    console.log(postData); return;

    if (this.flag === "EDIT") {
      let API = `LoyaltySettingMaster/UpdateLoyaltySettingMaster/${this.unq_id}`;
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
      let API = `LoyaltySettingMaster/InsertLoyaltySettingMaster`;
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

  BranchDataSelected(data: any) {

  }

  clear(element: any) {
    this.loyaltysettingform.controls[element].reset();
  }

  amountfield(data: any, event: any) {
    const updatedSRNO = data.data.SRNO - 1;
    this.maindetails2[updatedSRNO].AMOUNT = event.target.value;
    this.maindetails2[updatedSRNO].AMOUNT = this.commonService.decimalQuantityFormat(
      this.commonService.emptyToZero(event.target.value), "AMOUNT")

  }

  pointsfield(data: any, event: any) {
    const updatedSRNO = data.data.SRNO - 1;
    this.maindetails2[updatedSRNO].POINTS = event.target.value;
  }


  addTableData() {
    let count = this.maindetails2.length;
    let data = {
      'SRNO': count + 1,
      "POINTS": '',
      "AMOUNT": ''
    }
    this.maindetails2.push(data);

  }

  deleteTableData() {
    this.maindetails2.pop();
  }

  changeredeem() {
    let curr_redeem = this.loyaltysettingform.controls.no_redeem_points.value;
    console.log(curr_redeem);
    if (curr_redeem == true) {
      this.loyaltysettingform.controls['redeem'].enable();
      this.disadd_btn = false;
    } else {
      this.loyaltysettingform.controls['redeem'].disable();
      this.disadd_btn = true;
    }
  }

  adddetails_data(){
    let data_count = this.maindetails.length;
    let curr_division ;
    let curr_points ;
    console.log(this.loyaltysettingform.controls.division.value)
    if(this.loyaltysettingform.controls.division.value == 'Metal'){
      curr_division = 'M'
    }else{
      curr_division = 'S'
    }
    curr_points = this.loyaltysettingform.controls.standardamt1.value;
  
    let data = {
      'SLNO': data_count + 1,
      'DIA_METAL' : curr_division,
      'DIVISIONS' : '',
      'AMTSPENT' : ''
      // 'INVFILTER1' : '',
      // 'INVFILTER2' : '',
      // 'INVFILTER3' : '',
    };
    this.maindetails.push(data);
  }

  dia_metalfield(data:any , event:any){
    const updatedSLNO = data.data.SLNO - 1;
    this.maindetails[updatedSLNO].DIA_METAL = event.target.value;
  }

  amtfield(data:any , event:any){
    const updatedSLNO = data.data.SLNO - 1;
    this.maindetails[updatedSLNO].AMTSPENT = event.target.value;
  }


}
