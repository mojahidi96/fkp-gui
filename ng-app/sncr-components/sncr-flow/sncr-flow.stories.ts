import {storiesOf, moduleMetadata} from '@storybook/angular';
import {boolean, number, select, text} from '@storybook/addon-knobs';

import {NgxPageScrollModule} from 'ngx-page-scroll';

import {ButtonModule} from '../sncr-controls/button/button.module';
import {SncrFlowModule} from './sncr-flow.module';

import * as SncrFlowComponentAst from 'ast!./sncr-flow.component';
import {generateDocumentation} from '../../../storybook/utils/api';

storiesOf('SNCR Components|Flow', module)
  .addParameters(generateDocumentation(SncrFlowComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [NgxPageScrollModule, ButtonModule, SncrFlowModule]
    })
  )
  .add('✨ Playground', () => ({
    template: `
      <sncr-flow #flow="sncrFlow">
        <sncr-flow-section titleText="Section 1" #section1>
          <div *sncrSummaryTemplate>
            Summary
          </div>
          <div *sncrSectionTemplate>
            <p>Some description</p>
            <sncr-button type="strong" text="Next" (click)="section1.next()"></sncr-button>
          </div>
        </sncr-flow-section>
        <sncr-flow-section titleText="Section 2" #section2>
          <div *sncrSummaryTemplate>
            Summary
          </div>
          <div *sncrSectionTemplate>
            <p>Some description</p>
            <sncr-button type="primary" text="Place Order"></sncr-button>
          </div>
        </sncr-flow-section>
      </sncr-flow>
    `,
    props: {
      // TODO
      numberOfSteps: number('Number of Steps', 6)
    }
  }))
  .add('Two Steps', () => ({
    template: `
      <sncr-flow #flow="sncrFlow">
        <sncr-flow-section titleText="Section 1" #section1>
          <div *sncrSummaryTemplate>
            Summary
          </div>
          <div *sncrSectionTemplate>
            <p>Some description</p>
            <sncr-button type="strong" text="Next" (click)="section1.next()"></sncr-button>
          </div>
        </sncr-flow-section>
        <sncr-flow-section titleText="Section 2" #section2>
          <div *sncrSummaryTemplate>
            Summary
          </div>
          <div *sncrSectionTemplate>
            <p>Some description</p>
            <sncr-button type="primary" text="Place Order"></sncr-button>
          </div>
        </sncr-flow-section>
      </sncr-flow>
    `
  }));
