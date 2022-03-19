import { Component, Input } from '@angular/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SuspenseModule } from '../suspense.module';
import { LoadingState, SuspenseComponent } from './suspense.component';

@Component({
  template: `
    <susp [debug]="debug" [state]="loadingState"> is dit zichtbaar? </susp>
  `,
})
class TestComponent {
  @Input() debug = 'test';
  @Input() loadingState = LoadingState.LOADING;
}

export default {
  title: 'SuspenseComponent',
  component: TestComponent,
  decorators: [
    moduleMetadata({
      imports: [SuspenseModule.forRoot({ debugLoadingStatesInTemplate: true })],
    }),
  ],
} as Meta<SuspenseComponent>;

const Template: Story<SuspenseComponent> = (args: SuspenseComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  debug: '',
  state: LoadingState.LOADING,
  timeout: 0,
  catchError: false,
  stopPropagation: false,
};
