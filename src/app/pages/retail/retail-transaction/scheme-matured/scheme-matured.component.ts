import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-scheme-matured',
  templateUrl: './scheme-matured.component.html',
  styleUrls: ['./scheme-matured.component.scss']
})
export class SchemeMaturedComponent implements OnInit {
  SchemeMasterDetails: any[] = []
  constructor(
    private ActiveModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }
  close(){
    this.ActiveModal.close()
  }
}
