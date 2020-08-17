
const config = require('./config.json');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const MongoClient = require('mongodb').MongoClient;
const cassandra = require('cassandra-driver');
const kafka = require('kafka-node');
const utils = require('./scripts/utils.js')

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

let currencies = [];
let exchanges = [];
// let latestPrices = [];

let latestPrices = [
  {"exchange": "Coinbase", "btc_buy": 11800.70, "btc_sell": 11750.60, "eth_buy": 420.40, "eth_sell": 410.65},
  {"exchange": "Bittrex", "btc_buy": 11770.90, "btc_sell": 11760.45, "eth_buy": 430.35, "eth_sell": 400.25}
];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// TODO: Bind table names in queries
const cassandraQueries = [
  {
    "table": config.cassandraTables[0],
    "query": 'SELECT buy_price, sell_price FROM Coinbase WHERE coin_id = ? ORDER BY price_timestamp DESC LIMIT 1'
  },
  {
    "table": config.cassandraTables[1],
    "query": 'SELECT buy_price, sell_price FROM Bittrex WHERE coin_id = ? ORDER BY price_timestamp DESC LIMIT 1'
  }
];

// const cassandraClient = new cassandra.Client({
//   contactPoints: [config.cassandraIp],
//   localDataCenter: config.cassandraDataCenter,
//   keyspace: config.cassandraKeyspace
// });

// MongoClient.connect(config.mongoDbConnectionString, {
//   useUnifiedTopology: true }, 
//   (err, client) => {
//     if (err) return console.error(err);
//     console.log('Connected to Mongo Database');
//     const db = client.db(config.mongoDbName);

//     db.collection('exchanges').findOne()
//     .then(exchangesResult => {
//       console.log("Exchanges: " + exchangesResult.exchanges);
//       exchanges = exchangesResult.exchanges;
//     })
//     .catch(error => console.error(error));

//     db.collection('currencies').findOne()
//     .then(currenciesResult => {
//       console.log("Currencies: " + currenciesResult.currencies);
//       currencies = currenciesResult.currencies;

//       cassandraQueries.forEach(cassandraQuery => {
//         let priceObj = {};
//         //priceObj['exchange'] = cassandraQuery.table;
//         currencies.forEach(_currency => {
//           cassandraClient.execute(cassandraQuery.query, [_currency])
//           .then(cassandraResult => {
//             priceObj['exchange'] = cassandraQuery.table;
//             priceObj[_currency + '_buy'] = cassandraResult['rows'][0]['buy_price'].toFixed(2); // Only one record
//             priceObj[_currency + '_sell'] = cassandraResult['rows'][0]['sell_price'].toFixed(2); // Only one record
//           }).catch(error => console.error(error)); 
//         });
//         latestPrices.push(priceObj);
//       });
//     })
//     .catch(error => console.error(error));
//   }
// );

// let Consumer = kafka.Consumer;
// kafkaClient = new kafka.KafkaClient(config.kafkaIp);
// kafkaConsumer = new Consumer(
//   kafkaClient,
//   [ { topic: config.kafkaTopics[0], partitions: 0 }, { topic: config.kafkaTopics[1], partitions: 1 } ], 
//   { autoCommit: false }
// ); 

http.listen(config.port, () => {
  console.log('listening on *:' + config.port);
});

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

app.get('/metadata', (req, res) => {
  console.log('metadata called from frontend');
  let metadata = [currencies, exchanges, latestPrices];
  res.send(metadata);
});

io.on("connection", socket => {
  socket.on('disconnect', () => {
      console.log("A user disconnected");
  });
  console.log('client connected');

  let priceObj1 = {
    "exchange": "Coinbase",
    "btc_buy": 11699.95,
    "btc_sell": 11678.25,
    "eth_buy": 428.95,
    "eth_sell": 415.43
  }

  let priceObj2 = {
    "exchange": "Coinbase",
    "btc_buy": 11900.29,
    "btc_sell": 11875.15,
    "eth_buy": 421.45,
    "eth_sell": 403.47
  }

  let priceObj3 = {
    "exchange": "Bittrex",
    "btc_buy": 11719.37,
    "btc_sell": 11698.59,
    "eth_buy": 427.41,
    "eth_sell": 412.67
  }

  let priceObj4 = {
    "exchange": "Bittrex",
    "btc_buy": 11999.38,
    "btc_sell": 11900.99,
    "eth_buy": 473.44,
    "eth_sell": 469.83
  }

  let randomArray = [priceObj1, priceObj2, priceObj3, priceObj4];

  setInterval(function() {
    let rand_int = getRandomInt(4);
    socket.broadcast.emit("newdata", randomArray[rand_int]);
  }, 10000);

  // kafkaConsumer.on('message', function (message) {
  //   // console.log('Kafka message:' + JSON.stringify(message));
  //   // console.log(message.topic);
  //   // console.log(message['value'].currency_id);

  //   messageObj = JSON.parse(message);
  //   console.log(messageObj);

  //   // let priceObj = {};
  //   // priceObj['exchange'] = message['topic'];
  //   // priceObj[message.currency_id + '_buy'] = message['value']['buy_price'].toFixed(2);
  //   // priceObj[message.currency_id + '_sell'] = message['value']['sell_price'].toFixed(2);

  //   // const exchangeIndex = latestPrices.map(e => e.exchange).indexOf(message.topic);

  //   // if(!utils.objectsEqual(latestPrices[exchangeIndex], priceObj)) { // Only update and send to frontend if there is a change in prices
  //   //   socket.broadcast.emit("newdata", priceObj);
  //   //   latestPrices[exchangeIndex] = priceObj;
  //   // }
  // });
});