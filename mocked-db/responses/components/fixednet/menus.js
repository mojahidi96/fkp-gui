module.exports = {
  "tabs": [
    {
      "name": "Web Ticketing",
      "url": "https://vodafone-qa2.activationnow.com/buyflow/client/en_US/leadingdocumentmanagement?navigationValue=documents"
    }
  ],
  "shop": {
    "name": "",
    "number": ""
  },
  "menus": [
    {
      "menuOrder": "2",
      "name": "Administration",
      "url": "/portal/app/#/fixednet/home/admin",
      "submenus": [
        {
          "title": "Benutzer",
          "links": [
            {
              "name": "Benutzer anlegen",
              "url": "/usermanager/um/adduser?navigationValue=create_user&appFlow=fixednet"
            },
            {
              "name": "Benutzer suchen und bearbeiten",
              "url": "/usermanager/um/usersearch?navigationValue=search_and_modify_users&appFlow=fixednet"
            }
          ]
        },
        {
          "title": "Shop",
          "links": [
            {
              "name": "Einen neuen Shop anlegen",
              "url": "/portal/app/#/fixednet/createshop"
            },
            {
              "name": "Shop suchen und anpassen",
              "url": "/portal/app/#/fixednet/editshop"
            }
          ]
        },
        {
          "title": "Onboarding und Datenaktualisierung",
          "links": [
            {
              "name": "Onboarding und Datenaktualisierung",
              "url": "/portal/app/#/fixednet/dwhrefresh"
            }
          ]
        },
        {
          "title": "Order Management",
          "links": [
            {
              "name": "Startseite",
              "url": "/portal/app/#/fixednet/ordermanager"
            }
          ]
        }
      ]
    },
    {
      "menuOrder": "1",
      "name": "Bestellung",
      "url": "/portal/app/#/fixednet/home/order",
      "submenus": [
        {
          "title": "Bestellungen",
          "links": [
            {
              "name": "Bestellung suchen",
              "url": "/portal/app/#/fixednet/orderhistorysearch"
            }
          ]
        },
        {
          "title": "Bestell- und Vertragsmanagement",
          "links": [
            {
              "name": "Produkte am Standort anzeigen",
              "url": "/portal/app/#/fixednet/customerdetails?id=2"
            },
            {
              "name": "Aufträge anzeigen",
              "url": "/portal/app/#/fixednet/customerdetails?id=1"
            }
          ]
        }
      ]
    }
  ],
  "isReadOnlyUser": false,
  "vfUser": true,
  "techfundEnabled": false,
  "isReadOnlyVodafoneUser": false,
  "ssoUser": false,
  "ssoKeepAliveUrl": "https://eweb5.vfd2-testnet.de/ussa/service/ping/fkp/pohp/c_Id",
  "permissions": [
    "prefilled.cart.create",
    "prefilled.cart.delete",
    "prefilled.cart.edit"
  ]
};