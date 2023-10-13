import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-job-creation',
  templateUrl: './job-creation.component.html',
  styleUrls: ['./job-creation.component.scss']
})
export class JobCreationComponent implements OnInit {
 //variables
 modalReference:any;
 closeResult:any;
 pageTitle: any;
 currentFilter: any;
 showFilterRow: boolean = false;
 showHeaderFilter: boolean = false;
 divisionMS: any = 'ID';
 itemList: any[] = []

 columnhead:any[] = ['Sl No','Job Reference','Part Code','Description','Pcs','Metal Color','Metal Wt','Stone Wt','Gross Wt' ];
 constructor(
   private activeModal: NgbActiveModal
 ) { }

 ngOnInit(): void {
 }
 /**USE: close modal window */
 close(data?: any) {
   this.activeModal.close(data);
 }

}