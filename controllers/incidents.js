var models  = require('../models');
const querystring = require('querystring');

exports.getIncidents = function(req, res) {
  allIncidents(req, res)
};

var allIncidents = function(req, res) {
    var searchQuery = transformQuery(req.query);
    if (searchQuery["invalid_parameter"]) {
      return res.json({invalid_request: "unrecognized search parameter"})
    };
    models.Incident.findByQuery(models, searchQuery)
                   .then(function(results) {
                        customizeJsonKeys(results);
                        serializeIncidents(results);
                        return res.json(results);
    });
};

var paramsToModelFields =
                   {number:         "number",
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
                    page:           "page"};

var transformQuery = function(query) {
  var newQuery = {}
  for(var searchItem in query) {
    if(paramsToModelFields[searchItem] === "page") {
      continue;
    }
    else if(!paramsToModelFields[searchItem]) {
      newQuery["invalid_parameter"] = query[searchItem];
    }
    else if (searchItem === "date") {
      var start = query[searchItem] + "T00:00:00.000Z"
      var end = query[searchItem] + "T23:59:59.000Z"
      newQuery[paramsToModelFields[searchItem]] = { between: [start, end]}
    }
    else if (searchItem === "start_date"){
      newQuery[paramsToModelFields[searchItem]] = { gte: new Date(query[searchItem])}
    }
    else if (searchItem === "end_date"){
      newQuery[paramsToModelFields[searchItem]] = { lt: new Date(query[searchItem])}
    }
    else {
      newQuery[paramsToModelFields[searchItem]] = query[searchItem];
    };
  };
  return newQuery;
};

var customizeJsonKeys = function(results) {
  var count = results[0];
  var incidents = results[1];
  results.total_incidents = results.count;
  results.incidents = results.rows;
  delete results.count;
  delete results.rows;
  return results;
}

var serializeIncidents = function(results) {
  for(i in results["incidents"]) {
    results["incidents"][i] = results["incidents"][i].serialize();
  }
}
