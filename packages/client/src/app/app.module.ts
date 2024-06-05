import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SingleFileUploadComponent } from './single-file-upload/single-file-upload.component';
import { MultipleFileUploadComponent } from './multiple-file-upload/multiple-file-upload.component';
import { UploadcareUploadComponent } from './uploadcare-upload/uploadcare-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    SingleFileUploadComponent,
    MultipleFileUploadComponent,
    UploadcareUploadComponent,
  ],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
