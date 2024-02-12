import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';


@Component({
  selector: 'app-pos-daily-closing-summary',
  templateUrl: './pos-daily-closing-summary.component.html',
  styleUrls: ['./pos-daily-closing-summary.component.scss']
})
export class PosDailyClosingSummaryComponent implements OnInit {

  vocMaxDate = new Date();
  currentDate = new Date();
  columnhead:any[] = ['No.Inv','Amt.Rcvd','Gold','Dia & Other'];
  columnheadTransaction:any[] = ['Voucher','No.Inv','Amount'];
  columnheadMetal:any[] = ['Division','Type','Pcs','Gms','Pure Wt','St.Qty','St.Amt','Mkg.Rate','Mkg.Value','Metal Value','Total Amount'];
  columnheadDiamond:any[] = ['Division','Type','Pcs','Weight',' Amount'];
  columnheadReceipt:any[] = ['Rcvd.In',' Amount'];
  columnheadScrap:any[] = ['Item Code','Gross Wt',' Amount'];
  columnheadSales:any[] = ['Salesman','#Docs','Tot Amount','Gold','Dia & Others','Mkg.Value'];

  divisionMS: any = 'ID';

  posDailyClosingSummaryForm: FormGroup = this.formBuilder.group({
    transaction: [''],
    metal:[''],
    diamond: [''],
    fromDate:[''],
    toDate: [''],
  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
