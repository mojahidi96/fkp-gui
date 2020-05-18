module.exports = {
  "tabs": [
    {
      "name": "Web Ticketing",
      "url": "https://vodafone-qa2.activationnow.com/buyflow/client/en_US/leadingdocumentmanagement?navigationValue=documents"
    }
  ],
  "menus": [
    {
      "menuOrder": "101",
      "name": "Administration",
      "url": "/portal/app/#/ed/home/order",
      "submenus": [
        {
          "title": "Order Management",
          "links": [
            {
              "name": "Manage Existing orders",
              "url": "/portal/app/#/ed/ordermanager"
            }
          ]
        },
        {
          "title": "Reporting",
          "links": [
            {
              "name": "reportingsub",
              "url": "/portal/app/#/ed/reporting"
            }
          ]
        },
        {
          "title": "Benutzer",
          "links": [
            {
              "name": "Benutzer anlegen",
              "url": "/usermanager/um/adduser?navigationValue=create_user&appFlow=ed"
            },
            {
              "name": "Benutzer suchen und bearbeiten",
              "url": "/usermanager/um/usersearch?navigationValue=search_and_modify_users&appFlow=ed"
            }
          ]
        },
        {
          "title": "Document Management",
          "links": [
            {
              "name": "document mgt",
              "url": "/portal/app/#/ed/documentmgt"
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