import {addDecorator, addParameters, configure} from '@storybook/angular';
import {create} from '@storybook/theming';

import {withKnobs} from '@storybook/addon-knobs';

addParameters({
  options: {
    theme: create({
      base: 'light',
      colorPrimary: 'rgb(51, 51, 51)',
      colorSecondary: 'rgb(0, 126, 148)',
      brandTitle: 'Vodafone Design System'
    }),
    panelPosition: 'right'
  }
});

addDecorator(withKnobs);

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

function loadStories() {
  requireAll(require.context('../getting-started', true, /.*?\.stories\.ts$/));
  requireAll(require.context('../design-tokens', true, /.*?\.stories\.ts$/));
  requireAll(require.context('../global-styles', true, /.*?\.stories\.ts$/));

  requireAll(require.context('../../ng-app', true, /.*?\.stories\.ts$/));
}

configure(loadStories, module);
