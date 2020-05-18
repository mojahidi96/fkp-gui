module.exports = {
  "basicReportOptions": {"ban": "Y", "soc": "Y", "subscriber": "Y"},
  "savedReportOptions": [
    {
      "reportType": "subscriber",
      "reportName": "NFC-fähige SIM-Karten",
      "searchOptions": "[{\"title\":\"Kundennummer\",\"field\":\"1\",\"sortable\":\"custom\",\"show\":true,\"type\":\"number\"},{\"title\":\"Rufnummer\",\"field\":\"2\",\"sortable\":\"custom\",\"show\":true,\"type\":\"text\"},{\"title\":\"Tarifoption\",\"field\":\"3\",\"sortable\":\"custom\",\"show\":true,\"type\":\"text\"},{\"title\":\"Beschreibung\",\"field\":\"4\",\"sortable\":\"custom\",\"show\":true,\"type\":\"text\"},{\"title\":\"Einrichtungsdatum\",\"field\":\"5\",\"sortable\":\"custom\",\"show\":true,\"type\":\"date\"},{\"title\":\"Ablaufdatum\",\"field\":\"6\",\"sortable\":\"custom\",\"show\":true,\"type\":\"date\"}]",
      "columnFilterOptions": "[]",
      "columnSortOptions": "{\"sortField\":\"1\",\"sortOrder\":1}"
    }, {
      "reportType": "subscriber",
      "reportName": "newtemplateone",
      "searchOptions": "[{\"title\":\"Kundennummer\",\"field\":\"1\",\"sortable\":\"custom\",\"show\":true,\"type\":\"number\"},{\"title\":\"Rufnummer\",\"field\":\"2\",\"sortable\":\"custom\",\"show\":true,\"type\":\"text\"},{\"title\":\"Erstaktivierung\",\"field\":\"3\",\"sortable\":\"3\",\"show\":true,\"type\":\"date\"},{\"title\":\"Vertragsbeginn\",\"field\":\"4\",\"sortable\":\"4\",\"show\":true,\"type\":\"date\"},{\"title\":\"Mögl. Vertragsende\",\"field\":\"5\",\"sortable\":\"custom\",\"show\":true,\"type\":\"date\"},{\"title\":\"Name 1\",\"field\":\"9\",\"sortable\":\"custom\",\"show\":true,\"type\":\"text\"},{\"title\":\"Tarif ID\",\"field\":\"22\",\"sortable\":\"custom\",\"show\":true,\"type\":\"text\"},{\"title\":\"Tarifname\",\"field\":\"23\",\"sortable\":\"custom\",\"show\":true,\"type\":\"text\"},{\"title\":\"Gekündigt zum\",\"field\":\"31\",\"sortable\":\"custom\",\"show\":true,\"type\":\"date\"},{\"title\":\"Vertragsverlängerung möglich\",\"field\":\"37\",\"sortable\":\"custom\",\"show\":true,\"type\":\"text\"},{\"title\":\"Anz. UltraCards\",\"field\":\"38\",\"sortable\":\"custom\",\"show\":true,\"type\":\"number\"}]",
      "columnFilterOptions": "[{\"type\":\"number\",\"column\":\"1\",\"comparator1\":\"EQ\",\"comparator2\":\"EQ\",\"filter1\":\"81700001\"},{\"type\":\"text\",\"column\":\"2\",\"comparator1\":\"EQ\",\"comparator2\":\"INC\",\"filter1\":\"17683117034\"}]",
      "columnSortOptions": "{\"sortField\":\"1\",\"sortOrder\":1}"
    }
  ]
};
