import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal, } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-pos-salesman-details',
  templateUrl: './pos-salesman-details.component.html',
  styleUrls: ['./pos-salesman-details.component.scss']
})
export class PosSalesmanDetailsComponent implements OnInit {
  tableData: any = [];
  @Input() posDailyClosingSummaryFormData: any; //get data from PosDailyClosingSummaryComponent parent component
  htmlPreview: any;
  isLoading: boolean = false;

  constructor(
    private activeModal: NgbActiveModal, private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder, private toastr: ToastrService,
    private comService: CommonServiceService, private dataService: SuntechAPIService,
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.toastr.info("Please wait for a moment!!");
    let API = "UspRptPosSalesmanwiseDetailsNet";
    let postData = {
      "strSalType": 0,
      "strBranch": this.posDailyClosingSummaryFormData.value.branch,
      "strFromDate": this.formatDateToYYYYMMDD(this.posDailyClosingSummaryFormData.value.fromDate),
      "strToDate": this.formatDateToYYYYMMDD(this.posDailyClosingSummaryFormData.value.toDate),
      "str_MGroupBy": ''
    };
    
    this.dataService.postDynamicAPI(API, postData).subscribe((result: any) => {
      if (result.status == "Success") {
        this.toastr.success(result.status);                    
        this.tableData.push(result.dynamicData[0][0]);

        this.tableData.forEach((item: any)=>{
          for (const key in item) {
            if (typeof item[key] === 'number') {
              item[key] = this.comService.addCommaSepration(item[key]);
            }
          }
        }) 
        
        this.isLoading = false;
        this.comService.closeSnackBarMsg();
      }
      else{
        this.isLoading = false;
        this.toastr.error(result.status);
        this.comService.closeSnackBarMsg();
      }
    },(err: any) => this.toastr.error(err)); this.comService.closeSnackBarMsg(); this.isLoading = false;
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formatDateToYYYYMMDD(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }



  previewClick() {
    let postData = {
      "SPID": "160",
      "parameter": {
        "strFromDate ": this.formatDateToYYYYMMDD(this.posDailyClosingSummaryFormData.value.fromDate),
        "strToDate " : this.formatDateToYYYYMMDD(this.posDailyClosingSummaryFormData.value.toDate),
        "strBranch " : this.posDailyClosingSummaryFormData.value.branch,
        "blnBlockCost " : '',
        "LOGDATA ": '',
      }
    }
    this.comService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result: any) => {
      console.log(result)  
      if(result.status != "Failed"){
        let data = result.dynamicData;
        let printContent = data[0][0].HTMLReport;
        this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(printContent);
        const blob = new Blob([this.htmlPreview.changingThisBreaksApplicationSecurity], { type: 'text/html' });
        this.comService.closeSnackBarMsg();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
      else{
        this.toastr.error(result.message)
        return
      }
    });  
  }

  printBtnClick(){
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(``)
    printWindow?.document.close();
    printWindow?.print();
  }

}
