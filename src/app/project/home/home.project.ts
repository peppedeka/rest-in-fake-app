import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { Subscription } from 'rxjs/Subscription';

import * as moment from 'moment';

import { Project } from './../../../interface/project.interface';
import { DataService } from './../../service/data.service';
@Component({
  selector: 'home-project',
  templateUrl: './home.project.html',
  styleUrls: ['./home.project.scss']
})
export class HomeProjectComponent implements OnInit {
  title = 'app';
  projects: Project[];

  deletedProject: Project;

  displayAddProjectDialog: boolean;
  displayDeleteProjectDialog: boolean;

  addProjectName: string;
  error: string;

  private _dataSub: Subscription;
  private items: MenuItem[];

  constructor(private _dataService: DataService) {
    this.addProjectName = '';
    this._refreshData();
  }
  private _refreshData(): void {
    this._dataSub = this._dataService.getProject().subscribe((projects: Project[]) => {
      this.projects = projects;
      console.log(this.projects);
      this._dataSub.unsubscribe();
    });
  }
  addProject(): void {
    this.displayAddProjectDialog = true;
    this.error = '';
    this.addProjectName = '';
  }
  SaveProject(): void {
    const param: object = {
      name: this.addProjectName
    };

    this._dataService.postProject(JSON.stringify(param)).subscribe((res) => {
      this.error = '';
      if (Object.keys(res).length === 1) {
        this.error = res.name;
      } else {
        this.displayAddProjectDialog = false;
        this.addProjectName = '';
        this._refreshData();
      }
    });
  }
  deleteProject(id: string) {
    this._dataService.deleteProject(id).subscribe((res) => {
      this.displayDeleteProjectDialog = false;
      this._refreshData();
    });
  }
  deleteAPI(projectName: string, id: string) {
    this._dataService.deleteProject(id).subscribe((res) => {
      this.displayDeleteProjectDialog = false;
      this._refreshData();
    });
  }

  deleteProjectDialog(event: Event, project: Project): void {
    this.deletedProject = project;
    this.displayDeleteProjectDialog = true;
    event.preventDefault();
    console.log(project);
  }

  momentDate(date: any): any {
    return moment(date).format('HH:hh - DD MMM YY');
  }

  ngOnInit() {
  }
}
