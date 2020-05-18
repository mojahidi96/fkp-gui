export class EsimConfig {
  public static panelList = [
    {
      id: 1,
      title: 'ESIM_ALL-ORDER_DETAILS',
      selected: [],
      statusConfig: 'all'
    },
    {
      id: 2,
      title: 'ESIM_ORDER-FALLOUT_DETAILS',
      selected: [],
      statusConfig: 'order'
    },
    {
      id: 3,
      title: 'ESIM_TECHNICAL-FALLOUT_DETAILS',
      selected: [],
      statusConfig: 'technical'
    },
    {
      id: 4,
      title: 'ESIM_PDF-FALLOUT_DETAILS',
      selected: [],
      statusConfig: 'pdf'
    },
    {
      id: 5,
      title: 'ESIM_GENERAL-ERROR_DETAILS',
      selected: [],
      statusConfig: 'general'
    }
  ];

  public static defaultActivePanel = 2;

  public static defaultConfig = 'order';

}