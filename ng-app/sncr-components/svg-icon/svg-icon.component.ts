import {Component, Input} from '@angular/core';

/**
 * Renders an icon that is provided as a Scalable Vector Graphics (SVG)
 * file in the `ng-app/public/icons/svg` directory.
 *
 * To prepare SVG files, i.e. removing unnecessary metadata and removing
 * metdata that would conflict otherwise, as well as optimizing it for to
 * load as fast as possible, run `npm run optimize:svg` after you've
 * added/updated an SVG file under the directory mentioned above.
 *
 * If necessary SVG parts can be styled via CSS.
 * In this case `::ng-deep` needs to be used as we want to style a third-party
 * component, e.g.
 *
 * `
 * .your-svg-icon ::ng-deep .person {
 *   stroke: #e60000;
 * }
 * `
 *
 * where `person` is the class on an SVG element inside your SVG.
 */
@Component({
  selector: 'svg-icon',
  templateUrl: 'svg-icon.component.html',
  styleUrls: ['svg-icon.component.scss']
})
export class SvgIconComponent {
  /**
   * The name of the SVG icon to be rendered without the SVG extension.
   * The name should be relative to the `ng-app/public/icons/svg` directory,
   * e.g. `arrows/up` for referring to the
   * `ng-app/public/icons/svg/arrows/up.svg` file.
   */
  @Input() name: string;

  /**
   * Defines whether the size of the icon should be `small`, `medium`, `large`
   * or `auto`.
   *
   * `small`: 16px<br>
   * `medium`: 32px<br>
   * `large`: 48px<br>
   * `auto`: use width of parent container, scale height preserving aspect ratio
   */
  @Input() size: 'small' | 'medium' | 'large' | 'auto';

  /**
   * A descriptive title of the SVG icon. Browsers usually render this as tooltip.
   */
  @Input() title?: string;
}
