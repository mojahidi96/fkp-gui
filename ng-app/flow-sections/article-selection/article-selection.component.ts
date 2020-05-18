import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Inject, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Language } from 'angular-l10n';
import { finalize } from 'rxjs/operators';
import { UtilsService } from '../../sncr-components/sncr-commons/utils.service';
import { NotificationHandlerService } from '../../sncr-components/sncr-notification/notification-handler.service';
import { ArticleSelectionService } from './article-selection.service';
import { Article } from './article';
import {TranslationService} from 'angular-l10n';

@Component({
  selector: 'article-selection',
  templateUrl: 'article-selection.component.html',
  styleUrls: ['article-selection.component.scss'],
  providers: [CurrencyPipe]
})
export class ArticleSelectionComponent implements OnInit {

  @ViewChild('article', {static: true}) articleColumn;
  @ViewChild('available', {static: true}) availableColumn;
  @ViewChild('imageColumn', {static: true}) imageColumn;
  @ViewChild('DEP', {static: true}) depColumn;
  @ViewChild('lookupDetailsListView') lookUpColumn;
  @ViewChild('subsidizedPrice', {static: true}) subsidizedPriceColumn;
  @ViewChild('content') content: TemplateRef<any>;
  @Output() output = new EventEmitter();
  @Output() isArticleNotRequiredChange = new EventEmitter();
  @Output() selectedHardware = new EventEmitter();
  @Input() isChanged: boolean;
  @Input() showValidation: boolean;
  @Input() selectedTariff: any;
  @Input() isArticleNotRequired = 3;
  @Input() selectedArticle: any;
  @Input() eligibleSubsCount: any;
  @Input() totalSubsCount: any;
  @Input() prefilled = false;
  @Input() prefix = '';
  @Input() orderType: any;
  @Input() showNewESimMessage = false;
  @Language() lang: string;

  private modalRef: NgbModalRef;
  category = '';
  categories = [];
  currentHardware = [];
  hardwareFirst = 0;
  hardwareRows = 1;
  manufacturer = '';
  manufacturers = [];
  maximumPrice = 0;
  priceRange = [0, 0];
  articlesProcessed = [];
  articlesPerPage = 6;
  isLoading: boolean;
  articleCols = [];
  showTiles = true;
  isDEPValid = true;
  depInvalidMessage: any;
  successMsg = 'HARDWARE_SELECTION-ELIGIBLE_SUBSCRIBER';
  articles: any;
  subsidy: any[];
  productDetails: any[];
  articleSelected: boolean;
  noSubscriberEligiable: boolean;
  loadingEliSubs: boolean;
  depCustId: any;
  description: any;
  url: any;
  articleHeader: string;
  urlText: any;
  alertForNoSubs: boolean;
  updatedPriceRange?: any;
  selectedDropDownValue: any;
  displaySubsidies = true;
  articleLookUpPrice: any;
  disableOnceClicked = false;
  status: any;
  isComponentLoaded = false;
  articleSelectionAlert: NotificationHandlerService;

  @Input() set reload(reload: boolean) {
    if (reload && this.isComponentLoaded) {
      this.ngOnInit();
    }
  }

  constructor(private modalService: NgbModal,
    private articleSelectionService: ArticleSelectionService,
              private translationService: TranslationService,
              @Inject('NotificationHandlerFactory') private notificationHandlerFactory) {
    this.articleSelectionAlert = notificationHandlerFactory();
  }

  ngOnInit(): void {
    this.isComponentLoaded = true;
    this.status = {
      'available': this.translationService.translate('HARDWARE_SELECTION-AVAILABLE_HARDWARE'),
      'not available': this.translationService.translate('HARDWARE_SELECTION-NO_RESPONSE_HARDWARE'),
      'no response': this.translationService.translate('HARDWARE_SELECTION-NO_RESPONSE_HARDWARE')
    };

    this.manufacturer = '';
    this.category = '';
    this.showTiles = true;
    this.disableOnceClicked = false;
    this.articleSelected = false;
    this.displaySubsidies = true;
    if (!this.prefilled) {
      this.isArticleNotRequired = 3;
    }

    this.loadSubsidies();
    if (this.isArticleNotRequired === 0) {
        this.loadArticles();
    }
    this.articleSelectionAlert.clearNotification();
  }

