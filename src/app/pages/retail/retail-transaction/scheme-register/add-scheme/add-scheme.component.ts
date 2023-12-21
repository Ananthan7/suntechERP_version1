import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Observable, Subscription } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterFindIconComponent } from "src/app/shared/common/master-find-icon/master-find-icon.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-scheme",
  templateUrl: "./add-scheme.component.html",
  styleUrls: ["./add-scheme.component.scss"],
})
export class AddSchemeComponent implements OnInit {
  @Input() content!: any;
  @ViewChild(MasterFindIconComponent, { static: false })
  MasterFindIcon!: MasterFindIconComponent;

  // @Output() newRowSaveClick = new EventEmitter();
  // @Output() closebtnClick = new EventEmitter();
  // @Input() content!: any; //use: To get clicked row details from master grid
  //mat autocomplete observables
  filteredOptions!: Observable<any[]>;
  salesmanArray: any[] = [];
  branchFilteredOptions!: Observable<any[]>;
  branchArray: any[] = [];

  customerNumber: string = "";
  newSchemeItems: any[] = [];
  IdTypesList: any[] = [];
  Attachedfile: any[] = [];
  isViewAddbtn: boolean = true;

  searchFlag: any;
  API_VALUE: any;
  MasterFindDatas: any = {
    TABLE_NAME: "",
    FILTER_FEILD_NAMES: {},
    API_FILTER_VALUE: "",
    DB_FIELD_VALUE: "",
    NAME_FIELD_VALUE: "",
    USER_TYPED_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  BranchMasterFindData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: "BRANCH_CODE",
    SEARCH_HEADING: "Branch Master",
    SEARCH_VALUE: "",
    WHERECONDITION: "BRANCH_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  SchemeMasterFindData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 59,
    SEARCH_FIELD: "SCHEME_CODE",
    SEARCH_HEADING: "Scheme Master",
    SEARCH_VALUE: "",
    WHERECONDITION: "SCHEME_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  salesPersonMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: "SALESPERSON_CODE",
    SEARCH_HEADING: "Salesman",
    SEARCH_VALUE: "",
    WHERECONDITION: "SALESPERSON_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  receiptEntryForm: FormGroup = this.formBuilder.group({
    SchemeName: [""],
    SchemeUniqueNo: [""],
    SchemeID: ["", [Validators.required]],
    SchemePeriod: [""],
    SchemeAmount: [""],
    SCHEME_CUSTCODE: [""],
    TotalValue: [null, [Validators.required]],
    Units: [null, [Validators.required]],
    StartDate: ["", [Validators.required]],
    endDate: ["", [Validators.required]],
    Branch: ["", [Validators.required]],
    Salesman: ["", [Validators.required]],
    Status: ["", [Validators.required]],
    Attachment: [""],
    Attachedfile: [null],
    BlockScheme: [false],
    ID: [""],
  });
  private subscriptions: Subscription[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private activeModal: NgbActiveModal,
  ) // private ChangeDetector: ChangeDetectorRef, //to detect changes in dom
  {}

  ngOnInit(): void {
    this.getSalesmanList();
    this.getBranchMasterList();
    let date = new Date();
    this.receiptEntryForm.controls.StartDate.setValue(date);
    this.receiptEntryForm.controls.Branch.setValue(
      this.commonService.branchCode
    );
    this.receiptEntryForm.controls.Status.setValue("LIVE");
    console.log(this.content);
    
    this.setInitialValues(this.content);
  }

  onFileChange(input: any) {
    if (input.target.files.length > 0) {
      const file: File = input.target.files[0];
      for (let x = 0; x < input.target.files.length; x++) {
        this.Attachedfile.push(file);
        this.receiptEntryForm.controls.Attachedfile.setValue(this.Attachedfile);
        // this.formdata.append("Images[" + x + "].Image.File", file);
      }
    }
  }
  setInitialValues(data: any) {
    console.log(data,'fired');
    
    if (data) {
      this.isViewAddbtn = false;
      if (data.SCHEME_UNIQUEID) {
        this.receiptEntryForm.controls.SchemeUniqueNo.setValue(
          data.SCHEME_UNIQUEID
        );
      }
      if (data.SCHEME_CUSTCODE) {
        this.receiptEntryForm.controls.SCHEME_CUSTCODE.setValue(
          data.SCHEME_CUSTCODE
        );
      }
      this.receiptEntryForm.controls.SchemeID.setValue(data.SCHEME_ID);
      this.receiptEntryForm.controls.Branch.setValue(data.sbranch_code);
      this.receiptEntryForm.controls.Salesman.setValue(data.SalesManCode);
      this.receiptEntryForm.controls.Units.setValue(data.SCHEME_UNITS);
      this.receiptEntryForm.controls.TotalValue.setValue(
        data.SCHEME_TOTAL_VALUE
      );
      this.receiptEntryForm.controls.Status.setValue(data.SCHEME_STATUS);
      this.receiptEntryForm.controls.StartDate.setValue(data.SCHEME_STARTED);
      this.receiptEntryForm.controls.endDate.setValue(data.SCHEME_ENDEDON);
      let datediff = this.getMonthDifference(
        new Date(data.SCHEME_STARTED),
        new Date(data.SCHEME_ENDEDON)
      );
      this.receiptEntryForm.controls.SchemePeriod.setValue(datediff);
      this.receiptEntryForm.controls.ID.setValue(data.ID);
    } else {
      this.isViewAddbtn = true;
    }
  }
  getMonthDifference(startDate: Date, endDate: Date): number {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();

    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();

    return (endYear - startYear) * 12 + (endMonth - startMonth);
  }

  /**USE: branch autocomplete starts*/
  getBranchMasterList() {
    let Sub: Subscription = this.dataService
      .getDynamicAPI("BranchMaster")
      .subscribe(
        (result) => {
          if (result.response) {
            this.branchArray = result.response;
            this.branchFilteredOptions =
              this.receiptEntryForm.controls.Branch.valueChanges.pipe(
                startWith(""),
                map((value) => this._filterBranch(value || ""))
              );
          } else {
            Swal.fire({
              title: "branch Not Found!",
              text: "",
              icon: "warning",
              showCancelButton: false,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Ok",
            }).then((result) => {
              // if (result.isConfirmed) {
              // }
            });
          }
        },
        (err) => alert(err)
      );

    this.subscriptions.push(Sub);
  }
  private _filterBranch(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.branchArray.filter(
      (option: any) =>
        option.BRANCH_CODE.toLowerCase().includes(filterValue) ||
        option.DESCRIPTION.toLowerCase().includes(filterValue)
    );
  }
  /**USE: branch autocomplete ends*/
  /**USE: salesman autocomplete starts*/
  getSalesmanList() {
    let Sub: Subscription = this.dataService
      .getDynamicAPI("SalesPersonMaster/GetSalespersonMasterList")
      .subscribe(
        (result) => {
          if (result.response) {
            this.salesmanArray = result.response;

            this.filteredOptions =
              this.receiptEntryForm.controls.Salesman.valueChanges.pipe(
                startWith(""),
                map((value) => this._filterSalesman(value || ""))
              );
          } else {
            Swal.fire({
              title: "salesman Not Found!",
              text: "",
              icon: "warning",
              showCancelButton: false,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Ok",
            }).then((result) => {
              // if (result.isConfirmed) {
              // }
            });
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }
  private _filterSalesman(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.salesmanArray.filter(
      (option: any) =>
        option.SALESPERSON_CODE.toLowerCase().includes(filterValue) ||
        option.DESCRIPTION.toLowerCase().includes(filterValue)
    );
  }
  SchemeIDChange() {
    this.MasterFindDatas = this.SchemeMasterFindData;
    this.MasterFindIcon.openMasterSearch();
  }
  //search Value Change
  searchValueChange(event: any) {
    let API = `SchemeMaster/GetSchemeMasterDetails/${this.commonService.branchCode}/${event.SCHEME_CODE.toString()}`
    this.commonService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          this.commonService.closeSnackBarMsg();
          this.selectedScheme(result.response)
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
        this.commonService.closeSnackBarMsg();
      })
    this.subscriptions.push(Sub)
  }
  //use: form submit
  onSubmit() {
    if (this.receiptEntryForm.invalid) {
      // this.toastr.error("select all details!");
      // return;
    } else {
      // this.newRowSaveClick.emit(this.receiptEntryForm.value);
    }
    this.close(this.receiptEntryForm.value)//USE: passing Detail data to header screen on close
  }
  schemeUnitChanged(data: any) {
    this.receiptEntryForm.controls.TotalValue.setValue(
      this.receiptEntryForm.value.SchemeAmount * data.target.value
    );
  }
  selectedScheme(data: any) {
    // this.receiptEntryForm.controls.SchemeUniqueNo.setValue(data.MID)
    this.receiptEntryForm.controls.SchemeID.setValue(data.SCHEME_CODE);
    this.receiptEntryForm.controls.SchemeName.setValue(data.SCHEME_NAME);
    this.receiptEntryForm.controls.SchemeAmount.setValue(data.SCHEME_UNIT);
    this.receiptEntryForm.controls.TotalValue.setValue(data.SCHEME_UNIT);
    this.receiptEntryForm.controls.Units.setValue(1);
    if (data.SCHEME_PERIOD) {
      this.receiptEntryForm.controls.SchemePeriod.setValue(data.SCHEME_PERIOD);
    } else {
      this.toastr.error("SCHEME_PERIOD Not found!");
    }
    // Add 12 months to the current date
    const currentDate = new Date();
    const nextYearDate = new Date(currentDate);
    nextYearDate.setMonth(currentDate.getMonth() + data.SCHEME_PERIOD);
    this.receiptEntryForm.controls.endDate.setValue(nextYearDate);
  }
  selectedBranch(data: any) {
    this.receiptEntryForm.controls.Branch.setValue(data.BRANCH_CODE);
  }
  selectedSalesman(data: any) {
    this.receiptEntryForm.controls.Salesman.setValue(data.SALESPERSON_CODE);
  }
  branchChange(event: any) {
    if (event.target.value == "") return;
    let inputValue = event.target.value;
    inputValue = inputValue.toUpperCase();
    let data = this.branchArray.filter(
      (item: any) => item.BRANCH_CODE == inputValue
    );
    if (data.length > 0) {
      this.receiptEntryForm.controls.Branch.setValue(data[0].BRANCH_CODE);
    } else {
      this.toastr.error("Invalid Branch Code, try search!");
      this.receiptEntryForm.controls.Branch.setValue(
        this.commonService.branchCode
      );
    }
  }
  salesmanChange(event: any) {
    if (event.target.value == "") return;
    let inputValue = event.target.value;
    inputValue = inputValue.toUpperCase();
    let data = this.salesmanArray.filter(
      (item: any) => item.SALESPERSON_CODE == inputValue
    );
    if (data.length > 0) {
      this.receiptEntryForm.controls.Salesman.setValue(
        data[0].SALESPERSON_CODE
      );
    } else {
      this.toastr.error("Invalid Salesperson Code, try search!");
      this.receiptEntryForm.controls.Salesman.setValue("");
    }
  }
  //date validation
  dateChange(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue);
    let yr = date.getFullYear();
    let dt = date.getDate();
    let dy = date.getMonth();
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.receiptEntryForm.controls.StartDate.setValue(new Date(date));
    }

    const nextYearDate = new Date(this.receiptEntryForm.value.StartDate);
    nextYearDate.setMonth(dy + this.receiptEntryForm.value.SchemePeriod);
    this.receiptEntryForm.controls.endDate.setValue(nextYearDate);
  }
  //number validation
  isNumeric(event: any) {
    return this.commonService.isNumeric(event);
  }
  /**USE: close modal window */
  // close() {
  //   this.isViewAddbtn = true;
  //   this.receiptEntryForm.reset();
  //   this.closebtnClick.emit();
  // }
  close(data?: any) {
    this.activeModal.close(data);
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
      this.subscriptions = []; // Clear the array
    }
  }
}
