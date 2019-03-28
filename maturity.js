    var le = [
      {ID: '01',Age: 21,color: '#000000'},
      {ID: '02',Age: 19,color: '#00a2ee'},
      {ID: '03',Age: 20,color: '#fbcb39'},
      {ID: '04',Age: 21,color: '#007bc8'},
      {ID: '05',Age: 18,color: '#65cedb'},
      {ID: '06',Age: 25,color: '#ff6e52'},
      {ID: '07',Age: 23,color: '#f9de3f'},
      {ID: '08',Age: 26,color: '#5d2f8e'},
      {ID: '09',Age: 18,color: '#008fc9'},
      {ID: '10',Age: 22,color: '#507dca'},
      {ID: '11',Age: 22,color: '#507dca'},
      {ID: '12',Age: 22,color: '#507dca'},
      {ID: '13',Age: 22,color: '#507dca'},
      {ID: '14',Age: 22,color: '#507dca'},
      {ID: '15',Age: 22,color: '#507dca'},
      {ID: '16',Age: 22,color: '#507dca'},
      {ID: '17',Age: 22,color: '#507dca'},
      {ID: '18',Age: 22,color: '#507dca'},
      {ID: '19',Age: 22,color: '#507dca'},
      {ID: '20',Age: 22,color: '#507dca'},
      {ID: '21',Age: 22,color: '#507dca'},
      {ID: '22',Age: 22,color: '#507dca'},
      {ID: '23',Age: 22,color: '#507dca'},
      {ID: '24',Age: 22,color: '#507dca'},
      {ID: '25',Age: 22,color: '#507dca'}
    ];
    

  var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  var occurrence = function (array) {
    "use strict";
    var result = {};
    if (array instanceof Array) {
        array.forEach(function (v, i) {
            if (!result[v]) {
                result[v] = [i];
            } else {
                result[v].push(i);
            }
        });
    }
    return result;
};

  // var maturity_data = [];
  // $.getJSON('./att_data.json', function(json) {
  //   var ttl_std_count = json.attendanceData.length;
  // console.log(ttl_std_count);
  //   var groupedBySid_data = groupBy(json.attendanceData, 'StudentID');
  //   /*console.log(groupedBySid_data);*/
  //   var age_ar = [];
  //   $.each(groupedBySid_data, function(index, data) {
  //     var s_id = data[0].StudentID;
  //     var age = data[0].Age;
  //     /*console.log(s_id+' - '+age);*/
  //     age_ar.push(age);
  //   });
  //   var min_age = Math.min.apply(null, age_ar);
  //   var max_age = Math.max.apply(null, age_ar);
  //   /*console.log(min_age+'-'+max_age);*/

  //   var repval_count = occurrence(age_ar);
  //   /*console.log(repval_count);*/
  //   $.each(repval_count, function(index, data) {
  //     var age_value = index;
  //     var age_occurence_count = data.length;
  //     var age_occurence_count_percentage = (((data.length/ttl_std_count) * 100).toFixed(3)*100).toFixed(2);
  //     console.log('Age Value : '+age_value+' >>> Age Occurence Count : '+age_occurence_count+' >>> Age Occurence Count Pretcentage : '+age_occurence_count_percentage+'%')
  //     item = {};
  //     item ["age"] = age_value;
  //     item ["occurence_count"] = age_occurence_count;
  //     item ["occurence_count_percentage"] = age_occurence_count_percentage;

  //     maturity_data.push(item); 
  //   });
  // });
  // console.log(maturity_data)
  
var xmlhttp = new XMLHttpRequest();
var url = "./att_data.json";

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        myFunction(myArr);
        console.log("myArr",myArr);
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();



function myFunction(arr) {
  console.log("inside fuction",arr.attendanceData);
  var sample = arr.attendanceData;
}



    var svgContainer = d3.select('#container');
    var svg = d3.select('svg');
    
    var margin = 80;
    var width = 1000 - 2 * margin;
    var height = 600 - 2 * margin;

    var chart = svg.append('g')
      .attr('transform', `translate(${margin}, ${margin})`);

    var xScale = d3.scaleBand()
      .range([0, width])
      .domain(sample.map((s) => s.ID))
      .padding(0.4)
      
      // var formatPercent = d3.format(".0%")
    var yScale = d3.scaleLinear()
      .range([height, 0])
      // .tickFormat(formatPercent)
      .domain([0, 100]);

    // vertical grid lines
    // var makeXLines = () => d3.axisBottom()
    //   .scale(xScale)

    var makeYLines = () => d3.axisLeft()
      .scale(yScale)

    chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    chart.append('g')
      .call(d3.axisLeft(yScale));

    // vertical grid lines
    // chart.append('g')
    //   .attr('class', 'grid')
    //   .attr('transform', `translate(0, ${height})`)
    //   .call(makeXLines()
    //     .tickSize(-height, 0, 0)
    //     .tickFormat('')
    //   )

    chart.append('g')
      .attr('class', 'grid')
      .call(makeYLines()
        .tickSize(-width, 0, 0)
        .tickFormat('')
      )

    var barGroups = chart.selectAll()
      .data(sample)
      .enter()
      .append('g')

    barGroups
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (g) => xScale(g.ID))
      .attr('y', (g) => yScale(g.Age))
      .attr('height', (g) => height - yScale(g.Age))
      .attr('width', xScale.bandwidth())
      .on('mouseenter', function (actual, i) {
        d3.selectAll('.Age')
          .attr('opacity', 0)

        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 0.6)
          .attr('x', (a) => xScale(a.ID) - 5)
          .attr('width', xScale.bandwidth() + 10)

        var y = yScale(actual.Age)

        line = chart.append('line')
          .attr('id', 'limit')
          .attr('x1', 0)
          .attr('y1', y)
          .attr('x2', width)
          .attr('y2', y)

        barGroups.append('text')
          .attr('class', 'divergence')
          .attr('x', (a) => xScale(a.ID) + xScale.bandwidth() / 2)
          .attr('y', (a) => yScale(a.Age) + 30)
          .attr('fill', 'white')
          .attr('text-anchor', 'middle')
          .text((a, idx) => {
            var divergence = (a.Age - actual.Age).toFixed(1)
            
            let text = ''
            if (divergence > 0) text += '+'
            text += `${divergence}`

            return idx !== i ? text : '';
          })

      })
      .on('mouseleave', function () {
        d3.selectAll('.Age')
          .attr('opacity', 1)

        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 1)
          .attr('x', (a) => xScale(a.ID))
          .attr('width', xScale.bandwidth())

        chart.selectAll('#limit').remove()
        chart.selectAll('.divergence').remove()
      })

    barGroups 
      .append('text')
      .attr('class', 'Age')
      .attr('x', (a) => xScale(a.ID) + xScale.bandwidth() / 2)
      .attr('y', (a) => yScale(a.Age) + 30)
      .attr('text-anchor', 'middle')
      .text((a) => `${a.Age}`)
    
    svg
      .append('text')
      .attr('class', 'label')
      .attr('x', -(height / 2) - margin)
      .attr('y', margin / 2.4)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text('Percentage of Students (%)')

    svg.append('text')
      .attr('class', 'label')
      .attr('x', width / 2 + margin)
      .attr('y', height + margin * 1.7)
      .attr('text-anchor', 'middle')
      .text('Maturity level (Age)')

    svg.append('text')
      .attr('class', 'title')
      .attr('x', width / 2 + margin)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text('Number of Maturity Students')

    svg.append('text')
      .attr('class', 'source')
      .attr('x', width - margin / 2)
      .attr('y', height + margin * 1.7)
      .attr('text-anchor', 'start')
  