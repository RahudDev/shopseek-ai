// utils/cart.ts
import { supabase } from "../Auth/Supabase";

/**
 * Add product to a user's cart in Supabase.
 * - If cart exists → append product into list_cart JSON array
 * - If not → create new row with product
 */
export const handleAddToCart = async (product: any, userUuid: string) => {
  try {
    // Step 1: check if cart exists
    const { data: existingCart, error: fetchError } = await supabase
      .from("shopseek_client_cart")
      .select("list_cart")
      .eq("user_uuid", userUuid)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching cart:", fetchError);
      return;
    }

    if (existingCart) {
      // Step 2: cart exists → append new product
      const updatedCart = [...existingCart.list_cart, product];

      const { error: updateError } = await supabase
        .from("shopseek_client_cart")
        .update({ list_cart: updatedCart })
        .eq("user_uuid", userUuid);

      if (updateError) {
        console.error("Error updating cart:", updateError);
      } else {
        console.log("✅ Product added to cart!");
      }
    } else {
      // Step 3: no cart → create new one
      const { error: insertError } = await supabase
        .from("shopseek_client_cart")
        .insert([
          {
            user_uuid: userUuid,
            list_cart: [product],
          },
        ]);

      if (insertError) {
        console.error("Error creating cart:", insertError);
      } else {
        console.log("✅ New cart created with product!");
      }
    }
  } catch (err) {
    console.error("Unexpected error adding to cart:", err);
  }
};
