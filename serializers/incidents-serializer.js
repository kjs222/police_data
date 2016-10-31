var incidents  = require('../models/incident');

function IncidentsSerializer() {
    this.paramsToFields = {number:         "number",
                           priority:       "priority",
                           beat:           "Beat.number",
                           neighborhood:   "Beat.neighborhood",
                           disp_code:      "Disposition.code",
                           disp_desc:      "Disposition.description",
                           call_code:      "CallType.code",
                           call_desc:      "CallType.description",
                           street:         "street",
                           street_number:  "street_number",
                           street_dir:     "street_dir",
                           date:           "date",
                           start_date:     "date",
                           end_date:       "date",
                           page:           "page"}
                        }

IncidentsSerializer.prototype.transformQuery = function(query) {
  var newQuery = {}
  for(var searchItem in query) {
    if(this.paramsToFields[searchItem] === "page") {
      continue;
    }
    else if(!this.paramsToFields[searchItem]) {
      newQuery["invalid_parameter"] = query[searchItem];
    }
    else if (searchItem === "date") {
      var start = query[searchItem] + "T00:00:00.000Z"
      var end = query[searchItem] + "T23:59:59.000Z"
      newQuery[this.paramsToFields[searchItem]] = { between: [start, end]}
    }
    else if (searchItem === "start_date"){
      newQuery[this.paramsToFields[searchItem]] = { gte: new Date(query[searchItem])}
    }
    else if (searchItem === "end_date"){
      newQuery[this.paramsToFields[searchItem]] = { lt: new Date(query[searchItem])}
    }
    else {
      newQuery[this.paramsToFields[searchItem]] = query[searchItem];
    };
  };
  return newQuery;
}

IncidentsSerializer.prototype.customizeJsonKeys = function(results) {
  results.total_incidents = results.count;
  results.incidents = results.rows;
  delete results.count;
  delete results.rows;
  return results;
}

IncidentsSerializer.prototype.serialize = function(results) {
  this.customizeJsonKeys(results);
  for(i in results["incidents"]) {
    results["incidents"][i] = results["incidents"][i].serialize();
  }
}

module.exports = IncidentsSerializer;
