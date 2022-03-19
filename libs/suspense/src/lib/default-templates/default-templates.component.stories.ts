import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SuspenseModule } from '../suspense.module';
import { DefaultTemplatesComponent } from './default-templates.component';

export default {
  title: 'DefaultTemplatesComponent',
  component: DefaultTemplatesComponent,
  decorators: [
    moduleMetadata({
      imports: [SuspenseModule.forRoot()],
    }),
  ],
} as Meta<DefaultTemplatesComponent>;

const Template: Story<DefaultTemplatesComponent> = (
  args: DefaultTemplatesComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
