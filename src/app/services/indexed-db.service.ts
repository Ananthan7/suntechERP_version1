import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
// import Localbase from 'localbase';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {

  constructor(
    private dbService: NgxIndexedDBService,
    // private db: Localbase,
  ) { }


  bulkInsert(colName: string, data: any) {
    this.dbService
      .bulkAdd(colName, data)
      .subscribe((result) => {
        // res = { status: 'success' };
      });
    // Localbase.collection(colName).add(data);
  }

  onDeleteIndexedDB() {
    //  return this.dbService.deleteObjectStore('suntechPos');
    return this.dbService.deleteDatabase().subscribe((deleted) => {
      console.log('Database deleted successfully: ', deleted);
    });

    // this.dbService.deleteDatabase();
    // .subscribe((result) => {
    //   console.log('IndexedDB deleted successfully.');
    // })
    // .catch((error) => {
    //   console.error('Error deleting IndexedDB:', error);
    // });
  }

  getAllData(colName: string) {
    return this.dbService.getAll(colName)
  }
}
