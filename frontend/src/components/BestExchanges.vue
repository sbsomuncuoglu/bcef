<template>
  <div>
    <!-- TODO: Don't hardcode these  -->
    <b-row>
      <p>Best exchange to buy BTC: <a :href="bestPrices.best_btc_buy_link" target="_blank">{{ bestPrices.best_btc_buy }}</a> </p>
    </b-row>
    <b-row>
      <p>Best exchange to sell BTC: <a :href="bestPrices.best_btc_sell_link" target="_blank">{{ bestPrices.best_btc_sell }}</a> </p>
    </b-row> 
    <b-row>
      <p>Best exchange to buy ETH: <a :href="bestPrices.best_eth_buy_link" target="_blank">{{ bestPrices.best_eth_buy }}</a> </p>
    </b-row> 
    <b-row>
      <p>Best exchange to sell ETH: <a :href="bestPrices.best_eth_sell_link" target="_blank">{{ bestPrices.best_eth_sell }}</a> </p>
    </b-row>  
  </div>
</template>

<script>

  import { mapState } from 'vuex';
  
  export default {
    name: 'BestExchanges',
    computed: mapState(['tableData']),
    data() {
      return {
        prices: this.tableData,
        bestPrices: {
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
      }
    },
    watch: {
      tableData(newVal, oldVal) {
        console.log('asdf');
        if(newVal == oldVal) {
          return;
        }
        
        //TODO: Make it more generic, for when there's more than 2 exchanges. Don't hardcode variable names
        if(newVal[0].btc_buy < newVal[1].btc_buy) {
          this.bestPrices.best_btc_buy = newVal[0].exchange;
        } else {
          this.bestPrices.best_btc_buy = newVal[1].exchange;
        }

        if(newVal[0].btc_sell > newVal[1].btc_sell) {
          this.bestPrices.best_btc_sell = newVal[0].exchange;
        } else {
          this.bestPrices.best_btc_sell = newVal[1].exchange;
        }

        if(newVal[0].eth_buy < newVal[1].eth_buy) {
          this.bestPrices.best_eth_buy = newVal[0].exchange;
        } else {
          this.bestPrices.best_eth_buy = newVal[1].exchange;
        }

        if(newVal[0].eth_sell > newVal[1].eth_sell) {
          this.bestPrices.best_eth_sell = newVal[0].exchange;
        } else {
          this.bestPrices.best_eth_sell = newVal[1].exchange;
        }

        // TODO: Get links from database/server
        // Convert text into links
        this.bestPrices.best_btc_buy_link = "https://www." + this.bestPrices.best_btc_buy.toLowerCase() + ".com";
        this.bestPrices.best_btc_sell_link = "https://www." + this.bestPrices.best_btc_sell.toLowerCase() + ".com";
        this.bestPrices.best_eth_buy_link = "https://www." + this.bestPrices.best_eth_buy.toLowerCase() + ".com";
        this.bestPrices.best_eth_sell_link = "https://www." + this.bestPrices.best_eth_sell.toLowerCase() + ".com";
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>