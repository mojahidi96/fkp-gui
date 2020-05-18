module.exports = {
  "panels": [
    {
      "id": "1",
      "mandatory": false,
      "displayOrder": 1,
      "defaultExpanded": true,
      "label": "Auftragskopf",
      "contents": [
        [
          {
            "fieldId": "1",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "Kundennummer",
            "type": "text",
            "required": "true"
          },
          {
            "fieldId": "2",
            "displayOrder": 0,
            "validation": {
              "onlyNumbers": "true",
              "maxLength": "20"
            },
            "width": "4",
            "label": "Rechnungskonto",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "10",
            "displayOrder": 0,
            "validation": {
              "maxLength": "35"
            },
            "width": "4",
            "show": "(fieldId(8) == 9 || fieldId(8) == 10)",
            "label": "Referenzauftragsnummer",
            "type": "text",
            "required": "true"
          }
        ],
        [
          {
            "fieldId": "5",
            "displayOrder": 0,
            "validation": {
              "maxLength": "35"
            },
            "width": "4",
            "label": "Laufende Auftragsnummer Kunde",
            "type": "text",
            "required": "true"
          },
          {
            "fieldId": "6",
            "displayOrder": 0,
            "validation": {
              "maxLength": "35"
            },
            "width": "4",
            "label": "SAP-Bestellnummer des Kunden",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "7",
            "displayOrder": 0,
            "validation": {
              "maxLength": "35"
            },
            "width": "4",
            "label": "Kundeninterne Referenz",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "8",
            "displayOrder": 0,
            "width": "4",
            "label": "Auftragsart",
            "type": "select",
            "required": "true",
            "values": [
              {
                "label": "Kapazitätsanfrage",
                "value": "1",
                "displayOrder": 1
              },
              {
                "label": "Neubestellung",
                "value": "2",
                "displayOrder": 2
              },
              {
                "label": "Änderung SLA",
                "value": "3",
                "displayOrder": 3
              },
              {
                "label": "Änderung Bandbreite",
                "value": "4",
                "displayOrder": 4
              },
              {
                "label": "Änderung Realisierungsvariante",
                "value": "5",
                "displayOrder": 5
              },
              {
                "label": "Änderung Konfiguration",
                "value": "6",
                "displayOrder": 6
              },
              {
                "label": "Umzug",
                "value": "7",
                "displayOrder": 7
              },
              {
                "label": "Kündigung Service",
                "value": "8",
                "displayOrder": 8
              },
              {
                "label": "Auftrag Änderung",
                "value": "9",
                "displayOrder": 9
              },
              {
                "label": "Auftrag Storno",
                "value": "10",
                "displayOrder": 10
              },
              {
                "label": "Angebotsanfrage",
                "value": "11",
                "displayOrder": 11
              }
            ]
          },
          {
            "fieldId": "13",
            "displayOrder": 0,
            "validation": {
              "minDate": "+0"
            },
            "width": "4",
            "label": "Unverbindlicher Kunden-Wunschtermin",
            "type": "date",
            "required": "false"
          },
          {
            "fieldId": "14",
            "displayOrder": 0,
            "width": "4",
            "label": "Prio?",
            "type": "radio",
            "required": "false",
            "values": [
              {
                "label": "Ja",
                "value": "1",
                "displayOrder": 1
              },
              {
                "label": "Nein",
                "value": "2",
                "displayOrder": 2
              }
            ]
          }
        ],
        [
          {
            "fieldId": "9",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "Projektname",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "11",
            "displayOrder": 0,
            "validation": {
              "maxLength": "35"
            },
            "width": "4",
            "show": "(fieldId(8) == 3 || fieldId(8) == 4 || fieldId(8) == 5 || fieldId(8) == 6 || fieldId(8) == 7 || fieldId(8) == 8)",
            "label": "Service Nummer",
            "type": "text",
            "required": "true"
          }
        ],
        [
          {
            "fieldId": "12",
            "displayOrder": 0,
            "validation": {
              "maxLength": "1000"
            },
            "width": "12",
            "label": "Bemerkung",
            "type": "text",
            "required": "false"
          }
        ]
      ]
    },
    {
      "id": "2",
      "mandatory": false,
      "displayOrder": 2,
      "defaultExpanded": false,
      "label": "Produkt",
      "contents": [
        [
          {
            "fieldId": "16",
            "displayOrder": 0,
            "width": "8",
            "label": "Produkt",
            "type": "select",
            "required": "(fieldId(8) == 2 || fieldId(8) == 4)",
            "values": [
              {
                "label": "DB WAN L2 Access",
                "value": "1",
                "displayOrder": 1
              },
              {
                "label": "DB WAN L3 Access",
                "value": "2",
                "displayOrder": 2
              },
              {
                "label": "DB WAN Internet Access",
                "value": "3",
                "displayOrder": 3
              },
              {
                "label": "DB WAN Core",
                "value": "4",
                "displayOrder": 5
              },
              {
                "label": "DB WAN Internet Transit Corporate",
                "value": "5",
                "displayOrder": 5
              },
              {
                "label": "DB WAN Internet Transit Public",
                "value": "6",
                "displayOrder": 6
              }
            ]
          },
          {
            "fieldId": "15",
            "displayOrder": 0,
            "width": "4",
            "label": "Mindestvertragslaufzeit",
            "type": "select",
            "required": "fieldId(8) == 2",
            "values": [
              {
                "label": "12",
                "value": "1",
                "displayOrder": 1
              },
              {
                "label": "24",
                "value": "2",
                "displayOrder": 2
              },
              {
                "label": "36",
                "value": "3",
                "displayOrder": 3
              },
              {
                "label": "48",
                "value": "4",
                "displayOrder": 4
              }
            ]
          }
        ],
        [
          {
            "fieldId": "17",
            "displayOrder": 0,
            "width": "8",
            "label": "Bandbreite",
            "type": "select",
            "required": "(fieldId(8) == 2 || fieldId(8) == 4)",
            "values": [
              {
                "label": "2 Mbit/s",
                "value": "1",
                "displayOrder": 1,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "3 Mbit/s",
                "value": "2",
                "displayOrder": 2,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "4 Mbit/s",
                "value": "3",
                "displayOrder": 3,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "5 Mbit/s",
                "value": "4",
                "displayOrder": 4,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "6 Mbit/s",
                "value": "5",
                "displayOrder": 5,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "7 Mbit/s",
                "value": "6",
                "displayOrder": 6,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "8 Mbit/s",
                "value": "7",
                "displayOrder": 7,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "9 Mbit/s",
                "value": "8",
                "displayOrder": 8,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "10 Mbit/s",
                "value": "9",
                "displayOrder": 9,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "12 Mbit/s",
                "value": "10",
                "displayOrder": 10,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "14 Mbit/s",
                "value": "11",
                "displayOrder": 11,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "15 Mbit/s",
                "value": "12",
                "displayOrder": 12,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "19 Mbit/s",
                "value": "13",
                "displayOrder": 13,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "20 Mbit/s",
                "value": "14",
                "displayOrder": 14,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "34 Mbit/s",
                "value": "15",
                "displayOrder": 15,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "50 Mbit/s",
                "value": "16",
                "displayOrder": 16,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "100 Mbit/s",
                "value": "17",
                "displayOrder": 17,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "142 Mbit/s",
                "value": "18",
                "displayOrder": 18,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "150 Mbit/s",
                "value": "19",
                "displayOrder": 19,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "200 Mbit/s",
                "value": "20",
                "displayOrder": 20,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "300 Mbit/s",
                "value": "21",
                "displayOrder": 21,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "600 Mbit/s",
                "value": "22",
                "displayOrder": 22,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "1000 Mbit/s",
                "value": "23",
                "displayOrder": 23,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "2 Mbit/s",
                "value": "24",
                "displayOrder": 24,
                "show": "fieldId(16) == 2"
              },
              {
                "label": "6 Mbit/s",
                "value": "25",
                "displayOrder": 25,
                "show": "fieldId(16) == 2"
              },
              {
                "label": "7 Mbit/s",
                "value": "26",
                "displayOrder": 26,
                "show": "fieldId(16) == 2"
              },
              {
                "label": "16 Mbit/s",
                "value": "27",
                "displayOrder": 27,
                "show": "fieldId(16) == 2"
              },
              {
                "label": "21 Mbit/s",
                "value": "28",
                "displayOrder": 28,
                "show": "fieldId(16) == 2"
              },
              {
                "label": "50 Mbit/s",
                "value": "29",
                "displayOrder": 29,
                "show": "fieldId(16) == 2"
              },
              {
                "label": "200/50 Mbit/s",
                "value": "30",
                "displayOrder": 30,
                "show": "fieldId(16) == 2"
              },
              {
                "label": "1000 Mbit/s",
                "value": "31",
                "displayOrder": 31,
                "show": "fieldId(16) == 2"
              },
              {
                "label": "2 Mbit/s",
                "value": "32",
                "displayOrder": 32,
                "show": "fieldId(16) == 3"
              },
              {
                "label": "6 Mbit/s",
                "value": "33",
                "displayOrder": 33,
                "show": "fieldId(16) == 3"
              },
              {
                "label": "16 Mbit/s",
                "value": "34",
                "displayOrder": 34,
                "show": "fieldId(16) == 3"
              },
              {
                "label": "50 Mbit/s",
                "value": "35",
                "displayOrder": 35,
                "show": "fieldId(16) == 3"
              },
              {
                "label": "100 Mbit/s",
                "value": "36",
                "displayOrder": 36,
                "show": "fieldId(16) == 3"
              },
              {
                "label": "100 Gbit/s",
                "value": "37",
                "displayOrder": 37,
                "show": "fieldId(16) == 4"
              },
              {
                "label": "-",
                "value": "38",
                "displayOrder": 38,
                "show": "fieldId(16) == 5"
              },
              {
                "label": "-",
                "value": "39",
                "displayOrder": 39,
                "show": "fieldId(16) == 6"
              }
            ]
          },
          {
            "fieldId": "20",
            "displayOrder": 0,
            "defaultValue": "8",
            "width": "4",
            "label": "Service-Level",
            "type": "select",
            "required": "fieldId(8) == 2 || fieldId(8) == 3",
            "values": [
              {
                "label": "A",
                "value": "1",
                "displayOrder": 1
              },
              {
                "label": "B",
                "value": "2",
                "displayOrder": 2
              },
              {
                "label": "C",
                "value": "3",
                "displayOrder": 3
              },
              {
                "label": "D",
                "value": "4",
                "displayOrder": 4
              },
              {
                "label": "E",
                "value": "5",
                "displayOrder": 5
              },
              {
                "label": "F",
                "value": "6",
                "displayOrder": 6
              },
              {
                "label": "I",
                "value": "7",
                "displayOrder": 7
              },
              {
                "label": "J",
                "value": "8",
                "displayOrder": 8
              },
              {
                "label": "K",
                "value": "9",
                "displayOrder": 9
              },
              {
                "label": "M",
                "value": "10",
                "displayOrder": 10
              },
              {
                "label": "N",
                "value": "11",
                "displayOrder": 11
              },
              {
                "label": "O",
                "value": "12",
                "displayOrder": 12
              },
              {
                "label": "P",
                "value": "13",
                "displayOrder": 13
              }
            ]
          }
        ],
        [
          {
            "fieldId": "18",
            "displayOrder": 0,
            "width": "8",
            "label": "Schnittstelle",
            "type": "select",
            "required": "fieldId(8) == 2",
            "values": [
              {
                "label": "Gigabit Ethernet",
                "value": "1",
                "displayOrder": 1
              },
              {
                "label": "Fast Ethernet",
                "value": "2",
                "displayOrder": 2
              },
              {
                "label": "Ethernet",
                "value": "3",
                "displayOrder": 3
              }
            ]
          },
          {
            "fieldId": "21",
            "displayOrder": 0,
            "width": "4",
            "label": "Anschaltevariante",
            "type": "select",
            "required": "fieldId(8) == 5",
            "values": [
              {
                "label": "-",
                "value": "1",
                "displayOrder": 1
              },
              {
                "label": "L2-Access-CFV1",
                "value": "2",
                "displayOrder": 2
              },
              {
                "label": "L2-Access-CFV2",
                "value": "3",
                "displayOrder": 3
              },
              {
                "label": "L2-Access-DF",
                "value": "4",
                "displayOrder": 4
              },
              {
                "label": "L2-Access-Festverbindung",
                "value": "5",
                "displayOrder": 5
              },
              {
                "label": "L2-Access-SDSL",
                "value": "6",
                "displayOrder": 6
              },
              {
                "label": "L2-Access-SHDSL-BSA ",
                "value": "7",
                "displayOrder": 7
              },
              {
                "label": "L2-Access-SHDSL-CFV1",
                "value": "8",
                "displayOrder": 8
              },
              {
                "label": "L2-Access-SHDSL-CFV2",
                "value": "9",
                "displayOrder": 9
              },
              {
                "label": "L2-Access-SHDSL-TAL",
                "value": "10",
                "displayOrder": 10
              },
              {
                "label": "L2-Access-VHDSL",
                "value": "11",
                "displayOrder": 11
              },
              {
                "label": "L2-Access-VHDSL-BSA ",
                "value": "12",
                "displayOrder": 12
              },
              {
                "label": "L2-Access-WDM",
                "value": "13",
                "displayOrder": 13
              },
              {
                "label": "Company Dialog ADSL",
                "value": "14",
                "displayOrder": 14
              },
              {
                "label": "Company Dialog ADSL Regio",
                "value": "15",
                "displayOrder": 15
              },
              {
                "label": "Company Dialog Cable asym",
                "value": "16",
                "displayOrder": 16
              },
              {
                "label": "Company Dialog Mobile",
                "value": "17",
                "displayOrder": 17
              },
              {
                "label": "Company Dialog Region VDSL",
                "value": "18",
                "displayOrder": 18
              },
              {
                "label": "Company Dialog VDSL Regio",
                "value": "19",
                "displayOrder": 19
              },
              {
                "label": "Company Net Festverbindung",
                "value": "20",
                "displayOrder": 20
              },
              {
                "label": "Business Internet",
                "value": "21",
                "displayOrder": 21
              },
              {
                "label": "Business Internet DSL",
                "value": "22",
                "displayOrder": 22
              },
              {
                "label": "Internet Connect AS",
                "value": "23",
                "displayOrder": 23
              },
              {
                "label": "Dedicated Ethernet",
                "value": "24",
                "displayOrder": 24
              }
            ]
          }
        ],
        [
          {
            "fieldId": "19",
            "displayOrder": 0,
            "width": "4",
            "label": "Redundanz",
            "type": "select",
            "required": "false",
            "values": [
              {
                "label": "Basis",
                "value": "1",
                "displayOrder": 1
              },
              {
                "label": "Redundant",
                "value": "2",
                "displayOrder": 2
              },
              {
                "label": "Teilredundant",
                "value": "3",
                "displayOrder": 3
              }
            ]
          },
          {
            "fieldId": "22",
            "displayOrder": 0,
            "defaultValue": "42",
            "width": "4",
            "label": "Zwelter Standort: Bandbreite",
            "type": "select",
            "required": "false",
            "values": [
              {
                "label": "-",
                "value": "42",
                "displayOrder": 1
              },
              {
                "label": "2 Mbit/s",
                "value": "2",
                "displayOrder": 2,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "3 Mbit/s",
                "value": "3",
                "displayOrder": 3,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "4 Mbit/s",
                "value": "4",
                "displayOrder": 4,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "5 Mbit/s",
                "value": "5",
                "displayOrder": 5,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "6 Mbit/s",
                "value": "6",
                "displayOrder": 6,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "7 Mbit/s",
                "value": "7",
                "displayOrder": 7,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "8 Mbit/s",
                "value": "8",
                "displayOrder": 8,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "9 Mbit/s",
                "value": "9",
                "displayOrder": 9,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "10 Mbit/s",
                "value": "10",
                "displayOrder": 10,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "12 Mbit/s",
                "value": "11",
                "displayOrder": 11,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "14 Mbit/s",
                "value": "12",
                "displayOrder": 12,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "15 Mbit/s",
                "value": "13",
                "displayOrder": 13,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "19 Mbit/s",
                "value": "14",
                "displayOrder": 14,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "20 Mbit/s",
                "value": "15",
                "displayOrder": 15,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "34 Mbit/s",
                "value": "16",
                "displayOrder": 16,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "50 Mbit/s",
                "value": "17",
                "displayOrder": 17,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "100 Mbit/s",
                "value": "18",
                "displayOrder": 18,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "142 Mbit/s",
                "value": "19",
                "displayOrder": 19,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "150 Mbit/s",
                "value": "20",
                "displayOrder": 20,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "200 Mbit/s",
                "value": "21",
                "displayOrder": 21,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "300 Mbit/s",
                "value": "22",
                "displayOrder": 22,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "600 Mbit/s",
                "value": "23",
                "displayOrder": 23,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "1000 Mbit/s",
                "value": "24",
                "displayOrder": 24,
                "show": "fieldId(16) == 1"
              },
              {
                "label": "2 Mbit/s",
                "value": "26",
                "displayOrder": 26,
                "show": "fieldId(16) == 2"
              },
              {
                "label": "6 Mbit/s",
                "value": "27",
                "displayOrder": 27,
                "show": "fieldId(16) == 2"
              },
              {
                "label": "7 Mbit/s",
                "value": "28",
                "displayOrder": 28,
                "show": "fieldId(16) == 2"
              },
              {
                "label": "16 Mbit/s",
                "value": "29",
                "displayOrder": 29,
                "show": "fieldId(16) == 2"
              },
              {
                "label": "21 Mbit/s",
                "value": "30",
                "displayOrder": 30,
                "show": "fieldId(16) == 2"
              },
              {
                "label": "50 Mbit/s",
                "value": "31",
                "displayOrder": 31,
                "show": "fieldId(16) == 2"
              },
              {
                "label": "200/50 Mbit/s",
                "value": "32",
                "displayOrder": 32,
                "show": "fieldId(16) == 2"
              },
              {
                "label": "1000 Mbit/s",
                "value": "33",
                "displayOrder": 33,
                "show": "fieldId(16) == 2"
              },
              {
                "label": "2 Mbit/s",
                "value": "35",
                "displayOrder": 35,
                "show": "fieldId(16) == 3"
              },
              {
                "label": "6 Mbit/s",
                "value": "36",
                "displayOrder": 36,
                "show": "fieldId(16) == 3"
              },
              {
                "label": "16 Mbit/s",
                "value": "37",
                "displayOrder": 37,
                "show": "fieldId(16) == 3"
              },
              {
                "label": "50 Mbit/s",
                "value": "38",
                "displayOrder": 38,
                "show": "fieldId(16) == 3"
              },
              {
                "label": "100 Mbit/s",
                "value": "39",
                "displayOrder": 39,
                "show": "fieldId(16) == 3"
              },
              {
                "label": "100 Gbit/s",
                "value": "41",
                "displayOrder": 41,
                "show": "fieldId(16) == 4"
              }
            ]
          },
          {
            "fieldId": "23",
            "displayOrder": 0,
            "defaultValue": "1",
            "width": "4",
            "label": "Service Monitor?",
            "type": "radio",
            "required": "false",
            "values": [
              {
                "label": "Ja",
                "value": "1",
                "displayOrder": 1
              },
              {
                "label": "Nein",
                "value": "2",
                "displayOrder": 2
              }
            ]
          }
        ]
      ]
    },
    {
      "id": "3",
      "mandatory": false,
      "displayOrder": 3,
      "defaultExpanded": false,
      "label": "Erster Standort",
      "contents": [
        [
          {
            "fieldId": "25",
            "displayOrder": 0,
            "validation": {
              "maxLength": "30"
            },
            "width": "4",
            "label": "Standort-ID",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "24",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "4",
            "label": "Region",
            "type": "text",
            "required": "fieldId(8) == 1 || fieldId(8) == 2 || fieldId(8) == 7"
          },
          {
            "fieldId": "26",
            "displayOrder": 0,
            "validation": {
              "minLength": "3",
              "onlyNumbers": "true",
              "maxLength": "6",
              "startWith": "0"
            },
            "width": "4",
            "label": "Vorwahl",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "31",
            "displayOrder": 0,
            "validation": {
              "maxLength": "30"
            },
            "width": "4",
            "label": "Firmenname",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "29",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "4",
            "label": "Straße",
            "type": "text",
            "required": "fieldId(8) == 1 || fieldId(8) == 2 || fieldId(8) == 7"
          },
          {
            "fieldId": "30",
            "displayOrder": 0,
            "validation": {
              "maxLength": "10"
            },
            "width": "4",
            "label": "Hausnummer",
            "type": "text",
            "required": "fieldId(8) == 1 || fieldId(8) == 2 || fieldId(8) == 7"
          }
        ],
        [
          {
            "fieldId": "27",
            "displayOrder": 0,
            "validation": {
              "maxLength": "7"
            },
            "width": "4",
            "label": "PLZ",
            "type": "text",
            "required": "fieldId(8) == 1 || fieldId(8) == 2 || fieldId(8) == 7"
          },
          {
            "fieldId": "28",
            "displayOrder": 0,
            "validation": {
              "maxLength": "40"
            },
            "width": "4",
            "label": "Ort",
            "type": "text",
            "required": "fieldId(8) == 1 || fieldId(8) == 2 || fieldId(8) == 7"
          }
        ],
        [
          {
            "fieldId": "37",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "CPE: Gebäude, Etage, Raum",
            "type": "text",
            "required": "fieldId(8) == 1 || fieldId(8) == 2 || fieldId(8) == 7"
          }
        ],
        [
          {
            "fieldId": "38",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "APL: Gebäude, Etage, Raum",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "39",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "APL: Zusatzinformation",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "32",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "Standort - Zusatzinformationen",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "201",
            "displayOrder": 0,
            "width": "12",
            "label": "Ansprechpartner ver Ort",
            "type": "label"
          }
        ],
        [
          {
            "fieldId": "34",
            "displayOrder": 0,
            "validation": {
              "maxLength": "30"
            },
            "width": "4",
            "label": "Firma des Ansprechpartners ",
            "type": "text",
            "required": "fieldId(8) == 1 || fieldId(8) == 2 || fieldId(8) == 7"
          },
          {
            "fieldId": "33",
            "displayOrder": 0,
            "validation": {
              "maxLength": "30"
            },
            "width": "4",
            "label": "Name des Ansprechpartners",
            "type": "text",
            "required": "fieldId(8) == 1 || fieldId(8) == 2 || fieldId(8) == 7"
          },
          {
            "fieldId": "35",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "Rufnummer des Ansprechpartners",
            "type": "text",
            "required": "fieldId(8) == 1 || fieldId(8) == 2 || fieldId(8) == 7"
          }
        ],
        [
          {
            "fieldId": "36",
            "displayOrder": 0,
            "validation": {
              "email": "true",
              "maxLength": "100"
            },
            "width": "12",
            "label": "E-Mail-Adresse des Ansprechpartners",
            "type": "text",
            "required": "fieldId(8) == 1 || fieldId(8) == 2 || fieldId(8) == 7"
          }
        ]
      ]
    },
    {
      "id": "4",
      "mandatory": false,
      "displayOrder": 4,
      "defaultExpanded": false,
      "label": "CPE am ersten Standort",
      "contents": [
        [
          {
            "fieldId": "40",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "CPE Netzelementekennung",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "41",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "4",
            "label": "CPE Schnittstelle",
            "type": "text",
            "required": "fieldId(8) == 1 || fieldId(8) == 2 || fieldId(8) == 7"
          }
        ],
        [
          {
            "fieldId": "42",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "CPE Parameter LAN-Schnittstelle",
            "type": "text",
            "required": "fieldId(8) == 1 || fieldId(8) == 2 || fieldId(8) == 7"
          },
          {
            "fieldId": "43",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "4",
            "label": "CPE Alternative Bandbreite",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "202",
            "displayOrder": 0,
            "width": "12",
            "label": "Erstes VPN",
            "type": "label"
          }
        ],
        [
          {
            "fieldId": "44",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "CPE VPN 1",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "48",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv4-Adresse 1",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "47",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv4-Subnetzmaske 1",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "46",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv4-Netz 1",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "45",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv4-Loopbackadresse 1",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "49",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv6-Netz 1",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "50",
            "displayOrder": 0,
            "validation": {
              "maxLength": "1000"
            },
            "width": "8",
            "label": "CPE IPv6-Bemerkung 1",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "51",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "CPE Koppel-Netz 1",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "52",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "CPE Kaskadiertes LAN IPv4 next hop Netz 1",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "55",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE Kaskadierte LAN IPv4-Adresse 1",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "54",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE Kaskadierte LAN IPv4-Netzmaske 1",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "53",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE Kaskadiertes LAN IPv4-Netz 1",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "203",
            "displayOrder": 0,
            "width": "12",
            "label": "Zweltes VPN",
            "type": "label"
          }
        ],
        [
          {
            "fieldId": "56",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "CPE VPN 2",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "60",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv4-Adresse 2",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "59",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv4-Subnetzmaske 2",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "58",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv4-Netz 2",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "57",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv4-Loopbackadresse 2",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "61",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv6-Netz 2",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "62",
            "displayOrder": 0,
            "validation": {
              "maxLength": "1000"
            },
            "width": "8",
            "label": "CPE IPv6-Bemerkung 2",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "63",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "CPE Koppel-Netz 2",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "64",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "CPE Kaskadiertes LAN IPv4 next hop Netz 2",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "67",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE Kaskadierte LAN IPv4-Adresse 2",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "66",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE Kaskadierte LAN IPv4-Netzmaske 2",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "65",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE Kaskadiertes LAN IPv4-Netz 2",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "204",
            "displayOrder": 0,
            "width": "12",
            "label": "Alternative Schnittstellen",
            "type": "label"
          }
        ],
        [
          {
            "fieldId": "68",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "Erster Standort - Alternative Schnittstelle - Patchpanel-Steckertyp",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "69",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "Erster Standort - Alternative Schnittstelle Abschlusspunkt",
            "type": "text",
            "required": "false"
          }
        ]
      ]
    },
    {
      "id": "5",
      "mandatory": false,
      "displayOrder": 5,
      "defaultExpanded": false,
      "label": "Zweiter Standort",
      "contents": [
        [
          {
            "fieldId": "70",
            "displayOrder": 0,
            "width": "4",
            "label": "Zweiter Standort?",
            "type": "radio",
            "required": "false",
            "values": [
              {
                "label": "Ja",
                "value": "1",
                "displayOrder": 1
              },
              {
                "label": "Nein",
                "value": "2",
                "displayOrder": 2
              }
            ]
          },
          {
            "fieldId": "71",
            "displayOrder": 0,
            "validation": {
              "maxLength": "35"
            },
            "width": "4",
            "show": "fieldId(70) == 1",
            "label": "Laufende Auftragsnummer Kunde",
            "type": "text",
            "required": "true"
          }
        ],
        [
          {
            "fieldId": "73",
            "displayOrder": 0,
            "validation": {
              "maxLength": "10"
            },
            "width": "4",
            "label": "Standort-ID",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "72",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "4",
            "show": "fieldId(70) == 1",
            "label": "Region",
            "type": "text",
            "required": "true"
          },
          {
            "fieldId": "74",
            "displayOrder": 0,
            "validation": {
              "minLength": "3",
              "onlyNumbers": "true",
              "maxLength": "6",
              "startWith": "0"
            },
            "width": "4",
            "label": "Vorwahl",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "79",
            "displayOrder": 0,
            "validation": {
              "maxLength": "30"
            },
            "width": "4",
            "label": "Firmenname",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "77",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "4",
            "show": "fieldId(70) == 1",
            "label": "Straße",
            "type": "text",
            "required": "true"
          },
          {
            "fieldId": "78",
            "displayOrder": 0,
            "validation": {
              "maxLength": "10"
            },
            "width": "4",
            "show": "fieldId(70) == 1",
            "label": "Hausnummer",
            "type": "text",
            "required": "true"
          }
        ],
        [
          {
            "fieldId": "75",
            "displayOrder": 0,
            "validation": {
              "maxLength": "7"
            },
            "width": "4",
            "show": "fieldId(70) == 1",
            "label": "PLZ",
            "type": "text",
            "required": "true"
          },
          {
            "fieldId": "76",
            "displayOrder": 0,
            "validation": {
              "maxLength": "40"
            },
            "width": "4",
            "show": "fieldId(70) == 1",
            "label": "Ort",
            "type": "text",
            "required": "true"
          }
        ],
        [
          {
            "fieldId": "85",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "8",
            "show": "fieldId(70) == 1",
            "label": "CPE: Gebäude, Etage, Raum",
            "type": "text",
            "required": "true"
          }
        ],
        [
          {
            "fieldId": "86",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "8",
            "label": "APL: Gebäude, Etage, Raum",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "87",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "APL: Zusatzinformation",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "80",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "Standort - Zusatzinformationen",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "201",
            "displayOrder": 0,
            "width": "12",
            "label": "Ansprechpartner ver Ort",
            "type": "label"
          }
        ],
        [
          {
            "fieldId": "82",
            "displayOrder": 0,
            "validation": {
              "maxLength": "30"
            },
            "width": "4",
            "show": "fieldId(70) == 1",
            "label": "Firma des Ansprechpartners",
            "type": "text",
            "required": "true"
          },
          {
            "fieldId": "81",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "4",
            "show": "fieldId(70) == 1",
            "label": "Name des Ansprechpartners",
            "type": "text",
            "required": "true"
          },
          {
            "fieldId": "83",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "show": "fieldId(70) == 1",
            "label": "Rufnummer des Ansprechpartners",
            "type": "text",
            "required": "true"
          }
        ],
        [
          {
            "fieldId": "84",
            "displayOrder": 0,
            "validation": {
              "email": "true",
              "maxLength": "100"
            },
            "width": "12",
            "show": "fieldId(70) == 1",
            "label": "E-Mail-Adresse des Ansprechpartners",
            "type": "text",
            "required": "true"
          }
        ]
      ]
    },
    {
      "id": "6",
      "mandatory": false,
      "displayOrder": 6,
      "defaultExpanded": false,
      "label": "CPE am Zweiten Standort",
      "contents": [
        [
          {
            "fieldId": "88",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "CPE Netzelementekennung",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "89",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "4",
            "show": "fieldId(70) == 1",
            "label": "CPE Schnittstelle",
            "type": "text",
            "required": "true"
          }
        ],
        [
          {
            "fieldId": "90",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "show": "fieldId(70) == 1",
            "label": "CPE Parameter LAN-Schnittstelle",
            "type": "text",
            "required": "true"
          },
          {
            "fieldId": "91",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "4",
            "label": "CPE Alternative Bandbreite",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "202",
            "displayOrder": 0,
            "width": "12",
            "label": "Erstes VPN",
            "type": "label"
          }
        ],
        [
          {
            "fieldId": "92",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "CPE VPN 1",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "96",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv4-Adresse 1",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "95",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv4-Subnetzmaske 1",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "94",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv4-Netz 1",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "93",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv4-Loopbackadresse 1",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "97",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv6-Netz 1",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "98",
            "displayOrder": 0,
            "validation": {
              "maxLength": "1000"
            },
            "width": "8",
            "label": "CPE IPv6-Bemerkung 1",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "99",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "CPE Koppel-Netz 1",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "100",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "CPE Kaskadiertes LAN IPv4 next hop Netz 1",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "103",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE Kaskadierte LAN IPv4-Adresse 1",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "102",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE Kaskadierte LAN IPv4-Netzmaske 1",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "101",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE Kaskadiertes LAN IPv4-Netz 1",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "203",
            "displayOrder": 0,
            "width": "12",
            "label": "Zweltes VPN",
            "type": "label"
          }
        ],
        [
          {
            "fieldId": "104",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "CPE VPN 2",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "108",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv4-Adresse 2",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "107",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv4-Subnetzmaske 2",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "106",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv4-Netz 2",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "105",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv4-Loopbackadresse 2",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "109",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE IPv6-Netz 2",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "110",
            "displayOrder": 0,
            "validation": {
              "maxLength": "1000"
            },
            "width": "8",
            "label": "CPE IPv6-Bemerkung 2",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "111",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "CPE Koppel-Netz 2",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "112",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "CPE Kaskadiertes LAN IPv4 next hop Netz 2",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "115",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE Kaskadierte LAN IPv4-Adresse 2",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "114",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE Kaskadierte LAN IPv4-Netzmaske 2",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "113",
            "displayOrder": 0,
            "validation": {
              "maxLength": "20"
            },
            "width": "4",
            "label": "CPE Kaskadiertes LAN IPv4-Netz 2",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "204",
            "displayOrder": 0,
            "width": "12",
            "label": "Alternative Schnittstellen",
            "type": "label"
          }
        ],
        [
          {
            "fieldId": "116",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "Erster Standort - Alternative Schnittstelle - Patchpanel-Steckertyp",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "117",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "Erster Standort - Alternative Schnittstelle Abschlusspunkt",
            "type": "text",
            "required": "false"
          }
        ]
      ]
    },
    {
      "id": "7",
      "mandatory": false,
      "displayOrder": 7,
      "defaultExpanded": false,
      "label": "Zusätzliche Services",
      "contents": [
        [
          {
            "fieldId": "118",
            "displayOrder": 0,
            "width": "4",
            "label": "CPE Versand?",
            "type": "radio",
            "required": "false",
            "values": [
              {
                "label": "Ja",
                "value": "1",
                "displayOrder": 1
              },
              {
                "label": "Nein",
                "value": "2",
                "displayOrder": 2
              }
            ]
          },
          {
            "fieldId": "128",
            "displayOrder": 0,
            "width": "4",
            "label": "Ortsbegehung?",
            "type": "radio",
            "required": "false",
            "values": [
              {
                "label": "Ja",
                "value": "1",
                "displayOrder": 1
              },
              {
                "label": "Nein",
                "value": "2",
                "displayOrder": 2
              }
            ]
          },
          {
            "fieldId": "129",
            "displayOrder": 0,
            "width": "4",
            "label": "Vor-Ort-Installationsservice?",
            "type": "radio",
            "required": "false",
            "values": [
              {
                "label": "Ja",
                "value": "1",
                "displayOrder": 1
              },
              {
                "label": "Nein",
                "value": "2",
                "displayOrder": 2
              }
            ]
          }
        ]
      ]
    },
    {
      "id": "8",
      "mandatory": false,
      "displayOrder": 8,
      "defaultExpanded": false,
      "label": "CPE Lieferadresse",
      "contents": [
        [
          {
            "fieldId": "119",
            "displayOrder": 0,
            "validation": {
              "maxLength": "30"
            },
            "width": "4",
            "label": "Firmenname",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "120",
            "displayOrder": 0,
            "validation": {
              "maxLength": "30"
            },
            "width": "4",
            "label": "Empfänger Nachname",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "121",
            "displayOrder": 0,
            "validation": {
              "maxLength": "30"
            },
            "width": "4",
            "label": "Empfänger Vorname",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "122",
            "displayOrder": 0,
            "validation": {
              "maxLength": "7"
            },
            "width": "4",
            "label": "PLZ",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "123",
            "displayOrder": 0,
            "validation": {
              "maxLength": "40"
            },
            "width": "4",
            "label": "Ort",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "124",
            "displayOrder": 0,
            "validation": {
              "maxLength": "60"
            },
            "width": "8",
            "label": "Straße",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "125",
            "displayOrder": 0,
            "validation": {
              "maxLength": "10"
            },
            "width": "4",
            "label": "Hausnummer",
            "type": "text",
            "required": "false"
          }
        ]
      ]
    },
    {
      "id": "10",
      "mandatory": false,
      "displayOrder": 10,
      "defaultExpanded": false,
      "label": "Neues Kundenkonto",
      "contents": [
        [
          {
            "fieldId": "130",
            "displayOrder": 0,
            "width": "4",
            "label": "Neue Kundennummer anlegen?",
            "type": "radio",
            "required": "false",
            "values": [
              {
                "label": "Ja",
                "value": "1",
                "displayOrder": 1
              },
              {
                "label": "Nein",
                "value": "2",
                "displayOrder": 2
              }
            ]
          }
        ],
        [
          {
            "fieldId": "131",
            "displayOrder": 0,
            "validation": {
              "maxLength": "30"
            },
            "width": "4",
            "label": "Firma 1",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "132",
            "displayOrder": 0,
            "validation": {
              "maxLength": "30"
            },
            "width": "4",
            "label": "Firma 2",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "133",
            "displayOrder": 0,
            "validation": {
              "maxLength": "30"
            },
            "width": "4",
            "label": "Straße",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "134",
            "displayOrder": 0,
            "validation": {
              "maxLength": "10"
            },
            "width": "4",
            "label": "Hausnummer",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "135",
            "displayOrder": 0,
            "validation": {
              "maxLength": "7"
            },
            "width": "4",
            "label": "PLZ",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "136",
            "displayOrder": 0,
            "validation": {
              "maxLength": "40"
            },
            "width": "4",
            "label": "Ort",
            "type": "text",
            "required": "false"
          }
        ]
      ]
    },
    {
      "id": "11",
      "mandatory": false,
      "displayOrder": 11,
      "defaultExpanded": false,
      "label": "Neues Rechnungskonto",
      "contents": [
        [
          {
            "fieldId": "137",
            "displayOrder": 0,
            "width": "4",
            "label": "Neues Rechnungskonto anlegen?",
            "type": "radio",
            "required": "false",
            "values": [
              {
                "label": "Ja",
                "value": "1",
                "displayOrder": 1
              },
              {
                "label": "Nein",
                "value": "2",
                "displayOrder": 2
              }
            ]
          }
        ],
        [
          {
            "fieldId": "138",
            "displayOrder": 0,
            "validation": {
              "maxLength": "30"
            },
            "width": "4",
            "label": "Firma 1",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "139",
            "displayOrder": 0,
            "validation": {
              "maxLength": "30"
            },
            "width": "4",
            "label": "Firma 2",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "140",
            "displayOrder": 0,
            "validation": {
              "maxLength": "30"
            },
            "width": "4",
            "label": "Straße",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "141",
            "displayOrder": 0,
            "validation": {
              "maxLength": "10"
            },
            "width": "4",
            "label": "Hausnummer",
            "type": "text",
            "required": "false"
          }
        ],
        [
          {
            "fieldId": "142",
            "displayOrder": 0,
            "validation": {
              "maxLength": "7"
            },
            "width": "4",
            "label": "PLZ",
            "type": "text",
            "required": "false"
          },
          {
            "fieldId": "143",
            "displayOrder": 0,
            "validation": {
              "maxLength": "40"
            },
            "width": "4",
            "label": "Ort",
            "type": "text",
            "required": "false"
          }
        ]
      ]
    }
  ]
};
