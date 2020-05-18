import {Inject, Injectable} from '@angular/core';
import {
  ISOCode,
  L10N_CONFIG,
  L10nConfig,
  L10nConfigRef,
  L10nLoader,
  ProviderType,
  StorageStrategy,
  TranslationService
} from 'angular-l10n';
import {AppService} from '../../app/app.service';

@Injectable()
export class SncrTranslateService {
  static L10N_CONFIG: L10nConfig = {
    locale: {
      languages: [{code: 'en', dir: 'ltr'}, {code: 'de', dir: 'ltr'}],
      defaultLocale: {languageCode: 'de', countryCode: 'DE'},
      storage: StorageStrategy.Session
    },
    translation: {
      composedLanguage: [ISOCode.Language, ISOCode.Country]
    }
  };

  private prefix = '/buyflow/rest/localize/';

  constructor(
    private translation: TranslationService,
    private appService: AppService,
    public l10nLoader: L10nLoader,
    @Inject(L10N_CONFIG) private translationConfig: L10nConfigRef
  ) {}

  configureLocalisation(...bundleIds: string[]) {
    if (!bundleIds.length) {
      throw new Error(
        'SncrLocalisationService: bundleId must be a list of strings'
      );
    }

    this.appService.translationsLoading.emit(true);

    this.translationConfig.translation.caching = true;
    this.translationConfig.translation.providers = [];

    bundleIds.forEach(id => {
      if (!id.endsWith('/')) {
        id += '/';
      }
      this.translationConfig.translation.providers.push({
        type: ProviderType.WebAPI,
        path: this.prefix + id
      });
    });

    this.l10nLoader
      .load()
      .then(() => this.appService.translationsLoading.emit(false));
  }

  getTranslation(key, prefix = null, params = {}) {
    let translation = '';

    if (prefix) {
      const newKey = prefix + '-' + key;
      translation = this.translation.translate(newKey, params);
      if (translation === newKey) {
        translation = this.translation.translate(key, params);
      }
    } else {
      translation = this.translation.translate(key, params);
    }
    return translation;
  }
}
