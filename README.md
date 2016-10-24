Goals:

* make City of San Diego police incident data accessible, searchable and useable
* help users build effective search queries
* help user visualize the data

[production site](https://sandiego-police-data.herokuapp.com)

current API endpoints:
```
/api/v1/incidents
/api/v1/beats
/api/v1/dispositions
/api/v1/call_types  
```

the `/api/v1/incidents` endpoint takes a number of optional search params:
```
number
priority
beat
neighborhood
disp_code
disp_desc
call_code
call_desc
street
street_number
date
start_date
end_date
```

some sample queries:
```
/api/v1/incidents?priority=1
/api/v1/incidents?date=2015-04-17
/api/v1/incidents?start_date=2015-04-17
/api/v1/incidents?street=El Cajon
```

queries can be chained
