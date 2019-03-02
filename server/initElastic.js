const elasticsearch = require('elasticsearch');
const fs = require('fs');
const client =new elasticsearch.Client({
    hosts: ['http://localhost:9200']
});

client.ping({
    requestTimeout: 100000,
}, function(error) {
    if(error) {
        console.error("elasticsearch is down");
    } else {
        console.log('everything is ok');
    }
});

let dirname = './data';
fs.readdir(dirname, function(err, filenames) {
    if(err) {
        console.error(err);
        return;
    }
    filenames.forEach(function(filename) {
        fs.readFile(dirname + '/' + filename, 'utf-8', function(err, content) {
            if(err) {
                console.error(err);
                return;
            }
            
            let indexName = filename.split('.')[0];
            client.indices.create({
                index: indexName
            }, function(error, response, status) {
                if(error) {
                    console.error(error);
                }
                else {
                    console.log("created a new index", response);
                    // insert data
                    var bulk = [];
                    var data = JSON.parse(content)
                    data.forEach(sentence =>{
                    bulk.push({index:{
                            _index:indexName, 
                            _type:"sentence",
                        }          
                    });
                    bulk.push(sentence);
                    })
                    //perform bulk indexing of the data passed
                    client.bulk({body:bulk}, function( err, response  ){ 
                        if( err ){ 
                            console.log("Failed Bulk operation", err) 
                        } else { 
                            console.log("Successfully imported %s", data.length); 
                        } 
                    }); 
                }
            });
        })
    })
})
