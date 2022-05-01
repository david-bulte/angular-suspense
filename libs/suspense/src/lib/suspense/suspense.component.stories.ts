import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SuspenseModule } from '../suspense.module';
import { SuspenseComponent } from './suspense.component';

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
      options: ['loading', 'success', 'error', 'empty'],
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
  state: 'loading',
  debounce: 0,
  catchError: false,
  stopPropagation: false,
};
