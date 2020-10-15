import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

import '@vaadin/vaadin-combo-box/vaadin-combo-box';
import '@vaadin/vaadin-date-picker/vaadin-date-picker';
import '@vaadin/vaadin-grid/all-imports';
import '@vaadin/vaadin-grid-pro/vaadin-grid-pro';
import '@vaadin/vaadin-grid-pro/vaadin-grid-pro-edit-column';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@vaadin/vaadin-text-field/vaadin-text-field';

class HelloWorldView extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles lumo-badge lumo-typography">
        :host {
          display: block;
          height: 100%;
        }
        vaadin-grid-pro {
          height: 100%;
        }
        vaadin-grid-filter {
          width: 100%;
        }
        vaadin-grid-pro vaadin-horizontal-layout {
          align-items: center;
        }
        vaadin-grid-pro img {
          border-radius: 50%;
          flex-shrink: 0;
          height: var(--lumo-size-m);
          width: var(--lumo-size-m);
        }
        .name {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      </style>

      <vaadin-grid-pro id="grid" theme="no-border column-borders" items="[[items]]">
        <vaadin-grid-selection-column auto-select></vaadin-grid-selection-column>
        <vaadin-grid-column-group id="idColumnGroup">
          <vaadin-grid-column id="idColumn" flex-grow="0" path="id" width="120px"></vaadin-grid-column>
        </vaadin-grid-column-group>
        <vaadin-grid-column-group id="clientColumnGroup">
          <vaadin-grid-column id="clientColumn" path="client">
            <template>
              <vaadin-horizontal-layout theme="spacing">
                <img src="[[item.img]]" />
                <span class="name">[[item.client]]</span>
              </vaadin-horizontal-layout>
            </template>
          </vaadin-grid-column>
        </vaadin-grid-column-group>
        <vaadin-grid-column-group id="amountColumnGroup">
          <vaadin-grid-pro-edit-column id="amountColumn" path="amount">
            <template>
              <span>[[_getAmount(item.amount)]]</span>
            </template>
          </vaadin-grid-pro-edit-column>
        </vaadin-grid-column-group>
        <vaadin-grid-column-group id="statusColumnGroup">
          <vaadin-grid-pro-edit-column id="statusColumn" editor-type="select" path="status">
            <template>
              <span theme$="[[_getTheme(item.status)]]">[[item.status]]</span>
            </template>
          </vaadin-grid-pro-edit-column>
        </vaadin-grid-column-group>
        <vaadin-grid-column-group id="dateColumnGroup">
          <vaadin-grid-column id="dateColumn" flex-grow="0" path="date" width="180px">
            <template>
              <span>[[_getDate(item.date)]]</span>
            </template>
          </vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid-pro>
    `;
  }

  ready() {
    super.ready();

    this.currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    this.dateFormatter = new Intl.DateTimeFormat('en-US');

    /* Column sorting */
    this.$.idColumnGroup.headerRenderer = (root) => {
      root.innerHTML = '<vaadin-grid-sorter path="id">ID</vaadin-grid-sorter>';
    };

    this.$.clientColumnGroup.headerRenderer = (root) => {
      root.innerHTML = '<vaadin-grid-sorter path="client">Client</vaadin-grid-sorter>';
    };

    this.$.amountColumnGroup.headerRenderer = (root) => {
      root.innerHTML = '<vaadin-grid-sorter path="amount">Amount</vaadin-grid-sorter>';
    };

    this.$.statusColumnGroup.headerRenderer = (root) => {
      root.innerHTML = '<vaadin-grid-sorter path="status">Status</vaadin-grid-sorter>';
    };

    this.$.dateColumnGroup.headerRenderer = (root) => {
      root.innerHTML = '<vaadin-grid-sorter path="date">Date</vaadin-grid-sorter>';
    };

    /* Column filters */
    this.$.idColumn.headerRenderer = (root) => {
      root.innerHTML = `
        <vaadin-grid-filter path="id">
          <vaadin-number-field clear-button-visible placeholder="Filter" slot="filter" style="width: 100%"></vaadin-number-field>
        </vaadin-grid-filter>
        `;
      root.querySelector('vaadin-number-field').addEventListener('value-changed', (event) => {
        root.querySelector('vaadin-grid-filter').value = event.detail.value;
      });
    };

    this.$.clientColumn.headerRenderer = (root) => {
      root.innerHTML = `
        <vaadin-grid-filter path="client">
          <vaadin-text-field clear-button-visible placeholder="Filter" slot="filter" style="width: 100%"></vaadin-text-field>
        </vaadin-grid-filter>
        `;
      root.querySelector('vaadin-text-field').addEventListener('value-changed', (event) => {
        root.querySelector('vaadin-grid-filter').value = event.detail.value;
      });
    };

    this.$.amountColumn.headerRenderer = (root) => {
      root.innerHTML = `
        <vaadin-grid-filter path="amount">
          <vaadin-text-field clear-button-visible placeholder="Filter" slot="filter" style="width: 100%"></vaadin-text-field>
        </vaadin-grid-filter>
        `;
      root.querySelector('vaadin-text-field').addEventListener('value-changed', (event) => {
        root.querySelector('vaadin-grid-filter').value = event.detail.value;
      });
    };

    this.$.statusColumn.headerRenderer = (root) => {
      root.innerHTML = `
        <vaadin-grid-filter path="status">
          <vaadin-combo-box clear-button-visible placeholder="Filter" slot="filter" style="width: 100%"></vaadin-combo-box>
        </vaadin-grid-filter>
        `;
      root.querySelector('vaadin-combo-box').items = ['Pending', 'Success', 'Error'];
      root.querySelector('vaadin-combo-box').addEventListener('value-changed', (event) => {
        root.querySelector('vaadin-grid-filter').value = event.detail.value;
      });
    };

    this.$.dateColumn.headerRenderer = (root) => {
      root.innerHTML = `
        <vaadin-grid-filter path="date">
          <vaadin-date-picker clear-button-visible placeholder="Filter" slot="filter" style="width: 100%"></vaadin-date-picker>
        </vaadin-grid-filter>
        `;
      root.querySelector('vaadin-date-picker').addEventListener('value-changed', (event) => {
        root.querySelector('vaadin-grid-filter').value = event.detail.value;
      });
    };

    /* Status editor */
    this.$.grid.querySelector('[path="status"]').editorOptions = ['Pending', 'Success', 'Error'];
  }

  _getAmount(amount) {
    return this.currencyFormatter.format(amount);
  }

  _getDate(date) {
    return this.dateFormatter.format(Date.parse(date));
  }

  _getTheme(status) {
    return 'badge ' + status.toLowerCase();
  }

  static get is() {
    return 'hello-world-view';
  }
}

customElements.define(HelloWorldView.is, HelloWorldView);
