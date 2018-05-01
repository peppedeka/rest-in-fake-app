import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { publishReplay } from 'rxjs/operators/publishReplay';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { map } from 'rxjs/operators/map';
import { refCount } from 'rxjs/operators/refCount';

import * as moment from 'moment';

import { TreeNode } from 'primeng/api';
import { DataTableModule } from 'primeng/primeng';
import * as beautify from 'json-beautify';

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

  currentApi: string;

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
  fakeJson: Object;
  fakeJsonDetails: Object;
  private _dataSub: Subscription;

  constructor(private _dataService: DataService, private _route: ActivatedRoute) {
    this.addAPIName = '';
    this._subRouter = this._route.params.subscribe(params => {
      this.projectName = params['id'];
    });
    this.organizationData = [];
    this._refreshData();
    this.detail = 'Details';
    this.fakeJson = {};





  }
  private _refreshData(): void {
    this._dataSub = this._dataService.getProjectDetails(this.projectName).subscribe((project: any) => {
      this.project = project[this.projectName];

      const event = {
        node: this.project[0]
      };
      this.selectedNode = this.project[0];
      this.onNodeSelect(event);
      console.log(this.project);
      const organizationProject: Object = {};

      const children: object[] = [];
      this.project.forEach((api: object) => {
        const fieldChildren: Object[] = [];
        api['field'].forEach(fld => {
          fieldChildren.push(
            {
              label: 'field',
              type: 'person',
              styleClass: 'ui-person',
              expanded: true,
              name: fld['name'],
              data: fld,
              api: api['api']
            });
        });

        const objChildren: Object[] = [];
        api['obj'].forEach(ob => {
          objChildren.push(
            {
              label: 'object',
              type: 'person',
              styleClass: 'ui-person',
              expanded: true,
              name: ob['name'],
              data: ob,
              api: api['api']
            });
        });

        children.push(
          {
            label: 'api',
            type: 'person',
            styleClass: 'ui-person',
            expanded: true,
            name: api['api'],
            data: api,
            children: fieldChildren.concat(objChildren),
            api: api['api']
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

  private _refreshFakeJson() {
    this._dataService.getFakeApi(this.projectName, this.currentApi).subscribe((res: Object) => {
      this.fakeJson = res;
      this.fakeJsonDetails = res;
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

    if (this.currentApi !== this.selectedNode['api']) {
      this.currentApi = this.selectedNode['api'];
      this._refreshFakeJson();
    }

    const name: string = this.selectedNode['name'];
    this.fakeJsonDetails = Object.assign({});
    if (this.fakeJson[this.selectedNode['name']]) {
      this.fakeJsonDetails[name] = this.fakeJson[this.selectedNode['name']];
      if (this.selectedNode['label'] === 'object') {
        this._dataService.getObj(this.selectedNode['name']).subscribe((obj: object) => {
          Object.assign(this.fakeJsonDetails[name], { obj: obj });
        });
      }
    } else {
      this.fakeJsonDetails = this.fakeJson;
    }
    this.detail = 'Details of ' + this.selectedNode['name'];
  }
  isUnselected(value): boolean {
    if (typeof value === 'undefined' || value == null) {
      return true;
    } else {
      return false;
    }
  }
  updateJson() {
    this._dataService.saveElement(this.selectedNode.label, this.selectedNode.data).subscribe((res) => {
      console.log(res);
      this.selectedNode.data = Object.assign({}, res);

      const event = {
        node: this.selectedNode
      };
      this.onNodeSelect(event);
      this._refreshFakeJson();
    });
  }

  getObj(label: string) {
    return this._dataService.getObj(label);
  }

  ngOnInit() {
  }
}
