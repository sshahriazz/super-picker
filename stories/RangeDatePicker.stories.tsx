import React from 'react';
import { Meta, Story } from '@storybook/react';
import { RangeDatePicker } from '../src';
import '../src/public/css/style.css';

const meta: Meta = {
  title: 'Range Date Picker',
  component: RangeDatePicker,
};

export default meta;

const Template: Story = args => <RangeDatePicker {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const RangeDatePickerExample = Template.bind({});

RangeDatePickerExample.args = {};
