// Motore T-7: solo pianificazione, nessuna chiamata AI o pubblicazione.
// Attivare dopo configurazione database persistente, autenticazione e provider.
export const DAYS=['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
export const TIMEZONE='Europe/Rome';
export function dateInRome(date=new Date()){
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:TIMEZONE,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
  const get=k=>parts.find(x=>x.type===k)?.value;
  return get('year')+'-'+get('month')+'-'+get('day');
}
export function addDaysISO(iso,n){
  const d=new Date(iso+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);
  return d.toISOString().slice(0,10);
}
export function slotsToPrepare(plan,todayISO=dateInRome()){
  const target=addDaysISO(todayISO,7);
  const d=new Date(target+'T12:00:00Z');
  const rule=plan?.[DAYS[d.getUTCDay()]];
  if(!rule?.enabled)return [];
  const channels=[...(rule.channels||[])];
  const grouped=channels.includes('Facebook')&&channels.includes('Instagram')
    ?['Facebook + Instagram',...channels.filter(x=>x!=='Facebook'&&x!=='Instagram')]:channels;
  return grouped.map(channel=>({
    id:target+'|'+channel+'|'+(rule.time||'08:00'),
    date:target,channel,time:rule.time||'08:00',area:rule.area,
    format:rule.channelFormats?.[channel==='Facebook + Instagram'?'Facebook':channel]||'Post singolo',
    textStatus:'not_generated',imageStatus:'not_generated',approvalStatus:'blocked',
    publishStatus:'blocked'
  }));
}
export function mayPublish(item){
  return Boolean(item&&item.textStatus==='approved'&&item.imageStatus==='approved'&&item.approvalStatus==='approved'&&item.publishStatus==='scheduled'&&item.approvedVersion===item.currentVersion);
}
