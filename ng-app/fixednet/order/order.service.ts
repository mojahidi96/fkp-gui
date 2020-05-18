import {Injectable, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FnShop} from '../common/fn-shop';
import {Field} from './dynamic-panels/panel';


@Injectable()
export class OrderService {

  fnOrderRequest: any;
  fnOrderRequestLocationData: any;
  sharedForms: FormGroup[][];
  orderResponse: any;
  customers: Array<FnShop>;
  enabledTabs = {1: true};

  constructor() {

  }

  setFnOrderRequest(fnOrderRequest: any) {
    this.fnOrderRequest = fnOrderRequest;
  }

  getFnorderRequest() {
    return this.fnOrderRequest;
  }

  setFnOrderRequestLocationData(fnOrderRequestLocationData: any) {
    this.fnOrderRequestLocationData = fnOrderRequestLocationData;
  }

  getFnOrderRequestLocationData() {
    return this.fnOrderRequestLocationData;
  }

  getSharedForms() {
    return this.sharedForms;
  }

  setSharedForms(forms: FormGroup[][]) {
    this.sharedForms = forms;
  }

  getOrderResponse() {
    return this.orderResponse;
  }

  setOrderResponse(response) {
    this.orderResponse = response;
  }

  getCustomers() {
    return this.customers;
  }

  setCustomers(customers: Array<any>) {
    this.customers = customers;
  }

  disableTabsFrom(tab: number) {
    Object.keys(this.enabledTabs).forEach(key => {
      this.enabledTabs[key] = !(parseInt(key, 10) > tab);
    });
    this.enabledTabs[tab] = true;
  }

  resetData() {
    let sharedForms: FormGroup[][];
    this.setSharedForms(sharedForms);
    this.setOrderResponse({});
    this.setFnOrderRequestLocationData([]);
    this.setCustomers([]);
  }
   parsePanels(panels) {
    const tp = panels.tariffPanel;
    if (tp && tp.tariffs) {
      let contentField: Field = {
        width: 12,
        type: 'table'
      };

      contentField.cols = [{
        title: 'Tarif',
        field: tp.tariffs[0].fieldId
      }];
      contentField.cols.push(...tp.socs.map(soc => {
        return {title: soc.title, field: soc.field};
      }));

      contentField.rows = tp.tariffs.map(tariff => {
        let row = {};
        row[tariff.fieldId] = {
          fieldId: tariff.fieldId,
          type: tariff.displayType,
          values: [{
            label: tariff.name,
            value: tariff.id
          }],
          validation: tariff.validation,
          required: tariff.required,
          defaultValue: tariff.defaultValue
        };


        contentField.cols.forEach((col, i) => {
          if (i !== 0) {
            const field = tariff[col.field] || tp.socs.find(s => s.field === col.field);
            row[col.field] = {
              fieldId: `${tariff.id}-${field.fieldId}`,
              type: field.incl && tariff[col.field] ? 'checkmark' : field.displayType,
              values: field.values,
              validation: field.validation,
              required: field.required,
              disabled: `fieldId(${tariff.fieldId}) != '${tariff.id}'`
            };
          }
        });

        return row;
      });

      if (panels.panels.find(panel => panel.isTariffPanel)) {
        panels.panels.find(panel => panel.isTariffPanel).contents.unshift([contentField]);
      }

    }
    return panels.panels;
  }
}