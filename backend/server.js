
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
let latestPrices = [];

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

const cassandraClient = new cassandra.Client({
  contactPoints: [config.cassandraIp],
  localDataCenter: config.cassandraDataCenter,
  keyspace: config.cassandraKeyspace
});

MongoClient.connect(config.mongoDbConnectionString, {
  useUnifiedTopology: true }, 
  (err, client) => {
    if (err) return console.error(err);
    console.log('Connected to Mongo Database');
    const db = client.db(config.mongoDbName);

    db.collection('exchanges').findOne()
    .then(exchangesResult => {
      console.log("Exchanges: " + exchangesResult.exchanges);
      exchanges = exchangesResult.exchanges;
    })
    .catch(error => console.error(error));

    db.collection('currencies').findOne()
    .then(currenciesResult => {
      console.log("Currencies: " + currenciesResult.currencies);
      currencies = currenciesResult.currencies;

      cassandraQueries.forEach(cassandraQuery => {
        let priceObj = {};
        currencies.forEach(_currency => {
          cassandraClient.execute(cassandraQuery.query, [_currency])
          .then(cassandraResult => {
            priceObj['exchange'] = cassandraQuery.table;
            priceObj[_currency + '_buy'] = cassandraResult['rows'][0]['buy_price'].toFixed(2); // Only one record
            priceObj[_currency + '_sell'] = cassandraResult['rows'][0]['sell_price'].toFixed(2); // Only one record
          }).catch(error => console.error(error)); 
        });
        latestPrices.push(priceObj);
      });
    })
    .catch(error => console.error(error));
  }
);

let Consumer = kafka.Consumer;
kafkaClient = new kafka.KafkaClient(config.kafkaIp);
kafkaConsumer = new Consumer(
  kafkaClient,
  [ { topic: config.kafkaTopics[0], partitions: 0 }, { topic: config.kafkaTopics[1], partitions: 1 } ], 
  { autoCommit: false }
); 

http.listen(config.port, () => {
  console.log('listening on *:' + config.port);
});

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

  kafkaConsumer.on('message', function (message) {
    // console.log('Kafka message:' + JSON.stringify(message));
    // console.log(message.topic);
    // console.log(message['value'].currency_id);

    messageObj = JSON.parse(message);
    console.log(messageObj);

    let priceObj = {};
    priceObj['exchange'] = message['topic'];
    priceObj[message.currency_id + '_buy'] = message['value']['buy_price'].toFixed(2);
    priceObj[message.currency_id + '_sell'] = message['value']['sell_price'].toFixed(2);

    socket.broadcast.emit("newdata", priceObj);
  });
});