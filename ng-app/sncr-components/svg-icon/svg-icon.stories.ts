import {storiesOf, moduleMetadata} from '@storybook/angular';
import {select, text} from '@storybook/addon-knobs';

import {SvgIconModule} from './svg-icon.module';

import * as SvgIconComponentAst from 'ast!./svg-icon.component';
import {generateDocumentation} from '../../../storybook/utils/api';

import {HttpClientModule} from '@angular/common/http';

storiesOf('SNCR Components|SvgIcon', module)
  .addParameters(generateDocumentation(SvgIconComponentAst))
  .addDecorator(
    moduleMetadata({
      imports: [HttpClientModule, SvgIconModule]
    })
  )
  .add('✨ Playground', () => ({
    template: `<svg-icon [name]="name" [size]="size" [title]="title"></svg-icon>`,
    props: {
      name: select(
        'Name',
        [
          'checkbox/checked',
          'checkbox/minus',
          'checkbox/normal',
          'checkbox/plus',
          'filesystem/action/move-folder',
          'filesystem/action/new-folder',
          'filesystem/filetype/csv',
          'filesystem/filetype/doc',
          'filesystem/filetype/docx',
          'filesystem/filetype/jpeg',
          'filesystem/filetype/jpg',
          'filesystem/filetype/msg',
          'filesystem/filetype/pdf',
          'filesystem/filetype/png',
          'filesystem/filetype/ppt',
          'filesystem/filetype/pptx',
          'filesystem/filetype/txt',
          'filesystem/filetype/xls',
          'filesystem/filetype/xlsx',
          'filesystem/filetype/xml',
          'filesystem/folder',
          'filesystem/home-folder',
          'misc/file-format-csv',
          'misc/file-format-xlsx',
          'misc/spinner',
          'notification/basic',
          'notification/error',
          'notification/info-gray',
          'notification/info',
          'notification/success',
          'notification/warning',
          'radio/checked',
          'radio/normal',
          'vodafone/3g',
          'vodafone/4g-plus',
          'vodafone/4g',
          'vodafone/accessories',
          'vodafone/add-or-plus',
          'vodafone/apps',
          'vodafone/arrow-down',
          'vodafone/arrow-left',
          'vodafone/arrow-right',
          'vodafone/arrow-up',
          'vodafone/attachment',
          'vodafone/bill-or-report',
          'vodafone/birthday-greeting',
          'vodafone/block',
          'vodafone/blog',
          'vodafone/bold',
          'vodafone/broadband-or-wifi',
          'vodafone/business-phone',
          'vodafone/business',
          'vodafone/calendar',
          'vodafone/calls-contacts',
          'vodafone/camera',
          'vodafone/chat',
          'vodafone/chatbot-robot',
          'vodafone/cherries-points',
          'vodafone/chevron-down',
          'vodafone/chevron-left',
          'vodafone/chevron-right',
          'vodafone/chevron-up',
          'vodafone/clock-or-timed',
          'vodafone/close',
          'vodafone/comment',
          'vodafone/community-or-foundation',
          'vodafone/completed',
          'vodafone/connectivity',
          'vodafone/contact-us',
          'vodafone/country-or-international',
          'vodafone/customers-or-users',
          'vodafone/dashboard',
          'vodafone/data',
          'vodafone/delete',
          'vodafone/delivery',
          'vodafone/desktop',
          'vodafone/device-diagnostics',
          'vodafone/diagnostics',
          'vodafone/dislike',
          'vodafone/document-pdf',
          'vodafone/document',
          'vodafone/download-cloud',
          'vodafone/download',
          'vodafone/edit',
          'vodafone/enterprise',
          'vodafone/entertainment',
          'vodafone/error-circle',
          'vodafone/error-simple',
          'vodafone/filter',
          'vodafone/fixed-line',
          'vodafone/folder',
          'vodafone/grid-view',
          'vodafone/healthy-living',
          'vodafone/help-circle',
          'vodafone/home',
          'vodafone/info-circle',
          'vodafone/insurance',
          'vodafone/landline-or-call',
          'vodafone/like',
          'vodafone/list-view',
          'vodafone/location',
          'vodafone/log-in',
          'vodafone/log-out',
          'vodafone/mail-new',
          'vodafone/mail-read',
          'vodafone/menu',
          'vodafone/microphone',
          'vodafone/minus-or-less',
          'vodafone/minutes-sms',
          'vodafone/mobile',
          'vodafone/more',
          'vodafone/my-vodafone-or-profile',
          'vodafone/need-help',
          'vodafone/network-signal',
          'vodafone/notification',
          'vodafone/number-portability',
          'vodafone/pause-circle',
          'vodafone/pause',
          'vodafone/payg',
          'vodafone/payment',
          'vodafone/photos',
          'vodafone/pie-chart',
          'vodafone/ping',
          'vodafone/play-arrow',
          'vodafone/play-circle',
          'vodafone/pop-out',
          'vodafone/print',
          'vodafone/privacy-or-confidential',
          'vodafone/privacy',
          'vodafone/ratings-or-favourite',
          'vodafone/refresh',
          'vodafone/reply',
          'vodafone/reports',
          'vodafone/roaming',
          'vodafone/screen-size',
          'vodafone/search',
          'vodafone/security',
          'vodafone/settings',
          'vodafone/setup',
          'vodafone/share',
          'vodafone/shopping-checkout',
          'vodafone/shopping-trolley',
          'vodafone/sim-swap',
          'vodafone/sim',
          'vodafone/social-chat',
          'vodafone/social-facebook',
          'vodafone/social-google-plus',
          'vodafone/social-instagram',
          'vodafone/social-linkedin',
          'vodafone/social-paypal',
          'vodafone/social-pinterest',
          'vodafone/social-twitter',
          'vodafone/social-youtube',
          'vodafone/sound-off',
          'vodafone/sound',
          'vodafone/stop-circle',
          'vodafone/stop',
          'vodafone/store-offers',
          'vodafone/student',
          'vodafone/sync',
          'vodafone/tablet',
          'vodafone/tethering',
          'vodafone/text',
          'vodafone/tick-or-solved',
          'vodafone/tick-outline',
          'vodafone/top-up',
          'vodafone/topics',
          'vodafone/tv',
          'vodafone/unified-communication',
          'vodafone/upgrade',
          'vodafone/upload-cloud',
          'vodafone/upload',
          'vodafone/video',
          'vodafone/viewed',
          'vodafone/virus-protection',
          'vodafone/voice-of-vodafone-alerts',
          'vodafone/warning',
          'vodafone/website',
          'vodafone/weight',
          'vodafone/zoom-in',
          'vodafone/zoom-out'
        ],
        'vodafone/3g'
      ),
      size: select('Size', ['small', 'medium', 'large'], 'medium'),
      title: text('Title', 'Some Title')
    }
  }))
  .add('as background-image', () => ({
    template: `<div style="background: url(/public/icons/svg/notification/success.svg) no-repeat; width: 40px; height: 40px;"></div>`
  }))
  .add('as img', () => ({
    template: `<img src="/public/icons/svg/notification/success.svg" style="width: 75px; height: auto;" />`
  }))
  .add('with Label Flex', () => ({
    template: `<div style="display: flex; align-content: center;">
      <div><svg-icon name="notification/success" size="small"></svg-icon></div>
      <div>&nbsp;My directory</div>
    </div>`
  }))
  .add('with Label Inline', () => ({
    template: `<div><svg-icon name="notification/success" size="small"></svg-icon>&nbsp;My directory</div>`
  }))
  .add('with use in paragraph', () => ({
    template: `<p>This is some text with a <svg-icon name="notification/success" size="small"></svg-icon> icon.</p>`
  }))
  .add('with size auto, width 50%', () => ({
    template: `<div style="width: 50%;"><svg-icon name="notification/success" size="auto"></svg-icon></div>`
  }));
