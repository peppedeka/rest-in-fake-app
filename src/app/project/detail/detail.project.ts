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
  selectedNode: TreeNode;

  data: TreeNode[];
  detail: string;
  private _dataSub: Subscription;

  constructor(private _dataService: DataService, private _route: ActivatedRoute) {
    this.addAPIName = '';
    this._subRouter = this._route.params.subscribe(params => {
      this.projectName = params['id'];
    });
    this.organizationData = [];
    this._refreshData();
    this.detail = 'Details';

    this.data = [{
      label: 'CEO',
      type: 'person',
      styleClass: 'ui-person',
      expanded: true,
      data: { name: 'Walter White', 'avatar': 'walter.jpg' },
      children: [
        {
          label: 'CFO',
          type: 'person',
          styleClass: 'ui-person',
          expanded: true,
          data: { name: 'Saul Goodman', 'avatar': 'saul.jpg' },
          children: [{
            label: 'Tax',
            styleClass: 'department-cfo'
          },
          {
            label: 'Legal',
            styleClass: 'department-cfo'
          }],
        },
        {
          label: 'COO',
          type: 'person',
          styleClass: 'ui-person',
          expanded: true,
          data: { name: 'Mike E.', 'avatar': 'mike.jpg' },
          children: [{
            label: 'Operations',
            styleClass: 'department-coo'
          }]
        },
        {
          label: 'CTO',
          type: 'person',
          styleClass: 'ui-person',
          expanded: true,
          data: { name: 'Jesse Pinkman', 'avatar': 'jesse.jpg' },
          children: [{
            label: 'Development',
            styleClass: 'department-cto',
            expanded: true,
            children: [{
              label: 'Analysis',
              styleClass: 'department-cto'
            },
            {
              label: 'Front End',
              styleClass: 'department-cto'
            },
            {
              label: 'Back End',
              styleClass: 'department-cto'
            }]
          },
          {
            label: 'QA',
            styleClass: 'department-cto'
          },
          {
            label: 'R&D',
            styleClass: 'department-cto'
          }]
        }
      ]
    }];
  }
  private _refreshData(): void {
    this._dataSub = this._dataService.getProjectDetails(this.projectName).subscribe((project: any) => {
      this.project = project[this.projectName];
      console.log(this.project);
      const organizationProject: Object = {};

      const children: object[] = [];
      this.project.forEach(api => {

        const fieldChildren: Object[] = [];
        api.field.forEach(fld => {
          fieldChildren.push(
            {
              label: 'field',
              type: 'person',
              styleClass: 'ui-person',
              expanded: true,
              name: fld['name'],
              data: fld
            });
        });

        const objChildren: Object[] = [];
        api.obj.forEach(ob => {
          objChildren.push(
            {
              label: 'object',
              type: 'person',
              styleClass: 'ui-person',
              expanded: true,
              name: ob['name'],
              data: ob
            });
        });

        children.push(
          {
            label: 'api',
            type: 'person',
            styleClass: 'ui-person',
            expanded: true,
            name: api.api,
            data: api,
            children: fieldChildren.concat(objChildren)
          });

      });
      organizationProject['label'] = 'Project';
      organizationProject['type'] = 'person';
      organizationProject['styleClass'] = 'ui-person';
      organizationProject['expanded'] = true;
      organizationProject['name'] = this.projectName;
      organizationProject['children'] = children;
      this.organizationData.push(organizationProject);

      console.log(this.organizationData);
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
  onNodeSelect(event) {
    console.log(event);
    this.selectedNode = event.node;
    this.detail = 'Details of ' + this.selectedNode['name'];
  }
  isUnselected(value): boolean {
    if (typeof value === 'undefined' || value == null) {
      return true;
    } else {
      return false;
    }
  }
  ngOnInit() {
  }
}
