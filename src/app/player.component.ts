import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';

interface Event {
  SessionId: number;
  EventType: string;
  EventTargetText: string;
  EventTargetSelectorTok: string;
  EventStart: string;
}

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @ViewChild('events', { static: false })
  eventsRef: ElementRef;

  issues: any[] = [];
  issueNum: string;

  filteredEvents: Event[] = [];

  eventsText: string;
  sessionId: string;
  timestamp: string;

  constructor (
    private http: HttpClient,
  ) {

  }

  async ngOnInit() {
    this.issues = await this.http.get(`${environment.url}/issues`).toPromise() as any[];
  }

  async loadIssue(event: any) {
    const issue = event.value;
    const tokens = issue.body.split('|');
    
    this.sessionId= tokens[11].trim();
    this.timestamp = tokens[14].trim();

    const events = await this.http.get(`${environment.url}/issues/${issue.number}`).toPromise() as Event[];
    this.filteredEvents = this.pruneEvents(events);
    this.eventsText = JSON.stringify(this.filteredEvents, null, 2);
    this.filter();  // also filter since the timestamp is used from the issue
  }

  async filter() {
    if (this.sessionId) {
      this.filteredEvents = this.filteredEvents.filter(event => event.SessionId === +this.sessionId);
    }

    if (this.timestamp) {
      // FIXME there could be some delta between the timestamps in FS and the users machine
      this.filteredEvents = this.filteredEvents.filter(event => new Date(event.EventStart).getTime() <= (+this.timestamp + 1000));
    }

    console.log(`Filtered to ${this.filteredEvents.length}`);

    this.filteredEvents = this.pruneEvents(this.filteredEvents);

    this.filteredEvents = this.filteredEvents.map(event => {
      const { EventType, EventTargetText, EventTargetSelectorTok, EventStart, SessionId } = event;
      return {
        EventType,
        EventTargetText,
        EventTargetSelectorTok,
        EventStart,
        SessionId,
      };
    });
  }

  pruneEvents (events: Event[]) {
  // filter only click events since they apply to the calc usage
  return events.filter(event => 
    event.EventType === 'click' && event.EventTargetSelectorTok.includes('calc%2Dbutton'));
  }

  playAll() {
    const length = this.filteredEvents.length;
    
    // just loop n times as step will unshift the array
    for (let i = 0; i < length; i++) {
      this.step();
    }
  }

  step(event?: Event) {
    if (!event) {
      event = this.filteredEvents.shift();
    }

    const { EventTargetSelectorTok: selector, EventTargetText: text } = event;

    const element = this.findElement(selector, text);

    if (element) {
      console.log(`Found element at ${selector}`);

      console.log(`Simulating click event`);
      // @ts-ignore
      element.click();
    } else {
      console.error(`Element not found at ${selector}`);
    }
  }

  findElement(cssSelector: string, text: string) {
    // remove spaces between the tag and class name
    // remove .cdk%2Dfocused .cdk%2Dmouse%2Dfocused as it is only valid upon user click 
    const selector = decodeURI(cssSelector.replace(/ .cdk%2Dfocused .cdk%2Dmouse%2Dfocused/g, '')).replace(/ \./g, '.');

    const list: NodeListOf<Element> = document.querySelectorAll(selector);

    // the css selectors can match multiple buttons; find the one the user clicked
    const element = Array.from(list).find(node => node.textContent === text);

    return element;
  }
}