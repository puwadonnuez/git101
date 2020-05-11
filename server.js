'use strict';

const express = require('express')
const app = express()
var json2xls = require('json2xls');
var cron = require('node-cron');
var CronJob=require('cron').CronJob;
const CronTime = require('cron').CronTime
var bodyParser = require('body-parser')
var cors = require('cors')
    app.use(cors())
    app.use(bodyParser.json())
    app.use(json2xls.middleware);

    app.post('/schedule',(req,res)=> { 
        console.log('TEST995',req.body)
        let days = req.body.days;
        let hours = req.body.hours;
        let minutes = req.body.minutes;
        let dayFixed = req.body.dayFixed;
        let month = req.body.month;
        let second = req.body.seconds;
        let repeat = req.body.repeat;
        let type = req.body.type;
        let repeats = 1;
        let length = 1;
        let lengthTime = 1;
        let paramChangeTime
        let getTime = [Number(second) ? Number(second) : '*',Number(minutes) ? Number(second) : '*',Number(hours) ? Number(second) : '*']
        // console.log('getTime',getTime[0])
        for(let i=0; i < Object.keys(req.body).length; i++) {
          if(req.body[Object.keys(req.body)[i]].length >= length) {
              length = req.body[Object.keys(req.body)[i]].length
              if (i < 2) {
                lengthTime = req.body[Object.keys(req.body)[i]].length
              }
          }
        }
        // console.log('this is length',length)
        let setTime = [second ? [...second].join(',').substring(0) : '*',minutes ? [...minutes].join(',').substring(0) : '*',hours ? [...hours].join(',').substring(0) : '*',dayFixed ? [...dayFixed].join(',').substring(0) : '*',month ? [...month].join(',').substring(0) : '*',days ? [...days].join(',').substring(0) : '*'].join(' ')
        var setDataTime = setTime
        // type = 'repeatBy'
        // console.log('Nakano',setTime.split(' '))
        // console.log('Nakano',setTime.split(' ')[0].split(',').length)
        // console.log('length Time ',lengthTime)
        // console.log('this setTime data',setTime)
        var cronJob1 = new CronJob({
            cronTime: setTime,
            onTick: function () {
                if(repeats > (repeat == -1 ? 999999 : repeat) * length) {
                    // console.log('Test',repeats)
                    cronJob1.stop()
                } else {
                    console.log('Repeat '+repeats+' Cron Task - READ - Time: ' + (new Date()));
                    if (repeat == undefined && repeats == length) {
                      cronJob1.stop()
                    }
                    if(type == 'repeatBy') {
                      if(lengthTime >= 2) {
                        // let second = eval(setTime.split(' ')[0].replace(/,/g, '+'));
                        // let minute = setTime.split(' ')[1].length > 1 ? eval(setTime.split(' ')[1].replace(/,/g, '+')) : setTime.split(' ')[1]
                        // let hour = setTime.split(' ')[2].length > 1 ? eval(setTime.split(' ')[2].replace(/,/g, '+')) : setTime.split(' ')[2]
                        // console.log('sec',second)
                        // console.log('min',minute)
                        // console.log('hour',hour)
                          // secondsToHms(setDataTime.split(' ')[0],setDataTime.split(' ')[1],setDataTime.split(' ')[2])
                      } else {
                          paramChangeTime = secondsToHms(setDataTime.split(' ')[0],setDataTime.split(' ')[1],setDataTime.split(' ')[2])
                          setDataTime = paramChangeTime
                      }
                      changeTime2(paramChangeTime)
                    }
                }
                repeats++
            },
            runOnInit: false
            });
            cronJob1.start();

            let changeTime2 = (input) => {
              cronJob1.setTime(new CronTime(input))
              cronJob1.start();
            }

            function secondsToHms(secondz,minutez,hourz) {
              // let time = [secondz != '*' ? secondz : 0, minutez != '*' ? minutez : 0, hourz != '*' ?  hourz : 0]
              // console.log('this is never Time',time[0] ,time[1],time[2])
              let times = Math.floor(Number(time[0]) + Number(second)) + Math.floor((Number(time[1])*60)+(Number(minutes) ? Number(minutes*60) : 0) + Math.floor(Number(time[2])*3600 + Number(hours) ? hours*3600 : 0));
              // console.log('array',times)
              var h = Math.floor(times / 3600);
              var m = Math.floor(times % 3600 / 60);
              var s = Math.floor(times % 3600 % 60);
              var newHour = h > 0 ? h  : hours ? 0 : '*';
              var newMinute = m > 0 ? m  : minutes ? 0 : '*';
              var newSecond = s > 0 ? s  : second ? 0 : '*'; 
              // console.log('NewSecond',newSecond)
              // console.log('minutestZA',newSecond + ' ' + newMinute + ' ' + newHour + ' ' + (dayFixed ? dayFixed : '*') + ' ' + (month ? month : '*') + ' ' + (days ? days : '*'))
              return newSecond + ' ' + newMinute + ' ' + newHour + ' ' + (dayFixed ? dayFixed : '*') + ' ' + (month ? month : '*') + ' ' + (days ? days : '*')
              // return 
              // for (let i=0;i<time.length;i++) {
              //   if(time[i] != '*') {
              //     let array = time[i].split(',')
              //     console.log('this array',array.length)
              //     if (array.length > 1) {

              //     } else {
              //       array[0] = Number(array[0]) + getTime[i] * array.length
              //       console.log('array 0 ',array[0])
              //     }
              //   } else {
              //     getTime.push(time[i])
              //   }
              //   console.log('TIMES',getTime)
              // }
          }
            res.json(req.body)
        })
    app.listen('3000',() => {    
        console.log('start port 3000')  
    })