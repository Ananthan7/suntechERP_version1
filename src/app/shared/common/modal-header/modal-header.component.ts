import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss']
})
export class ModalHeaderComponent implements OnInit {
  @Output() saveClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

  saveClicked() {
    this.saveClick.emit();
  }
  cancelClicked() {
    this.cancelClick.emit();
  }

}
