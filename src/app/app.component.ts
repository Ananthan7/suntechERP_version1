import { AfterViewInit, Component, OnInit } from '@angular/core';
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
    private indexedApiService: IndexedApiService,
  ) {
  }

  ngAfterViewInit(){
    //fetch datas and save into indexed db
    this.indexedApiService.setInitailLoadSetUp()
  }
}
