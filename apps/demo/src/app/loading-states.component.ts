import { Component } from '@angular/core';

@Component({
  selector: 'demo-loading-states',
  template: `
    <app-suspense-default-templates>
      <ng-template appLoading> This is my global loading state </ng-template>
      <ng-template appEmpty> This is my global empty state </ng-template>
      <ng-template appError> This is my global error state </ng-template>
    </app-suspense-default-templates>
  `,
})
export class LoadingStatesComponent {}
