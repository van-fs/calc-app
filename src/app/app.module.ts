import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FullStoryComponent } from './fullstory.component';
import { PlayerComponent } from './player.component';

import { AppErrorHandler } from './error.handler';
import { LogService } from './log.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatToolbarModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    FullStoryComponent,
    PlayerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatToolbarModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
  ],
  providers: [
    {provide: ErrorHandler, useClass: AppErrorHandler},
    LogService,
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
