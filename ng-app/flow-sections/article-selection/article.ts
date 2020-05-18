export class Article {

  public static articleCols = [
    {show: true, sortable: false, filter: false},
    {title: 'HARDWARE_SELECTION-COLUMN_NAME_AVAILABILITY', field: 'status', show: true, sortable: true,
      type: 'text', bodyTemplate: '', valueFunction: null},
    {title: 'HARDWARE_SELECTION-COLUMN_NAME_ARTICLE_NUMBER', field: 'articleNumber', show: true, sortable: true,
      type: 'text', bodyTemplate: ''},
    {title: 'HARDWARE_SELECTION-COLUMN_NAME_DEP', field: 'depCustomerId', show: true, sortable: true, width: '200px',
      type: 'text', bodyTemplate: ''},
    {title: 'HARDWARE_SELECTION-COLUMN_NAME_MANUFACTURE', field: 'manufacturer', show: true, sortable: true,
      type: 'text'},
    {title: 'HARDWARE_SELECTION-COLUMN_NAME_DESIGNATION', field: 'text', show: true, sortable: true,
      type: 'text'},
    {title: 'HARDWARE_SELECTION-COLUMN_NAME_CATEGORY', field: 'type', show: true, sortable: true,
      type: 'text'},
    {title: 'HARDWARE_SELECTION-COLUMN_NAME_PRICE', field: 'subsidizedPrice', show: true, sortable: true,
      type: 'price', bodyTemplate: ''}
  ];

  public static articleOptions = [
    {text: 'HARDWARE_SELECTION-CONTINUE_WITH_DELAYED_SUBSIDY', value: 2},
    {text: 'HARDWARE_SELECTION-CONTINUE_WITH_CREDIT_VOUCHER', value: 1},
    {text: 'HARDWARE_SELECTION-SELECT_NEW', value: 0}
  ];
}
