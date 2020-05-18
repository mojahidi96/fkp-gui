import {Component, Input, OnInit} from '@angular/core';
import {Footer} from './footer';
import {FooterService} from './footer.service';

@Component({
  selector: 'sncr-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.scss']
})
export class FooterComponent implements OnInit {

  @Input() showTariffDisclaimer = false;
  @Input() tariffDisclaimer;

  footer: Footer;

  constructor(private footerService: FooterService) {
    this.footer = new Footer;
  }

  ngOnInit(): void {
    this.footerService.getFooter()
      .then(items => this.footer = items);
  }
}
