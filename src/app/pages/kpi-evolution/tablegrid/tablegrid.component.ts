import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tablegrid',
  templateUrl: './tablegrid.component.html',
  styleUrls: ['./tablegrid.component.scss']
})
export class TablegridComponent implements OnInit {
  @Input() tableData: any[] = [];
  @Input() tableHeader: any[] = [];
  @Input() tableCode: string = ''
  @Input() graphFilter!: string;
  constructor() { 
    
  }

  ngOnInit(): void {
    console.log(this.tableData);
    
  }

  
 
}
