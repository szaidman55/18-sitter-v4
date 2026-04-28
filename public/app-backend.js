const config = window.APP_CONFIG || {};
const hasSupabaseConfig = Boolean(config.supabaseUrl && config.supabaseAnonKey);
let supabase = null;

if (hasSupabaseConfig) {
  const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
  supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}

function setAuthStatus(message, kind) {
  const el = document.getElementById("auth-status");
  if (!el) return;
  el.textContent = message || "";
  el.classList.remove("ok", "err");
  if (kind) el.classList.add(kind);
}

function value(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function setBusy(isBusy) {
  const button = document.getElementById("signup-submit");
  if (!button) return;
  button.disabled = isBusy;
  button.textContent = isBusy ? "Creating account..." : "Verify & Continue";
}

async function handleSignup(event) {
  if (event) event.preventDefault();

  const fullName = value("signup-name");
  const email = value("signup-email");
  const password = value("signup-password");
  const phone = value("signup-phone");
  const role = window.userRole || "family";

  if (!email || !password) {
    setAuthStatus("Enter an email and password to create the account.", "err");
    return;
  }

  if (!supabase) {
    setAuthStatus("Backend not connected yet. Continuing in prototype mode.", "ok");
    window.go("s-onboard");
    return;
  }

  setBusy(true);
  setAuthStatus("Creating your secure account...", "");
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role
        }
      }
    });
    if (error) throw error;

    if (data.session) {
      setAuthStatus("Account created. Continue your profile.", "ok");
      window.go("s-onboard");
      return;
    }

    setAuthStatus("Check your email to confirm the account, then continue your profile.", "ok");
    window.go("s-onboard");
  } catch (error) {
    setAuthStatus(error.message || "Could not create the account. Try again.", "err");
  } finally {
    setBusy(false);
  }
}

async function handleSignIn(event) {
  if (event) event.preventDefault();

  const email = value("signup-email");
  const password = value("signup-password");

  if (!email || !password) {
    setAuthStatus("Enter your email and password to sign in.", "err");
    return;
  }

  if (!supabase) {
    setAuthStatus("Backend not connected yet. Opening prototype mode.", "ok");
    window.go("s-f-discover");
    return;
  }

  setBusy(true);
  setAuthStatus("Signing you in...", "");
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setAuthStatus("Signed in.", "ok");
    window.go("s-f-discover");
  } catch (error) {
    setAuthStatus(error.message || "Could not sign in. Try again.", "err");
  } finally {
    setBusy(false);
  }
}

async function getCurrentUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user || null;
}

window.appBackend = {
  configured: hasSupabaseConfig,
  client: supabase,
  getCurrentUser
};
window.handleSignup = handleSignup;
window.handleSignIn = handleSignIn;
