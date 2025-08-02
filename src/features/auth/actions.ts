"use server";

import { createServerClient } from "@/infrastructure/supabase";

/**
 * Signs up a new user
 * @param email User's email
 * @param password User's password
 * @returns Success status and user data or error message
 */
export async function signUp(email: string, password: string) {
  try {
    const supabase = await createServerClient();
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

/**
 * Signs in a user
 * @param email User's email
 * @param password User's password
 * @returns Success status and session data or error message
 */
export async function signIn(email: string, password: string) {
  try {
    const supabase = await createServerClient();
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

/**
 * Signs out the current user
 * @returns Success status or error message
 */
export async function signOut() {
  try {
    const supabase = await createServerClient();
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

/**
 * Gets the current session
 * @returns The current session or null
 */
export async function getSession() {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    return { success: true, data: data.session };
  } catch (error) {
    console.error("Error getting session:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get session",
    };
  }
}

/**
 * Gets the current user
 * @returns The current user or null
 */
export async function getUser() {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;

    return { success: true, data: user };
  } catch (error) {
    console.log("Error getting user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get user",
    };
  }
}
