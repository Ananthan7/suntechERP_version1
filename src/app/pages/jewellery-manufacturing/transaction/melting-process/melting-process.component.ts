import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MeltingProcessDetailsComponent } from './melting-process-details/melting-process-details.component';
@Component({
  selector: 'app-melting-process',
  templateUrl: './melting-process.component.html',
  styleUrls: ['./melting-process.component.scss']
})
export class MeltingProcessComponent implements OnInit {
  vocMaxDate = new Date();
  currentDate = new Date();


  columnhead:any[] = ['Sr #', 'Div','Job No','Stock Code','Stock Desc','Process','Worker','Pcs','Gross Wt','Stone Wt','Net Wt','Purity','Pure Wt','Balance Wt','Balance Pure'];
  columnhead1:any[] = ['R to Stock','Stock Code','Gross Wt','Purity', 'Pure Wt','Location'];
  columnhead2:any[] = ['R to Scrap','Stock Code','Gross Wt','Purity', 'Pure Wt','Location','Loss','Pure Wt','Bal Gross','Bal Pure'];
  column:any[] = ['Sr','So No','Party Code', 'Party Name','Job No','job Desc','Design Code','UNQ Design ID','Process','Worker',' Req Metal','Stone Wt','Recd Gross Wt','Metal Allocated','Allocated Pure Wt','Job Pcs'];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  meltingIssueFrom: FormGroup = this.formBuilder.group({
    vocType : [''],
    vocNo : [''],
    voucherDate : [''],
    meltingType : [''],
    processCode : [''],
    processDesc : [''],
    workerCode : [''],
    workerDesc : [''],
    color : [''],
    time : [''],
    stoneStockCode : [''],
    stoneStockCodeNo : [''],
    stoneStockCodeDesc : [''],
    stoneStockCodeValue : [''],
    stoneWeight : [''],
    rate : [''],
    stoneAmount : [''],
    stockCode : [''],
    purity : [''],
    pureWt : [''],
    grossWt : [''],
    location : [''],
    pureWtOne : [''],
    balGross : [''],
    balPure : [''],
  });
  openaddmeltingprocess() {
    const modalRef: NgbModalRef = this.modalService.open(MeltingProcessDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }
  formSubmit(){

  }

  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.meltingIssueFrom.controls.VoucherDate.setValue(new Date(date))
    }
  }

}

