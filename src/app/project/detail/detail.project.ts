import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import * as moment from 'moment';

import { TreeNode } from 'primeng/api';
import { DataTableModule } from 'primeng/primeng';

import { Project } from './../../../interface/project.interface';
import { DataService } from './../../service/data.service';
@Component({
  selector: 'detail-project',
  templateUrl: './detail.project.html',
  styleUrls: ['./detail.project.scss']
})
export class DetailProjectComponent implements OnInit {
  private _subRouter: Subscription;
  projectName: string;

  displayAddAPIDialog: boolean;

  addAPIName: string;
  error: string;

  deletedAPI: object;
  displayDeleteAPIDialog: boolean;
  APIs: Object[];
  project: any;
  organizationData: TreeNode[];

  private _dataSub: Subscription;

  constructor(private _dataService: DataService, private _route: ActivatedRoute) {
    this.addAPIName = '';
    this._subRouter = this._route.params.subscribe(params => {
      this.projectName = params['id'];
    });
    this.organizationData = [];
    this._refreshData();
  }
  private _refreshData(): void {
    this._dataSub = this._dataService.getProjectDetails(this.projectName).subscribe((project: any) => {
      this.project = project[this.projectName];
      const organizationProject: Object = {};
      organizationProject['label'] = this.projectName;
      const children: object[] = [];
      this.project.forEach(api => {

        const fieldChildren: Object[] = [];
        api.field.forEach(fld => {
          fieldChildren.push({ 'label': fld['name'], 'expanded': true });
        });
        const field: object = { 'label': 'fields', 'children': fieldChildren, 'expanded': true };

        const objChildren: Object[] = [];
        api.obj.forEach(ob => {
          objChildren.push({ 'label': ob['name'], 'expanded': true });
        });
        const obj: object = { 'label': 'objects', 'children': objChildren, 'expanded': true };

        children.push({ 'label': api.api, children: [field, obj], 'expanded': true });

      });
      organizationProject['children'] = children;
      organizationProject['expanded'] = true;
      this.organizationData.push(organizationProject);

      console.log(this.project);
      this._dataSub.unsubscribe();
    });
  }
  /*
    deleteAPI(id: string) {
      this._dataService.deleteAPI(this.projectName, id).subscribe((res) => {
        this.displayDeleteAPIDialog = false;
        this._refreshData();
      });
    }
  */
  deleteAPIDialog(event: Event, API: any): void {
    this.deletedAPI = API;
    this.displayDeleteAPIDialog = true;
    event.preventDefault();
    console.log(API);
  }
  ngOnInit() {
  }
}
