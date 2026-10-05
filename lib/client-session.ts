type SessionInfo={signedIn:boolean};
let sessionPromise:Promise<SessionInfo>|null=null;
export function ensureSession():Promise<SessionInfo>{if(!sessionPromise)sessionPromise=fetch("/api/session",{method:"POST",credentials:"same-origin",cache:"no-store"}).then(async r=>{const data=await r.json();if(!r.ok)throw Error(data.error);return data;}).catch(e=>{sessionPromise=null;throw e;});return sessionPromise;}
