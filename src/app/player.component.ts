import { Component, ViewChild, ElementRef } from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

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

  filteredEvents: Event[] = [];

  load(json: string, sessionId?: string, timestamp?: string) {
    let events: Event[] = JSON.parse(json);

    // filter only click events since they apply to the calc usage
    events = events.filter(event => event.EventType === 'click');

    console.log(`Found ${events.length} events`);

    if (sessionId) {
      events = events.filter(event => event.SessionId === +sessionId);
    }

    if (timestamp) {
      events = events.filter(event => new Date(event.EventStart).getTime() >= +timestamp);
    }

    console.log(`Filtered to ${events.length} events based on session ${sessionId}`);

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

    this.eventsRef.nativeElement.value = '';
  }

  playAll() {
    for (const event of this.filteredEvents) {
      this.step();
    }
  }

  step() {
    const event = this.filteredEvents.shift();

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