import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
      tableData: [],
      currencies: [],
      exchanges: []
    },
    mutations: {
      updateRow(state, newRow) {
        //console.log(newRow);
        const exchangeIndex = state.tableData.map(e => e.exchange).indexOf(newRow.exchange);
        if(exchangeIndex != -1) {
          for (const key of Object.keys(newRow)) { // Merge two objects
            if (Object.prototype.hasOwnProperty.call(state.tableData[exchangeIndex], key)) {
              if(newRow[key] > state.tableData[exchangeIndex][key]) {
                state.tableData[exchangeIndex][key] = newRow[key] + '(+)';
              } else if(newRow[key] < state.tableData[exchangeIndex][key]) {
                state.tableData[exchangeIndex][key] = newRow[key] + '(-)';
              }
            }
          }  
        } else {
          console.log("Error finding the exchange");
        }
      },
      loadInitialTableData(state, initialTableData) {
        //console.log(initialTableData);
        if(state.tableData.length == 0) { // First load
          state.tableData = initialTableData;
        }
      },
      updateCurrencies(state, currencies) {
        state.currencies = currencies;
      },
      updateExchanges(state, exchanges) {
        state.exchanges = exchanges;
      }
    },
    actions: {
      updateRow(context, newRow) {
        context.commit('updateRow', newRow);
      },
      loadInitialTableData(context, initialTableData) {
        context.commit('loadInitialTableData', initialTableData);
      },
      updateCurrencies(context, currencies) {
        context.commit('updateCurrencies', currencies);
      },
      updateExchanges(context, exchanges) {
        context.commit('updateExchanges', exchanges);
      }
    },
    getters: {
      getTableData: state => {
        return state.tableData;
      },
      getCurrencies: state => {
        return state.exchanges;
      },
      getExchanges: state => {
        return state.exchangeIDs;
      }
    }
  });