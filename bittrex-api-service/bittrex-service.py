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
    price_url = api_url_base + c + '-' + targetCurrency + '/ticker'
    price_response = requests.get(price_url)
    buy_price = 0
    sell_price = 0
    if price_response.status_code == 200:
      price_json_data = json.loads(price_response.content.decode('utf-8'))
      buy_price = float(price_json_data['askRate'])
      sell_price = float(price_json_data['bidRate'])

    
    if buy_price > 0 and sell_price > 0:  
      # Object to send to Kafka
      price_data = {
        'currency_id': c,
        'buy_price': buy_price,
        'sell_price': sell_price
      }
      print (price_data)
      kafkaProducer.send('Bittrex', price_data)
    else:
      # Error pulling the price data, don't send to Kafka #TODO: Handle this differently, maybe save it to database that there was an error
      pass
    
def main():
  with open('config.json') as config_json:
    config = json.load(config_json)

    kafkaIp = config['kafkaBrokerIpPort']
    _kafkaProducer = KafkaProducer(bootstrap_servers=kafkaIp, value_serializer=lambda v: json.dumps(v).encode('utf-8'))

    _api_url_base = 'https://api.bittrex.com/v3/markets/' #TODO: Pull this from database
    _currencies = ['btc', 'eth'] #TODO: Pull this from database
    _targetCurrency = 'usd' #TODO: Pull this from database - support multiple target currencies
    
    schedule.every(1).minutes.do(stream_prices, api_url_base=_api_url_base, currencies=_currencies, targetCurrency=_targetCurrency, kafkaProducer=_kafkaProducer)
    while True:
      schedule.run_pending()
      time.sleep(1)

if __name__ == "__main__":
  main()