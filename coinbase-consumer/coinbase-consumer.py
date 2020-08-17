import sys
import json
from kafka import KafkaConsumer
from cassandra.cluster import Cluster

try:
  #print("Running coinbase-consumer.py")
  with open('config.json') as config_json:
    config = json.load(config_json)

    cassandraIp = config['cassandraIp']
    cassandraPort = config['cassandraPort']

    cluster = Cluster([cassandraIp], port = cassandraPort)
    session = cluster.connect('prices')

    kafkaBrokerIpPort = config['kafkaBrokerIpPort']
    consumer = KafkaConsumer('Coinbase', bootstrap_servers = kafkaBrokerIpPort)

    for message in consumer:
      entry = json.loads(message.value)
      print("Log: {}".format(entry))
      print("--------------------------------------------------")
      session.execute(
        """
          INSERT INTO Coinbase (coin_id, price_timestamp, buy_price, sell_price)
          VALUES (%s, toTimestamp(now()), %s, %s)
        """,
        (entry['currency_id'],
        float(entry['buy_price']),
        float(entry['sell_price'])))  
  
except KeyboardInterrupt:
  sys.exit()