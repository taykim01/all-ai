"use server";

import { createClient } from "@/lib/supabase";

export async function signUp(email: string, password: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error signing up:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sign up",
    };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error signing in:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sign in",
    };
  }
}

export async function signOut() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sign out",
    };
  }
}

export async function getUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;

    return { success: true, data: user };
  } catch (error) {
    console.error("Error getting user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get user",
    };
  }
}
