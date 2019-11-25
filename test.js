const pdf = require('html-pdf');
const fs = require('fs');

var options = { format: 'Letter' };
var html = fs.readFileSync('./public/doanhthu/template.html', 'utf-8');

pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
  if (err) return console.log(err);
  console.log(res);
});