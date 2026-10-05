export const guestCookie="__Host-shift-guest";
export function validGuestToken(token:unknown):token is string{return typeof token==="string"&&/^[a-f0-9]{64}$/.test(token);}
export function newGuestToken(){return Array.from(crypto.getRandomValues(new Uint8Array(32))).map(x=>x.toString(16).padStart(2,"0")).join("");}
export async function guestIdentity(token:string){if(!validGuestToken(token))throw Error("Invalid session");const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token));return "guest_"+Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,"0")).join("");}
