var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/police_data';

var client = new pg.Client(connectionString);
client.connect();

var query = client.query('CREATE TABLE call_types(id SERIAL PRIMARY KEY, code VARCHAR(20) not null, description VARCHAR(100))');

query.on('end', function() { client.end(); });
