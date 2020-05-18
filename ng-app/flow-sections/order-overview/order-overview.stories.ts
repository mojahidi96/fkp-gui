import {storiesOf, moduleMetadata} from '@storybook/angular';

import {HttpClientModule} from '@angular/common/http';

import {TranslationModule} from 'angular-l10n';

import {OrderOverviewModule} from './order-overview.module';

import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';

import * as OrderOverviewComponentAst from 'ast!./order-overview.component';
import {generateDocumentation} from '../../../storybook/utils/api';

storiesOf('Templates|Flow Sections/Order Overview', module)
  .addParameters(generateDocumentation(OrderOverviewComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        HttpClientModule,
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        OrderOverviewModule
      ]
    })
  )
  .add('✨ Playground', () => ({
    template: `<order-overview [orderSummary]="orderSummary"></order-overview>`,
    props: {
      orderSummary: {
        handySummary: {
          text: 'Apple iPhone 7 Plus Schwarz (32 GB)',
          articleNumber: '301368',
          imagePaths: [
            {
              type: 'SMALL',
              path: '/assets/images/small/iphone-7-plus-schwarz-s.png'
            }
          ]
        },
        tariffSummary: {
          tariffs: [
            {
              text: 'Business Classic 60/1 s',
              subsCount: 4,
              monthlyPrice: 5.67,
              amount: 47.11
            }
          ]
        },
        totalSummary: {
          monthlyTotalValue: 23.5,
          monthlyTotalVAT: 3.48,
          monthlyTotalValueWithVAT: 26.98
        }
      }
    }
  }));
