module.exports = {
  'panels': [
    {
      'id': '31',
      'mandatory': false,
      'displayOrder': 1,
      'defaultExpanded': true,
      'label': 'Tarifauswahl',
      'contents': [
        [{'fieldId': '111', 'displayOrder': 0, 'validation': {'min': '1', 'max': '10', 'maxLength': '2', 'onlyNumbers': 'true'}, 'width': '4', 'inline': false, 'label': 'Anzahl neue Rufnummern (1)', 'type': 'text', 'required': 'true'}], [
          {
            'fieldId': '197',
            'displayOrder': 0,
            'width': '4',
            'inline': false,
            'label': 'Einzelverbindungsnachweis',
            'type': 'select',
            'required': 'true',
            'values': [{'label': 'EVN mit vollständiger Zielrufnummer', 'value': '1', 'displayOrder': 0}, {'label': 'Keine EVN', 'value': '2', 'displayOrder': 0}, {'label': 'EVN mit verkürzter Zielrufnummer', 'value': '3', 'displayOrder': 0}]
          }, {'fieldId': '198', 'displayOrder': 0, 'width': '4', 'inline': false, 'label': 'Rechnungsstellung', 'type': 'select', 'required': 'true', 'values': [{'label': 'Webbill', 'value': '1', 'displayOrder': 0}, {'label': 'elektronisch', 'value': '2', 'displayOrder': 0}, {'label': 'Papier', 'value': '3', 'displayOrder': 0}]}
        ]
      ],
      'isTariffPanel': 'true'
    }, {
      'id': '1', 'mandatory': false, 'displayOrder': 2, 'defaultExpanded': false, 'label': 'Standort des Anschlusses', 'contents': [
        [{'fieldId': '18', 'displayOrder': 0, 'validation': {'readonlyAndPrepopulate': '30', 'maxLength': '30'}, 'width': '4', 'inline': false, 'label': 'Straße', 'type': 'text', 'required': 'true'}], [
          {'fieldId': '19', 'displayOrder': 0, 'validation': {'readonlyAndPrepopulate': '30', 'maxLength': '10'}, 'width': '4', 'inline': false, 'label': 'Nr.', 'type': 'text', 'required': 'true'}, {
            'fieldId': '20',
            'displayOrder': 0,
            'validation': {'readonlyAndPrepopulate': '30', 'minLength': '5', 'maxLength': '5', 'onlyNumbers': 'true'},
            'width': '4',
            'inline': false,
            'label': 'PLZ',
            'type': 'text',
            'required': 'true'
          }, {'fieldId': '21', 'displayOrder': 0, 'validation': {'readonlyAndPrepopulate': '30', 'maxLength': '30'}, 'width': '4', 'inline': false, 'label': 'Ort', 'type': 'text', 'required': 'true'}
        ], [{'fieldId': '22', 'displayOrder': 0, 'width': '12', 'inline': false, 'label': 'Lagebezeichnung', 'type': 'label', 'required': 'false'}], [
          {'fieldId': '23', 'displayOrder': 0, 'validation': {'maxLength': '30'}, 'width': '4', 'inline': false, 'label': 'Gebäude', 'type': 'text', 'required': 'true'}, {'fieldId': '24', 'displayOrder': 0, 'validation': {'maxLength': '30'}, 'width': '4', 'inline': false, 'label': 'Etage', 'type': 'text', 'required': 'true'}, {
            'fieldId': '25',
            'displayOrder': 0,
            'validation': {'maxLength': '30'},
            'width': '4',
            'inline': false,
            'label': 'Raum',
            'type': 'text',
            'required': 'true'
          }
        ], [{'fieldId': '26', 'displayOrder': 0, 'validation': {'maxLength': '256'}, 'width': '4', 'inline': false, 'label': 'Genaue Lagebezeichnung für den Anschluss', 'type': 'text', 'required': 'false'}], [{'fieldId': '27', 'displayOrder': 0, 'width': '12', 'inline': false, 'label': 'Kontakt vor Ort', 'type': 'label', 'required': 'false'}], [
          {
            'fieldId': '28',
            'displayOrder': 0,
            'inline': false,
            'label': 'Anrede',
            'type': 'radio',
            'required': 'true',
            'values': [{'label': 'Herr', 'value': '1', 'displayOrder': 0}, {'label': 'Frau', 'value': '2', 'displayOrder': 0}]
          }, {'fieldId': '30', 'displayOrder': 0, 'validation': {'maxLength': '30'}, 'width': '4', 'inline': false, 'label': 'Vorname', 'type': 'text', 'required': 'true'}, {'fieldId': '31', 'displayOrder': 0, 'validation': {'maxLength': '30'}, 'width': '4', 'inline': false, 'label': 'Nachname', 'type': 'text', 'required': 'true'}
        ], [
          {'fieldId': '32', 'displayOrder': 0, 'validation': {'maxLength': '20', 'onlyNumbers': 'true'}, 'width': '4', 'inline': false, 'label': 'Mobilfunknummer', 'type': 'text', 'required': 'false'}, {'fieldId': '33', 'displayOrder': 0, 'validation': {'maxLength': '20', 'onlyNumbers': 'true'}, 'width': '4', 'inline': false, 'label': 'Rufnummer', 'type': 'text', 'required': 'true'}, {
            'fieldId': '34',
            'displayOrder': 0,
            'validation': {'maxLength': '20', 'onlyNumbers': 'true'},
            'width': '4',
            'inline': false,
            'label': 'Faxnummer',
            'type': 'text',
            'required': 'false'
          }
        ], [{'fieldId': '35', 'displayOrder': 0, 'validation': {'maxLength': '100', 'email': 'true'}, 'width': '4', 'inline': false, 'label': 'E-Mail-Adresse', 'type': 'text', 'required': 'true'}]
      ]
    }, {
      'id': '4', 'mandatory': false, 'displayOrder': 3, 'defaultExpanded': false, 'label': 'Vorhandener Anschluss und Rufnummern', 'contents': [
        [
          {'fieldId': '39', 'displayOrder': 0, 'width': '4', 'inline': false, 'label': 'Vorhandener Anschluss', 'type': 'select', 'required': 'false', 'values': [{'label': 'Neuanschluss', 'value': '1', 'displayOrder': 0}, {'label': 'Analog', 'value': '2', 'displayOrder': 0}, {'label': 'Mehrgeräteanschluss', 'value': '3', 'displayOrder': 0}, {'label': 'Anlagenanschluss', 'value': '4', 'displayOrder': 0}, {'label': 'PMX', 'value': '5', 'displayOrder': 0}]}, {
          'fieldId': '42', 'displayOrder': 0, 'width': '4', 'inline': false, 'label': 'DerzeitigeTelefongesellschaft', 'type': 'select', 'required': 'false', 'values': [
            {'label': 'DTAG', 'value': '1', 'displayOrder': 0}, {'label': '01026 Telecom', 'value': '2', 'displayOrder': 0}, {'label': '01029 Telecom', 'value': '3', 'displayOrder': 0}, {'label': '01035 Telecom', 'value': '4', 'displayOrder': 0}, {'label': '01051 Telecom GmbH', 'value': '5', 'displayOrder': 0}, {'label': '01058 TELECOM', 'value': '6', 'displayOrder': 0}, {'label': '01059 GmbH', 'value': '7', 'displayOrder': 0}, {
              'label': '01066 GmbH',
              'value': '8',
              'displayOrder': 0
            }, {'label': '01081TELECOM AG', 'value': '9', 'displayOrder': 0}, {'label': '1&1 AG', 'value': '10', 'displayOrder': 0}, {'label': '3U TELEKOMMUNIKATION', 'value': '11', 'displayOrder': 0}, {'label': 'ACC TELEKOMMUNIKATION', 'value': '12', 'displayOrder': 0}, {'label': 'ACCESS:SEVEN COMMUNICATIONS', 'value': '13', 'displayOrder': 0}, {'label': 'Accom', 'value': '14', 'displayOrder': 0}, {'label': 'ACCX TELEKOMMUNIKATION', 'value': '15', 'displayOrder': 0}, {
              'label': 'acoreus AG',
              'value': '16',
              'displayOrder': 0
            }, {'label': 'Andere', 'value': '17', 'displayOrder': 0}, {'label': 'ARCOR', 'value': '18', 'displayOrder': 0}, {'label': 'AugustaKom Telekommunikation', 'value': '19', 'displayOrder': 0}, {'label': 'BerliKomm (Versatel)', 'value': '20', 'displayOrder': 0}, {'label': 'BITEL', 'value': '21', 'displayOrder': 0}, {'label': 'BNT', 'value': '22', 'displayOrder': 0}, {'label': 'BreisNet', 'value': '23', 'displayOrder': 0}, {
              'label': 'Breitbandkabelgesellschaft',
              'value': '24',
              'displayOrder': 0
            }, {'label': 'BROADNET', 'value': '25', 'displayOrder': 0}, {'label': 'BT Ignite (Viag)', 'value': '26', 'displayOrder': 0}, {'label': 'Cable & Wireless Deutschland GmbH', 'value': '27', 'displayOrder': 0}, {'label': 'cablefone', 'value': '28', 'displayOrder': 0}, {'label': 'CALLAX', 'value': '29', 'displayOrder': 0}, {'label': 'Callino GmbH', 'value': '30', 'displayOrder': 0}, {'label': 'Carrier 1', 'value': '31', 'displayOrder': 0}, {
              'label': 'Catel Communications',
              'value': '32',
              'displayOrder': 0
            }, {'label': 'CHEMTEL', 'value': '33', 'displayOrder': 0}, {'label': 'CITYKOMMÜNSTER', 'value': '34', 'displayOrder': 0}, {'label': 'CNE', 'value': '35', 'displayOrder': 0}, {'label': 'Colt Telecom', 'value': '36', 'displayOrder': 0}, {'label': 'Congster GmbH', 'value': '37', 'displayOrder': 0}, {'label': 'CONNECTION 42', 'value': '38', 'displayOrder': 0}, {'label': 'Cybernet Internet Dienstleistungen', 'value': '39', 'displayOrder': 0}, {
              'label': 'Daten - und Telekommunikations-GmbH',
              'value': '40',
              'displayOrder': 0
            }, {'label': 'Detecon', 'value': '41', 'displayOrder': 0}, {'label': 'Deutsche LandTel', 'value': '42', 'displayOrder': 0}, {'label': 'DEUTSCHE TELEFON-UND MARKET SERVICE GMBH', 'value': '43', 'displayOrder': 0}, {'label': 'DNS:NET', 'value': '44', 'displayOrder': 0}, {'label': 'DOKOM', 'value': '45', 'displayOrder': 0}, {'label': 'dus.net GmbH', 'value': '46', 'displayOrder': 0}, {'label': 'E-Plus Mobilfunk', 'value': '47', 'displayOrder': 0}, {
              'label': 'ECN',
              'value': '48',
              'displayOrder': 0
            }, {'label': 'Econo Deutschland', 'value': '49', 'displayOrder': 0}, {'label': 'EconoPhone', 'value': '50', 'displayOrder': 0}, {'label': 'EINSTEINet', 'value': '51', 'displayOrder': 0}, {'label': 'EnBw', 'value': '52', 'displayOrder': 0}, {'label': 'Enco.Tel', 'value': '53', 'displayOrder': 0}, {'label': 'ENVIA.TEL', 'value': '54', 'displayOrder': 0}, {'label': 'ESTel', 'value': '55', 'displayOrder': 0}, {'label': 'ETS', 'value': '56', 'displayOrder': 0}, {
              'label': 'EWE TEL',
              'value': '57',
              'displayOrder': 0
            }, {'label': 'EWE TEL (NORDCOM)', 'value': '58', 'displayOrder': 0}, {'label': 'Extracom AG', 'value': '59', 'displayOrder': 0}, {'label': 'FaciliCom Telekommunikation', 'value': '60', 'displayOrder': 0}, {'label': 'FINISH INTERNATIONALE', 'value': '61', 'displayOrder': 0}, {'label': 'FIRST Telecom', 'value': '62', 'displayOrder': 0}, {'label': 'FREENET CITYLINE', 'value': '63', 'displayOrder': 0}, {'label': 'FristMark Communications', 'value': '64', 'displayOrder': 0}, {
              'label': 'G-FIT',
              'value': '65',
              'displayOrder': 0
            }, {'label': 'GELSEN-NET', 'value': '66', 'displayOrder': 0}, {'label': 'Gigabell', 'value': '67', 'displayOrder': 0}, {'label': 'GNT', 'value': '68', 'displayOrder': 0}, {'label': 'GÖTEL GMBH', 'value': '69', 'displayOrder': 0}, {'label': 'GROUP3 UMTS', 'value': '70', 'displayOrder': 0}, {'label': 'GTS', 'value': '71', 'displayOrder': 0}, {'label': 'Hansenet', 'value': '72', 'displayOrder': 0}, {'label': 'HEAG MediaNet', 'value': '73', 'displayOrder': 0}, {
              'label': 'HELINET',
              'value': '74',
              'displayOrder': 0
            }, {'label': 'Henken & Hormann', 'value': '75', 'displayOrder': 0}, {'label': 'HLKOMM', 'value': '76', 'displayOrder': 0}, {'label': 'HTP', 'value': '77', 'displayOrder': 0}, {'label': 'IN-TELEGENCE GMBH&CO.KG', 'value': '78', 'displayOrder': 0}, {'label': 'Intele', 'value': '79', 'displayOrder': 0}, {'label': 'INTERCROSS Deutschland', 'value': '80', 'displayOrder': 0}, {'label': 'Interoute Telecom Deutschland', 'value': '81', 'displayOrder': 0}, {
              'label': 'ISH GmbH & Co.KG',
              'value': '82',
              'displayOrder': 0
            }, {'label': 'JETZT', 'value': '83', 'displayOrder': 0}, {'label': 'Jippi GmbH', 'value': '84', 'displayOrder': 0}, {'label': 'K-Net', 'value': '85', 'displayOrder': 0}, {'label': 'Kabel Deutschland', 'value': '86', 'displayOrder': 0}, {'label': 'KABELBW', 'value': '87', 'displayOrder': 0}, {'label': 'Kabelfernsehen München', 'value': '88', 'displayOrder': 0}, {'label': 'KDD-Conos', 'value': '89', 'displayOrder': 0}, {
              'label': 'KEVAG Telekom',
              'value': '90',
              'displayOrder': 0
            }, {'label': 'KIELNET', 'value': '91', 'displayOrder': 0}, {'label': 'KINNEVIK TELECOMMUNICATIONS INTERNATIONA', 'value': '92', 'displayOrder': 0}, {'label': 'KPN', 'value': '93', 'displayOrder': 0}, {'label': 'LeuCom', 'value': '94', 'displayOrder': 0}, {'label': 'LEVEL 3 GmbH', 'value': '95', 'displayOrder': 0}, {'label': 'Long Distance International', 'value': '96', 'displayOrder': 0}, {'label': 'M NET', 'value': '97', 'displayOrder': 0}, {
              'label': 'Maestro Telecom',
              'value': '98',
              'displayOrder': 0
            }, {'label': 'MaterniSiebzehn GmbH', 'value': '99', 'displayOrder': 0}, {'label': 'MCIWORLDCOM', 'value': '100', 'displayOrder': 0}, {'label': 'mcn tele.com AG', 'value': '101', 'displayOrder': 0}, {'label': 'MDCC Magdeburg City-Com', 'value': '102', 'displayOrder': 0}, {'label': 'Mega Satellitenfernsehen', 'value': '103', 'displayOrder': 0}, {'label': 'MEOCOM GmbH & Co.', 'value': '104', 'displayOrder': 0}, {
              'label': 'MK Netzdienste GmbH & Co. KG',
              'value': '105',
              'displayOrder': 0
            }, {'label': 'MobilCom Multimedia GmbH', 'value': '106', 'displayOrder': 0}, {'label': 'MR.NET SERVICES', 'value': '107', 'displayOrder': 0}, {'label': 'NEFKOM', 'value': '108', 'displayOrder': 0}, {'label': 'NETCOLOGNE', 'value': '109', 'displayOrder': 0}, {'label': 'Netcom Kassel', 'value': '110', 'displayOrder': 0}, {'label': 'Netzquadrat GmbH', 'value': '111', 'displayOrder': 0}, {'label': 'NEXNET GmbH', 'value': '112', 'displayOrder': 0}, {
              'label': 'NEXT ID GMBH (TALKLINE)',
              'value': '113',
              'displayOrder': 0
            }, {'label': 'nordCom', 'value': '114', 'displayOrder': 0}, {'label': 'O2 GERMANY GMBH', 'value': '115', 'displayOrder': 0}, {'label': 'ONE.Tel GmbH', 'value': '116', 'displayOrder': 0}, {'label': 'Osnatel', 'value': '117', 'displayOrder': 0}, {'label': 'outbox AG', 'value': '118', 'displayOrder': 0}, {'label': 'PfalzKom', 'value': '119', 'displayOrder': 0}, {'label': 'PLUSNET', 'value': '120', 'displayOrder': 0}, {
              'label': 'PM2 Telecommunations',
              'value': '121',
              'displayOrder': 0
            }, {'label': 'PRIMACALL', 'value': '122', 'displayOrder': 0}, {'label': 'Primacom', 'value': '123', 'displayOrder': 0}, {'label': 'Primus Telecommunications', 'value': '124', 'displayOrder': 0}, {'label': 'PROMPT', 'value': '125', 'displayOrder': 0}, {'label': 'PTI', 'value': '126', 'displayOrder': 0}, {'label': 'Pulsaar', 'value': '127', 'displayOrder': 0}, {'label': 'QS Communication Service', 'value': '128', 'displayOrder': 0}, {
              'label': 'QSC',
              'value': '129',
              'displayOrder': 0
            }, {'label': 'QuickNet', 'value': '130', 'displayOrder': 0}, {'label': 'R-KOM', 'value': '131', 'displayOrder': 0}, {'label': 'Rapid Link Telecommunications', 'value': '132', 'displayOrder': 0}, {'label': 'RSLCOM Deutschland', 'value': '133', 'displayOrder': 0}, {'label': 'SDTelecom', 'value': '134', 'displayOrder': 0}, {'label': 'SEC Service', 'value': '135', 'displayOrder': 0}, {'label': 'SNT Multiconnect (Extracom AG)', 'value': '136', 'displayOrder': 0}, {
              'label': 'Sontheimer Datentechnik',
              'value': '137',
              'displayOrder': 0
            }, {'label': 'SpaceKomm', 'value': '138', 'displayOrder': 0}, {'label': 'STAR Telecommunications Deutschland', 'value': '139', 'displayOrder': 0}, {'label': 'Startec GLOBAL Communications', 'value': '140', 'displayOrder': 0}, {'label': 'streamgate AG', 'value': '141', 'displayOrder': 0}, {'label': 'T-ONLINE International', 'value': '142', 'displayOrder': 0}, {'label': 'T-Systems Business Services GmbH', 'value': '143', 'displayOrder': 0}, {
              'label': 'TALKLINE',
              'value': '144',
              'displayOrder': 0
            }, {'label': 'TelDaFax', 'value': '145', 'displayOrder': 0}, {'label': 'Tele Passport Service', 'value': '146', 'displayOrder': 0}, {'label': 'TELE2', 'value': '147', 'displayOrder': 0}, {'label': 'TeleBel', 'value': '148', 'displayOrder': 0}, {'label': 'TELECALL GMBH', 'value': '149', 'displayOrder': 0}, {'label': 'TELEDISCOUNT', 'value': '150', 'displayOrder': 0}, {'label': 'Telefonica Deutschland', 'value': '151', 'displayOrder': 0}, {
              'label': 'Telegate',
              'value': '152',
              'displayOrder': 0
            }, {'label': 'TeleLev Telekommunikation', 'value': '153', 'displayOrder': 0}, {'label': 'TelemaxX Telecommunikation GmbH', 'value': '154', 'displayOrder': 0}, {'label': 'TeleNEC', 'value': '155', 'displayOrder': 0}, {'label': 'Teleos', 'value': '156', 'displayOrder': 0}, {'label': 'TELEPASSPORTSERVICE', 'value': '157', 'displayOrder': 0}, {'label': 'Teleson', 'value': '158', 'displayOrder': 0}, {'label': 'Telia International Carrier GmbH', 'value': '159', 'displayOrder': 0}, {
              'label': 'Teliko',
              'value': '160',
              'displayOrder': 0
            }, {'label': 'tellfon GmbH', 'value': '161', 'displayOrder': 0}, {'label': 'TELTA Citynetz', 'value': '162', 'displayOrder': 0}, {'label': 'Tiscali Communications GmbH', 'value': '163', 'displayOrder': 0}, {'label': 'TNG NETWORK MANAGEMENT', 'value': '164', 'displayOrder': 0}, {'label': 'Tnp telenet potsdam', 'value': '165', 'displayOrder': 0}, {'label': 'toplink-Planet GmbH', 'value': '166', 'displayOrder': 0}, {
              'label': 'Tritone Telecom',
              'value': '167',
              'displayOrder': 0
            }, {'label': 'TROPOLYS (ElisaNet)', 'value': '168', 'displayOrder': 0}, {'label': 'Unitymedia', 'value': '169', 'displayOrder': 0}, {'label': 'ventelo', 'value': '170', 'displayOrder': 0}, {'label': 'VERSATEL', 'value': '171', 'displayOrder': 0}, {'label': 'VERSATEL-SÜD (TESION)', 'value': '172', 'displayOrder': 0}, {'label': 'VERSATEL WEST', 'value': '173', 'displayOrder': 0}, {'label': 'VERSATELNORD(KOMTEL)', 'value': '174', 'displayOrder': 0}, {
              'label': 'VIAG',
              'value': '175',
              'displayOrder': 0
            }, {'label': 'VIATEL Communications GmbH', 'value': '176', 'displayOrder': 0}, {'label': 'VSE Net', 'value': '177', 'displayOrder': 0}, {'label': 'Wikom Elektrik', 'value': '178', 'displayOrder': 0}, {'label': 'Wilhelmshavener TeleCommunikation', 'value': '179', 'displayOrder': 0}, {'label': 'wilhelm.tel', 'value': '180', 'displayOrder': 0}, {'label': 'wittenberg-net', 'value': '181', 'displayOrder': 0}, {'label': 'WOBCOM', 'value': '182', 'displayOrder': 0}, {
              'label': 'WuCom',
              'value': '183',
              'displayOrder': 0
            }, {'label': 'Yellow ACCESS', 'value': '184', 'displayOrder': 0}
          ]
        }
        ], [{'fieldId': '49', 'displayOrder': 0, 'width': '12', 'inline': false, 'label': 'Folgende weitere Rufnummern gehören zum Mehrgeräte-Anschluss', 'type': 'label', 'required': 'false'}], [
          {'fieldId': '44', 'displayOrder': 0, 'validation': {'minLength': '3', 'maxLength': '6', 'onlyNumbers': 'true'}, 'width': '4', 'inline': false, 'label': 'Vorwahl', 'type': 'text', 'required': 'false'}, {
            'fieldId': '51',
            'displayOrder': 0,
            'validation': {'minLength': '5', 'maxLength': '12', 'onlyNumbers': 'true'},
            'width': '4',
            'inline': false,
            'label': 'Rufnummer 1',
            'type': 'text',
            'required': 'false'
          }, {'fieldId': '52', 'displayOrder': 0, 'validation': {'minLength': '5', 'maxLength': '12', 'onlyNumbers': 'true'}, 'width': '4', 'inline': false, 'label': 'Rufnummer 2', 'type': 'text', 'required': 'false'}
        ], [
          {'fieldId': '53', 'displayOrder': 0, 'validation': {'minLength': '5', 'maxLength': '12', 'onlyNumbers': 'true'}, 'width': '4', 'inline': false, 'label': 'Rufnummer 3', 'type': 'text', 'required': 'false'}, {'fieldId': '54', 'displayOrder': 0, 'validation': {'minLength': '5', 'maxLength': '12', 'onlyNumbers': 'true'}, 'width': '4', 'inline': false, 'label': 'Rufnummer 4', 'type': 'text', 'required': 'false'}, {
            'fieldId': '55',
            'displayOrder': 0,
            'validation': {'minLength': '5', 'maxLength': '12', 'onlyNumbers': 'true'},
            'width': '4',
            'inline': false,
            'label': 'Rufnummer 5',
            'type': 'text',
            'required': 'false'
          }
        ], [
          {'fieldId': '56', 'displayOrder': 0, 'validation': {'minLength': '5', 'maxLength': '12', 'onlyNumbers': 'true'}, 'width': '4', 'inline': false, 'label': 'Rufnummer 6', 'type': 'text', 'required': 'false'}, {'fieldId': '57', 'displayOrder': 0, 'validation': {'minLength': '5', 'maxLength': '12', 'onlyNumbers': 'true'}, 'width': '4', 'inline': false, 'label': 'Rufnummer 7', 'type': 'text', 'required': 'false'}, {
            'fieldId': '58',
            'displayOrder': 0,
            'validation': {'minLength': '5', 'maxLength': '12', 'onlyNumbers': 'true'},
            'width': '4',
            'inline': false,
            'label': 'Rufnummer 8',
            'type': 'text',
            'required': 'false'
          }
        ], [{'fieldId': '59', 'displayOrder': 0, 'validation': {'minLength': '5', 'maxLength': '12', 'onlyNumbers': 'true'}, 'width': '4', 'inline': false, 'label': 'Rufnummer 9', 'type': 'text', 'required': 'false'}, {'fieldId': '60', 'displayOrder': 0, 'validation': {'minLength': '5', 'maxLength': '12', 'onlyNumbers': 'true'}, 'width': '4', 'inline': false, 'label': 'Rufnummer 10', 'type': 'text', 'required': 'false'}], [
          {
            'fieldId': '62',
            'displayOrder': 0,
            'validation': {'maxLength': '30'},
            'width': '4',
            'inline': false,
            'label': 'Anschlussinhaber Name',
            'type': 'text',
            'required': 'false'
          }, {'fieldId': '63', 'displayOrder': 0, 'validation': {'maxLength': '30'}, 'width': '4', 'inline': false, 'label': 'Vorname', 'type': 'text', 'required': 'false'}
        ], [{'fieldId': '64', 'displayOrder': 0, 'width': '12', 'inline': false, 'label': '<b>Rufnummern:</b> Sofern nicht anders gewünscht, erfolgt der Wechsel zu Vodafone mit Rufnummernübernahme.(2)', 'type': 'label', 'required': 'false'}], [{'fieldId': '66', 'displayOrder': 0, 'width': '12', 'inline': false, 'label': 'keine Übernahme der Rufnummern', 'type': 'checkbox', 'required': 'false'}]
      ]
    }, {'id': '8', 'mandatory': false, 'displayOrder': 4, 'defaultExpanded': false, 'label': 'Optionen', 'contents': [[{'fieldId': '72', 'displayOrder': 0, 'width': '12', 'inline': false, 'label': '<b>Optionen für Internet:</b>', 'type': 'label', 'required': 'false'}], [{'fieldId': '74', 'displayOrder': 0, 'width': '4', 'inline': false, 'label': 'Feste IP-Adresse', 'type': 'checkbox', 'required': 'false'}]]}, {
      'id': '12', 'mandatory': false, 'displayOrder': 6, 'defaultExpanded': false, 'label': 'Zusatzleistungen', 'contents': [
        [{'fieldId': '83', 'displayOrder': 0, 'width': '12', 'inline': false, 'label': 'Kostenlose Zusatzleistungen:', 'type': 'label', 'required': 'false'}], [
          {'fieldId': '85', 'displayOrder': 0, 'width': '4', 'inline': false, 'label': 'Sperre 0900-Rufnummern', 'type': 'checkbox', 'required': 'false'}, {'fieldId': '86', 'displayOrder': 0, 'width': '4', 'inline': false, 'label': 'Sperre Ausland', 'type': 'checkbox', 'required': 'false'}, {
            'fieldId': '87',
            'displayOrder': 0,
            'width': '4',
            'inline': false,
            'label': 'Ständige Rufnummernunterdrückung',
            'type': 'checkbox',
            'required': 'false'
          }
        ], [{'fieldId': '89', 'displayOrder': 0, 'width': '12', 'inline': false, 'label': 'Kostenpflichtige Zusatzleistungen:', 'type': 'label', 'required': 'false'}], [
          {'fieldId': '90', 'displayOrder': 0, 'width': '4', 'inline': false, 'label': 'Techniker-Service', 'type': 'checkbox', 'required': 'false'}, {'fieldId': '91', 'displayOrder': 0, 'defaultValue': 'true', 'width': '4', 'inline': false, 'label': 'Versand', 'type': 'checkbox', 'required': 'false'}, {
            'fieldId': '94',
            'displayOrder': 0,
            'width': '4',
            'inline': false,
            'label': 'Service Level classic plus',
            'type': 'checkbox',
            'required': 'false'
          }
        ], [{'fieldId': '95', 'displayOrder': 0, 'validation': {'maxLength': '100'}, 'width': '4', 'inline': false, 'label': 'Weitere Zusatzleistungen', 'type': 'label', 'required': 'false'}], [{'fieldId': '96', 'displayOrder': 0, 'validation': {'maxLength': '4', 'onlyNumbers': 'true'}, 'width': '4', 'inline': false, 'label': 'Aktionskennung', 'type': 'text', 'required': 'false'}], [
          {
            'fieldId': '179',
            'displayOrder': 0,
            'width': '12',
            'inline': false,
            'label': 'Von Vodafone bereitgestellte Hardware wird an den Standort des Anschlusses gesendet. Für eine abweichende Lieferanschrift geben Sie  diese bitte hier ein.',
            'type': 'label',
            'required': 'false'
          }
        ], [{'fieldId': '92', 'displayOrder': 0, 'width': '4', 'inline': false, 'label': 'Abweichende Lieferadresse', 'type': 'checkbox', 'required': 'false'}]
      ]
    }, {
      'id': '38',
      'mandatory': false,
      'displayOrder': 7,
      'hidden': 'fieldId(92) != true',
      'defaultExpanded': false,
      'label': 'Abweichende Lieferadresse',
      'contents': [
        [
          {'fieldId': '173', 'displayOrder': 0, 'validation': {'maxLength': '30'}, 'width': '4', 'inline': false, 'label': 'Firmenname bzw. Name', 'type': 'text', 'required': 'true'}, {'fieldId': '174', 'displayOrder': 0, 'validation': {'maxLength': '30'}, 'width': '4', 'inline': false, 'label': 'Vorname', 'type': 'text', 'required': 'false'}, {
          'fieldId': '175',
          'displayOrder': 0,
          'validation': {'maxLength': '30'},
          'width': '4',
          'inline': false,
          'label': 'Straße',
          'type': 'text',
          'required': 'true'
        }
        ], [
          {'fieldId': '176', 'displayOrder': 0, 'validation': {'maxLength': '10'}, 'width': '4', 'inline': false, 'label': 'Nr.', 'type': 'text', 'required': 'true'}, {'fieldId': '177', 'displayOrder': 0, 'validation': {'minLength': '5', 'maxLength': '5', 'onlyNumbers': 'true'}, 'width': '4', 'inline': false, 'label': 'PLZ', 'type': 'text', 'required': 'true'}, {
            'fieldId': '178',
            'displayOrder': 0,
            'validation': {'maxLength': '30'},
            'width': '4',
            'inline': false,
            'label': 'Ort',
            'type': 'text',
            'required': 'true'
          }
        ]
      ]
    }, {
      'id': '17',
      'mandatory': false,
      'displayOrder': 8,
      'defaultExpanded': false,
      'label': 'Vertragslaufzeit, Telefonbucheintrag und Termin',
      'contents': [
        [
          {'fieldId': '99', 'displayOrder': 0, 'width': '4', 'inline': false, 'label': 'Mindestvertragslaufzeit in Monaten', 'type': 'select', 'required': 'true', 'values': [{'label': '24', 'value': '24', 'displayOrder': 0}, {'label': '36', 'value': '36', 'displayOrder': 0}, {'label': '48', 'value': '48', 'displayOrder': 0}, {'label': '60', 'value': '60', 'displayOrder': 0}]}, {
          'fieldId': '100',
          'displayOrder': 0,
          'width': '4',
          'inline': false,
          'label': 'Telefonbucheintrag',
          'type': 'select',
          'required': 'false',
          'values': [{'label': 'Standard', 'value': '1', 'displayOrder': 0}, {'label': 'nicht gewünscht', 'value': '2', 'displayOrder': 0}]
        }
        ], [{'fieldId': '101', 'displayOrder': 0, 'width': '12', 'inline': false, 'label': 'Unverbindlicher Terminwunsch (Mo-Fr) (falls nicht schnellstmöglich)', 'type': 'label', 'required': 'false'}], [{'fieldId': '102', 'displayOrder': 0, 'validation': {'minDate': '+1'}, 'width': '4', 'inline': false, 'label': 'Terminwunsch', 'type': 'date', 'required': 'false'}]
      ]
    }, {
      'id': '39', 'mandatory': false, 'displayOrder': 9, 'defaultExpanded': false, 'label': 'Technischer Ansprechpartner', 'contents': [
        [{'fieldId': '186', 'displayOrder': 0, 'width': '12', 'inline': false, 'label': 'An den technischen Ansprechpartner werden die PIN Briefe versendet.', 'type': 'label', 'required': 'false'}], [
          {'fieldId': '187', 'displayOrder': 0, 'validation': {'maxLength': '30'}, 'width': '4', 'inline': false, 'label': 'Nachname', 'type': 'text', 'required': 'true'}, {
            'fieldId': '188',
            'displayOrder': 0,
            'validation': {'maxLength': '30'},
            'width': '4',
            'inline': false,
            'label': 'Vorname',
            'type': 'text',
            'required': 'false'
          }, {'fieldId': '189', 'displayOrder': 0, 'validation': {'maxLength': '30'}, 'width': '4', 'inline': false, 'label': 'Straße', 'type': 'text', 'required': 'true'}
        ], [
          {'fieldId': '190', 'displayOrder': 0, 'validation': {'maxLength': '10'}, 'width': '4', 'inline': false, 'label': 'Hausnummer', 'type': 'text', 'required': 'true'}, {'fieldId': '191', 'displayOrder': 0, 'validation': {'minLength': '5', 'maxLength': '5', 'onlyNumbers': 'true'}, 'width': '4', 'inline': false, 'label': 'PLZ', 'type': 'text', 'required': 'true'}, {
            'fieldId': '192',
            'displayOrder': 0,
            'validation': {'maxLength': '30'},
            'width': '4',
            'inline': false,
            'label': 'Ort',
            'type': 'text',
            'required': 'true'
          }
        ], [
          {'fieldId': '193', 'displayOrder': 0, 'validation': {'maxLength': '20', 'onlyNumbers': 'true'}, 'width': '4', 'inline': false, 'label': 'Telefon-Nr. für Rückfragen', 'type': 'text', 'required': 'true'}, {'fieldId': '194', 'displayOrder': 0, 'validation': {'maxLength': '20', 'onlyNumbers': 'true'}, 'width': '4', 'inline': false, 'label': 'Fax-Nr.', 'type': 'text', 'required': 'false'}, {
            'fieldId': '195',
            'displayOrder': 0,
            'validation': {'maxLength': '20', 'onlyNumbers': 'true'},
            'width': '4',
            'inline': false,
            'label': 'Mobil-Nr.',
            'type': 'text',
            'required': 'false'
          }
        ], [{'fieldId': '196', 'displayOrder': 0, 'validation': {'maxLength': '100', 'email': 'true'}, 'width': '4', 'inline': false, 'label': 'E-Mail', 'type': 'text', 'required': 'true'}]
      ]
    }, {
      'id': '24', 'mandatory': false, 'displayOrder': 10, 'defaultExpanded': false, 'label': 'Wichtige Hinweise', 'contents': [
        [{'fieldId': '133', 'displayOrder': 0, 'width': '12', 'inline': false, 'label': 'Bitte beachten Sie, dass bei einem Stromausfall ein Notruf (110 oder 112) nicht möglich ist.', 'type': 'label', 'required': 'false'}], [
          {
            'fieldId': '134',
            'displayOrder': 0,
            'width': '12',
            'inline': false,
            'label': 'Für Festnetz-Flat, Vodafone-Flat, Mobilfunk-Flat, Euro-Flat und International-Flat gelten besondere Nutzungseinschränkungen gemäß Ziffer 4 sowie eine besondere Kündigungsregelung gemäß Ziffer 5 der Preisliste.',
            'type': 'label',
            'required': 'false'
          }
        ], [
          {
            'fieldId': '135',
            'displayOrder': 0,
            'width': '12',
            'inline': false,
            'label': 'Die Nutzung von electronic cash ist beim Komfort-Anschluss Plus ausschließlich über LAN-Anschlüsse (DSL) möglich. Bitte setzen Sie sich mit Ihrem electronic cash Anbieter in Verbindung, falls Sie Ihr Terminal bislang über Analog- oder ISDN-Anschlüsse angebunden hatten. Die jeweils nutzbaren Leistungsmerkmale für den Komfort-Anschluss Classic bzw. Komfort-Anschluss Plus entnehmen Sie der Leistungsbeschreibung.',
            'type': 'label',
            'required': 'false'
          }
        ]
      ]
    }, {
      'id': '20', 'mandatory': false, 'displayOrder': 11, 'defaultExpanded': true, 'label': 'Fußnoten', 'contents': [
        [{'fieldId': '123', 'displayOrder': 0, 'width': '12', 'inline': false, 'label': '<sup>1</sup> Ein Komfort-Anschluss hat standard mäßig drei Rufnummern, maximal 10 können beantragt werden.', 'type': 'label', 'required': 'false'}], [
          {
            'fieldId': '122',
            'displayOrder': 0,
            'width': '12',
            'inline': false,
            'label': '<sup>2</sup> Bei einer Rufnummern übernahme beauftrage ich meine derzeitige Telefongesell schaft, die Portierung der Rufnummer zum Termin des tatsächlichen Wechsels durchzuführen und bevollmächtige Vodafone meiner derzeitigen Telefongesellschaft den Portierungsauftrag mitzuteilen.',
            'type': 'label',
            'required': 'false'
          }
        ], [{'fieldId': '124', 'displayOrder': 0, 'width': '12', 'inline': false, 'label': '<sup>3</sup> Ins jeweilige deutsche Netz, bei Euro- und International-Flat ins Festnetz der jeweils aufgeführten Länder lt. Preisliste - ausgenommen Sonderrufnummern.', 'type': 'label', 'required': 'false'}], [
          {
            'fieldId': '121',
            'displayOrder': 0,
            'width': '12',
            'inline': false,
            'label': 'Sofern der Anschluss nicht oder nicht ausschließlich auf meinen Namen angemeldet ist, versichere ich, dass ich befugt bin, den Wechsel auch für die übrigen Anschlussinhaber zu beauftragen. Ich beauftrage die o.g. Telefongesellschaft, Vodafone auf Anfrage für die o.g. Anschlüsse sämtliche Anschlussinhaber mitzuteilen.',
            'type': 'label',
            'required': 'false'
          }
        ], [{'fieldId': '120', 'displayOrder': 0, 'width': '12', 'inline': false, 'label': 'Hiermit kündige ich den Anschluss bei meiner derzeitigen Telefongesellschaft zum Termin des Wechsels zu Vodafone und bevollmächtige Vodafone, meiner derzeitigen Telefongesellschaft die Kündigung mitzuteilen.', 'type': 'label', 'required': 'false'}], [
          {
            'fieldId': '181',
            'displayOrder': 0,
            'width': '12',
            'inline': false,
            'label': 'Es ist kein Call-by-Call oder Preselect über andere Anbieter verfügbar.',
            'type': 'label',
            'required': 'false'
          }
        ]
      ]
    }
  ], 'tariffPanel': {
    'mandatory': false,
    'displayOrder': 0,
    'defaultExpanded': false,
    'tariffs': [{'displayType': 'radio', 'name': 'Professional XXL', 'id': '57f443b1-cbb8-0710-e053-404c070a04db', 'required': 'true', 'fieldId': '103'}],
    'socs': [
      {'fieldId': '80', 'displayType': 'checkbox', 'field': '57f443b1-cbf3-0710-e053-404c070a04db', 'title': 'Euro Flat', 'incl': false}, {'fieldId': '81', 'displayType': 'checkbox', 'field': '57f443b1-cbf4-0710-e053-404c070a04db', 'title': 'International Flat', 'incl': false}, {
        'fieldId': '78',
        'displayType': 'select',
        'field': '57f443b1-cbf5-0710-e053-404c070a04db',
        'title': 'Minutenpakete ins deutsche Mobilfunknetz',
        'incl': false,
        'values': [
          {'label': 'mobile minutes 60', 'value': 'mm60', 'displayOrder': 0}, {'label': 'mobile minutes 120 ', 'value': 'mm120 ', 'displayOrder': 0}, {'label': 'mobile minutes 240', 'value': 'mm240', 'displayOrder': 0}, {'label': 'mobile minutes 480', 'value': 'mm480', 'displayOrder': 0}, {'label': 'mobile minutes 600', 'value': 'mm600', 'displayOrder': 0}, {'label': 'mobile minutes 1200', 'value': 'mm1200', 'displayOrder': 0}, {
            'label': 'mobile minutes 2400',
            'value': 'mm2400',
            'displayOrder': 0
          }, {'label': 'mobile minutes 4800', 'value': 'mm4800', 'displayOrder': 0}
        ]
      }
    ]
  }
};
