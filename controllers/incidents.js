var models  = require('../models');
const querystring = require('querystring');

exports.getIncidents = function(req, res) {
  allIncidents(req, res)
};


var allIncidents = function(req, res) {
  var searchQuery = mapQuery(req.query);
  if (searchQuery["invalid_parameter"]) {
    return res.json({invalid_request: "unrecognized search parameter"})
  } else {
    models.Incident.findAll({where: searchQuery, limit: 100, include: [ models.Beat, models.Disposition, models.CallType ]}).then(function(incidents) {
      for(i in incidents) {
        incidents[i] = incidents[i].serialize();
      }
      return res.json(incidents);
    });
  };
}

var queryHashMap = {number: "number",
                    priority: "priority",
                    beat: "Beat.number",
                    neighborhood: "Beat.neighborhood",
                    disp_code: "Disposition.code",
                    disp_desc: "Disposition.description",
                    call_code: "CallType.code",
                    call_desc: "CallType.description",
                    street: "street",
                    street_number: "street_number",
                    street_dir: "street_dir",
                    date: "date",
                    start_date: "date",
                    end_date: "date"};

var mapQuery = function(query) {
  var newQuery = {}
  for(var searchItem in query) {
    if(!queryHashMap[searchItem]) {
      newQuery["invalid_parameter"] = query[searchItem];
    } else if (searchItem == "date") {
      var start = query[searchItem] + "T00:00:00.000Z"
      var end = query[searchItem] + "T23:59:59.000Z"
      newQuery[queryHashMap[searchItem]] = { between: [start, end]}
    } else if (searchItem == "start_date"){
      newQuery[queryHashMap[searchItem]] = { gte: new Date(query[searchItem])}
    } else if (searchItem == "end_date"){
      newQuery[queryHashMap[searchItem]] = { lt: new Date(query[searchItem])}
    } else {
      newQuery[queryHashMap[searchItem]] = query[searchItem];
    };
  };
  return newQuery;
};
