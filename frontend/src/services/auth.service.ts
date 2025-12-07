const API_URL = "http://localhost:3000/auth";

export async function register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}) {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function login(data: {
    email: string;
    password: string;
    deviceId: string;
  }) {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  export async function verifyLoginOtp(data: {
    email: string;
    code: string;
    rememberDevice?: boolean;
    deviceId?: string;
  }) {
    const res = await fetch(`${API_URL}/verify-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  

export async function verifyRegisterOtp(email: string, code: string) {
    const res = await fetch(`${API_URL}/verify-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
    });
    return res.json();
}

// -------------------------------------------------------
// ---------------- FORGOT PASSWORD ----------------------
// -------------------------------------------------------
export async function forgotPassword(email: string) {
    const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    return res.json(); // { message: "..."}
}

// -------------------------------------------------------
// ---------------- RESET PASSWORD -----------------------
// -------------------------------------------------------
export async function resetPassword(token: string, newPassword: string) {
    const res = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
    });
    return res.json(); // { message: "..."}
}
// -------------------------------------------------------
// ---------------- RESEND OTP ---------------------------
// -------------------------------------------------------
export async function resendOtp(email: string, context: "register" | "login") {
    const res = await fetch(`${API_URL}/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, context }),
    });
    return res.json(); // { message: "Nouveau code envoyé." }
}
