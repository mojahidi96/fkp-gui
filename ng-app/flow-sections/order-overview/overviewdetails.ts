/**
 * Created by rsah0002 on 10/26/2018.
 */
import {DatatableModel} from '../../sncr-components/sncr-datatable/store/datatable.store';
import {AvailableTariffs} from '../tariff-selection/tariff';
import {PlannedChange} from '../../sncr-components/sncr-planned-changes/planned-change';

export interface Overviewdetails extends DatatableModel {
  selectedTariffGroup?: 'exist'|'new'|'none';
  selectedTariff?: any;
  existingTariffList?: AvailableTariffs;
  eligibleSubscribersForTariff?: number;
  isArticleNotRequired?: number;
  selectedArticle?: any;
  selectedAddress?: any;
  socSelections?: PlannedChange[];
  reloadSummary?: boolean;
  monthlyTotalValue?: number;
  monthlyTotalVAT?: number;
  oneTimeTotalValue?: number;
  oneTimeTotalVAT?: number;
  vatPercentage?: number;
  orderSubmitted?: boolean;
  orderRows?: any[];
  processing?: boolean;
  debitorDetails?: any;
  shipmentDetails?: any;
  eligibleSubsCountFormHardware?: number;
}
