export type WeeklyDay={enabled:boolean,start:string,end:string};
export type WeeklySchedule=WeeklyDay[];
export const emptySchedule=():WeeklySchedule=>Array.from({length:7},()=>({enabled:false,start:"17:00",end:"22:00"}));
export function validSchedule(s:unknown):s is WeeklySchedule{return Array.isArray(s)&&s.length===7&&s.every(d=>d&&typeof d.enabled==="boolean"&&[d.start,d.end].every(t=>typeof t==="string"&&/^([01]\d|2[0-3]):[0-5]\d$/.test(t))&&(!d.enabled||d.start!==d.end));}
export function validMonth(m:unknown):m is string{return typeof m==="string"&&/^(19|20|21)\d{2}-(0[1-9]|1[0-2])$/.test(m);}
export function shiftsForMonth(month:string,schedule:WeeklySchedule){if(!validMonth(month)||!validSchedule(schedule))throw Error("月と固定シフトを確認してください。");const [year,m]=month.split("-").map(Number),days=new Date(Date.UTC(year,m,0)).getUTCDate();const shifts:{date:string,start:string,end:string}[]=[];for(let day=1;day<=days;day++){const weekday=new Date(Date.UTC(year,m-1,day)).getUTCDay();const t=schedule[weekday];if(t.enabled)shifts.push({date:month+"-"+String(day).padStart(2,"0"),start:t.start,end:t.end});}return shifts;}
