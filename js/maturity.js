/*
var data_V1 = [{
  "Type": "Mature Students",
  "Amount": 600,
  "Description": ""
}, {
  "Type": "UnMatured Students",
  "Amount": 400,
  "Description": ""
}, ];*/

var groupBy = function(xs, key) {
return xs.reduce(function(rv, x) {
  (rv[x[key]] = rv[x[key]] || []).push(x);
  return rv;
}, {});
};

var xmlhttp = new XMLHttpRequest();
var url = "./json/att_data.json";

xmlhttp.onreadystatechange = function() {
if (this.readyState == 4 && this.status == 200) {
    var myArr = JSON.parse(this.responseText);
    myFunction(myArr);
    // console.log("myArr",myArr);
}
};
xmlhttp.open("GET", url, true);
xmlhttp.send();


function myFunction(arr) {
  abv21 = [];
below21= [];
age_ar= [];
// console.log("inside fuction",arr.attendanceData.length);
var groupedBySid_data = groupBy(arr.attendanceData, 'StudentID');
// console.log(groupedBySid_data)

$.each(groupedBySid_data, function(index, data) {
    var s_id = data[0].StudentID;
    var age = data[0].Age;
// AGE arrays are declared below 
    age_ar.push(age);
    if(age <= 21){
      below21.push(s_id);
    }else{
      abv21.push(s_id);
    }
    
});


/*console.log("below21",below21.length);
console.log("abv21",abv21.length);*/

var per_abv_21 = ((abv21.length)/(below21.length + abv21.length) * 100).toFixed(1);
var per_below_21 = ((below21.length)/(below21.length + abv21.length) * 100).toFixed(1);

/*console.log("per_abv_21",per_abv_21);
console.log("per_below_21",per_below_21);*/

var data_V1 = [{
  "Type": "Mature Students",
  "Amount": per_abv_21,
  "Description": ""
}, {
  "Type": "UnMatured Students",
  "Amount": per_below_21,
  "Description": ""
}, ];

draw_graph(data_V1)
}



function draw_graph(data_V1){
  var width = parseInt(d3.select('#pieChart').style('width'), 10);
var height = width;
var radius = (Math.min(width, height) - 15) / 2;

var type = function getObject(obj) {
  types = [];
  for (var i = 0; i < obj.length; i++) {
    types.push(obj[i].Type);
  }
  return types
};
var arcOver = d3.svg.arc()
  .outerRadius(radius + 10)
  .innerRadius(150);

var color = d3.scale.ordinal()
  .domain(type(data_V1))
  .range(["#8A76A6", "#54B5BF", "#8EA65B", "#F27B35"]);

/*var color = d3.scale.category20();
color.domain(type(data))*/

var arc = d3.svg.arc()
  .outerRadius(radius - 10)
  .innerRadius(150);

var pie = d3.layout.pie()
  .sort(null)
  .value(function(d) {
    return +d.Amount;
  });

change = function(d, i) {
  var angle = 90 - ((d.startAngle * (180 / Math.PI)) + ((d.endAngle - d.startAngle) * (180 / Math.PI) / 2))
  svg.transition()
    .duration(1000)
    .attr("transform", "translate(" + radius + "," + height / 2 + ") rotate(" + angle + ")")
  d3.selectAll("path")
    .transition()
    .attr("d", arc)
  d3.select(i)
    .transition()
    .duration(1000)
    .attr("d", arcOver)
};

var svg = d3.select("#pieChart").append("svg")
  .attr("width", '25%')
  .attr("height", '25%')
  .attr('viewBox', '0 0 ' + Math.min(width, height) + ' ' + Math.min(width, height))
  .attr('preserveAspectRatio', 'xMinYMin')
  .append("g")
  .attr("transform", "translate(" + radius + "," + height / 2 + ")");

var g = svg.selectAll("path")
  .data(pie(data_V1))
  .enter().append("path")
  .style("fill", function(d) {
    return color(d.data.Type);
  })
  .attr("d", arc)
  .style("fill", function(d) {
    return color(d.data.Type);
  })
  .on("click", function(d) {
    change(d, this);
    $('.text-container').hide();
    $('#segmentTitle').replaceWith('<h3 id="segmentTitle">' + d.data.Type + ": " + d.data.Amount + '%</h3>');
    $('#')
    $('#segmentText').replaceWith('<p id="segmentText">' + d.data.Description + '</p>');
    $('.text-container').fadeIn(400);
  });
}

// document.querySelector('style').textContent += '@media(max-width:767px) {#pieChart { transform: rotate(90deg); transform-origin: 50% 50%; transition: 1s; max-width: 50%; } .text-container { width: 100%; min-height: 0; }} @media(min-width:768px) {#pieChart { transition: 1s;}}'