  loadSubsidies() {
    let subsidyOptions = [];
    this.isLoading = true;
    this.articleSelectionService.getAvailableSubsidies()
      .subscribe(value => {
        if (value && value.delayedSubsidy === 'true') {
          subsidyOptions.push(Article.articleOptions[0]);
        }
        if (value && value.creditVoucher === 'true') {
          subsidyOptions.push(Article.articleOptions[1]);
        }
        if (value && value.handy === 'true') {
          subsidyOptions.push(Article.articleOptions[2]);
        }
        this.subsidy = subsidyOptions;
        if (this.subsidy.length === 1 && this.subsidy[0].value === 0) {
          this.displaySubsidies = false;
          this.isArticleNotRequired = 0;
          this.loadArticles();
        } else {
          this.isLoading = false
        }
      });
  }

  loadArticles() {
    if (!this.prefilled) {
      this.selectedArticle = null;
    }
    this.articleSelectionAlert.clearNotification();
    this.articleSelected = !!this.selectedArticle;
    this.noSubscriberEligiable = false;
    this.alertForNoSubs = false;
    if (this.isArticleNotRequired === 0) {
      this.hardwareFirst = 0;
      this.loadAvaliableArticles();
    } else {
      delete this.selectedArticle;
      this.getEligibleSubsCount();
    }
    this.isArticleNotRequiredChange.emit(this.isArticleNotRequired);
  }

  getCount() {
    return UtilsService.flattenArray(this.articlesProcessed).length;
  }

  rangeChange(event) {
    let filtered = [];
    let val = {
      category: this.category,
      manufacturer: this.manufacturer
    };
    if (UtilsService.notNull(val)) {
      filtered = this.applyDropDownFilters(val);
    }
    if (filtered.length > 0) {
      filtered = this.applyFilterRange(event, filtered);
    }
    
    this.articlesProcessed = this.processArticles(filtered);
    this.currentHardware = this.articlesProcessed[0];
    this.updatedPriceRange = event.range;
    this.onPageChange({ first: 0 });
  }

  onPageChange(event) {
    const current = this.articlesProcessed[event.first] || [];
    // Trick to have always the same number of elements so flex works as a grid
    this.currentHardware = [...current, ...Array(this.articlesPerPage - current.length)];
    this.hardwareFirst = event.first;
  }

  dropDownChange() {
    let val = {
      category: this.category,
      manufacturer: this.manufacturer
    };
    let filtered = this.applyDropDownFilters(val);
    if (UtilsService.notNull(this.updatedPriceRange)) {
      filtered = this.applyFilterRange(this.updatedPriceRange, filtered);
    } else {
      filtered = this.applyFilterRange(this.priceRange, filtered);
    }
    this.articlesProcessed = this.processArticles(filtered);
    this.currentHardware = this.articlesProcessed[0];
    this.selectedDropDownValue = val;
    this.onPageChange({ first: 0 });
  }

  saveHardware() {
    let articleID = this.selectedArticle ? this.selectedArticle.value : null;
    this.alertForNoSubs = this.noSubscriberEligiable;
    if (this.alertForNoSubs && !this.isLoading && this.isArticleNotRequired === 0) {
      this.articleSelectionAlert.printErrorNotification('HARDWARE_SELECTION-SELECT_HARDWARE_ERR_MSG');
    }
    if (!(this.isLoading || this.loadingEliSubs)) {
      this.disableOnceClicked = true;
      if (this.isEligibleToContinue(articleID) && !this.noSubscriberEligiable) {
        this.articleSelectionService.saveSelectedSubsidies(this.isArticleNotRequired)
          .subscribe(() => {
            let data = {
              isArticleNotRequired: this.isArticleNotRequired,
              selectedArticle: null,
              eligibleSubsHardware: this.eligibleSubsCount
            };
            if (articleID != null) {
              this.articleSelectionService.saveSelectedHardware(articleID, this.depCustId)
                .subscribe(() => {
                  data.selectedArticle = this.selectedArticle;
                  this.disableOnceClicked = false;
                  this.output.emit(data)
                });
            } else {
              this.disableOnceClicked = false;
              this.output.emit(data);
            }
          }
          );
      } else {
        this.disableOnceClicked = false;
      }
    }
  }

