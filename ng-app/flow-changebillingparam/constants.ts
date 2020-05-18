export class CONSTANTS {

  /*itOptions: Array<any>;
   targetNumberOptions: Array<any>;
   */
  itOptionsJson = {
    'Kein Einzelverbindungsnachweis': 'N',
    'Verbindungsübersicht Mini': 'M',
    'Verbindungsübersicht Super': 'S',
    'N': 'Kein Einzelverbindungsnachweis',
    'M': 'Verbindungsübersicht Mini',
    'S': 'Verbindungsübersicht Super'
  };

  tnOptionsJson = {
    'Ja': 'Y',
    'Nein': 'N',
    'Y': 'Ja',
    'N': 'Nein'
  };

  germanDescription = {
    'N': 'Kein Einzelverbindungsnachweis',
    'M': 'Einzelverbindungsnachweis Mini',
    'S': 'Einzelverbindungsnachweis Super\u00B9'
  };

  columnJson = {
    1: 'ban', 2: 'subNumber', 41: 'oldCallDetailType', 43: 'oldDigitMasked'
  };

  itOptionsIndex = {
    'N': 0,
    'M': 1,
    'S': 2
  };

  tnOptionsIndex = {
    'Y': 0,
    'N': 1
  };


  CONST_CD_INDEX = '41';

  CONST_DM_INDEX = '43';

  CONST_CD_INDEX_NEW = '041';

  CONST_DM_INDEX_NEW = '043';

  CONST_BN_INDEX = '1';

  CONST_SB_INDEX = '2';

  EMPTY_MESSAGE_FOUND = 'Kein Teilnehmer gefunden';

  CONST_CALL_DETAIL_TYPE_ID = '38';

  CONST_NUMBER_DIGIT_MASKED_ID = '41';

  technicalErrorText = `<b>Vorübergehende technische Störung</b><p></p>` +
    `Aufgrund einer Systemstörung steht Ihnen die gewünschte Internetseite zurzeit leider nicht zur Verfügung.` +
    ` Bitte versuchen Sie es später noch einmal.<p></p>Viele Grüße, Ihr Vodafone Team`;

  constructor() {

  }

  getProperties() {
    let mapList = new Map;
    mapList.set('add.label.pre', 'Sie aktivieren diese Einstellung für ');
    mapList.set('add.label.post', ' Teilnehmer.');
    mapList.set('remove.label.pre', 'Sie kündigen diese Tariftoption für ');
    mapList.set('remove.label.post', ' Teilnehmer.');
    mapList.set('subscriber.section.label', 'Bitte wählen Sie die Teilnehmer für die Verwaltung des Einzelverbindungsnachweises aus.');
    mapList.set('subscriber.next.button', 'Einzelverbindungsnachweis verwalten');
    return mapList;
  }


}