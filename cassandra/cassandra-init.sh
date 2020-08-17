CQL="DROP keyspace prices;
CREATE KEYSPACE IF NOT EXISTS prices WITH replication = { 'class':'NetworkTopologyStrategy', 'datacenter1' : 1 };
CREATE TABLE IF NOT EXISTS prices.Coinbase (coin_id text, price_timestamp timestamp, buy_price float, sell_price float, PRIMARY KEY(coin_id, price_timestamp));
CREATE TABLE IF NOT EXISTS prices.Bittrex (coin_id text, price_timestamp timestamp, buy_price float, sell_price float, PRIMARY KEY(coin_id, price_timestamp));"

until echo $CQL | cqlsh "cassandra"; do
  echo "cqlsh: Cassandra is unavailable to initialize - will retry later"
  sleep 2
done &

exec /docker-entrypoint.sh "$@"