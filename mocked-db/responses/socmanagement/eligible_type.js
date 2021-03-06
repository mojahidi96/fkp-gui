module.exports = {
  "readOnlyVodafoneUser": false,
  "mandatory": false,
  "show": false,
  "disabled": false,
  "length": 1,
  "excluded": 0,
  "displayOrder": 0,
  "duration": 0,
  "isTrigger": false,
  "wifi": false,
  "specialHwSoc": false,
  "subsidizedHWSoc": false,
  "subsCountForLazy": 0,
  "trigger": {
    "readOnlyVodafoneUser": false,
    "value": "TRIGSOC1",
    "text": "FKPTrigger",
    "description": "Trigger",
    "type": "TRIGGER",
    "mandatory": false,
    "show": true,
    "canOnly": "A",
    "disabled": false,
    "length": 0,
    "excluded": 0, "displayOrder": 0, "duration": 0, "isTrigger": true,
    "wifi": false,
    "specialHwSoc": false,
    "subsidizedHWSoc": false,
    "charge": {
      "type": "Monatlicher Basispreis",
      "amount": "0.00"
    },
    "subsCountForLazy": 0,
  },
  "masterFamilyList": [{
    "name": "BlackBerry",
    "uuid": "58a9fd28-9bb1-6fc8-e053-404c070a1563",
    "mandatory": false, 
    "socs": [
      {
        "readOnlyVodafoneUser": false,
        "value": "24BBPMACT",
        "text": "Basispreis BlackBerry",
        "description": "BlackBerry Nutzung für die Professional Plus Tarife.",
        "type": "DATA",
        "mandatory": false,
        "show": true,
        "canOnly": "A",
        "disabled": false,
        "length": 0,
        "excluded": 0,
        "displayOrder": 1,
        "duration": 24,
        "isTrigger": false, 
        "wifi": false,
        "specialHwSoc": false,
        "categoryName": "BlackBerry",
        "subsidizedHWSoc": false, 
        "charge": { 
          "type": "Monatlicher Basispreis",
          "amount": "10.00" 
        }, 
        "subsCountForLazy": 0
      },
      {
        "readOnlyVodafoneUser": false,
        "value": "03BBPMACT",
        "text": "Basispreis BlackBerry 3M",
        "description": "BlackBerry Nutzung für die Professional Plus Tarife in der 3Monatsvariante.",
        "type": "DATA",
        "mandatory": false,
        "show": true, 
        "canOnly": "A",
        "disabled": false,
        "length": 0,
        "excluded": 0,
        "displayOrder": 2,
        "duration": 3,
        "isTrigger": false,
        "wifi": false,
        "specialHwSoc": false,
        "categoryName": "BlackBerry",
        "subsidizedHWSoc": false,
        "charge": { 
          "type": "Monatlicher Basispreis",
          "amount": "10.00"
        }, 
        "subsCountForLazy": 0 
    }], 
    "displayOrder": 1,
    "socText": "Basispreis BlackBerry",
    "adaptable": false 
  }]
};