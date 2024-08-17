import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IndexedApiService } from './services/indexed-api.service';
import { IndexedDbService } from './services/indexed-db.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
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
    private indexedApiService: IndexedApiService,
    private IndexedDbService: IndexedDbService,
    private router: Router,
  ) {
  }

  ngAfterViewInit() {
    //fetch datas and save into indexed db
    let branch = localStorage.getItem('userbranch');
    if (branch) {
      this.indexedApiService.setInitailLoadSetUp()
    }
  }
}
