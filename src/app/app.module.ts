import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';


import { AccordionModule } from 'primeng/accordion';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { DataGridModule } from 'primeng/datagrid';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {PanelModule} from 'primeng/panel';

import { AppComponent } from './app.component';
import { DataService } from './service/data.service';
import { environment } from './../environments/environment';
import { HomeProjectComponent } from './project/home/home.project';
import { DetailProjectComponent } from './project/detail/detail.project';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeProjectComponent },
  { path: ':id', component: DetailProjectComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeProjectComponent,
    DetailProjectComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AccordionModule,
    ButtonModule,
    CardModule,
    MenuModule,
    DataViewModule,
    DialogModule,
    MessagesModule,
    MessageModule,
    OrganizationChartModule,
    PanelModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
