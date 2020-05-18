import {storiesOf, moduleMetadata} from '@storybook/angular';

import {number} from '@storybook/addon-knobs';

import {SncrSliderModule} from './sncr-slider.module';

import * as SncrSliderComponentAst from 'ast!./sncr-slider.component';
import {generateDocumentation} from '../../../storybook/utils/api';

storiesOf('SNCR Components|Slider', module)
  .addParameters(generateDocumentation(SncrSliderComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [SncrSliderModule]
    })
  )
  .add('✨ Playground', () => ({
    template: `<sncr-slider [rangeMin]="rangeMin" [rangeMax]="rangeMax" [step]="step" [value]="value"></sncr-slider>`,
    props: {
      rangeMin: number('Range Min', 0),
      rangeMax: number('Range Max', 100),
      step: number('Step', 1),
      value: [number('Value Min', 10), number('Value Max', 50)]
    }
  }));
