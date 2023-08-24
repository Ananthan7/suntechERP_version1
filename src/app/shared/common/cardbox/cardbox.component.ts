import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cardbox',
  templateUrl: './cardbox.component.html',
  styleUrls: ['./cardbox.component.scss']
})
export class CardboxComponent implements OnInit {
  @Input() header:any
  @Input() content:any
  constructor() { }

  ngOnInit(): void {
  }

}
