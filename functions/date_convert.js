const csv = '/Users/James/Desktop/Calendar.csv'
const csvtojson=require('csvtojson/v1')
const fs = require('fs')
const Json2csvParser=require('json2csv').Parser;

function redoDate(date) {
  let str = date.toString();
  let regex = / /
  if (regex.test(str)) {
    var res = str.split(" ");
    if (res[1]) {
    return res[2] + '-' + res[1] + '-' + res[0]
    }
  }
}

csvtojson()
.fromFile(csv)
.on('json', (jsonObj, rowIndex) => {
  let dirtyDates = jsonObj['14 October 1795']
  (redoDate(dirtyDates))
})