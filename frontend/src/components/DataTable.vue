<template>
  <div>
    <b-table ref="table" :items="items" :fields="fields"></b-table>
  </div>
</template>

<script>
  import MetadataService from '@/services/MetadataService.js';

  import io from "socket.io-client";
  let socket = io.connect("http://localhost:4000");

  import { mapGetters } from 'vuex';
  
  export default {
    name: 'DataTable',
    created() {
      this.getRealTimeData();
      this.getMetaData();
    },
    computed: {
      ...mapGetters({
        tableData: 'getTableData'
      })
    },
    methods: {
      loadInitialTableData(data) {
        this.$store.dispatch('loadInitialTableData', data);
        this.items = this.tableData || [];
      },
      updateRow(row) {
        this.$store.dispatch('updateRow', row);
        this.items = this.tableData || [];
      },
      getRealTimeData() {
        socket.on("newdata", fetchedData => {
          this.updateRow(fetchedData);
        });
      },
      getMetaData() {
        MetadataService.getMetaData()
        .then(
          (metadata => {
            this.$store.dispatch('updateCurrencies', metadata[0]);
            this.$store.dispatch('updateExchanges', metadata[1]);
            this.loadInitialTableData(metadata[2]);
          })
        );  
      }
    },
    data() {
      return {
        // TODO: Extract fields from items' property names
        fields: [
          {
            key: 'exchange',
            label: 'Exchange',
            sortable: true
          },
          {
            key: "btc_buy",
            label: "BTC Buy $",
            sortable: true
          },
          {
            key: "btc_sell",
            label: "BTC Sell $",
            sortable: true
          },
          {
            key: "eth_buy",
            label: "ETH Buy $",
            sortable: true
          },
          {
            key: "eth_sell",
            label: "ETH Sell $",
            sortable: true
          }
        ],
        items: []
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>