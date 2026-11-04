import test from 'node:test';
import assert from 'node:assert/strict';
import {slotsToPrepare,mayPublish} from '../lib/scheduler.js';
test('prepara esattamente a T-7 e raggruppa Meta',()=>{
  const plan={'Lunedì':{enabled:true,area:'Previdenza',time:'08:00',channels:['Facebook','Instagram','LinkedIn'],channelFormats:{Facebook:'Carosello',Instagram:'Carosello',LinkedIn:'Post singolo'}}};
  const slots=slotsToPrepare(plan,'2026-11-02');
  assert.equal(slots.length,2);
  assert.equal(slots[0].date,'2026-11-09');
  assert.equal(slots[0].channel,'Facebook + Instagram');
  assert.equal(slots[0].format,'Carosello');
  assert.equal(slots[1].format,'Post singolo');
  assert.equal(slots[0].publishStatus,'blocked');
});
test('non programma giorni disattivati',()=>{assert.deepEqual(slotsToPrepare({'Lunedì':{enabled:false}},'2026-11-02'),[])});
test('pubblicazione richiede entrambe approvazioni e versione corrente',()=>{
  const ok={textStatus:'approved',imageStatus:'approved',approvalStatus:'approved',publishStatus:'scheduled',approvedVersion:3,currentVersion:3};
  assert.equal(mayPublish(ok),true);
  assert.equal(mayPublish({...ok,imageStatus:'pending'}),false);
  assert.equal(mayPublish({...ok,currentVersion:4}),false);
});
