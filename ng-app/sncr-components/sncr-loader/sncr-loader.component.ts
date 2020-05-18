import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'sncr-loader',
  templateUrl: 'sncr-loader.component.html',
  styleUrls: ['sncr-loader.component.scss']
})
export class SncrLoaderComponent implements OnInit {

  @Input() isLoading;

  isGeneric: boolean;

  ngOnInit(): void {
    if (this.isLoading === undefined) {
      this.isLoading = true;
      this.isGeneric = true;
    }
  }
}