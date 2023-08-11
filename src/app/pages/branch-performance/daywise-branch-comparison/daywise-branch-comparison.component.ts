import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SignumCRMApiService } from 'src/app/services/signum-crmapi.service';

@Component({
  selector: 'app-daywise-branch-comparison',
  templateUrl: './daywise-branch-comparison.component.html',
  styleUrls: ['./daywise-branch-comparison.component.scss']
})
export class DaywiseBranchComparisonComponent implements OnInit {
  /** form validations */
  dataForm = this.fb.group({
    fromDate: ['02-11-2022'],
    ToDate: ['10-11-2022'],
  })

  date = new Date();
  d = new Date(new Date().getFullYear(), 0, 1);
  currYtd = this.commonService.formatDate(this.d);
  currentDate = this.commonService.formatDate(this.date);
  
  tabledatas: any[] = []
  constructor(
    private fb: FormBuilder,
    private dataService: SignumCRMApiService,
    private commonService: CommonServiceService
  ) {
    /** form validations */
    this.dataForm.controls['fromDate'].setValue(this.currYtd)
    this.dataForm.controls['ToDate'].setValue(this.currentDate)
    this.getData()
  }

  ngOnInit(): void {
  }

  getData() {
    this.tabledatas = []
    console.log(this.dataForm.value.fromDate);
    
    let fromd = new Date(this.dataForm.value.fromDate)
    let tod = new Date(this.dataForm.value.ToDate)
    let fromDate = this.commonService.formatDate(fromd)
    let toDate = this.commonService.formatDate(tod)
    
  }

}
