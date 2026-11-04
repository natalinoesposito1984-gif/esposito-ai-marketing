import crypto from 'node:crypto';
const MAX_BYTES=256*1024;
const kinds=new Set(['brand','weekly-plan','approval-queue']);
export function validateDocument(kind,data){
  if(!kinds.has(kind))throw Object.assign(new Error('Tipo documento non valido'),{status:400});
  if(!data||typeof data!=='object'||Array.isArray(data))throw Object.assign(new Error('Documento non valido'),{status:400});
  if(Buffer.byteLength(JSON.stringify(data),'utf8')>MAX_BYTES)throw Object.assign(new Error('Documento troppo grande'),{status:413});
  return data;
}
export function safeEqual(a,b){
  if(typeof a!=='string'||typeof b!=='string')return false;
  const ah=crypto.createHash('sha256').update(a).digest();
  const bh=crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ah,bh);
}
export function authConfigured(env=process.env){return Boolean(env.APP_USERNAME&&env.APP_PASSWORD&&env.DATABASE_URL)}
export function authorized(req,env=process.env){
  if(!authConfigured(env))return false;
  const h=req.headers.authorization||'';
  if(!h.startsWith('Basic '))return false;
  let decoded='';
  try{decoded=Buffer.from(h.slice(6),'base64').toString('utf8')}catch{return false}
  const colon=decoded.indexOf(':');if(colon<0)return false;
  return safeEqual(decoded.slice(0,colon),env.APP_USERNAME)&&safeEqual(decoded.slice(colon+1),env.APP_PASSWORD);
}
export async function database(env=process.env){
  if(!env.DATABASE_URL)throw new Error('Database non configurato');
  const {Pool}=await import('pg');
  const pool=new Pool({connectionString:env.DATABASE_URL,max:3,ssl:env.DATABASE_SSL==='require'?{rejectUnauthorized:true}:undefined});
  await pool.query('CREATE TABLE IF NOT EXISTS app_documents (kind text PRIMARY KEY, content jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())');
  await pool.query('CREATE TABLE IF NOT EXISTS editorial_jobs (id text PRIMARY KEY, publication_date date NOT NULL, channel text NOT NULL, payload jsonb NOT NULL, text_status text NOT NULL DEFAULT \'not_generated\', image_status text NOT NULL DEFAULT \'not_generated\', approval_status text NOT NULL DEFAULT \'blocked\', created_at timestamptz NOT NULL DEFAULT now())');
  return pool;
}
export async function readDocument(db,kind){validateDocument(kind,{});const r=await db.query('SELECT content FROM app_documents WHERE kind=$1',[kind]);return r.rows[0]?.content||{}}
export async function writeDocument(db,kind,data){validateDocument(kind,data);await db.query('INSERT INTO app_documents(kind,content) VALUES($1,$2::jsonb) ON CONFLICT(kind) DO UPDATE SET content=excluded.content,updated_at=now()',[kind,JSON.stringify(data)])}
export async function enqueue(db,slots){
  let inserted=0;
  for(const slot of slots){const r=await db.query('INSERT INTO editorial_jobs(id,publication_date,channel,payload) VALUES($1,$2,$3,$4::jsonb) ON CONFLICT(id) DO NOTHING',[slot.id,slot.date,slot.channel,JSON.stringify(slot)]);inserted+=r.rowCount}
  return inserted;
}