  onArticleSelection(event) {
    this.articleSelectionAlert.clearNotification();
    this.selectedArticle = event;
    this.disableOnceClicked = false;
    this.selectedHardware.emit(this.selectedArticle);
    this.articleSelected = true;
    if (this.showTiles) {
      this.setRadioCheck();
    }
  }

  isEligibleToContinue(articleID) {
    this.articleSelectionAlert.clearNotification();
    this.depCustId = null;
    let pleaseSelectAtLeastOneOption = this.isArticleNotRequired === 3;
    if (pleaseSelectAtLeastOneOption) {
      this.disableOnceClicked = false;
      this.articleSelectionAlert.printErrorNotification('HARDWARE_SELECTION-SELECT_AT_LEAST_ONE_OPTION');
      return false;
    }
    if ((this.isArticleNotRequired === 1 || this.isArticleNotRequired === 2) && this.eligibleSubsCount === 0) {
      this.disableOnceClicked = false;
      this.articleSelectionAlert.printErrorNotification('HARDWARE_SELECTION-NO_SUBS_ELIGIBLE_WARNING');
      return false;
    }
    if (this.isArticleNotRequired === 0 && articleID === null) {
      this.disableOnceClicked = false;
      this.articleSelectionAlert.printErrorNotification('HARDWARE_SELECTION-SELECT_WARNING');
      return false;
    }
    if (this.isArticleNotRequired === 0) {
      this.validateDEPRegex();
      if (!this.isDEPValid) {
        this.disableOnceClicked = false;
        this.articleSelectionAlert.printErrorNotification(this.depInvalidMessage);
        return false;
      }
    }
    return true;
  }

  validateDEPRegex() {
    let selectedArticle = this.articles.find(a => a.value === this.selectedArticle.value);
    this.isDEPValid = true;
    if (selectedArticle.depRelevance !== '' && selectedArticle.depRelevance > 0 && selectedArticle.displayDep) {
      let regex = new RegExp(selectedArticle.depRegEx);
      this.depCustId = selectedArticle.depCustomerId;
      if (selectedArticle.depOverride) {
        this.isDEPValid = (!this.depCustId || this.depCustId === '') ? false : this.depCustId.match(regex);
        if (!this.isDEPValid) {
          this.depInvalidMessage = selectedArticle.depMessageKey;
        }
      }
    }
  }

  changeView(showTiles) {
    this.showTiles = showTiles;
    if (!showTiles && UtilsService.notNull(this.selectedArticle) && UtilsService.notNull(this.selectedArticle.articleNumber)) {
        this.setRadioCheck();
    }
  }

  setDepDescription(article) {
    this.description = article.description;
    this.url = article.url;
    this.urlText = article.urlText;
  }

  setLookUpPrice(article) {
    if (UtilsService.notNull(this.selectedTariff.existingTariffList)
        && UtilsService.notNull(this.selectedTariff.existingTariffList.tariffs)) {
        article.tariffLookupDetails.forEach( tariff => {
          tariff.count = this.getSubscriberCount(this.selectedTariff.existingTariffList.tariffs, tariff.tariffOption);
        });
    }
    this.articleLookUpPrice = article;
  }

  getSubscriberCount(tariffList: any[], tariffOption: string): number {
    let i = 0;
    tariffList.forEach( tariff => {
      if (tariff.tariffOption.toLowerCase() === tariffOption.toLowerCase()) {
        i = tariff.subsCount;
      }
    });
    return i;
  }

  openPopUp(article) {
    this.getProductDetails(article);
  }

  getProductDetails(article) {
    let productId = article.value;
    this.articleHeader = article.text;
    this.articleSelectionService.getProductDetails(productId).subscribe((response: any) => {
      this.productDetails = response;
      this.modalService.open(this.content, { backdrop: 'static' });
    });
  }

