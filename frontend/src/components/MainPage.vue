<template>
  <div class="main">
    <b-container fluid>
      <b-row>
        <b-col></b-col>
          <b-col cols="10">
              <h1>
                {{ welcomeMsg }}
              </h1>
          </b-col>
        <b-col></b-col>
      </b-row>
      <b-row>
        <b-col></b-col>
          <b-col cols="8">
              <p>
                  {{infoMsg}}
              </p>
          </b-col>
        <b-col></b-col>
      </b-row>
    </b-container>

    <b-container fluid>
      <b-row>
        <b-col></b-col>
          <b-col cols="10">
              <DataTable />
          </b-col>
        <b-col></b-col>
      </b-row>
    </b-container>

    <b-container fluid>
      <b-row>
        <b-col cols="5"></b-col>
          <b-col>
              <BestExchanges />
          </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script>
import DataTable from './DataTable.vue'
import BestExchanges from './BestExchanges.vue'

export default {
  name: 'MainPage',
  components: {
    DataTable,
    BestExchanges
  },
  props: {
    welcomeMsg: String,
    infoMsg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
