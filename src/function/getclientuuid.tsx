 import { supabase } from "../Auth/Supabase";


  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  // ✅ Helper to get userUuid once
 export const getUserUuid = async (): Promise<string | null> => {
    const cookieValue = getCookie("shop_seek_client");
    if (!cookieValue) return null;

    try {
      let cleaned = cookieValue;
      if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.slice(1, -1);
      }
      const parsedCookie = JSON.parse(cleaned);
      const userEmail = parsedCookie.email;

      if (!userEmail) return null;

      const { data: userData, error } = await supabase
        .from("shopseek_user")
        .select("uuid")
        .eq("email", userEmail)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user UUID:", error);
        return null;
      }
      return userData?.uuid || null;
    } catch (err) {
      console.error("Failed to parse cookie for uuid:", err);
      return null;
    }
  };