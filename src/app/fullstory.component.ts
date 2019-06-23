import { AfterViewInit, Component, ElementRef } from '@angular/core';

import { environment } from '../environments/environment'

declare const FS: any;  // in case you want to call FS.identify

@Component({
  selector: 'app-fullstory',
  template: ''
})
export class FullStoryComponent implements AfterViewInit {

  constructor(private elementRef: ElementRef) {
  
  }

  /**
   * Load the script include after init. Must inject into the DOM because ng will not allow
   * script tag in component HTML.
   */
  ngAfterViewInit() {
    if (environment.production) {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.text = `window['_fs_debug'] = false;
      window['_fs_host'] = 'fullstory.com';
      window['_fs_org'] = '${environment.fsOrg}';
      window['_fs_namespace'] = 'FS';
      (function(m,n,e,t,l,o,g,y){
          if (e in m) {if(m.console && m.console.log) {
            m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;
          }
          g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s);};g.q=[];
          o=n.createElement(t);o.async=1;o.src='https://'+_fs_host+'/s/fs.js';
          y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
          g.identify=function(i,v,s){
            g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)
          };
          g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
          g.consent=function(a){g("consent",!arguments.length||a)};
          g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
          g.clearUserCookie=function(){};
      })(window,document,window['_fs_namespace'],'script','user');`;
      this.elementRef.nativeElement.appendChild(s);
    }
  }

}
