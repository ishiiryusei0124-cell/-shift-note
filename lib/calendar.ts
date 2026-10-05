export function calendarWeeks(month:string):(string|null)[][] {
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))return [];
 const first=new Date(month+'-01T00:00:00Z');
 const year=first.getUTCFullYear(),m=first.getUTCMonth();
 const last=new Date(first);last.setUTCMonth(m+1,0);
 const cells:(string|null)[]=Array(first.getUTCDay()).fill(null);
 for(let day=1;day<=last.getUTCDate();day++)cells.push(`${month}-${String(day).padStart(2,'0')}`);
 while(cells.length%7)cells.push(null);
 return Array.from({length:cells.length/7},(_,i)=>cells.slice(i*7,i*7+7));
}
