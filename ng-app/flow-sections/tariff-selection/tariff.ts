import {Item} from '../item';

export class Tariff extends Item {

    familyName: string;
    amount: number;
    subsCount: number;
    tariffLookupPrice: number;
    specialMonthlyPrice: number;
    tariffOption: string;
}

export class AvailableTariffs {

    public static tariffCols = [
    {title: 'TARIFF_SELECTION-COLUMN_NAME_TARIFF', field: 'text', show: true, sortable: true, type: 'text', filter: true},
    {title: 'TARIFF_SELECTION-COLUMN_NAME_PRICE', field: 'amount', show: true, sortable: true, type: 'price', filter: true,
      bodyTemplate: null}
    ];

    tariffs: Tariff[];

}
