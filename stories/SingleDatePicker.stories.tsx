import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SingleDatePicker } from '../src';
import '../src/public/css/style.css';

const meta: Meta = {
  title: 'Single Date Picker',
  component: SingleDatePicker,
};

export default meta;

const Template: Story = args => <SingleDatePicker {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const SingleDatePickerExample = Template.bind({});

SingleDatePickerExample.args = {};
