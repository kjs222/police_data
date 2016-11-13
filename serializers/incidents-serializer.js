var incidents  = require('../models/incident');

function IncidentsSerializer() {
    this.paramsToFields = {number:         "number",
                           priority:       "priority",
                           beat:           "number",
                           neighborhood:   "neighborhood",
                           disp_code:      "code",
                           disp_desc:      "description",
                           call_code:      "code",
                           call_desc:      "description",
                           street:         "street",
                           street_number:  "street_number",
                           street_dir:     "street_dir",
                           date:           "date",
                           start_date:     "date",
                           end_date:       "date",
                           month:          "date",
                           page:           "page"}
                        }

IncidentsSerializer.prototype.transformQuery = function(query) {
  var incidentQuery = {};
  var beatQuery = {};
  var dispQuery = {};
  var callQuery = {};
  for(var searchItem in query) {
    if(this.paramsToFields[searchItem] === "page") {
      continue;
    }
    else if(!this.paramsToFields[searchItem]) {
      incidentQuery["invalid_parameter"] = query[searchItem];
    }
    else if (searchItem === "date") {
      var start = query[searchItem] + "T00:00:00.000PST8PDT"
      var end = query[searchItem] + "T23:59:59.000PST8PDT"
      incidentQuery[this.paramsToFields[searchItem]] = { between: [start, end]}
    }
    else if (searchItem === "start_date"){
      incidentQuery[this.paramsToFields[searchItem]] = { gte: new Date(query[searchItem])}
    }
    else if (searchItem === "end_date"){
      incidentQuery[this.paramsToFields[searchItem]] = { lt: new Date(query[searchItem])}
    }
    else if (searchItem === "month"){
      var start = new Date(query[searchItem]);
      var end = new Date(start.getFullYear(), start.getMonth()+1, 1)
      incidentQuery[this.paramsToFields[searchItem]] = { gte: start };
      incidentQuery[this.paramsToFields[searchItem]] = { lt: end };
    } else if (searchItem === "beat" || searchItem === "neighborhood" ){
      beatQuery[this.paramsToFields[searchItem]] = query[searchItem]
    } else if (searchItem === "disp_code" || searchItem === "disp_desc" ){
      dispQuery[this.paramsToFields[searchItem]] = query[searchItem]
    } else if (searchItem === "call_code" || searchItem === "call_desc" ){
      callQuery[this.paramsToFields[searchItem]] = query[searchItem]
    } else {
      incidentQuery[this.paramsToFields[searchItem]] = query[searchItem];
    };
  };
  return {incidents: incidentQuery, beats: beatQuery, dispositions: dispQuery, calls: callQuery};
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
