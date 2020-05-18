import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {TranslationService} from 'angular-l10n';
import {UtilsService} from '../sncr-commons/utils.service';
import {SncrTranslateService} from './sncr-translate.service';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[sncrTranslate]'
})
export class SncrTranslateDirective implements AfterViewInit, OnChanges, OnDestroy {

  @Input() sncrTranslate: any;

  public get prefix() {
    return this._prefix;
  }

  public set prefix(str: string) {
    this.setPrefix(str);
  }

  private node: any;
  private currentKey: string;
  private originalKey: string;
  private _prefix: string;
  private textObserver: MutationObserver;
  private subscriptions$: Subscription[] = [];

  constructor(private translation: TranslationService, private el: ElementRef, private renderer: Renderer2,
              private sncrTranslateService: SncrTranslateService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.textObserver) {
      this.translate();
    }

    const self = changes['sncrTranslate'];
    if (self && !self.firstChange && self.previousValue && self.currentValue) {
      const newParams = Object.keys(self.currentValue).some(key => {
        return self.currentValue[key] !== self.previousValue[key];
      });
      if (newParams) {
        this.translate();
      }
    }
  }

  ngAfterViewInit(): void {
    this.node = this.el.nativeElement.childNodes[0];
    this.setPrefix();
    this.subscriptions$.push(this.translation.translationChanged().subscribe(() => this.translate()));
  }

  ngOnDestroy(): void {
    this.removeTextListener();
    this.subscriptions$.forEach(s => s.unsubscribe());
  }

  private addTextListener() {
    this.textObserver = new MutationObserver(() => {
      this.setPrefix();
    });
    this.textObserver.observe(this.node, {subtree: true, characterData: true});
  }

  private removeTextListener() {
    if (this.textObserver) {
      this.textObserver.disconnect();
    }
  }

  private setPrefix(str = '') {
    if (UtilsService.notNull(str)) {
      if (str !== '') {
        this._prefix = str.toUpperCase();
      }
      this.currentKey = this.node.nodeValue.trim();
      this.translate();
    }
  }

  private translate() {
    let value = this.sncrTranslateService.getTranslation(this.currentKey, this.prefix, this.sncrTranslate);
    if (!this.originalKey || value !== this.currentKey) {
      this.originalKey = this.currentKey;
    } else {
      value = this.sncrTranslateService.getTranslation(this.originalKey, this.prefix, this.sncrTranslate);
    }

    this.removeTextListener();
    this.renderer.setValue(this.node, value);
    this.addTextListener();
  }
}