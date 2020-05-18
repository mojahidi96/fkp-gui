import {storiesOf} from '@storybook/angular';

storiesOf('Getting Started|Pages', module).add('Getting Started', () => ({
  template: `
  <div class="storybook-docs">
    <h1>Getting Started</h1>
    <p>
      Storybook provides a sandbox to build UI components in isolation so you
      can develop hard-to-reach states and edge cases.
    </p>
    <p>
      To get started, you may want to have a look at the official
      <a target="_blank" href="https://storybook.js.org/">Storybook website</a>.
    </p>
    <p>
      Design Systems are composed of various building blocks that are briefly
      described in the following sections.
    </p>

    <h3>Design Tokens</h3>
    <p>
      Design tokens are the atoms of the system. In a Design System they are
      used instead of hard coded values to ensure a better consistency across
      any platform.
    </p>
    <p>
      Have a look at the list of <a href="/?path=/story/design-tokens-pages--all-tokens">all tokens</a>.
    </p>

    <h3>Elements</h3>
    <p>
      Elements are the smallest basic structures of an user interface.
      They cannot be broken down any further. Buttons, links, and inputs are
      good examples. Elements utilize decisions made on the design token level.
    </p>

    <h3>Patterns</h3>
    <p>
      Patterns are UI Patterns that fall on the more complex side of the
      spectrum. Date pickers, data tables, and visualizations are good
      examples. Patterns utilize both elements and design tokens.
    </p>

    <h3>Templates</h3>
    <p>
      Templates exist to document the layout and structure of a section.
      These are not called "pages" for a reason. While they can be pages,
      that’s not their only functionality. Templates consist of design tokens,
      elements, and patterns.
    </p>
  </div>
  `
}));
