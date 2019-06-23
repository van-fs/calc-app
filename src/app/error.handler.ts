import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';
import { LogService } from './log.service';

declare const FS: any;

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  constructor (
    private http: HttpClient,
    private logService: LogService,
  ) { 

  }

  async handleError(error) {
    if (error) {
      // send error to the browser console
      console.error(error);


      // send the error to issue server
      const sessionUrl = FS.getCurrentSessionURL(true);

      try {
        const response: any = await this.http.post(`${environment.url}/issue`, {
          content: error.message,
          sessionUrl
        }).toPromise();

        const { html_url: issueUrl } = response;
        
        console.log(`Bug reported created at ${issueUrl}`)

        this.logService.error(`Oh snap, something went wrong! Track the bug @ ${issueUrl}.`);
      } catch (e) {
        console.error(e);
      }
    }
  }

  
}