export type Shift={id:string,date:string,start:string,end:string};
// Japanese national holidays, substitute holidays and citizens' holidays.
// Source: Cabinet Office, https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html
const holidays=new Set([
'2026-01-01','2026-01-12','2026-02-11','2026-02-23','2026-03-20','2026-04-29','2026-05-03','2026-05-04','2026-05-05','2026-05-06','2026-07-20','2026-08-11','2026-09-21','2026-09-22','2026-09-23','2026-10-12','2026-11-03','2026-11-23',
'2027-01-01','2027-01-11','2027-02-11','2027-02-23','2027-03-21','2027-03-22','2027-04-29','2027-05-03','2027-05-04','2027-05-05','2027-07-19','2027-08-11','2027-09-20','2027-09-23','2027-10-11','2027-11-03','2027-11-23']);
export function holidayLabel(date:string){const day=new Date(date+'T00:00:00Z').getUTCDay();return holidays.has(date)?'祝日':day===0||day===6?'土日':'';}
export function calculate(start:string,end:string,date='2026-10-05',addition=0,base=1350,nightMultiplier=1.25,overtimeMultiplier=1.25){
 const minutes=(t:string)=>Number(t.slice(0,2))*60+Number(t.slice(3));
 const startMinute=minutes(start);let duration=minutes(end)-startMinute;if(duration<0)duration+=1440;
 const rest=duration>=421?60:duration>=361?45:duration>=316?30:0;
 const timeline:{date:string,night:boolean,holiday:boolean,paid:boolean}[]=[];
 const origin=new Date(date+'T00:00:00Z');
 for(let i=0;i<duration;i++){
  const absolute=startMinute+i;const day=new Date(origin.getTime()+Math.floor(absolute/1440)*86400000).toISOString().slice(0,10);
  const night=absolute%1440>=1320||absolute%1440<300;
  timeline.push({date:day,night,holiday:!!holidayLabel(day),paid:true});
 }
 // Deduct breaks from ordinary hours first, then night hours if needed.
 let remaining=rest;
 for(const night of [false,true])for(const minute of timeline){if(remaining===0)break;if(minute.night!==night)continue;minute.paid=false;remaining--;}
 let paidMinutes=0,pay=0,nightMinutes=0,overtimeMinutes=0;
 const buckets:{date:string,night:boolean,overtime:boolean,rate:number,minutes:number}[]=[];
 for(const minute of timeline){
  if(!minute.paid)continue;
  const overtime=paidMinutes>=480;
  const rate=base+addition+(minute.holiday?70:0)+(minute.night?base*(nightMultiplier-1):0)+(overtime?base*(overtimeMultiplier-1):0);
  pay+=rate/60;paidMinutes++;if(minute.night)nightMinutes++;if(overtime)overtimeMinutes++;
  const last=buckets[buckets.length-1];
  if(last&&last.date===minute.date&&last.night===minute.night&&last.overtime===overtime)last.minutes++;
  else buckets.push({date:minute.date,night:minute.night,overtime,rate,minutes:1});
 }
 // Sum integer minute weights before dividing, avoiding per-minute rounding drift.
 pay=buckets.reduce((sum,b)=>sum+b.minutes*b.rate,0)/60;
 return {duration,rest,work:paidMinutes,pay,nightMinutes,overtimeMinutes,buckets};
}
export function valid(s:any){return s&&typeof s.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s.date)&&!isNaN(Date.parse(s.date))&&new Date(s.date+'T00:00:00Z').toISOString().slice(0,10)===s.date&&[s.start,s.end].every(t=>typeof t==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(t))&&s.start!==s.end;}

export function validAddition(value:unknown){return typeof value==="number"&&Number.isInteger(value)&&value>=0&&value<=10000;}

export function validBase(value:unknown){return typeof value==="number"&&Number.isInteger(value)&&value>=1&&value<=100000;}

export function validMultiplier(value:unknown){return typeof value==="number"&&Number.isFinite(value)&&value>=1&&value<=5&&Math.abs(value*100-Math.round(value*100))<1e-8;}
