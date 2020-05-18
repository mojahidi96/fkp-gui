import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {ButtonModule} from '../../sncr-components/sncr-controls/button/button.module';

import {TopBarComponent} from './top-bar.component';
import {TopBarService} from './top-bar.service';

@NgModule({
  imports: [CommonModule, RouterModule, ButtonModule],
  declarations: [TopBarComponent],
  exports: [TopBarComponent],
  providers: [TopBarService]
})
export class TopBarModule {}
