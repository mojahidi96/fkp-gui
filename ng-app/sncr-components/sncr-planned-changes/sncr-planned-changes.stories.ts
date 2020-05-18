import {storiesOf, moduleMetadata} from '@storybook/angular';
import {text} from '@storybook/addon-knobs';

import {Input, Component, AfterViewInit} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {TranslationModule} from 'angular-l10n';

import {SncrTranslateService} from '../sncr-translate/sncr-translate.service';
import {SncrPlannedChangesModule} from './sncr-planned-changes.module';
import {SncrPlannedChangesService} from './sncr-planned-changes.service';

import * as SncrPlannedChangesComponentAst from 'ast!./sncr-planned-changes.component';
import {generateDocumentation} from '../../../storybook/utils/api';

@Component({
  selector: 'planned-changes-with-fixture',
  template: `
    <sncr-planned-changes
      *ngIf="buttonLabel"
      [plannedChangesService]="plannedChangesService"
      [buttonLabel]="buttonLabel"
    ></sncr-planned-changes>
    <sncr-planned-changes
      *ngIf="!buttonLabel"
      [plannedChangesService]="plannedChangesService"
    ></sncr-planned-changes>
  `
})
export class PlannedChangesWithFixture implements AfterViewInit {
  @Input() buttonLabel: string | undefined;

  @Input() plannedChangesFixture;

  constructor(public plannedChangesService: SncrPlannedChangesService) {}

  ngAfterViewInit(): void {
    for (let plannedChange of this.plannedChangesFixture) {
      this.plannedChangesService.plannedChangeEmit(plannedChange);
    }
  }
}

storiesOf('SNCR Components|Planned Changes', module)
  .addParameters(generateDocumentation(SncrPlannedChangesComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [
        HttpClientModule,
        TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
        SncrPlannedChangesModule
      ],
      declarations: [PlannedChangesWithFixture],
      providers: [SncrPlannedChangesService]
    })
  )
  .add('✨ Playground', () => ({
    template: `<planned-changes-with-fixture [plannedChangesFixture]="plannedChangesFixture" [buttonLabel]="buttonLabel"></planned-changes-with-fixture>`,
    props: {
      plannedChangesFixture: [
        {
          groupName: 'Internet',
          socs: [
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            }
          ]
        }
      ],
      buttonLabel: text('Button Label', 'Continue')
    }
  }))
  .add('With Single Group', () => ({
    template: `<planned-changes-with-fixture [plannedChangesFixture]="plannedChangesFixture"></planned-changes-with-fixture>`,
    props: {
      plannedChangesFixture: [
        {
          groupName: 'Internet',
          socs: [
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            }
          ]
        }
      ]
    }
  }))
  .add('With Multiple Groups', () => ({
    template: `<planned-changes-with-fixture [plannedChangesFixture]="plannedChangesFixture"></planned-changes-with-fixture>`,
    props: {
      plannedChangesFixture: [
        {
          groupName: 'Internet',
          socs: [
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            }
          ]
        },
        {
          groupName: 'Misc',
          socs: [
            {
              name: 'Weekend Unlimited',
              value: 'SOC4711',
              quantity: 30,
              isAddition: true,
              price: 3.7,
              frequency: 'Monatlicher Basispreis',
              showPrice: true
            }
          ]
        }
      ]
    }
  }))
  .add('Sticky Behavior', () => ({
    template: `<div class="row" style="background: #ccc; height: 2000px;"><div style="width: 66%;"></div><planned-changes-with-fixture [plannedChangesFixture]="plannedChangesFixture"></planned-changes-with-fixture></div>`,
    props: {
      plannedChangesFixture: [
        {
          groupName: 'Internet',
          socs: [
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            },
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            },
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            },
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            },
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            },
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            },
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            },
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            },
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            },
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            },
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            },
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            },
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            },
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            },
            {
              name: 'Internet Free World',
              value: 'SOC123',
              quantity: 3,
              isAddition: true
            },
            {
              name: 'Internet Europe',
              value: 'SOC124',
              quantity: 3,
              isAddition: false
            }
          ]
        }
      ]
    }
  }));
