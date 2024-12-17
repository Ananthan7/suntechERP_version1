import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
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
  code_occurs: boolean = false;
  modalReference!: NgbModalRef;
  @Input() content!: any;
  unq_id: any;
  flag: any;
  dyndatas: any;
  private subscriptions: Subscription[] = [];
  viewOnly: boolean = false;
  dis_group: boolean = false;
  codeedit: boolean = false;
  curr_branch: any = localStorage.getItem('userbranch');
  curr_user: any = localStorage.getItem('username');
  disable_code: boolean = false;
  editMode: boolean = false;
  disadd_btn: boolean = true;
  dropdownvalues: any[] = [];
  curr_div = "";
  group1_val: any;
  group2_val: any;
  group3_val: any;
  @ViewChild('grid') grid!: DxDataGridComponent;
  filter_1: any;
  filter_2: any;
  filter_3: any;



  loyaltysettingform: FormGroup = this.formBuilder.group({
    code: ['',[Validators.required]],
    codedesc: [''],
    division: [''],
    divisions: [''],
    group1: [''],
    group1search: [''],
    group2: [''],
    group2search: [''],
    group3: [''],
    group3search: [''],
    standardamt1: ['',[Validators.required]],
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

  BranchDataSelected(data: any) {

  }

  divisiondata: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 18,
    LOOKUPID: 18,
    ORDER_TYPE: 0,
    WHERECONDITION: "",
    SEARCH_FIELD: "",
    SEARCH_HEADING: "Division Code",
    SEARCH_VALUE: "",
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  group1data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 18,
    LOOKUPID: 111,
    ORDER_TYPE: 0,
    SEARCH_HEADING: 'Group 1',
    WHERECONDITION: "",
    SEARCH_FIELD: "",
    SEARCH_VALUE: "",
    LOAD_ONCLICK: true,
    FRONTENDFILTER:true
  }

  group2data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 18,
    LOOKUPID: 111,
    ORDER_TYPE: 0,
    SEARCH_HEADING: 'Group 2',
    WHERECONDITION: "",
    SEARCH_FIELD: "",
    SEARCH_VALUE: "",
    LOAD_ONCLICK: true,
    FRONTENDFILTER:true
  }

  group3data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 18,
    LOOKUPID: 111,
    ORDER_TYPE: 0,
    SEARCH_HEADING: 'Group 3',
    WHERECONDITION: "",
    SEARCH_FIELD: "",
    SEARCH_VALUE: "",
    LOAD_ONCLICK: true,
    FRONTENDFILTER:true
  }


  change_curr_div() {
    let division = this.loyaltysettingform.controls.division.value;
    if (division == 'Diamond') {
      this.curr_div = 'S';
    } else {
      this.curr_div = 'M';
    }
    this.divisiondata.WHERECONDITION = "DIVISION = '" + this.curr_div + "' and DIVISION_CODE not in (select DivisionCode from tbl_AllPossibleDivision)";
  }

  setmastergroup1() {
    this.filter_1 = this.loyaltysettingform.controls.group1.value;
    if (this.filter_1 == this.filter_2 || this.filter_1 == this.filter_3) {
      this.loyaltysettingform.controls['group1'].reset();
      Swal.fire({
        title: 'Code Already Entered',
        text: '',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'ok',
      })
      return;
    }
    let group = this.loyaltysettingform.controls.group1.value;
    this.loyaltysettingform.controls['group1search'].reset();
    this.group1data.WHERECONDITION = "   @strSelectedField='" + group + "' ";
  }

  groupselected(e: any, field: string) {
    console.log(e);
    this.loyaltysettingform.controls[field].setValue(e.Code);
  }


  setmastergroup2() {
    this.filter_2 = this.loyaltysettingform.controls.group2.value;
    if (this.filter_2 == this.filter_1 || this.filter_2 == this.filter_3) {
      this.loyaltysettingform.controls['group2'].reset();
      return;
    }
    let group = this.loyaltysettingform.controls.group2.value;
    this.loyaltysettingform.controls['group2search'].reset();
    this.group2data.WHERECONDITION = "   @strSelectedField='" + group + "' ";
  }

  group2selected(e: any) {
    console.log(e);
    this.loyaltysettingform.controls.group2search.setValue(e.Code)
  }

  setmastergroup3() {
    this.filter_3 = this.loyaltysettingform.controls.group3.value;
    if (this.filter_3 == this.filter_1 || this.filter_3 == this.filter_2) {
      this.loyaltysettingform.controls['group3'].reset();
      return;
    }
    let group = this.loyaltysettingform.controls.group3.value;
    this.loyaltysettingform.controls['group3search'].reset();
    this.group3data.WHERECONDITION = "   @strSelectedField='" + group + "' ";
  }

  group3selected(e: any) {
    console.log(e);
    this.loyaltysettingform.controls.group3search.setValue(e.Code);
  }

  divisiondataselected(e: any) {
    console.log(e);
    this.loyaltysettingform.controls.divisions.setValue(e.DIVISION_CODE);

  }

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
    if(this.flag == undefined){
      this.renderer.selectRootElement('#code')?.focus();
    }

    if (this.flag == 'EDIT') {
      this.dis_group = true;
      this.detailsapi(this.unq_id);
      this.disable_code = true;
      this.codeedit = true;
    } else if (this.flag == 'VIEW') {
      this.dis_group = true;

      this.detailsapi(this.unq_id);

      this.viewMode = true;
      this.codeedit = true;
    }
    this.initialController(this.flag, this.content);
    if (this?.flag == "EDIT" || this?.flag == 'VIEW') {
      // this.detailsapi(this.unq_id);
      console.log("data")
    }
  }



  ngAfterViewInit() {
    if(this.content?.FLAG != undefined){
      if (this.grid && this.grid.instance) {
        this.grid.instance.columnOption('INVFILT1_VALUES', 'caption', this.content?.FILTER1);
        this.grid.instance.columnOption('INVFILT2_VALUES', 'caption', this.content?.FILTER2);
        this.grid.instance.columnOption('INVFILT3_VALUES', 'caption', this.content?.FILTER3);
      } else {
        console.error('Grid instance is not available.');
      }
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
    this.loyaltysettingform.controls.division.setValue(this.content?.ALL_DIVISION);
    this.loyaltysettingform.controls.group1.setValue(this.content?.FILTER1);
    this.loyaltysettingform.controls.group2.setValue(this.content?.FILTER2);
    this.loyaltysettingform.controls.group3.setValue(this.content?.FILTER3);
    this.loyaltysettingform.controls.redeem.setValue(this.content?.STD_AMT_REDEEMPOINT);
    this.loyaltysettingform.controls.no_redeem_points.setValue(this.content?.STD_AMT_REDEEMPOINT);
    this.loyaltysettingform.controls.calculate_points.setValue(this.content?.DONT_CAL_POINTS);
    this.loyaltysettingform.controls.reference1.setValue(this.content?.FIRST_REF_PER);
    this.loyaltysettingform.controls.subreference.setValue(this.content?.STD_REF_PER);

    this.loyaltysettingform.controls.reference1.setValue(this.commonService.decimalQuantityFormat(
      this.commonService.emptyToZero(this.content?.FIRST_REF_PER), "METAL"));
    this.loyaltysettingform.controls.subreference.setValue(this.commonService.decimalQuantityFormat(
      this.commonService.emptyToZero(this.content?.STD_REF_PER), "METAL"));
    this.loyaltysettingform.controls.standardamt1.setValue(this.commonService.decimalQuantityFormat(
      this.commonService.emptyToZero(this.content?.STD_AMT_PERPOINT), "METAL"));
      this.grid.instance.columnOption('INVFILT1_VALUES', 'caption', this.content?.FILTER1);
      this.grid.instance.columnOption('INVFILT2_VALUES', 'caption', this.content?.FILTER2);
      this.grid.instance.columnOption('INVFILT3_VALUES', 'caption', this.content?.FILTER3);

  }


  detailsapi(fm_id: any) {
    if (this.flag == 'VIEW') {
      this.viewOnly = true;
    }

    let API = `LoyaltySettingMaster/GetLoyaltySettingMasterDetailWithCode/${this.unq_id}`;
    let Sub: Subscription = this.apiService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.dyndatas = result.response;
        console.log(this.dyndatas);
        this.loyaltysettingform.controls.codedesc.setValue(this.dyndatas.DESCRIPTION);
        this.loyaltysettingform.controls.division.setValue(this.dyndatas.ALL_DIVISION);
        this.loyaltysettingform.controls.group1.setValue(this.dyndatas.FILTER1);
        this.loyaltysettingform.controls.group2.setValue(this.dyndatas.FILTER2);
        this.loyaltysettingform.controls.group3.setValue(this.dyndatas.FILTER3);
        this.loyaltysettingform.controls.redeem.setValue(this.dyndatas.STD_AMT_REDEEMPOINT);
        this.loyaltysettingform.controls.no_redeem_points.setValue(this.dyndatas.STD_AMT_REDEEMPOINT);
        this.loyaltysettingform.controls.calculate_points.setValue(this.dyndatas.DONT_CAL_POINTS);
        this.loyaltysettingform.controls.reference1.setValue(this.dyndatas.FIRST_REF_PER);
        this.loyaltysettingform.controls.subreference.setValue(this.dyndatas.STD_REF_PER);
        this.maindetails.push(...this.dyndatas.Detail);
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
        if (result.status == 'Success') {
          this.dropdownvalues = result.dynamicData[0];
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

    Object.keys(this.loyaltysettingform.controls).forEach((controlName) => {
      const control = this.loyaltysettingform.controls[controlName];
      if (control.validator && control.validator({} as AbstractControl)) {
        control.markAsTouched();
      }
    });

    const requiredFieldsInvalid = Object.keys(
      this.loyaltysettingform.controls
    ).some((controlName) => {
      const control = this.loyaltysettingform.controls[controlName];
      return control.hasError("required") && control.touched;
    });

    if(!requiredFieldsInvalid){

      let len = this.maindetails.length;
      if(len<=0){
        this.commonService.toastErrorByMsgId('MSG1453');
        Swal.fire({
          title: 'Error',
          text: 'No Detail Found!!',
        });return;
      }

      let datas = this.maindetails;
      let allgroup_1 = '';
      let allgroup_2 = '';
      let allgroup_3 = '';
  
      if (Array.isArray(datas)) {
        datas.forEach((e: any) => {
          allgroup_1 += e.INVFILT1_VALUES + ',';
          allgroup_2 += e.INVFILT2_VALUES + ',';
          allgroup_3 += e.INVFILT3_VALUES + ',';
        });
      }
      allgroup_1 = allgroup_1.slice(0, -1);
      allgroup_2 = allgroup_2.slice(0, -1);
      allgroup_3 = allgroup_3.slice(0, -1);
  
      const postData = {
        "MID": 0,
        "CODE": this.loyaltysettingform.controls.code.value,
        "DESCRIPTION": this.loyaltysettingform.controls.codedesc.value,
        "ALL_DIVISION": this.loyaltysettingform.controls.division.value,//"string",
        "FILTER1": this.loyaltysettingform.controls.group1.value,
        "FILTER2": this.loyaltysettingform.controls.group2.value,
        "FILTER3": this.loyaltysettingform.controls.group3.value,
        "ALL_GRP1": allgroup_1,//"string",
        "ALL_GRP2": allgroup_2,//"string",
        "ALL_GRP3": allgroup_3,//"string",
        "STD_AMT_PERPOINT": this.loyaltysettingform.controls.standardamt1.value,
        "CREATED_BY": this.curr_user,
        "CREATED_ON": new Date(),
        "FILTERFILED1": this.loyaltysettingform.controls.group1search.value,
        "FILTERFILED2": this.loyaltysettingform.controls.group2search.value,
        "FILTERFILED3": this.loyaltysettingform.controls.group3search.value,
        "DONT_CAL_POINTS": this.loyaltysettingform.controls.calculate_points.value ? true : false,
        "STD_AMT_REDEEMPOINT": this.loyaltysettingform.controls.redeem.value,
        "NO_POINTSSLAB": this.loyaltysettingform.controls.no_redeem_points.value ? true : false,
        "FIRST_REF_PER": this.loyaltysettingform.controls.reference1.value,
        "STD_REF_PER": this.loyaltysettingform.controls.subreference.value,
        "Detail": this.maindetails
      }
  
      // console.log(postData); return;
  
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


  adddetails_data() {
    let group_1 = this.loyaltysettingform.controls.group1.value;
    let group_2 = this.loyaltysettingform.controls.group2.value;
    let group_3 = this.loyaltysettingform.controls.group3.value;
    this.loyaltysettingform.controls['group1'].disable();
    this.loyaltysettingform.controls['group2'].disable();
    this.loyaltysettingform.controls['group3'].disable();
   
    if (this.grid) {
        this.grid.instance.columnOption('INVFILT1_VALUES', 'caption', group_1);
        this.grid.instance.columnOption('INVFILT2_VALUES', 'caption', group_2);
        this.grid.instance.columnOption('INVFILT3_VALUES', 'caption', group_3);

    } else {
      console.log("grid not found");
    }




    let data_count = this.maindetails.length;
    let curr_division;
    let curr_points;
    console.log(this.loyaltysettingform.controls.division.value)
    if (this.loyaltysettingform.controls.division.value == 'Metal') {
      curr_division = 'M'
    } else {
      curr_division = 'S'
    }
    curr_points = this.loyaltysettingform.controls.standardamt1.value;
    let divisions = this.loyaltysettingform.controls.divisions.value;
    let g1_val = this.loyaltysettingform.controls.group1search.value;
    let g2_val = this.loyaltysettingform.controls.group2search.value;
    let g3_val = this.loyaltysettingform.controls.group3search.value;

    // let data = {
    //   'SLNO': data_count + 1,
    //   'DIA_METAL' : curr_division,
    //   'DIVISIONS' : divisions,
    //   'AMTSPENT' : curr_points,
    //   'INVFILTER1' : g1_val,
    //   'INVFILTER2' : g2_val,
    //   'INVFILTER3' : g3_val,
    // };
    let grid_len = this.maindetails.length;

    let data = {
      "SLNO": grid_len + 1,
      "REFMID": 0,
      "CODE": this.loyaltysettingform.controls.code.value,
      "DIA_OR_MTL": curr_division,
      "DIVISIONS": divisions,
      "INVFILT1_VALUES": g1_val,
      "INVFILT2_VALUES": g2_val,
      "INVFILT3_VALUES": g3_val,
      "INVFILT1_FIELD": this.loyaltysettingform.controls.group1.value,
      "INVFILT2_FIELD": this.loyaltysettingform.controls.group2.value,
      "INVFILT3_FIELD": this.loyaltysettingform.controls.group3.value,
      "AMOUNT_SPENT": curr_points
    }


    console.log(data);
    this.maindetails.push(data);
    this.loyaltysettingform.controls['group1search'].reset();
    this.loyaltysettingform.controls['group2search'].reset();
    this.loyaltysettingform.controls['group3search'].reset();
    this.loyaltysettingform.controls['divisions'].reset();

  }

  dia_metalfield(data: any, event: any) {
    const updatedSLNO = data.data.SLNO - 1;
    this.maindetails[updatedSLNO].DIA_METAL = event.target.value;
  }

  amtfield(data: any, event: any) {
    const updatedSLNO = data.data.SLNO - 1;
    this.maindetails[updatedSLNO].AMTSPENT = event.target.value;
  }

  checkcode() {
    const CodeControl = this.loyaltysettingform.controls.code;
    if (!CodeControl.value || CodeControl.value.trim() === "") {
      this.commonService.toastErrorByMsgId('MSG1124');
      this.renderer.selectRootElement('#code')?.focus();
    }else{
      this.code_occurs = true;
    }
  }

    SPvalidateLookupFieldModified(
      event: any,
      LOOKUPDATA: MasterSearchModel,
      FORMNAMES: string[],
      isCurrencyField: boolean,
      lookupFields?: string[],
      FROMCODE?: boolean,
      dont_check?: boolean
    ) {
      const searchValue = event.target.value?.trim();
  
      if (!searchValue || this.flag == "VIEW") return;
  
      LOOKUPDATA.SEARCH_VALUE = searchValue;
  
      const param = {
        PAGENO: LOOKUPDATA.PAGENO,
        RECORDS: LOOKUPDATA.RECORDS,
        LOOKUPID: LOOKUPDATA.LOOKUPID,
        WHERECONDITION: LOOKUPDATA.WHERECONDITION,
        searchField: LOOKUPDATA.SEARCH_FIELD,
        searchValue: LOOKUPDATA.SEARCH_VALUE,
      };
  
      this.commonService.showSnackBarMsg("MSG81447");
  
      const sub: Subscription = this.apiService
        .postDynamicAPI("MasterLookUp", param)
        .subscribe({
          next: (result: any) => {
            this.commonService.closeSnackBarMsg();
            const data = result.dynamicData?.[0];
  
            console.log("API Response Data:", data);
  
            if (data?.length) {
              if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE) {
  
                let searchResult = this.commonService.searchAllItemsInArray(
                  data,
                  LOOKUPDATA.SEARCH_VALUE
                );
  
                console.log("Filtered Search Result:", searchResult);
  
                if (FROMCODE === true) {
                  searchResult = [
                    ...searchResult.filter(
                      (item: any) =>
                        item.MobileCountryCode === LOOKUPDATA.SEARCH_VALUE
                    ),
                    ...searchResult.filter(
                      (item: any) =>
                        item.MobileCountryCode !== LOOKUPDATA.SEARCH_VALUE
                    ),
                  ];
                } else if (FROMCODE === false) {
                  searchResult = [
                    ...searchResult.filter(
                      (item: any) => item.DESCRIPTION === LOOKUPDATA.SEARCH_VALUE
                    ),
                    ...searchResult.filter(
                      (item: any) => item.DESCRIPTION !== LOOKUPDATA.SEARCH_VALUE
                    ),
                  ];
                }
  
                if (searchResult?.length) {
                  const matchedItem = searchResult[0];
  
                  FORMNAMES.forEach((formName, index) => {
                    const field = lookupFields?.[index];
                    if (field && field in matchedItem) {
  
                      this.loyaltysettingform.controls[formName].setValue(
                        matchedItem[field]
                      );
                    } else {
                      console.error(
                        `Property ${field} not found in matched item.`
                      );
                      this.commonService.toastErrorByMsgId("No data found");
                      this.clearLookupData(LOOKUPDATA, FORMNAMES);
                    }
                  });
                } else {
                  this.commonService.toastErrorByMsgId("No data found");
                  this.clearLookupData(LOOKUPDATA, FORMNAMES);
                }
              }
            } else {
              this.commonService.toastErrorByMsgId("No data found");
              this.clearLookupData(LOOKUPDATA, FORMNAMES);
            }
          },
          error: () => {
            this.commonService.toastErrorByMsgId("MSG2272");
            this.clearLookupData(LOOKUPDATA, FORMNAMES);
          },
        });
  
      this.subscriptions.push(sub);
    }
  
    clearLookupData(LOOKUPDATA: MasterSearchModel, FORMNAMES: string[]) {
      LOOKUPDATA.SEARCH_VALUE = "";
      FORMNAMES.forEach((formName) => {
        this.loyaltysettingform.controls[formName].setValue("");
      });
    }
  
    lookupSelect(e: any, controller?: any, modelfield?: any) {
      console.log(e);
      if (Array.isArray(controller) && Array.isArray(modelfield)) {
        // Handle multiple controllers and fields
        if (controller.length === modelfield.length) {
          controller.forEach((ctrl, index) => {
            const field = modelfield[index];
            const value = e[field];
            if (value !== undefined) {
              this.loyaltysettingform.controls[ctrl].setValue(value);
            } else {
              console.warn(`Model field '${field}' not found in event object.`);
            }
          });
        } else {
          console.warn(
            "Controller and modelfield arrays must be of equal length."
          );
        }
      } else if (controller && modelfield) {
        // Handle single controller and field
        const value = e[modelfield];
        if (value !== undefined) {
          this.loyaltysettingform.controls[controller].setValue(value);
        } else {
          console.warn(`Model field '${modelfield}' not found in event object.`);
        }
      } else {
        console.warn("Controller or modelfield is missing.");
      }
    }

}
