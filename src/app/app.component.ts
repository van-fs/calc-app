import { Component } from '@angular/core';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';

enum Color {
  ACCENT = 'accent',
  BASIC = '',
  PRIMARY = 'primary',
  WARN = 'warn',
}

class Button {
  constructor(public text?: string, public color = Color.ACCENT, public span = 1) {

  }
}

enum Operation {
  CLEAR_ALL = 'AC',
  CLEAR_ENTRY = 'CE',
  SIGN = '+/-',
  PERCENT = '%',
  DIVIDE = '/',
  MULTIPLY = '*',
  ADD = '+',
  SUBTRACT = '-',
  DECIMAL = '.',
  EVAL = '='
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Calculator';

  operation: string;
  registers: string[];
  display: string;    // FIXME this is more error prone so good for a demo
  values: number[];

  constructor() {
    this.display = '0';
    this.registers = [];
    this.values = [];
  }

  buttons = [
    new Button(Operation.SIGN, Color.BASIC),
    new Button(Operation.PERCENT, Color.BASIC),
    new Button(Operation.DIVIDE, Color.PRIMARY),
    new Button('7'), new Button('8'), new Button('9'),
    new Button(Operation.MULTIPLY, Color.PRIMARY),
    new Button('4'), new Button('5'), new Button('6'),
    new Button(Operation.SUBTRACT, Color.PRIMARY),
    new Button('1'), new Button('2'), new Button('3'),
    new Button(Operation.ADD, Color.PRIMARY),
    new Button('0', Color.ACCENT, 2),
    new Button(Operation.DECIMAL),
    new Button(Operation.EVAL, Color.PRIMARY),
  ];

  press(input: string) {
    switch (input) {
      case Operation.ADD:
      case Operation.SUBTRACT:
      case Operation.MULTIPLY:
      case Operation.DIVIDE:
        this.store();
        this.operation = input;
        break;
      case Operation.SIGN:
        this.store(this.currentValue() * -1);
        break;
      case Operation.PERCENT:
        this.store(this.currentValue() / 100);
        break;
      case Operation.CLEAR_ALL:
        this.clear(true);
        break;
      case Operation.CLEAR_ENTRY:
        this.clear();
        break;
      case Operation.DECIMAL:
        // TODO implement
        break;
      case Operation.EVAL:
        this.store();
        this.display = this.compute().toString();
        break;
      default:
        this.registers.push(input);
        console.log(this.registers);
        this.display = this.currentValue().toString();
    }
  }

  compute () {
    const length = this.values.length;
    const a = this.values[length - 2];
    const b = this.values[length - 1];
    
    switch (this.operation) {
      case Operation.ADD:
        return a + b;
      case Operation.SUBTRACT:
        return a - b;
      case Operation.MULTIPLY:
        return a * b;
      case Operation.DIVIDE:
        return a / b;
    }
  }

  currentValue (): number {
    if (this.registers.length > 0) {
      return +this.registers.join('');
    } else {
      // FIXME something that fails for the demo
      // return this.display;
    }
    
  }

  store (value?: number): void {
    const v = value || this.currentValue();
    
    this.values.push(v);
    this.registers = [];
    this.display = v.toString();

    console.log(this.values);
  }

  clear (all = false) {
    if (all) {
      this.values = [];
    }

    this.registers = [];
    this.display = '0';
  }
}
