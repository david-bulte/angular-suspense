import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SuspenseModule } from '../suspense.module';
import { LoadingState, SuspenseComponent } from './suspense.component';

export default {
  title: 'SuspenseComponent',
  component: SuspenseComponent,
  decorators: [
    moduleMetadata({
      imports: [
        SuspenseModule.forRoot({ debugLoadingStatesInTemplate: false }),
      ],
    }),
  ],
  argTypes: {
    state: {
      options: [
        LoadingState.LOADING,
        LoadingState.SUCCESS,
        LoadingState.ERROR,
        LoadingState.EMPTY,
      ],
      control: { type: 'radio' },
    },
  },
} as Meta;

const DefaultStory: Story = (args) => ({
  props: args,
  template: `
    <susp [debug]="debug" [state]="state" [timeout]="timeout"> 
      <span>is this thing on?</span>
    </susp>
    `,
});

export const Default = DefaultStory.bind({});
Default.args = {
  debug: 'debugName',
  state: LoadingState.LOADING,
  timeout: 0,
  catchError: false,
  stopPropagation: false,
};
