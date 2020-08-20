# Best Crypto Exchange Finder

<h3>System Design</h3>
&nbsp;

![System Design](./diagram.png?raw=true "System Design")

<h3>How to Build/Run</h3>
&nbsp;

Live version is available at http://18.215.135.131:8080 between 12 pm - 6 pm EST.

Under ```bcef``` directory, run ```docker-compose up -d```. 

Sometimes it takes too long for Kafka to start and create topics. Even though the ```backend``` container waits for Kafka to start, it'll start before Kafka and fail when it exceeds the timeout. In that case, ```backend``` container should be restarted.  

Connection string in ```/backend/config.json``` should also be modified to talk to a Mongo database.
IP address of the Node API under ```frontend/src/store/store.js and frontend/src/components/DataTable.vue``` also should be modified if you're running this setup on a different server.

<h3>Future Work</h3>
&nbsp;

- Test on different browsers/devices. Make sure UI looks good.
- Write unit tets.
- Build a proper CI/CD pipeline.
- Implement user signup/login and allow users to save their exchange/cryptocurrency preferences.
- Distribute Docker containers into different instances using AWS ECS.
- Add monitoring.
- Extend Kafka to multiple brokers/nodes.
- Extend Cassandra database to multiple nodes.