import {storiesOf, moduleMetadata} from '@storybook/angular';

import {HeadingComponent} from './heading.component';

storiesOf('Global Styles|Pages', module)
  .addDecorator(
    moduleMetadata({
      declarations: [HeadingComponent]
    })
  )
  .add('Headings', () => ({
    template: `
  <h1 heading>The quick brown fox</h1>
  <h2 heading>The quick brown fox</h2>
  <h3 heading>The quick brown fox</h3>
  <h4 heading>The quick brown fox</h4>
  <h5 heading>The quick brown fox</h5>
  `
  }));
