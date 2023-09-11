import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-melting-type',
  templateUrl: './melting-type.component.html',
  styleUrls: ['./melting-type.component.scss']
})
export class MeltingTypeComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }
  formSubmit(){
  }
  close() {
    //TODO reset forms and data before closing
    this.activeModal.close();
  }

  columnheads:any[] = ['Sr','Division','Default Alloy','Description','Alloy %'];

  // fontChange(event){
  //   console.log('====================================');
  //   console.log( event);
  //   console.log(this.font.getStyles());
  //   console.log('====================================');
  // }

  // public font: Font = new Font({
  //   family: 'Roboto',
  //   size: '14px',
  //   style: 'regular',
  //   styles: ['regular']
  // });

}
