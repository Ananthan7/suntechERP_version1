import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { control } from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-customer-enquiry',
  templateUrl: './customer-enquiry.component.html',
  styleUrls: ['./customer-enquiry.component.scss']
})
export class CustomerEnquiryComponent implements OnInit {
  isLoading: boolean = false;
  fetchedBranchData: any[] =[];
  fetchedBranchDataParam: any= [];
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  dateToPass: { fromDate: string; toDate: string } = { fromDate: '', toDate: '' };

  customerEnquiryForm: FormGroup = this.formBuilder.group({
    branch : [''],
    fromDate : [new Date()],
    toDate : [new Date()],

    Name: [''],
    Spouse: [''],
    Email: [''],
    customerfrom: [''],
    customerto: [''],
    birthMonth: [''],
    birthDate: [''],
    DOBValue:[new Date()],
    birthMonth2: [''],
    birthDate2: [''],
    DOBValue2: [new Date()],
    weddingMonth: [''],
    weddingDate: [''],
    WeddingDateValue: [new Date()],
    weddingMonth2: [''],
    WeddingDate2: [''],
    WeddingDateValue2: [new Date()],
    telephoneContact: [''],
    mobileContact: [''],
    MaritalStatusSelection: [''],
    GenderSelection: [''],
    country: [''],
    type: [''],
    nationality: [''],
    category: [''],
    city: [''],
    cust: [''],
    religion: [''],
    division: [''],
    state: [''],
    loyalty: [''],
    saleDateFrom: [''],
    dateTo: [''],


    templateName: ['']
  })
  currentDate: Date = new Date();
  maritalStatusArr = [
    { value: 'S', label: 'Single' },
    { value: 'M', label: 'Married' },
    { value: 'W', label: 'Widow' },
    { value: 'D', label: 'Divorced' }
  ];
  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder, 
    private dataService: SuntechAPIService, private commonService: CommonServiceService, 
    private toastr: ToastrService, private sanitizer: DomSanitizer,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
 
  }

  selectedData(data: any) {
    console.log(data)
    // let content= ``, content2 =``,  content3 =``, content4 =``
    let content = `Current Selected Branches:  \n`
    let content2 = `Current Selected Divisions:  \n`
    let content3 = `Current Selected Area:  \n`
    let content4 = `Current Selected B category:  \n`
    let branchDivisionData = '';
    if(data.BranchData){
      // content = `Current Selected Branches:  \n`
      data.BranchData.forEach((Bdata: any)=>{
        branchDivisionData += Bdata.BRANCH_CODE+'#'
        content += Bdata.BRANCH_CODE ? `${Bdata.BRANCH_CODE}, ` : ''
      }) 
    }

    if(data.DivisionData){
      // content2 = `Current Selected Divisions:  \n`
      data.DivisionData.forEach((Ddata: any)=>{
        branchDivisionData += Ddata.DIVISION_CODE+'#'
        content2 += Ddata.DIVISION_CODE ? `${Ddata.DIVISION_CODE}, ` : ''
      }) 
    }

    if(data.AreaData){
      // content3 = `Current Selected Area:  \n`
      data.AreaData.forEach((Adata: any)=>{
        branchDivisionData += Adata.AREA_CODE+'#'
        content3 += Adata.AREA_CODE ? `${Adata.AREA_CODE}, ` : ''
      }) 
    }

    if(data.BusinessCategData){
      // content4 = `Current Selected B category:  \n`
      data.BusinessCategData.forEach((BCdata: any)=>{
        branchDivisionData += BCdata.CATEGORY_CODE+'#'
        content4 += BCdata.CATEGORY_CODE ? `${BCdata.CATEGORY_CODE}, ` : ''
      }) 
    }

    content = content.replace(/, $/, '');
    content2 = content2.replace(/, $/, '');
    content3 = content3.replace(/, $/, '');
    content4 = content4.replace(/, $/, '');
    this.branchDivisionControlsTooltip = content +'\n'+content2 +'\n'+ content3 +'\n'+ content4

    this.formattedBranchDivisionData = branchDivisionData
    this.customerEnquiryForm.controls.branch.setValue(this.formattedBranchDivisionData);
  }

  onDateChange(controlName: string, event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      const formattedDate = this.datePipe.transform(event.value, 'MMMM, d');

      if (typeof formattedDate === 'string') {
        const [month, day] = formattedDate.split(', ').map(part => part.trim());
        let shortMonthValue = this.getShortMonth(month);

        if(controlName == 'bdayPicker1'){
          this.customerEnquiryForm.controls.birthMonth.setValue(shortMonthValue);
          this.customerEnquiryForm.controls.birthDate.setValue(day);
        }
        else if(controlName == 'bdayPicker2'){
          this.customerEnquiryForm.controls.birthMonth2.setValue(shortMonthValue);
          this.customerEnquiryForm.controls.birthDate2.setValue(day);
        }
        else if(controlName == 'weddingDataPicker1'){
          this.customerEnquiryForm.controls.weddingMonth.setValue(shortMonthValue);
          this.customerEnquiryForm.controls.weddingDate.setValue(day);
        }
        else if(controlName == 'weddingDayPicker2'){
          this.customerEnquiryForm.controls.weddingMonth2.setValue(shortMonthValue);
          this.customerEnquiryForm.controls.WeddingDate2.setValue(day);
        }
      }
      else{
        console.log('no Formatted Date:', formattedDate);
      }
    }
  }
  getShortMonth(month: string): string {
    switch (month) {
        case 'January': return 'Jan';
        case 'February': return 'Feb';
        case 'March': return 'Mar';
        case 'April': return 'Apr';
        case 'May': return 'May';
        case 'June': return 'Jun';
        case 'July': return 'Jul';
        case 'August': return 'Aug';
        case 'September': return 'Sep';
        case 'October': return 'Oct';
        case 'November': return 'Nov';
        case 'December': return 'Dec';
        default: return month;
    }
  }






  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
