"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { DisabilityType, AccessibilityProfile } from "@/lib/supabase/database.types";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const disabilityType = formData.get("disabilityType") as DisabilityType | "";
  const accessibilityProfileRaw = formData.getAll("accessibilityProfile") as string[];

  // Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Gagal membuat akun" };
  }

  // Insert user profile to public.users table
  const { error: profileError } = await supabase.from("users").insert({
    auth_id: authData.user.id,
    email: email,
    full_name: fullName,
    disability_type: disabilityType || null,
    accessibility_profile: accessibilityProfileRaw.length > 0 
      ? accessibilityProfileRaw as AccessibilityProfile[]
      : null,
  });

  if (profileError) {
    console.error("Profile insert error:", profileError);
    // Don't fail registration if profile insert fails
    // User can update profile later
  }

  revalidatePath("/", "layout");
  redirect("/login?registered=true");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tidak terautentikasi" };
  }

  const fullName = formData.get("fullName") as string;
  const disabilityType = formData.get("disabilityType") as DisabilityType | "";
  const accessibilityProfileRaw = formData.getAll("accessibilityProfile") as string[];

  // Update auth user metadata
  await supabase.auth.updateUser({
    data: {
      full_name: fullName,
    },
  });

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from("users")
    .select("user_id")
    .eq("auth_id", user.id)
    .single();

  if (existingProfile) {
    // Update existing profile
    const { error } = await supabase
      .from("users")
      .update({
        full_name: fullName,
        disability_type: disabilityType || null,
        accessibility_profile: accessibilityProfileRaw.length > 0 
          ? accessibilityProfileRaw as AccessibilityProfile[]
          : null,
      })
      .eq("auth_id", user.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    // Create profile if doesn't exist
    const { error } = await supabase.from("users").insert({
      auth_id: user.id,
      email: user.email!,
      full_name: fullName,
      disability_type: disabilityType || null,
      accessibility_profile: accessibilityProfileRaw.length > 0 
        ? accessibilityProfileRaw as AccessibilityProfile[]
        : null,
    });

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/dashboard", "layout");
  return { success: true };
}

export async function getUserProfile() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  return {
    authUser: user,
    profile: profile,
  };
}
