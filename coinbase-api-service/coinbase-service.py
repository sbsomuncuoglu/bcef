import json
import requests
from kafka import KafkaProducer
import functools
import schedule
import time

def catch_exceptions(cancel_on_failure=False):
  def catch_exceptions_decorator(job_func):
    @functools.wraps(job_func)
    def wrapper(*args, **kwargs):
      try:
        return job_func(*args, **kwargs)
      except:
        import traceback
        print(traceback.format_exc())
        if cancel_on_failure:
          return schedule.CancelJob
    return wrapper
  return catch_exceptions_decorator

@catch_exceptions(cancel_on_failure=True)
def stream_prices(api_url_base, currencies, targetCurrency, kafkaProducer):
  for c in currencies:
    buy_price_url = api_url_base + c + '-' + targetCurrency + '/buy'
    buy_price_response = requests.get(buy_price_url)
    buy_price = 0
    if buy_price_response.status_code == 200:
      buy_price_json_data = json.loads(buy_price_response.content.decode('utf-8'))
      buy_price = float(buy_price_json_data['data']['amount'])
    
    sell_price_url = api_url_base + c + '-' + targetCurrency + '/sell'
    sell_price_response = requests.get(sell_price_url)
    sell_price = 0
    if sell_price_response.status_code == 200:
      sell_price_json_data = json.loads(sell_price_response.content.decode('utf-8'))
      sell_price = float(sell_price_json_data['data']['amount'])

    if buy_price > 0 and sell_price > 0:
      # Object to send to Kafka
      price_data = {
        'currency_id': c,
        'buy_price': buy_price,
        'sell_price': sell_price
      }
      print (price_data)
      kafkaProducer.send('Coinbase', price_data)
    else:
      # Error pulling the price data, don't send to Kafka #TODO: Handle this differently, maybe save it to database that there was an error
      pass

def main():
  with open('config.json') as config_json:
    config = json.load(config_json)

    kafkaIp = config['kafkaBrokerIpPort']
    _kafkaProducer = KafkaProducer(bootstrap_servers=kafkaIp, value_serializer=lambda v: json.dumps(v).encode('utf-8'))

    _api_url_base = 'https://api.coinbase.com/v2/prices/'
    _currencies = ['btc', 'eth'] #TODO: Pull this from database
    _targetCurrency = 'usd' #TODO: Pull this from database - support multiple target currencies

    schedule.every(1).minutes.do(stream_prices, api_url_base=_api_url_base, currencies=_currencies, targetCurrency=_targetCurrency, kafkaProducer=_kafkaProducer)
    while True:
      schedule.run_pending()
      time.sleep(1)

if __name__ == "__main__":
  main()