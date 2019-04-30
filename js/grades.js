var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  
  var att_url = "./json/att_data.json";
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var myAttArr = JSON.parse(this.responseText);
      gender_attendance(myAttArr);
      // console.log("myAttArr",myAttArr);
    }
  };
  xmlhttp.open("GET", att_url, true);
  xmlhttp.send();
  
  stdnt_att_data = [];
  
  function gender_attendance(arr) {
    abv21 = [];
    below21 = [];
    age_ar = [];
    // console.log("inside fuction",arr.attendanceData.length);
    var groupedBySid_data = groupBy(arr.attendanceData, 'StudentID');
    // console.log(groupedBySid_data)
  
    $.each(groupedBySid_data, function (index, data) {
      var s_id = data[0].StudentID;
      var age = data[0].Age;
      // AGE arrays are declared below 
      age_ar.push(age);
      if (age <= 21) {
        below21.push(s_id);
      } else {
        abv21.push(s_id);
      }
  
    });
    // console.log("below21",below21);
    // console.log("abv21",abv21)
  
    var groupedBySts_data = groupBy(arr.attendanceData, 'Status');
    // console.log(groupedBySts_data)
  
    var status_typs = [];
    $.each(groupedBySts_data, function (idx, dt) {
      status_typs.push(idx)
    });
    // console.log(status_typs)
  
    present = ['P', 'PROJ', 'PDG'];
    absent = ['ABS', 'AA', 'NM', 'PWR', 'U'];
    neutral = ['CC', 'O'];
  
    stdnt_att = [];
    $.each(groupedBySid_data, function (index, data) {
      var s_id = data[0].StudentID;
      var gender = data[0].Gender;
  
      // Pushing Attendance status int one array with studenID
      std_at = [];
      std_at['id'] = s_id;
      std_at['gender'] = gender;
      std_at['status'] = [];
      $.each(data, function (index1, data1) {
  
        std_at['status'].push(data1.Status);
  
      });
  
      stdnt_att.push(std_at);
    });
    // console.log('stdnt_att',stdnt_att);
  
    $.each(stdnt_att, function (i, d) {
      id = d.id;
      status = d.status;
      no_of_classes = d.status.length;
      d['status_percentage'] = [];
      d['attendance_per'] = [];
  
      // console.log('no_of_classes',no_of_classes)
  
      $.each(status_typs, function (is, ds) {
        sts_ar = status.split(',');
  
        var count = sts_ar.reduce(function (n, val) {
          return n + (val === ds);
        }, 0);
        var sts_pr = ds + ' - ' + count;
        d['status_percentage'].push(sts_pr)
      });
      // console.log(d.status_percentage)
  
      sp_ar = [];
      sab_ar = [];
      sn_ar = [];
      $.each(d.status_percentage, function (si, sd) {
        sts_nm = sd.split(' - ')[0];
        sts_val = sd.split(' - ')[1];
  
        if (present.indexOf(sts_nm) != -1) {
          sp_ar.push(parseInt(sts_val));
        } else if (absent.indexOf(sts_nm) != -1) {
          sab_ar.push(parseInt(sts_val));
        } else {
          sn_ar.push(parseInt(sts_val));
        }
  
      });
  
      function getSum(total, num) {
        return total + Math.round(num);
      }
  
      var present_per = (((sp_ar.reduce(getSum, 0)) / no_of_classes) * 100).toFixed(1);
      var absent_per = (((sab_ar.reduce(getSum, 0)) / no_of_classes) * 100).toFixed(1);
      var neutral_per = (((sn_ar.reduce(getSum, 0)) / no_of_classes) * 100).toFixed(1);
  
      d['attendance_per'].push('present_per - ' + present_per)
      d['attendance_per'].push('absent_per - ' + absent_per)
      d['attendance_per'].push('neutral_per - ' + neutral_per)
  
  
    });
  
    $.each(stdnt_att, function (i, d) {
      isa_ar = [];
      isa_ar['sid'] = d.id;
      isa_ar['att_per'] = d.attendance_per;
      stdnt_att_data.push(isa_ar);
    });
  
  
    // console.log(stdnt_att)
  
    m_stdnt_att = [];
    f_stdnt_att = [];
    $.each(stdnt_att, function (gi, gd) {
      if (gd['gender'] == 'M') {
        m_stdnt_att.push(gd);
      } else if (gd['gender'] == 'F') {
        f_stdnt_att.push(gd);
      }
    });
  
    /*console.log('m_stdnt_att',m_stdnt_att);
    console.log('f_stdnt_att',f_stdnt_att);*/
  
    m_present_per_ar = [];
    m_absent_per_ar = [];
    m_neutral_per_ar = [];
    $.each(m_stdnt_att, function (mi, md) {
      var prsnt = md['attendance_per'][0].split(' - ')[1];
      var absent = md['attendance_per'][1].split(' - ')[1];
      var neutral = md['attendance_per'][2].split(' - ')[1];
  
      m_present_per_ar.push(prsnt);
      m_absent_per_ar.push(absent);
      m_neutral_per_ar.push(neutral);
    });
  
    function getSum(total, num) {
      return total + Math.round(num);
    }
  
    m_present_per = ((m_present_per_ar.reduce(getSum, 0)) / m_present_per_ar.length).toFixed(1);
    m_absent_per = ((m_absent_per_ar.reduce(getSum, 0)) / m_absent_per_ar.length).toFixed(1);
    m_neutral_per = ((m_neutral_per_ar.reduce(getSum, 0)) / m_neutral_per_ar.length).toFixed(1);
  
    /*console.log('m_present_per',m_present_per);
    console.log('m_absent_per',m_absent_per);
    console.log('m_neutral_per',m_neutral_per);*/
  
    male_att_per = [];
    male_att_per['present'] = m_present_per;
    male_att_per['absent'] = m_absent_per;
    male_att_per['neutral'] = m_neutral_per;
  
    // console.log('male_att_per',male_att_per);
  
    f_present_per_ar = [];
    f_absent_per_ar = [];
    f_neutral_per_ar = [];
    $.each(f_stdnt_att, function (mi, md) {
      var prsnt = md['attendance_per'][0].split(' - ')[1];
      var absent = md['attendance_per'][1].split(' - ')[1];
      var neutral = md['attendance_per'][2].split(' - ')[1];
  
      f_present_per_ar.push(prsnt);
      f_absent_per_ar.push(absent);
      f_neutral_per_ar.push(neutral);
    });
  
    function getSum(total, num) {
      return total + Math.round(num);
    }
  
    f_present_per = ((f_present_per_ar.reduce(getSum, 0)) / f_present_per_ar.length).toFixed(1);
    f_absent_per = ((f_absent_per_ar.reduce(getSum, 0)) / f_absent_per_ar.length).toFixed(1);
    f_neutral_per = ((f_neutral_per_ar.reduce(getSum, 0)) / f_neutral_per_ar.length).toFixed(1);
  
    /*console.log('f_present_per',f_present_per);
    console.log('f_absent_per',f_absent_per);
    console.log('f_neutral_per',f_neutral_per);*/
  
    female_att_per = [];
    female_att_per['present'] = f_present_per;
    female_att_per['absent'] = f_absent_per;
    female_att_per['neutral'] = f_neutral_per;
  
    // console.log('female_att_per',female_att_per)
  
  
    
  
   
  
      /*******************/
  
  
      var attMod_url = "./json/att_module_results.json";
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          var myAttmodArr = JSON.parse(this.responseText);
          // module_function(myAttmodArr);
          // console.log("myAttmodArr",myAttmodArr)
          marr = myAttmodArr;
          var groupedByGrade_data = groupBy(marr.moduleResults, 'Grade');
          // console.log('groupedByGrade_data',groupedByGrade_data)
          var all_grades = [];
          $.each(groupedByGrade_data, function(index,data){
            all_grades.push(index)
          });
          // console.log('all_grades',all_grades);
  
          var groupedByStdId_data = groupBy(marr.moduleResults, 'StuduentID');
          // console.log('groupedByStdId_data',groupedByStdId_data)
          var all_stdIds = [];
          var all_std_data = [];
          $.each(groupedByStdId_data, function(index,data){
            all_stdIds.push(index)
            all_std_data.push(data)
          });
          // console.log('all_stdIds',all_stdIds)
          // console.log('all_std_data',all_std_data)
  
          stdnt_grd_data = [];
  
          $.each(all_std_data, function(idx,dt){
            // console.log(all_stdIds[idx])
            // console.log(dt)
            var sg = [];
            sg['sid'] = all_stdIds[idx];
            var gd = [];
            $.each(dt, function(i,d){
              gd.push(d.Mark);
            });
            // sg['marks'] = gd;
            var per = Math.round((gd.reduce(getSum, 0))/gd.length);
            var grade = '';
            if(per >= 70){
              grade = 'A';
            }
            else if(per >= 60 && per <= 69){
              grade = 'B';
            }
            else if(per >= 50 && per <= 59){
              grade = 'C';
            }
            else if(per >= 40 && per <= 49){
              grade = 'D';
            }
            else if(per < 40){
              grade = 'F';
            }
            else if(per == 0){
              grade = 'FS';
            }
            
  
            sg['grade'] = grade;
            stdnt_grd_data.push(sg)
          });
        
          // console.log('stdnt_att_data.length - '+stdnt_att_data.length,stdnt_att_data)
          // console.log('stdnt_grd_data.length - '+stdnt_grd_data.length,stdnt_grd_data)
  
          stdnt_att_grd_arr = [];
          $.each(stdnt_att_data, function(aidx,adt){
            $.each(stdnt_grd_data, function(gidx,gdt){
              if(adt['sid'] == gdt['sid']){
                // console.log(adt['sid'])
                var sdt = [];
                sdt['sid'] = adt['sid'];
                sdt['att_per'] = adt['att_per'];
                sdt['grade'] = gdt['grade'];
  
                stdnt_att_grd_arr.push(sdt)
                
              }
            });
          });
  
          // console.log('stdnt_att_grd_arr',stdnt_att_grd_arr);
  
          a_ar = [];
          b_ar = [];
          c_ar = [];
          d_ar = [];
          f_ar = [];
          fs_ar = [];
          
          $.each(stdnt_att_grd_arr, function(agi,agd){
            if(agd['grade'] == 'A'){
              a_ar.push(agd.att_per);
            }
            if(agd['grade'] == 'B'){
              b_ar.push(agd.att_per);
            }
            if(agd['grade'] == 'C'){
              c_ar.push(agd.att_per);
            }
            if(agd['grade'] == 'D'){
              d_ar.push(agd.att_per);
            }
            if(agd['grade'] == 'F'){
              f_ar.push(agd.att_per);
            }
            if(agd['grade'] == 'FS'){
              fs_ar.push(agd.att_per);
            }
          });
          
          ap_per = [];
          aa_per = [];
          an_per = [];
          $.each(a_ar, function(ai,ad){
            ad[0] = ad[0].replace('present_per - ','');
            ad[1] = ad[1].replace('absent_per - ','');
            ad[2] = ad[2].replace('neutral_per - ','');
  
            ap_per.push(ad[0]);
            aa_per.push(ad[1]);
            an_per.push(ad[2]);
          });
          a_grd_present_per = Math.round((ap_per.reduce(getSum, 0))/ap_per.length);
          a_grd_absent_per = Math.round((aa_per.reduce(getSum, 0))/aa_per.length);
          a_grd_neutral_per = Math.round((an_per.reduce(getSum, 0))/an_per.length);
  
          bp_per = [];
          ba_per = [];
          bn_per = [];
          $.each(b_ar, function(bi,bd){
            bd[0] = bd[0].replace('present_per - ','');
            bd[1] = bd[1].replace('absent_per - ','');
            bd[2] = bd[2].replace('neutral_per - ','');
  
            bp_per.push(bd[0]);
            ba_per.push(bd[1]);
            bn_per.push(bd[2]);
          });
          b_grd_present_per = Math.round((bp_per.reduce(getSum, 0))/bp_per.length);
          b_grd_absent_per = Math.round((ba_per.reduce(getSum, 0))/ba_per.length);
          b_grd_neutral_per = Math.round((bn_per.reduce(getSum, 0))/bn_per.length);
  
          cp_per = [];
          ca_per = [];
          cn_per = [];
          $.each(c_ar, function(ci,cd){
            cd[0] = cd[0].replace('present_per - ','');
            cd[1] = cd[1].replace('absent_per - ','');
            cd[2] = cd[2].replace('neutral_per - ','');
  
            cp_per.push(cd[0]);
            ca_per.push(cd[1]);
            cn_per.push(cd[2]);
          });
          c_grd_present_per = Math.round((cp_per.reduce(getSum, 0))/cp_per.length);
          c_grd_absent_per = Math.round((ca_per.reduce(getSum, 0))/ca_per.length);
          c_grd_neutral_per = Math.round((cn_per.reduce(getSum, 0))/cn_per.length);
  
          dp_per = [];
          da_per = [];
          dn_per = [];
          $.each(d_ar, function(di,dd){
            dd[0] = dd[0].replace('present_per - ','');
            dd[1] = dd[1].replace('absent_per - ','');
            dd[2] = dd[2].replace('neutral_per - ','');
  
            dp_per.push(dd[0]);
            da_per.push(dd[1]);
            dn_per.push(dd[2]);
          });
          d_grd_present_per = Math.round((dp_per.reduce(getSum, 0))/dp_per.length);
          d_grd_absent_per = Math.round((da_per.reduce(getSum, 0))/da_per.length);
          d_grd_neutral_per = Math.round((dn_per.reduce(getSum, 0))/dn_per.length);
  
          fp_per = [];
          fa_per = [];
          fn_per = [];
          $.each(f_ar, function(fi,fd){
            fd[0] = fd[0].replace('present_per - ','');
            fd[1] = fd[1].replace('absent_per - ','');
            fd[2] = fd[2].replace('neutral_per - ','');
  
            fp_per.push(fd[0]);
            fa_per.push(fd[1]);
            fn_per.push(fd[2]);
          });
          f_grd_present_per = Math.round((fp_per.reduce(getSum, 0))/fp_per.length);
          f_grd_absent_per = Math.round((fa_per.reduce(getSum, 0))/fa_per.length);
          f_grd_neutral_per = Math.round((fn_per.reduce(getSum, 0))/fn_per.length);
  
          fsp_per = [];
          fsa_per = [];
          fsn_per = [];
          $.each(fs_ar, function(fsi,fsd){
            fsd[0] = fsd[0].replace('present_per - ','');
            fsd[1] = fsd[1].replace('absent_per - ','');
            fsd[2] = fsd[2].replace('neutral_per - ','');
  
            fsp_per.push(fsd[0]);
            fsa_per.push(fsd[1]);
            fsn_per.push(fsd[2]);
          });
          fs_grd_present_per = Math.round((fsp_per.reduce(getSum, 0))/fsp_per.length);
          fs_grd_absent_per = Math.round((fsa_per.reduce(getSum, 0))/fsa_per.length);
          fs_grd_neutral_per = Math.round((fsn_per.reduce(getSum, 0))/fsn_per.length);
  
          console.log('present',a_grd_present_per+' - '+b_grd_present_per+' - '+c_grd_present_per+' - '+d_grd_present_per+' - '+f_grd_present_per+' - '+fs_grd_present_per);
          console.log('absent',a_grd_absent_per+' - '+b_grd_absent_per+' - '+c_grd_absent_per+' - '+d_grd_absent_per+' - '+f_grd_absent_per+' - '+fs_grd_absent_per);
          console.log('neutral',a_grd_neutral_per+' - '+b_grd_neutral_per+' - '+c_grd_neutral_per+' - '+d_grd_neutral_per+' - '+f_grd_neutral_per+' - '+fs_grd_neutral_per);
          
          var present = [{
            title: "A",
            color: '#80cbc4',
            percentage: a_grd_present_per
          },
          {
            title: "B",
            color: '#80cbc4',
            percentage: b_grd_present_per
          },
          {
            title: "C",
            color: '#80cbc4',
            percentage: c_grd_present_per
          },
          {
            title: "D",
            color: '#80cbc4',
            percentage: d_grd_present_per
          },
          {
            title: "F",
            color: '#80cbc4',
            percentage: f_grd_present_per
          }];

        console.log('present',present)




  var psvg = d3.select('svg#present');

  var pmargin = 80;
  var pwidth = 500 - 2 * pmargin;
  var pheight = 500 - 2 * pmargin;

  var pchart = psvg.append('g')
    .attr('transform', `translate(${pmargin}, ${pmargin})`);

  var pxScale = d3.scaleBand()
    .range([0, pwidth])
    .domain(present.map((s) => s.title))
    .padding(0.4)

  var pyScale = d3.scaleLinear()
    .range([pheight, 0])
    .domain([0, 100]); 

  pchart.append('g')
    .attr('transform', `translate(0, ${pheight})`)
    .call(d3.axisBottom(pxScale));

  pchart.append('g')
    .call(d3.axisLeft(pyScale));

    pchart.append('g')
    .attr('class', 'grid')

var pbarGroups = pchart.selectAll()
    .data(present)
    .enter()
    .append('g')

  pbarGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => pxScale(g.title))
    .attr('y', (g) => pyScale(g.percentage))
    .attr('fill', (g) => (g.color))
    .attr('height', (g) => pheight - pyScale(g.percentage))
    .attr('width', pxScale.bandwidth())
    .on('mouseenter', function (actual, i) {
      d3.selectAll('.Age')
        .attr('opacity', 0)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 0.6)
        /*.attr('x', (a) => pxScale(a.title) - 5)
        .attr('width', pxScale.bandwidth() + 10)*/

      var y = pyScale(actual.percentage)

      line = pchart.append('line')
        .attr('id', 'limit')
        .attr('x1', 0)
        .attr('y1', y)
        .attr('x2', pwidth)
        .attr('y2', y)

      pbarGroups.append('text')
        .attr('class', 'divergence')
        .attr('x', (a) => pxScale(a.title) + pxScale.bandwidth() / 2)
        .attr('y', (a) => pyScale(a.percentage) + 30)
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .text((a, idx) => {
          var divergence = (a.percentage - actual.percentage).toFixed(1)

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
        /*.attr('x', (a) => pxScale(a.title))
        .attr('width', pxScale.bandwidth())*/

      pchart.selectAll('#limit').remove()
      pchart.selectAll('.divergence').remove()
    })

  pbarGroups
    .append('text')
    .attr('class', 'Age')
    .attr('x', (a) => pxScale(a.title) + pxScale.bandwidth() / 2)
    .attr('y', (a) => pyScale(a.percentage)-2.5)
    .attr('text-anchor', 'middle')
    .text((a) => `${a.percentage}`)

  psvg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(pheight / 2) - pmargin)
    .attr('y', pmargin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Percentage of Present Attendance (%)')

  psvg.append('text')
    .attr('class', 'label')
    .attr('x', pwidth / 2 + pmargin)
    .attr('y', pheight + pmargin * 1.7)
    .attr('text-anchor', 'middle')
    .text('Grades')

  psvg.append('text')
    .attr('class', 'title')
    .attr('x', pwidth / 2 + pmargin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    

  psvg.append('text')
    .attr('class', 'source')
    .attr('x', pwidth - pmargin / 2)
    .attr('y', pheight + pmargin * 1.7)
    .attr('text-anchor', 'start')




/*absent*/

var absent = [{
            title: "A",
            color: '#ea2026',
            percentage: a_grd_absent_per
          },
          {
            title: "B",
            color: '#ea2026',
            percentage: b_grd_absent_per
          },
          {
            title: "C",
            color: '#ea2026',
            percentage: c_grd_absent_per
          },
          {
            title: "D",
            color: '#ea2026',
            percentage: d_grd_absent_per
          },
          {
            title: "F",
            color: '#ea2026',
            percentage: f_grd_absent_per
          }
        ];

        console.log('absent',absent)




  var asvg = d3.select('svg#absent');

  var amargin = 80;
  var awidth = 500 - 2 * amargin;
  var aheight = 500 - 2 * amargin;

  var achart = asvg.append('g')
    .attr('transform', `translate(${amargin}, ${amargin})`);

  var axScale = d3.scaleBand()
    .range([0, awidth])
    .domain(absent.map((s) => s.title))
    .padding(0.4)

  var ayScale = d3.scaleLinear()
    .range([aheight, 0])
    .domain([0, 100]); 

  achart.append('g')
    .attr('transform', `translate(0, ${aheight})`)
    .call(d3.axisBottom(axScale));

  achart.append('g')
    .call(d3.axisLeft(ayScale));

    achart.append('g')
    .attr('class', 'grid')

var abarGroups = achart.selectAll()
    .data(absent)
    .enter()
    .append('g')

  abarGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => axScale(g.title))
    .attr('y', (g) => ayScale(g.percentage))
    .attr('fill', (g) => (g.color))
    .attr('height', (g) => aheight - ayScale(g.percentage))
    .attr('width', axScale.bandwidth())
    .on('mouseenter', function (actual, i) {
      d3.selectAll('.Age')
        .attr('opacity', 0)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 0.6)
        /*.attr('x', (a) => axScale(a.title) - 5)
        .attr('width', axScale.bandwidth() + 10)*/

      var y = ayScale(actual.percentage)

      line = achart.append('line')
        .attr('id', 'limit')
        .attr('x1', 0)
        .attr('y1', y)
        .attr('x2', awidth)
        .attr('y2', y)

      abarGroups.append('text')
        .attr('class', 'divergence')
        .attr('x', (a) => axScale(a.title) + axScale.bandwidth() / 2)
        .attr('y', (a) => ayScale(a.percentage) + 30)
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .text((a, idx) => {
          var divergence = (a.percentage - actual.percentage).toFixed(1)

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
        /*.attr('x', (a) => axScale(a.title))
        .attr('width', axScale.bandwidth())*/

      achart.selectAll('#limit').remove()
      achart.selectAll('.divergence').remove()
    })

  abarGroups
    .append('text')
    .attr('class', 'Age')
    .attr('x', (a) => axScale(a.title) + axScale.bandwidth() / 2)
    .attr('y', (a) => ayScale(a.percentage)-2.5)
    .attr('text-anchor', 'middle')
    .text((a) => `${a.percentage}`)

  asvg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(aheight / 2) - amargin)
    .attr('y', amargin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Percentage of Absent Attendance (%)')

  asvg.append('text')
    .attr('class', 'label')
    .attr('x', awidth / 2 + amargin)
    .attr('y', aheight + amargin * 1.7)
    .attr('text-anchor', 'middle')
    .text('Grades')

  asvg.append('text')
    .attr('class', 'title')
    .attr('x', awidth / 2 + amargin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    

  asvg.append('text')
    .attr('class', 'source')
    .attr('x', awidth - amargin / 2)
    .attr('y', aheight + amargin * 1.7)
    .attr('text-anchor', 'start')
   
  
  
        }
      };
      xmlhttp.open("GET", attMod_url, true);
      xmlhttp.send();
  
      /*******************/

      
  
  }