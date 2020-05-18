import {storiesOf, moduleMetadata} from '@storybook/angular';

import {NgModule} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {TranslationModule} from 'angular-l10n';

import {ShipmentSelectionModule} from './shipment-selection.module';
import {ShipmentSelectionService} from './shipment-selection.service';

import {AppService} from '../../app/app.service';
import {CreateEditAddressService} from '../address-selection/create-edit-address/create-edit-address.service';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';
import {TimeoutService} from '../../app/timeout/timeout.service';
import {TranslationsGuidsService} from '../../sncr-components/sncr-commons/translations-guids.service';

import * as ShipmentSelectionComponentAst from 'ast!./shipment-selection.component';
import {generateDocumentation} from '../../../storybook/utils/api';

@NgModule({
  imports: [ShipmentSelectionModule],
  exports: [ShipmentSelectionModule]
})
class StoryShipmentSelectionModule {
  constructor(
    sncrTranslateService: SncrTranslateService,
    guids: TranslationsGuidsService
  ) {
    sncrTranslateService.configureLocalisation(
      ...guids.getGuids(
        'common',
        'address-selection-bundle',
        'default-data-table'
      )
    );
  }
}

storiesOf('Templates|Flow Sections/Shipment Selection', module)
  .addParameters(generateDocumentation(ShipmentSelectionComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        RouterModule.forRoot([], {onSameUrlNavigation: 'reload'}),
        HttpClientModule,
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        StoryShipmentSelectionModule
      ],
      providers: [
        AppService,
        CreateEditAddressService,
        ShipmentSelectionService,
        TimeoutService,
        TranslationsGuidsService,
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    })
  )
  .add('✨ Playground', () => ({
    template: `<shipment-selection [addressSelectionType]="addressSelectionType" [debitorAddress]="debitorAddress"></shipment-selection>`,
    props: {
      addressSelectionType: 'SHIPMENT',
      debitorAddress: {}
    }
  }));
