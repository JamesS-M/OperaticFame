var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "james"));
var session = driver.session()



session
.run('Match (n) detach delete n')
.then(function (result) {
  console.log(result.summary.counters)
  console.log('Completed in ' + result.summary.resultAvailableAfter + ' ms')
})

