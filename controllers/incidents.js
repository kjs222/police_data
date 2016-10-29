var models  = require('../models');
const querystring = require('querystring');

exports.getIncidents = function(req, res) {
  allIncidents(req, res)
};

var allIncidents = function(req, res) {
  var page = req.query["page"] || 1;
  var offset = 100 * (page - 1);
  var searchQuery = transformQuery(req.query);

  if (searchQuery["invalid_parameter"]) {
    return res.json({invalid_request: "unrecognized search parameter"})
  } else {
    models.Incident.findAndCountAll({where: searchQuery,
                                     offset: offset,
                                     limit: 100,
                                     order: '"date" ASC',
                                     include: [ models.Beat, models.Disposition, models.CallType ]})
                    .then(function(results) {
                                    customizeJsonKeys(results);
                                    serializeIncidents(results);
                                    return res.json(results);
    });
  };
}

var queryHashMap = {number:         "number",
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
    if(queryHashMap[searchItem] === "page") {
      continue;
    }
    else if(!queryHashMap[searchItem]) {
      newQuery["invalid_parameter"] = query[searchItem];
    }
    else if (searchItem === "date") {
      var start = query[searchItem] + "T00:00:00.000Z"
      var end = query[searchItem] + "T23:59:59.000Z"
      newQuery[queryHashMap[searchItem]] = { between: [start, end]}
    }
    else if (searchItem === "start_date"){
      newQuery[queryHashMap[searchItem]] = { gte: new Date(query[searchItem])}
    }
    else if (searchItem === "end_date"){
      newQuery[queryHashMap[searchItem]] = { lt: new Date(query[searchItem])}
    }
    else {
      newQuery[queryHashMap[searchItem]] = query[searchItem];
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
