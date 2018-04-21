import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { Subscription } from 'rxjs/Subscription';

import * as moment from 'moment';

import { Project } from './../interface/project.interface';
import { DataService } from './service/data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  projects: Project[];

  selectedProject: Project;
  deletedProject: Project;

  displayDialog: boolean;
  displayAddProjectDialog: boolean;
  displayDeleteProjectDialog: boolean;

  addProjectName: string;

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
  }
  SaveProject(): void {
    const param: object = {
      name: this.addProjectName
    };

    this._dataService.postProject(JSON.stringify(param)).subscribe((res) => {
      this.addProjectName = '';
      this.displayAddProjectDialog = false;
      this._refreshData();
    });
  }
  deleteProject(id: string) {
    this._dataService.deleteProject(id).subscribe((res) => {
      this.displayDeleteProjectDialog = false;
      this._refreshData();
    });
  }
  selectProject(event: Event, project: Project): void {
    this.selectedProject = project;
    this.displayDialog = true;
    event.preventDefault();
    console.log(project);
  }
  deleteProjectDialog(event: Event, project: Project): void {
    this.deletedProject = project;
    this.displayDeleteProjectDialog = true;
    event.preventDefault();
    console.log(project);
  }
  onDialogHide(): void {
    this.selectedProject = null;
  }
  momentDate(date: any): any {
    return moment(date).format('HH:hh - DD MMM YY');
  }

  ngOnInit() {
    this.items = [{
      label: 'File',
      items: [
        { label: 'New', icon: 'fa-plus' },
        { label: 'Open', icon: 'fa-download' }
      ]
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', icon: 'fa-refresh' },
        { label: 'Redo', icon: 'fa-repeat' }
      ]
    }];
  }
}
