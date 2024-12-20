import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MasterSearchModel } from '../../data/master-find-model';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { DxDataGridComponent } from 'devextreme-angular';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'grid-search',
  templateUrl: './grid-search.component.html',
  styleUrls: ['./grid-search.component.scss']
})
export class GridSearchComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true }) dataGrid!: DxDataGridComponent;
  @Output() newRowClick = new EventEmitter();
  @Input() dataSource!: any[];
  @Input() dataSourceHead!: any[];
  searchFieldLabel: any;
  searchNameLabel: any;
  showFilterRow: boolean = true;
  showHeaderFilter: boolean = true;
  isLoading: boolean = false;
  currentFilter: any;

  subscriptions$!: Subscription;

  //lazyload
  data: any[] = [];
  pageSize = 10;
  currentPage = 1;
  totalItems: number = 0;
  constructor(
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
  ) {
  }
  ngOnInit(): void {

  }
  onRowClickHandler(event: any){
    this.newRowClick.emit(event.data)
  }

  currentRowIndex = 0; // Index of the currently selected row
  focusedRowKey = 1; // Initialize with the first row
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      // Move focus to the next row
      this.currentRowIndex = Math.min(this.currentRowIndex + 1, this.dataSource.length - 1);
    } else if (event.key === 'ArrowUp') {
      // Move focus to the previous row
      this.currentRowIndex = Math.max(this.currentRowIndex - 1, 0);
    } else if (event.key === "Enter"){
      this.newRowClick.emit(this.dataSource[this.currentRowIndex])
    }
    this.focusedRowKey = this.currentRowIndex+1
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.onKeyDown(event)
  }
  //unsubscriptions of streams
  ngOnDestroy(): void {
    this.subscriptions$ && this.subscriptions$.unsubscribe()
  }

}
