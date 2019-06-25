import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
export class PlayerComponent {

  @ViewChild('events', { static: false })
  eventsRef: ElementRef;

  issueNum: string;

  filteredEvents: Event[] = [];

  constructor (
    private http: HttpClient,
  ) {

  }

  async load(issueNumber: string, json?: string, sessionId?: string, timestamp?: string) {
    let events: Event[] = [];

    // get the events either from the Git issue or supplied from textarea
    if (issueNumber) {
      events = await this.http.get(`${environment.url}/issues/${issueNumber}`).toPromise() as Event[];
    } else {
      events = JSON.parse(json);

      if (sessionId) {
        events = events.filter(event => event.SessionId === +sessionId);
      }

      if (timestamp) {
        events = events.filter(event => new Date(event.EventStart).getTime() >= +timestamp);
      }

      console.log(`Filtered to ${events.length} events based on session ${sessionId}`);

      this.eventsRef.nativeElement.value = '';
    }

    console.log(`Found ${events.length} events`);

    // filter only click events since they apply to the calc usage
    events = events.filter(event => event.EventType === 'click' && event.EventTargetSelectorTok.includes('calc%2Dbutton'));

    this.filteredEvents = events.map(event => {
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