  loadAvaliableArticles() {
    this.isLoading = true;
    this.loadingEliSubs = true;
    this.articleSelectionService.getAvailableArticles()
      .subscribe(value => {
        let maxPrice = [...value].reduce((accumulator, article) => {
          return Math.max(accumulator, article.subsidizedPrice);
        }, this.maximumPrice);
        this.maximumPrice = this.priceRange[1] = Math.ceil(maxPrice);
        this.articleSelectionService.getDEPDetailsForShop().pipe(finalize(() => this.isLoading = false)).subscribe(shopDepDetails => {
          if (UtilsService.notNull(value)) {
            let articles = [...value];
            // setup image type map for article.
            // this will simplify the access of images, instead of looping in article and order review display.
            articles.forEach(a => {
              a.images = {};
              if (a.imagePaths) {
                a.imagePaths.forEach(i => {
                  a.images[i.type] = i.path;
                });
              }
              let depDetails = shopDepDetails[a.depRelevance];
              if (UtilsService.notNull(depDetails)) {
                a.depVendorName = depDetails.depVendorName;
                a.depVendorId = depDetails.depVendorId;
                a.depOverride = depDetails.depCustomerIdOverride === 'true';
                a.depRegEx = depDetails.depCustomerIDRegex;
                a.depMessageKey = depDetails.regexMessage;
                a.description = depDetails.description;
                a.url = depDetails.url;
                a.urlText = depDetails.urlText;
                a.displayDep = !UtilsService.isEmpty(depDetails.depCustomerId);
                a.depCustomerId = depDetails.depCustomerId;
              }
                if (this.selectedArticle && a.value === this.selectedArticle.value) {
                if (!this.selectedArticle.depCustomerId) {
                  a.displayDep = false;
                }
                a.depCustomerId = this.selectedArticle.depCustomerId;
                a._sncrChecked = 0;                
                this.selectedArticle = a;
              }
            });
            this.loadFilterOptions(articles);
            this.articlesProcessed = this.processArticles([...value]);
            this.currentHardware = [...this.articlesProcessed[0]];
            const valueFunction = status => this.status[status];
            const articleClos = Article.articleCols;
            articleClos[0].bodyTemplate = this.imageColumn;
            articleClos[1].bodyTemplate = this.availableColumn;
            articleClos[2].bodyTemplate = this.articleColumn;
            articleClos[3].bodyTemplate = this.depColumn;
            articleClos[7].bodyTemplate = this.subsidizedPriceColumn;
            articleClos[1].valueFunction = valueFunction;
            this.articles = [...articles];
            this.articleCols = articleClos;
          }
          // making the eligible subs call for hardware on the load
          this.articleSelectionService.getEligibleSubsCountHandy()
            .pipe(finalize(() => this.loadingEliSubs = false))
            .subscribe(eligibleSubs => {
              if (eligibleSubs !== 0) {
                this.eligibleSubsCount = eligibleSubs;
                this.noSubscriberEligiable = false;
              } else {
                this.noSubscriberEligiable = this.orderType !== 'ACTIVATE_SUBSCRIBER';
              }
            });
        });
      }
      );
  }

  loadFilterOptions(articles) {
    let categories = {};
    let manufacturers = {};
    articles.forEach(a => {
      categories[a.type] = a.type;
      manufacturers[a.manufacturer] = true;
    });
    this.manufacturers = Object.keys(manufacturers).sort().map(k => {
      return { value: k, text: k };
    });
    this.categories = Object.keys(categories).sort().map(k => {
      return { value: k, text: categories[k] };
    });
  }

  processArticles(articles) {
    let result = [];
    while (articles && articles.length) {
      result.push(articles.splice(0, this.articlesPerPage));
    }
    return result;
  }

  getEligibleSubsCount() {
    this.isLoading = true;
    this.articleSelectionService.getEligibleSubsCount(this.isArticleNotRequired)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(value => {
        this.eligibleSubsCount = value.subsidySubsCount;
        this.totalSubsCount = value.tariffSubsCount;
      });
  }

  private applyDropDownFilters(articleDetails: any) {
    return this.articles.filter(a => {
      let result = true;

      if (articleDetails.category !== '') {
        result = a.type === articleDetails.category;
      }
      if (articleDetails.manufacturer !== '' && result) {
        result = a.manufacturer === articleDetails.manufacturer;
      }
      return result;
    });
  }

  private applyFilterRange(range, articles) {
    range = range.map(r => parseInt(r, 10));
    return articles.filter(article => {
      return article.subsidizedPrice >= range[0] && article.subsidizedPrice <= range[1];
    });
  }

  private setRadioCheck() {
    this.articles.forEach(article => {
      if (this.selectedArticle && this.selectedArticle.articleNumber === article.articleNumber) {
        article._sncrChecked = 0;
      } else {
        article._sncrChecked = null;
      }
    });
  }

  public disableButton(): boolean {
    return this.isLoading || this.loadingEliSubs || this.disableOnceClicked;
  }
}
