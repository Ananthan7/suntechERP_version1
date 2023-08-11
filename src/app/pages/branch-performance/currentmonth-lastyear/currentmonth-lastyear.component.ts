import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-currentmonth-lastyear',
  templateUrl: './currentmonth-lastyear.component.html',
  styleUrls: ['./currentmonth-lastyear.component.scss']
})
export class CurrentmonthLastyearComponent implements OnInit {
  tabledata: any[] = [
    {id: 'MOE',name: 175,id1: '44.5',GM: '44.5%'},
    {id: 'DM ',name: 175,id1: '44.5',GM: '44.5%'},
    {id: 'MOH',name: 175,id1: '44.5',GM: '44.5%'},
    {id: 'NKM',name: 175,id1: '44.5',GM: '44.5%'},
    {id: 'NKM',name: 175,id1: '44.5',GM: '44.5%'},
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
