function StatsSerializer() {
    this.intToMonth = {   1: "January",
                          2: "February",
                          3: "March",
                          4: "April",
                          5: "May",
                          6: "June",
                          7: "July",
                          8: "August",
                          9: "September",
                          10: "October",
                          11: "November",
                          12: "December"};
    this.abrevToType =   {"A": "Arrest",
                          "R": "Report",
                          "K": "No Report",
                          "U": "Unfounded",
                          "O": "Other"}
}

StatsSerializer.prototype.serializeDispositionStats = function(results) {
    results.forEach(function(result) {
      result["type"] = this.abrevToType[result["type"]];
      result["month"]= this.intToMonth[result["month"]];
    }, this);
}

module.exports = StatsSerializer;
