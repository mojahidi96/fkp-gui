module.exports = {
  "tabs": [
    {
      "name": "Web Ticketing", "url": "https://web-incident-portal.vodafone.de/tt/login.seam"
    }
  ], "shop": {
    "name": "UAT Shop1", "number": "303015","banExist":"0"
  }, "menus": [
    {
      "name": "Bestellung", "url": "/buyflow/client/leadingorderpage?navigationValue=order_1", "submenus": [
        {
          "title": "Neubestellungen", "links": [
            {
              "name": "Neukarte mit Hardware", "url": "/buyflow/client/bansearch?BuyFlowType=HANDY_TARIFF&navigationValue=handy_and_tariff"
            }, {
              "name": "Neukarte mit Hardwaregutschrift", "url": "/buyflow/client/sim_bansearch?BuyFlowType=SIM_CREDIT&navigationValue=sim_and_credit_voucher"
            }, {
              "name": "Neukarte mit Hardwareoption", "url": "/buyflow/client/sim_bansearch?BuyFlowType=SIM_SUBSIDY&navigationValue=sim_and_delayed_subsidy"
            }, {
              "name": "Neukarte (SIM only)", "url": "/buyflow/client/sim_bansearch?BuyFlowType=SIM_ONLY&navigationValue=sim_only"
            }, {
              "name": "Hardware und Zubehör", "url": "/buyflow/client/hardwareaccflow?navigationValue=hardware_or_accessory_only_new"
            }
          ]
        }, {
          "title": "Ihre Bestellungen", "links": [
            {
              "name": "Bestellhistorie", "url": "/buyflow/client/orderhistory?navigationValue=order_history"
            }
          ]
        }
      ]
    }, {
      "name": "Teilnehmer", "url": "/buyflow/client/leadingSubscribersPage?navigationValue=subscribers", "submenus": [
        {
          "title": "Vertragsverlängerung (VVL)", "links": [
            {
              "name": "VVL mit Hardware", "url": "/buyflow/client/Prolongation_HandySelection?BuyFlowType=subs_handy_only&navigationValue=subs_handy_only"
            }, {
              "name": "VVL mit Hardwaregutschrift", "url": "/buyflow/client/Prolongation_SubscriberSelection?navigationValue=subs_tariff_and_credit_voucher"
            }, {
              "name": "VVL mit Hardwareabruf", "url": "/buyflow/client/Prolongation_SubscriberSelection?navigationValue=subs_tariff_and_delayed_subsidy"
            }, {
              "name": "VVL mit Tarifwechsel und Hardware", "url": "/buyflow/client/Prolongation_HandySelection?BuyFlowType=subs_handy_and_tariff&navigationValue=subs_handy_and_tariff"
            }, {
              "name": "Vertragsverlängerung", "url": "/portal/app/#/mobile/vvlflow"
            }
          ]
        }, {
          "title": "Teilnehmer-Verwaltung", "links": [
            {
              "name": "Hardwareoption abrufen", "url": "/portal/client/redeemSubscriber?navigationValue=redeem_delayed_subsidy"
            }, {
              "name": "Tarifwechsel", "url": "/portal/app/#/mobile/ctflow"
            }, {
              "name": "Tarifoptionen verwalten", "url": "/portal/app/#/mobile/maintainsoc"
            }, {
              "name": "Teilnehmerverwaltung", "url": "/portal/app/#/mobile/subscriberUpdateInfo"
            }, {
              "name": "Simkartentausch", "url": "/buyflow/client/SubscriberSearch?navigationValue=subscriber_search2"
            }, {
              "name": "UltraCard verwalten", "url": "/buyflow/client/ultracardflow#/?navigationValue=ultracard"
            }, {
              "name": "Einzelverbindungsnachweis verwalten", "url": "/portal/app/#/mobile/changebillflow"
            }
          ]
        }
      ]
    }, {
      "name": "Rahmenvertrag", "url": "/buyflow/client/leadingcontractpage?navigationValue=contract", "submenus": [
        {
          "title": "Kundennummer", "links": [
            {
              "name": "Kundennummern verwalten", "url": "/portal/app/#/mobile/banupdate"
            }, {
              "name": "Report erstellen", "url": "/buyflow/client/fkpdatareport#?navigationValue=fkp_data_reporting"
            }
          ]
        }, {
          "title": "Organisationseinheiten", "links": [
            {
              "name": "Organisationseinheiten administrieren", "url": "/portal/client/freeorgmanager?navigationValue=freeorgmanager"
            }
          ]
        }
      ]
    }, {
      "name": "Administration", "url": "/portal/client/shophome?navigationValue=portal_administration&changecontract=false", "submenus": [
        {
          "title": "Benutzer", "links": [
            {
              "name": "Benutzer anlegen", "url": "/usermanager/um/adduser?navigationValue=create_user"
            }, {
              "name": "Benutzer suchen und bearbeiten", "url": "/usermanager/um/usersearch?navigationValue=search_and_modify_users"
            }
          ]
        }, {
          "title": "Auftragsgenehmigungen", "links": [
            {
              "name": "Anzeige der ausstehenden Genehmigungen", "url": "/portal/client/approversearch?navigationValue=approver_search"
            }
          ]
        }
      ]
    }, {
      "name": "Dokumente", "url": "/buyflow/client/leadingdocumentmanagement?navigationValue=documents", "submenus": [
        {
          "title": "Dokumentenverwaltung", "links": [
            {
              "name": "Dokumente suchen und bearbeiten", "url": "/buyflow/client/document_search?navigationValue=search_and_modify_documents"
            }
          ]
        }
      ]
    }, {
      "name": "Reporting", "url": "/buyflow/client/user_reporting?navigationValue=user_reporting", "submenus": []
    }, {
      "name": "Hilfe", "url": "http://www.vodafone.de/fkp-hilfe?navigationValue=help", "submenus": []
    }
  ],
  "isReadOnlyUser": false,
  "vfUser": false,
  "ssoUser": false,
  "ssoKeepAliveUrl": "https://eweb5.vfd2-testnet.de/ussa/service/ping/fkp/pohp/c_Id",
  "permissions":["prefilled.cart.create", "prefilled.cart.edit", "prefilled.cart.delete"]
};