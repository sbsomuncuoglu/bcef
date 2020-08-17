<template>
  <div id="app">
    <b-container fluid>
      <b-row>
        <b-col></b-col>
          <b-col cols="10">
              <b-img src="./assets/logo.png" fluid alt="Logo" class="small-image"></b-img>
          </b-col>
        <b-col></b-col>
      </b-row>  
    </b-container>
    <div class="spacer"></div>
    <MainPage 
      welcomeMsg="Welcome to Best Crypto Exchange Finder" 
      infoMsg="You can see the prices of cryptocurrencies and best exchanges to buy them in the below table"
    />
  </div>
</template>

<script>
import MainPage from './components/MainPage.vue'

export default {
  name: 'App',
  components: {
    MainPage
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.small-image {
  width: 7%;
  height: auto;
}

.spacer { 
  margin: 0; 
  padding: 0; 
  height: 1rem; 
}
</style>
