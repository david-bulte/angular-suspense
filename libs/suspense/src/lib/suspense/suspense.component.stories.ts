import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SuspenseModule } from '../suspense.module';
import { LoadingStates, SuspenseComponent } from './suspense.component';

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
        LoadingStates.LOADING,
        LoadingStates.SUCCESS,
        LoadingStates.ERROR,
        LoadingStates.EMPTY,
      ],
      control: { type: 'radio' },
    },
  },
} as Meta;

const DefaultStory: Story = (args) => ({
  props: args,
  template: `
    <susp [debug]="debug" [state]="state" [debounce]="debounce"> 
      <span>is this thing on?</span>
    </susp>
    `,
});

export const Default = DefaultStory.bind({});
Default.args = {
  debug: 'debugName',
  state: LoadingStates.LOADING,
  debounce: 0,
  catchError: false,
  stopPropagation: false,
};
