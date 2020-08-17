<template>
  <div>
    <!-- TODO: Don't hardcode these  -->
    <b-row>
      <p>Best exchange to buy BTC: <a :href="best_btc_buy_link" target="_blank">{{ best_btc_buy }}</a> </p>
    </b-row>
    <b-row>
      <p>Best exchange to sell BTC: <a :href="best_btc_sell_link" target="_blank">{{ best_btc_sell }}</a> </p>
    </b-row> 
    <b-row>
      <p>Best exchange to buy ETH: <a :href="best_eth_buy_link" target="_blank">{{ best_eth_buy }}</a> </p>
    </b-row> 
    <b-row>
      <p>Best exchange to sell ETH: <a :href="best_eth_sell_link" target="_blank">{{ best_eth_sell }}</a> </p>
    </b-row>  
  </div>
</template>

<script>

  import { mapState } from 'vuex';
  //import { mapGetters } from 'vuex'
  //import { store } from '../store/store.js'
  
  export default {
    name: 'BestExchanges',
    // computed: mapState(['tableData']),
    computed: {
      ...mapState(['tableData']),
      computedTableData() {
          // is triggered whenever the store state changes
          return this.tableData;
      }
      // ...mapGetters({
      //   tableData: 'getTableData'
      // })
      // tableData() {
      //   return store.getters.getTableData
      // }
    },
    data() {
      return {
        //TODO: Don't hardcode variable names
        best_btc_buy: "",
        best_btc_buy_link: "",

        best_btc_sell: "",
        best_btc_sell_link: "",
        
        best_eth_buy: "",
        best_eth_buy_link: "",
        
        best_eth_sell: "",
        best_eth_sell_link: ""
      }
    },
    watch: {
      computedTableData: {
        handler: function(newVal) {
          //TODO: Make it more generic, for when there's more than 2 exchanges. Don't hardcode variable names
          if(newVal[0].btc_buy < newVal[1].btc_buy) {
            this.best_btc_buy = newVal[0].exchange;
          } else {
            this.best_btc_buy = newVal[1].exchange;
          }

          if(newVal[0].btc_sell > newVal[1].btc_sell) {
            this.best_btc_sell = newVal[0].exchange;
          } else {
            this.best_btc_sell = newVal[1].exchange;
          }

          if(newVal[0].eth_buy < newVal[1].eth_buy) {
            this.best_eth_buy = newVal[0].exchange;
          } else {
            this.best_eth_buy = newVal[1].exchange;
          }

          if(newVal[0].eth_sell > newVal[1].eth_sell) {
            this.best_eth_sell = newVal[0].exchange;
          } else {
            this.best_eth_sell = newVal[1].exchange;
          }

          // TODO: Get links from database/server
          // Convert text into links
          this.best_btc_buy_link = "https://www." + this.best_btc_buy.toLowerCase() + ".com";
          this.best_btc_sell_link = "https://www." + this.best_btc_sell.toLowerCase() + ".com";
          this.best_eth_buy_link = "https://www." + this.best_eth_buy.toLowerCase() + ".com";
          this.best_eth_sell_link = "https://www." + this.best_eth_sell.toLowerCase() + ".com";
        },
        deep: true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>