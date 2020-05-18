module.exports = {
  "panels": [
  {
    "id": "11",
    "mandatory": false,
    "displayOrder": 1,
    "defaultExpanded": false,
    "label": "ATTACHMENTS",
    "contents": [
      [
        {
          "fieldId": "115",
          "displayOrder": 0,
          "width": "4",
          "label": "Attachments vorhanden",
          "type": "radio",
          "required": false,
          "values": [
            {
              "label": "Ja",
              "value": "1",
              "displayOrder": 0
            },
            {
              "label": "Nein",
              "value": "2",
              "displayOrder": 0
            }
          ]
        },
        {
          "fieldId": "116",
          "displayOrder": 0,
          "width": "4",
          "label": "Anzahl vorhandene Attachments",
          "type": "text",
          "required": false
        }
      ]
    ]
  },
  {
    "id": "12",
    "mandatory": false,
    "displayOrder": 1,
    "defaultExpanded": false,
    "label": "ADDITIONAL SERVICES",
    "contents": [
      [
        {
          "fieldId": "117",
          "displayOrder": 0,
          "width": "4",
          "label": "Ortsbegehung",
          "type": "radio",
          "required": false,
          "values": [
            {
              "label": "Ja",
              "value": "1",
              "displayOrder": 0
            },
            {
              "label": "Nein",
              "value": "2",
              "displayOrder": 0
            }
          ]
        },
        {
          "fieldId": "118",
          "displayOrder": 0,
          "width": "4",
          "label": "Option: Vor-Ort-Installationsservice",
          "type": "radio",
          "required": true,
          "values": [
            {
              "label": "Ja",
              "value": "1",
              "displayOrder": 0
            },
            {
              "label": "Nein",
              "value": "2",
              "displayOrder": 0
            }
          ]
        },
        {
          "fieldId": "119",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE Versand",
          "type": "radio",
          "required": true,
          "values": [
            {
              "label": "Ja",
              "value": "1",
              "displayOrder": 0
            },
            {
              "label": "Nein",
              "value": "2",
              "displayOrder": 0
            }
          ]
        }
      ]
    ]
  },
  {
    "id": "13",
    "mandatory": false,
    "displayOrder": 1,
    "defaultExpanded": false,
    "label": "RECHNUNGSKONTO",
    "contents": [
      [
        {
          "fieldId": "121",
          "displayOrder": 0,
          "width": "4",
          "label": "Neues Rechnungskonto anlegen?",
          "type": "radio",
          "required": true,
          "values": [
            {
              "label": "Ja",
              "value": "1",
              "displayOrder": 0
            },
            {
              "label": "Nein",
              "value": "2",
              "displayOrder": 0
            }
          ]
        },
        {
          "fieldId": "122",
          "displayOrder": 0,
          "width": "4",
          "label": "Firma1",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "123",
          "displayOrder": 0,
          "width": "4",
          "label": "Firma2",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "124",
          "displayOrder": 0,
          "width": "4",
          "label": "Neues Rechnungskonto Straße",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "125",
          "displayOrder": 0,
          "width": "4",
          "label": "Neues Rechnungskonto Hausnummer",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "126",
          "displayOrder": 0,
          "width": "4",
          "label": "Neues Rechnungskonto PLZ",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "127",
          "displayOrder": 0,
          "width": "4",
          "label": "Neues Rechnungskonto Ort",
          "type": "text",
          "required": false
        }
      ]
    ]
  },
  {
    "id": "1",
    "mandatory": false,
    "displayOrder": 1,
    "defaultExpanded": true,
    "label": "HEADER",
    "contents": [
      [
        {
          "fieldId": "1",
          "displayOrder": 0,
          "width": "4",
          "label": "Vodafone-Aufrtags Nummer",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "2",
          "displayOrder": 0,
          "width": "4",
          "label": "Interne Vodafone Auftragsnummer",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "3",
          "displayOrder": 0,
          "width": "4",
          "label": "Laufende Auftragsnummer Kunde",
          "type": "text",
          "required": true
        }
      ],
      [
        {
          "fieldId": "4",
          "displayOrder": 0,
          "width": "4",
          "label": "Kundeninterne Referenz",
          "type": "text",
          "required": true
        },
        {
          "fieldId": "5",
          "displayOrder": 0,
          "width": "4",
          "label": "SAP-Bestellnummer des Kunden",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "6",
          "displayOrder": 0,
          "width": "4",
          "label": "User-Name (Besteller)",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "7",
          "displayOrder": 0,
          "width": "4",
          "label": "Mandant",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "8",
          "displayOrder": 0,
          "width": "4",
          "label": "angelegt von",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "9",
          "displayOrder": 0,
          "width": "4",
          "label": "geändert von",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "10",
          "displayOrder": 0,
          "width": "4",
          "label": "importiert von",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "11",
          "displayOrder": 0,
          "width": "4",
          "label": "Erstelldatum / Zeitpunkt der Änderung",
          "type": "date",
          "required": false
        },
        {
          "fieldId": "12",
          "displayOrder": 0,
          "width": "4",
          "label": "letzte Statusänderung",
          "type": "date",
          "required": false
        }
      ],
      [
        {
          "fieldId": "13",
          "displayOrder": 0,
          "width": "12",
          "label": "Bemerkung",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "14",
          "displayOrder": 0,
          "width": "4",
          "label": "Unverbindlicher Kunden-Wunschtermin",
          "type": "date",
          "required": false
        }
      ]
    ]
  },
  {
    "id": "2",
    "mandatory": false,
    "displayOrder": 1,
    "defaultExpanded": false,
    "label": "REFERENCE_DATA",
    "contents": [
      [
        {
          "fieldId": "16",
          "displayOrder": 0,
          "width": "4",
          "label": "Service Nummer",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "15",
          "displayOrder": 0,
          "width": "4",
          "label": "Referenzauftragsnummer",
          "type": "text",
          "required": false
        }
      ]
    ]
  },
  {
    "id": "3",
    "mandatory": false,
    "displayOrder": 1,
    "defaultExpanded": false,
    "label": "ORDER_CONTEXT",
    "contents": [
      [
        {
          "fieldId": "17",
          "displayOrder": 0,
          "width": "4",
          "label": "Kundennummer",
          "type": "text",
          "required": true
        },
        {
          "fieldId": "18",
          "displayOrder": 0,
          "width": "4",
          "label": "Auftragsart",
          "type": "select",
          "required": true,
          "values": [
            {
              "label": "Kapazitätsanfrage",
              "value": "1",
              "displayOrder": 0
            },
            {
              "label": "Neubereitstellung",
              "value": "2",
              "displayOrder": 0
            },
            {
              "label": "Änderung SLA",
              "value": "3",
              "displayOrder": 0
            },
            {
              "label": "Änderung Bandbreite",
              "value": "4",
              "displayOrder": 0
            },
            {
              "label": "Änderung Realisierungsvariante",
              "value": "5",
              "displayOrder": 0
            },
            {
              "label": "Änderung Konfiguration",
              "value": "6",
              "displayOrder": 0
            },
            {
              "label": "Umzug",
              "value": "7",
              "displayOrder": 0
            },
            {
              "label": "Kündigung Service",
              "value": "8",
              "displayOrder": 0
            },
            {
              "label": "Auftrag Änderung",
              "value": "9",
              "displayOrder": 0
            },
            {
              "label": "Auftrag Storno",
              "value": "10",
              "displayOrder": 0
            }
          ]
        }
      ],
      [
        {
          "fieldId": "120",
          "displayOrder": 0,
          "width": "12",
          "label": "Rechnungskonto",
          "type": "text",
          "required": false
        }
      ]
    ]
  },
  {
    "id": "4",
    "mandatory": false,
    "displayOrder": 1,
    "defaultExpanded": false,
    "label": "STATUS",
    "contents": [
      [
        {
          "fieldId": "19",
          "displayOrder": 0,
          "width": "4",
          "label": "Status",
          "type": "select",
          "required": false,
          "values": [
            {
              "label": "Vorinformation in Prüfung",
              "value": "1",
              "displayOrder": 0
            },
            {
              "label": "Auftrag erteilt",
              "value": "2",
              "displayOrder": 0
            },
            {
              "label": "Auftrag in Prüfung",
              "value": "3",
              "displayOrder": 0
            },
            {
              "label": "Auftragseingang bestätigt",
              "value": "4",
              "displayOrder": 0
            },
            {
              "label": "Auftrag bestätigt",
              "value": "5",
              "displayOrder": 0
            },
            {
              "label": "Auftrag bereit zur Abnahme",
              "value": "6",
              "displayOrder": 0
            },
            {
              "label": "Technische Abnahme abgelehnt",
              "value": "7",
              "displayOrder": 0
            },
            {
              "label": "Technische Abnahme erteilt",
              "value": "8",
              "displayOrder": 0
            },
            {
              "label": "Auftrag zurückgewiesen",
              "value": "9",
              "displayOrder": 0
            },
            {
              "label": "Auftrag storniert",
              "value": "10",
              "displayOrder": 0
            },
            {
              "label": "Kündigung bestätigt",
              "value": "11",
              "displayOrder": 0
            },
            {
              "label": "Auftrag abgeschlossen",
              "value": "12",
              "displayOrder": 0
            },
            {
              "label": "Auftragsstorno bestätigt",
              "value": "13",
              "displayOrder": 0
            }
          ]
        },
        {
          "fieldId": "20",
          "displayOrder": 0,
          "width": "4",
          "label": "Order receive date",
          "type": "date",
          "required": false
        },
        {
          "fieldId": "21",
          "displayOrder": 0,
          "width": "4",
          "label": "Kommentar Status",
          "type": "date",
          "required": false
        }
      ]
    ]
  },
  {
    "id": "5",
    "mandatory": false,
    "displayOrder": 1,
    "defaultExpanded": false,
    "label": "PRODUCT",
    "contents": [
      [
        {
          "fieldId": "22",
          "displayOrder": 0,
          "width": "4",
          "label": "Mindestvertragslaufzeit",
          "type": "select",
          "required": true,
          "values": [
            {
              "label": "12",
              "value": "1",
              "displayOrder": 0
            },
            {
              "label": "24",
              "value": "2",
              "displayOrder": 0
            },
            {
              "label": "36",
              "value": "3",
              "displayOrder": 0
            },
            {
              "label": "48",
              "value": "4",
              "displayOrder": 0
            }
          ]
        },
        {
          "fieldId": "23",
          "displayOrder": 0,
          "width": "4",
          "label": "Produkt",
          "type": "select",
          "required": true,
          "values": [
            {
              "label": "DB WAN L3 Access",
              "value": "1",
              "displayOrder": 0
            },
            {
              "label": "DB WAN Internet Access",
              "value": "2",
              "displayOrder": 0
            },
            {
              "label": "DB WAN Core",
              "value": "3",
              "displayOrder": 0
            },
            {
              "label": "DB WAN Internet Transit Public",
              "value": "4",
              "displayOrder": 0
            }
          ]
        },
        {
          "fieldId": "24",
          "displayOrder": 0,
          "width": "4",
          "label": "Bandbreite",
          "type": "select",
          "required": true,
          "values": [
            {
              "label": "2 Mbit/s",
              "value": "1",
              "displayOrder": 0
            },
            {
              "label": "3 Mbit/s",
              "value": "2",
              "displayOrder": 0
            },
            {
              "label": "4 Mbit/s",
              "value": "3",
              "displayOrder": 0
            },
            {
              "label": "5 Mbit/s",
              "value": "4",
              "displayOrder": 0
            },
            {
              "label": "6 Mbit/s",
              "value": "5",
              "displayOrder": 0
            },
            {
              "label": "7 Mbit/s",
              "value": "6",
              "displayOrder": 0
            },
            {
              "label": "8 Mbit/s",
              "value": "7",
              "displayOrder": 0
            },
            {
              "label": "9 Mbit/s",
              "value": "8",
              "displayOrder": 0
            },
            {
              "label": "10 Mbit/s",
              "value": "9",
              "displayOrder": 0
            },
            {
              "label": "12 Mbit/s",
              "value": "10",
              "displayOrder": 0
            },
            {
              "label": "14 Mbit/s",
              "value": "11",
              "displayOrder": 0
            },
            {
              "label": "15 Mbit/s",
              "value": "12",
              "displayOrder": 0
            },
            {
              "label": "19 Mbit/s",
              "value": "13",
              "displayOrder": 0
            },
            {
              "label": "20 Mbit/s",
              "value": "14",
              "displayOrder": 0
            },
            {
              "label": "34 Mbit/s",
              "value": "15",
              "displayOrder": 0
            },
            {
              "label": "50 Mbit/s",
              "value": "16",
              "displayOrder": 0
            },
            {
              "label": "100 Mbit/s",
              "value": "17",
              "displayOrder": 0
            },
            {
              "label": "142 Mbit/s",
              "value": "18",
              "displayOrder": 0
            },
            {
              "label": "150 Mbit/s",
              "value": "19",
              "displayOrder": 0
            },
            {
              "label": "200 Mbit/s",
              "value": "20",
              "displayOrder": 0
            },
            {
              "label": "300 Mbit/s",
              "value": "21",
              "displayOrder": 0
            },
            {
              "label": "600 Mbit/s",
              "value": "22",
              "displayOrder": 0
            },
            {
              "label": "1000 Mbit/s",
              "value": "23",
              "displayOrder": 0
            },
            {
              "label": "2 Mbit/s",
              "value": "24",
              "displayOrder": 0
            },
            {
              "label": "6 Mbit/s",
              "value": "25",
              "displayOrder": 0
            },
            {
              "label": "7 Mbit/s",
              "value": "26",
              "displayOrder": 0
            },
            {
              "label": "16 Mbit/s",
              "value": "27",
              "displayOrder": 0
            },
            {
              "label": "21 Mbit/s",
              "value": "28",
              "displayOrder": 0
            },
            {
              "label": "50 Mbit/s",
              "value": "29",
              "displayOrder": 0
            },
            {
              "label": "200/50 Mbit/s",
              "value": "30",
              "displayOrder": 0
            },
            {
              "label": "1000 Mbit/s",
              "value": "31",
              "displayOrder": 0
            },
            {
              "label": "2 Mbit/s",
              "value": "32",
              "displayOrder": 0
            },
            {
              "label": "6 Mbit/s",
              "value": "33",
              "displayOrder": 0
            },
            {
              "label": "16 Mbit/s",
              "value": "34",
              "displayOrder": 0
            },
            {
              "label": "50 Mbit/s",
              "value": "35",
              "displayOrder": 0
            },
            {
              "label": "100 Mbit/s",
              "value": "36",
              "displayOrder": 0
            },
            {
              "label": "100 Gbit/s",
              "value": "37",
              "displayOrder": 0
            },
            {
              "label": "-",
              "value": "38",
              "displayOrder": 0
            },
            {
              "label": "-",
              "value": "39",
              "displayOrder": 0
            }
          ]
        }
      ],
      [
        {
          "fieldId": "25",
          "displayOrder": 0,
          "width": "4",
          "label": "Schnittstelle",
          "type": "select",
          "required": true,
          "values": [
            {
              "label": "Gigabit Ethernet",
              "value": "1",
              "displayOrder": 0
            },
            {
              "label": "Fast Ethernet",
              "value": "2",
              "displayOrder": 0
            },
            {
              "label": "Ethernet",
              "value": "3",
              "displayOrder": 0
            }
          ]
        },
        {
          "fieldId": "26",
          "displayOrder": 0,
          "width": "4",
          "label": "Redundanz",
          "type": "select",
          "required": true,
          "values": [
            {
              "label": "Basis",
              "value": "1",
              "displayOrder": 0
            },
            {
              "label": "Redundant",
              "value": "2",
              "displayOrder": 0
            },
            {
              "label": "Teilredundant",
              "value": "3",
              "displayOrder": 0
            }
          ]
        },
        {
          "fieldId": "27",
          "displayOrder": 0,
          "width": "4",
          "label": "Service-Level",
          "type": "select",
          "required": true,
          "values": [
            {
              "label": "A",
              "value": "1",
              "displayOrder": 0
            },
            {
              "label": "B",
              "value": "2",
              "displayOrder": 0
            },
            {
              "label": "C",
              "value": "3",
              "displayOrder": 0
            },
            {
              "label": "D",
              "value": "4",
              "displayOrder": 0
            },
            {
              "label": "E",
              "value": "5",
              "displayOrder": 0
            },
            {
              "label": "F",
              "value": "6",
              "displayOrder": 0
            },
            {
              "label": "G",
              "value": "7",
              "displayOrder": 0
            }
          ]
        }
      ],
      [
        {
          "fieldId": "28",
          "displayOrder": 0,
          "width": "4",
          "label": "Anschaltevariante",
          "type": "select",
          "required": false,
          "values": [
            {
              "label": "-",
              "value": "1",
              "displayOrder": 0
            },
            {
              "label": "L2-Access-CFV1",
              "value": "2",
              "displayOrder": 0
            },
            {
              "label": "L2-Access-CFV2",
              "value": "3",
              "displayOrder": 0
            },
            {
              "label": "L2-Access-DF",
              "value": "4",
              "displayOrder": 0
            },
            {
              "label": "L2-Access-Festverbindung",
              "value": "5",
              "displayOrder": 0
            },
            {
              "label": "L2-Access-SDSL",
              "value": "6",
              "displayOrder": 0
            },
            {
              "label": "L2-Access-SHDSL-BSA ",
              "value": "7",
              "displayOrder": 0
            },
            {
              "label": "L2-Access-SHDSL-CFV1",
              "value": "8",
              "displayOrder": 0
            },
            {
              "label": "L2-Access-SHDSL-CFV2",
              "value": "9",
              "displayOrder": 0
            },
            {
              "label": "L2-Access-SHDSL-TAL",
              "value": "10",
              "displayOrder": 0
            },
            {
              "label": "L2-Access-VHDSL",
              "value": "11",
              "displayOrder": 0
            },
            {
              "label": "L2-Access-VHDSL-BSA ",
              "value": "12",
              "displayOrder": 0
            },
            {
              "label": "L2-Access-WDM",
              "value": "13",
              "displayOrder": 0
            },
            {
              "label": "Company Dialog ADSL",
              "value": "14",
              "displayOrder": 0
            },
            {
              "label": "Company Dialog ADSL Regio",
              "value": "15",
              "displayOrder": 0
            },
            {
              "label": "Company Dialog Cable asym",
              "value": "16",
              "displayOrder": 0
            },
            {
              "label": "Company Dialog Mobile",
              "value": "17",
              "displayOrder": 0
            },
            {
              "label": "Company Dialog Region VDSL",
              "value": "18",
              "displayOrder": 0
            },
            {
              "label": "Company Dialog VDSL Regio",
              "value": "19",
              "displayOrder": 0
            },
            {
              "label": "Company Net Festverbindung",
              "value": "20",
              "displayOrder": 0
            },
            {
              "label": "Business Internet",
              "value": "21",
              "displayOrder": 0
            },
            {
              "label": "Business Internet DSL",
              "value": "22",
              "displayOrder": 0
            },
            {
              "label": "Internet Connect AS",
              "value": "23",
              "displayOrder": 0
            },
            {
              "label": "Dedicated Ethernet",
              "value": "24",
              "displayOrder": 0
            }
          ]
        },
        {
          "fieldId": "29",
          "displayOrder": 0,
          "width": "4",
          "label": "Zweiter Standort: Bandbreite",
          "type": "select",
          "required": false
        },
        {
          "fieldId": "30",
          "displayOrder": 0,
          "width": "4",
          "label": "EBS Monitor",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "31",
          "displayOrder": 0,
          "width": "4",
          "label": "Standort - ID",
          "type": "text",
          "required": false
        }
      ]
    ]
  },
  {
    "id": "6",
    "mandatory": false,
    "displayOrder": 1,
    "defaultExpanded": false,
    "label": "LOCATION_1",
    "contents": [
      [
        {
          "fieldId": "32",
          "displayOrder": 0,
          "width": "4",
          "label": "Erster Standort: Ort",
          "type": "text",
          "required": true
        },
        {
          "fieldId": "33",
          "displayOrder": 0,
          "width": "4",
          "label": "Erster Standort: Postleitzahl",
          "type": "text",
          "required": true
        },
        {
          "fieldId": "34",
          "displayOrder": 0,
          "width": "4",
          "label": "Erster Standort: Vorwahl",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "35",
          "displayOrder": 0,
          "width": "8",
          "label": "Erster Standort: Straße",
          "type": "text",
          "required": true
        },
        {
          "fieldId": "36",
          "displayOrder": 0,
          "width": "4",
          "label": "Erster Standort: Hausnummer",
          "type": "text",
          "required": true
        }
      ],
      [
        {
          "fieldId": "37",
          "displayOrder": 0,
          "width": "4",
          "label": "Erster Standort:Firmenname",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "38",
          "displayOrder": 0,
          "width": "8",
          "label": "Erster Standort:Zusatzinformationen",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "39",
          "displayOrder": 0,
          "width": "4",
          "label": "Erster Standort: Name, Vorname des Ansprechpartners vor Ort",
          "type": "text",
          "required": true
        },
        {
          "fieldId": "40",
          "displayOrder": 0,
          "width": "4",
          "label": "Erster Standort: Rufnummer des Ansprechpartners vor Ort",
          "type": "text",
          "required": true
        }
      ],
      [
        {
          "fieldId": "41",
          "displayOrder": 0,
          "width": "8",
          "label": "Erster Standort: Name, Vorname des Ansprechpartners",
          "type": "text",
          "required": true
        },
        {
          "fieldId": "42",
          "displayOrder": 0,
          "width": "4",
          "label": "Erster Standort: Rufnummer des Ansprechpartners",
          "type": "text",
          "required": true
        }
      ],
      [
        {
          "fieldId": "43",
          "displayOrder": 0,
          "width": "4",
          "label": "Erster Standort: Firma des Ansprechpartners vor Ort",
          "type": "text",
          "required": true
        },
        {
          "fieldId": "44",
          "displayOrder": 0,
          "width": "8",
          "label": "Erster Standort: Mailadresse des Ansprechpartners vor Ort",
          "type": "text",
          "required": true
        }
      ],
      [
        {
          "fieldId": "45",
          "displayOrder": 0,
          "width": "8",
          "label": "Erster Standort CPE: Gebäude",
          "type": "text",
          "required": true
        }
      ],
      [
        {
          "fieldId": "46",
          "displayOrder": 0,
          "width": "8",
          "label": "Erster Standort CPE: Etage",
          "type": "text",
          "required": true
        }
      ],
      [
        {
          "fieldId": "47",
          "displayOrder": 0,
          "width": "8",
          "label": "Erster Standort APL Gebäude",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "48",
          "displayOrder": 0,
          "width": "8",
          "label": "Erster Standort APL Etage",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "49",
          "displayOrder": 0,
          "width": "8",
          "label": "Erster Standort APL Raum",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "50",
          "displayOrder": 0,
          "width": "8",
          "label": "Erster Standort APL Zusatzinformation",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "51",
          "displayOrder": 0,
          "width": "8",
          "label": "Erster Standort Region",
          "type": "text",
          "required": true
        }
      ],
      [
        {
          "fieldId": "52",
          "displayOrder": 0,
          "width": "4",
          "label": "Erster Standort Standort-ID ",
          "type": "text",
          "required": false
        }
      ]
    ]
  },
  {
    "id": "7",
    "mandatory": false,
    "displayOrder": 1,
    "defaultExpanded": false,
    "label": "CPE",
    "contents": [
      [
        {
          "fieldId": "53",
          "displayOrder": 0,
          "width": "8",
          "label": "CPE Netzelementekennung",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "54",
          "displayOrder": 0,
          "width": "8",
          "label": "CPE Schnittstelle",
          "type": "text",
          "required": true
        }
      ],
      [
        {
          "fieldId": "55",
          "displayOrder": 0,
          "width": "8",
          "label": "CPE Parameter LAN-Schnittstelle",
          "type": "text",
          "required": true
        }
      ],
      [
        {
          "fieldId": "56",
          "displayOrder": 0,
          "width": "8",
          "label": "CPE Alternative Schnittstelle Bandbreite",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "57",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE IPv4-Netz",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "58",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE IPv4-Subnetzmaske",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "59",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE IPv4-Loopbackadresse",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "60",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE IP-Loopback Subnetzmaske",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "61",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE IPv4-Adresse",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "62",
          "displayOrder": 0,
          "width": "8",
          "label": "CPE VPN",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "63",
          "displayOrder": 0,
          "width": "8",
          "label": "CPE Gateway",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "64",
          "displayOrder": 0,
          "width": "8",
          "label": "CPE Koppel-Netz",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "65",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE Kaskadiertes LAN IPv4 Adresse",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "66",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE Kaskadiertes LAN IPv4 Netz",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "67",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE Kaskadiertes LAN IPv4 Netzmaske",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "68",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE IPv6 Netze",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "69",
          "displayOrder": 0,
          "width": "12",
          "label": "CPE IPv6 Bemerkung",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "70",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE IP-Adresse 2",
          "type": "text",
          "required": false
        }
      ]
    ]
  },
  {
    "id": "8",
    "mandatory": false,
    "displayOrder": 1,
    "defaultExpanded": false,
    "label": "LOCATION2",
    "contents": [
      [
        {
          "fieldId": "71",
          "displayOrder": 0,
          "width": "4",
          "label": "Zweiter Standort:",
          "type": "radio",
          "required": true,
          "values": [
            {
              "label": "Ja",
              "value": "1",
              "displayOrder": 0
            },
            {
              "label": "Nein",
              "value": "2",
              "displayOrder": 0
            }
          ]
        }
      ],
      [
        {
          "fieldId": "72",
          "displayOrder": 0,
          "width": "4",
          "label": "Zweiter Standort: Laufende Auftragsnummer Kunde",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "73",
          "displayOrder": 0,
          "width": "4",
          "label": "Zweiter Standort: Ort",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "74",
          "displayOrder": 0,
          "width": "4",
          "label": "Zweiter Standort: PLZ",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "75",
          "displayOrder": 0,
          "width": "8",
          "label": "Zweiter Standort: Straße",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "76",
          "displayOrder": 0,
          "width": "4",
          "label": "Zweiter Standort: Hausnummer",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "77",
          "displayOrder": 0,
          "width": "8",
          "label": "Zweiter Standort: Name, Vorname des Ansprechpartners vor Ort",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "78",
          "displayOrder": 0,
          "width": "4",
          "label": "Zweiter Standort: Rufnummer des Ansprechpartners vor Ort",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "79",
          "displayOrder": 0,
          "width": "8",
          "label": "Zweiter Standort: Name, Vorname des Ansprechpartners",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "80",
          "displayOrder": 0,
          "width": "4",
          "label": "Zweiter Standort: Rufnummer des Ansprechpartners",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "81",
          "displayOrder": 0,
          "width": "4",
          "label": "Zweiter Standort CPE Gebäude",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "82",
          "displayOrder": 0,
          "width": "4",
          "label": "Zweiter Standort CPE Etage",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "83",
          "displayOrder": 0,
          "width": "4",
          "label": "Zweiter Standort APL Gebäude",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "84",
          "displayOrder": 0,
          "width": "4",
          "label": "Zweiter Standort APL Etage",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "85",
          "displayOrder": 0,
          "width": "4",
          "label": "Zweiter Standort APL Raum",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "86",
          "displayOrder": 0,
          "width": "8",
          "label": "Zweiter Standort APL Zusatzinformation",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "87",
          "displayOrder": 0,
          "width": "4",
          "label": "Zweiter Standort  APL Vodafone Netzelementekennung",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "88",
          "displayOrder": 0,
          "width": "4",
          "label": "Zweiter Standort ID",
          "type": "text",
          "required": false
        }
      ]
    ]
  },
  {
    "id": "9",
    "mandatory": false,
    "displayOrder": 1,
    "defaultExpanded": false,
    "label": "CPE2",
    "contents": [
      [
        {
          "fieldId": "89",
          "displayOrder": 0,
          "width": "8",
          "label": "CPE2 Netzelementekennung",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "90",
          "displayOrder": 0,
          "width": "8",
          "label": "CPE2 Schnittstelle",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "91",
          "displayOrder": 0,
          "width": "8",
          "label": "CPE2 Parameter LAN-Schnittstelle",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "92",
          "displayOrder": 0,
          "width": "8",
          "label": "CPE2 Alternative Bandbreite",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "93",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE2 IPv4-Netz",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "94",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE2 IP-Subnetzmaske",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "95",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE2 IPv4-Loopbackadresse",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "96",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE2 IPv4-Loopback Subnetzmaske",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "97",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE2 IPv4-Adresse",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "98",
          "displayOrder": 0,
          "width": "8",
          "label": "CPE2 VPN",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "99",
          "displayOrder": 0,
          "width": "8",
          "label": "CPE2 Gateway",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "100",
          "displayOrder": 0,
          "width": "8",
          "label": "CPE2 Koppel-Netz",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "101",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE2 Kaskadiertes LAN IPv4 Adresse",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "102",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE2 Kaskadiertes LAN IPv4 Netz",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "103",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE2 Kaskadiertes LAN IPv4 Netzmaske",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "104",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE2 IPv6 Netze",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "105",
          "displayOrder": 0,
          "width": "4",
          "label": "CPE2 IPv6 Bemerkung",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "106",
          "displayOrder": 0,
          "width": "8",
          "label": "Zweiter Standort: Alternative Schnittstelle - Patchpanel-Steckertyp",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "107",
          "displayOrder": 0,
          "width": "8",
          "label": "Zweiter Standort: Alternative Schnittstelle Abschlusspunkt",
          "type": "text",
          "required": false
        }
      ]
    ]
  },
  {
    "id": "10",
    "mandatory": false,
    "displayOrder": 1,
    "defaultExpanded": false,
    "label": "CPE_DELIVERY_ADDRESS",
    "contents": [
      [
        {
          "fieldId": "108",
          "displayOrder": 0,
          "width": "4",
          "label": "Lieferadresse Hardware: Firmenname",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "109",
          "displayOrder": 0,
          "width": "4",
          "label": "Lieferadresse Hardware: Nachname",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "110",
          "displayOrder": 0,
          "width": "4",
          "label": "Lieferadresse Hardware: Vorname",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "111",
          "displayOrder": 0,
          "width": "4",
          "label": "Lieferadresse Hardware: Ort",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "112",
          "displayOrder": 0,
          "width": "4",
          "label": "Lieferadresse Hardware: Postleitzahl",
          "type": "text",
          "required": false
        },
        {
          "fieldId": "113",
          "displayOrder": 0,
          "width": "8",
          "label": "Lieferadresse Hardware: Straße",
          "type": "text",
          "required": false
        }
      ],
      [
        {
          "fieldId": "114",
          "displayOrder": 0,
          "width": "4",
          "label": "Lieferadresse Hardware: Hausnummer",
          "type": "text",
          "required": false
        }
      ]
    ]
  }
]
};
