import { Component, Input, OnInit } from '@angular/core';
import { LoadingStates } from '@david-bulte/angular-suspense';
import { BehaviorSubject, timer } from 'rxjs';

@Component({
  selector: 'bar',
  template: `bar`,
})
export class BarComponent {}
