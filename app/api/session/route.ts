import {cookies} from "next/headers";
import {getChatGPTUser} from "@/app/chatgpt-auth";
import {guestCookie,validGuestToken,newGuestToken} from "@/lib/guest-session";
export async function POST(){try{const user=await getChatGPTUser();if(user)return Response.json({signedIn:true},{headers:{"Cache-Control":"no-store"}});const existing=(await cookies()).get(guestCookie)?.value;const token=validGuestToken(existing)?existing:newGuestToken();return Response.json({signedIn:false},{headers:{"Cache-Control":"no-store","Set-Cookie":`${guestCookie}=${token}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`}});}catch{return Response.json({error:"利用の準備ができませんでした。もう一度お試しください。"},{status:503});}}
