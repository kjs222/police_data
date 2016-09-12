var models  = require('../models');
const querystring = require('querystring');

exports.getIncidents = function(req, res) {
  allIncidents(req, res)
};


var allIncidents = function(req, res) {
  search_terms = mapQuery(req.query)
  if (search_terms["invalid_parameter"]) {
    return res.json({invalid_request: "unrecognized search parameter"})
  } else {
    models.Incident.findAll({where: mapQuery(req.query), limit: 100, include: [ models.Beat, models.Disposition, models.CallType ]}).then(function(incidents) {
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
                    street_dir: "street_dir"};

var mapQuery = function(query) {
  var newQuery = {}
  for(var searchItem in query) {
    if(!queryHashMap[searchItem]) {
      newQuery["invalid_parameter"] = query[searchItem];
    } else {
      newQuery[queryHashMap[searchItem]] = query[searchItem];
    };
  };
  return newQuery;
};
