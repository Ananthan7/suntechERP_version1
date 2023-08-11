import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tabledata',
  templateUrl: './tabledata.component.html',
  styleUrls: ['./tabledata.component.scss']
})
export class TabledataComponent implements OnInit {
  @Input() tableData: any[] = [];
  @Input() tableCode: string = '';
  tableDataHeader: any[]=[];
  
  constructor() { 
  }

  ngOnInit(): void {
    this.tableDataHeader = Object.keys(this.tableData[0])
  }
}
