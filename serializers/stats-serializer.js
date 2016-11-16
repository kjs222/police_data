function StatsSerializer() {
    this.intToMonth = {   1: "01 Ja",
                          2: "02 Feb",
                          3: "03 Mar",
                          4: "04 Apr",
                          5: "05 May",
                          6: "06 Jun",
                          7: "07 Jul",
                          8: "08 Aug",
                          9: "09 Sep",
                          10: "10 Oct",
                          11: "11 Nov",
                          12: "12 Dec"};
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
