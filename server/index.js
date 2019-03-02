const express = require( 'express' );
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const elasticsearch = require('elasticsearch');
// instantiate an elasticsearch client
const client = new elasticsearch.Client({
   hosts: [ 'http://localhost:9200']
});

// ping the client to be sure Elasticsearch is up
client.ping({
     requestTimeout: 30000,
 }, function(error) {
 // at this point, eastic search is down, please check your Elasticsearch service
     if (error) {
         console.error('elasticsearch cluster is down!');
     } else {
         console.log('Everything is ok');
     }
 });

 app.use(cors());
 app.use(bodyParser.json());

app.post('/search', function (req, res){
  // declare the query object to search elastic server and return 5 results from the first result found. 
  // also match any data where the data contains one or more keywords.
  console.log(req.body.keywords.split(','));
  let body = {
    size: 5,
    from: 0, 
    query: {
      match: {
          data: req.body.keywords
      }
    }
  }
  // perform the actual search passing in the index, the search query and the type
  client.search({index:'funny-jokes-1',  body:body, type:'sentence'})
  .then(results => {
    let data = [];
    results.hits.hits.forEach((hit) => {
        data.push(hit._source.data);
    })
    console.log(results);
    res.json({result: data});
  })
  .catch(err=>{
    console.log(err)
    res.send([]);
  });

})
// listen on the specified port
app .listen(8000, function(){
  console.log( 'Express server listening on port 8000');
} );