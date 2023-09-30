import { IndexedDbService } from './services/indexed-db.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { SuntechAPIService } from './services/suntech-api.service';
import { CommonServiceService } from './services/common-service.service';
import { IndexedApiService } from './services/indexed-api.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  accessToken: any;
  userBranch: any;
  value: Object | undefined;

  constructor(
    private router: Router,
    private suntechApi: SuntechAPIService,
    private comFunc: CommonServiceService,
    private inDb: IndexedDbService,
    private indexedApiService: IndexedApiService,
  ) {
  }
  ngOnInit() {
  }
  ngAfterViewInit(){
    this.indexedApiService.setInitailLoadSetUp()
  }
}
