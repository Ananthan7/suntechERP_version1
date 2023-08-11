import { Component, OnInit } from '@angular/core';
import { SignumCRMApiService } from 'src/app/services/signum-crmapi.service';

@Component({
  selector: 'app-ytd-branch-comparison',
  templateUrl: './ytd-branch-comparison.component.html',
  styleUrls: ['./ytd-branch-comparison.component.scss']
})
export class YtdBranchComparisonComponent implements OnInit {
  tabledata: any =[];
  constructor(private apiService: SignumCRMApiService) { }

  ngOnInit(): void {

  }


  

}
