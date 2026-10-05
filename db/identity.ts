import {getChatGPTUser} from "@/app/chatgpt-auth";
import {cookies} from "next/headers";
import {guestCookie,validGuestToken,guestIdentity} from "@/lib/guest-session";
import {database} from "./raw";
const legacyOwnerHash="f2454b030aa5f6d6c8c43c8c26408da08b6abe34e586590709bd43e99b9f7649";
export async function currentIdentity(){const user=await getChatGPTUser();if(!user){const token=(await cookies()).get(guestCookie)?.value;return validGuestToken(token)?await guestIdentity(token):null;}
 const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(user.email.toLowerCase()));
 const hash=Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,"0")).join("");
 // Only the original owner can inherit the records created before per-user storage.
 if(hash===legacyOwnerHash)await database().prepare("UPDATE shifts SET user_id=? WHERE user_id IS NULL").bind(user.userId).run();
 return user.userId;
}
export const unauthorized=()=>Response.json({error:"ブラウザーのCookieを有効にして、ページを再読み込みしてください。"},{status:401});
