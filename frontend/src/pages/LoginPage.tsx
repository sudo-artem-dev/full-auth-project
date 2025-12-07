import { useState, useEffect } from "react"
import { LoginForm } from "@/components/shadcn/LoginForm"
import { OTPForm } from "@/components/shadcn/OtpForm"
import { login, verifyLoginOtp, resendOtp } from "@/services/auth.service"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [otp, setOtp] = useState("")

  const [resendLoading, setResendLoading] = useState(false)
  const [timer, setTimer] = useState(30)

  const [form, setForm] = useState({
    email: "",
    password: "",
  })
  const [rememberDevice, setRememberDevice] = useState(false);
  const storedDeviceId = localStorage.getItem("deviceId");
  const deviceId = storedDeviceId || crypto.randomUUID();
  localStorage.setItem("deviceId", deviceId);
  // TIMER RESEND (comme RegisterPage)
  useEffect(() => {
    if (step !== 2) return
    if (timer <= 0) return

    const interval = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer, step])

  // STEP 1 — LOGIN
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
  
    const res = await login({
      email: form.email,
      password: form.password,
      deviceId
    });
  
    // 👉 Cas 1 : login sans OTP
    if (res.accessToken) {
      localStorage.setItem("accessToken", res.accessToken)
      setUser(res.user)
      navigate("/")
      return
    }
  
    // 👉 Cas 2 : demande d’OTP
    if (res.message?.includes("OTP")) {
      setStep(2)
      setTimer(30)
      return
    }
  
    // 👉 Cas 3 : erreur
    setError("Identifiants invalides")
  }
  

  // STEP 2 — VERIFY OTP
  async function handleOtp(e: React.FormEvent) {
    e.preventDefault()

    const res = await verifyLoginOtp({
        email: form.email,
        code: otp,
        rememberDevice,
        deviceId
      });
      
      console.log("OTP PAYLOAD:", {
        email: form.email,
        code: otp,
        rememberDevice,
        deviceId
      });
      
    if (res.accessToken) {
      localStorage.setItem("accessToken", res.accessToken)
      setUser(res.user)
      navigate("/")
    } else {
      setError("OTP incorrect")
    }
  }

  async function handleResend() {
    setResendLoading(true)

    const res = await resendOtp(form.email, "login")

    setResendLoading(false)

    if (res.message) {
      setError("A new code has been sent to your email.")
      setTimer(30) // reset timer
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {step === 1 && (
            <LoginForm
            onSubmit={handleLogin}
            form={form}
            setForm={setForm}
            rememberDevice={rememberDevice}
            setRememberDevice={setRememberDevice}
            error={error}
            />

        )}

        {step === 2 && (
          <OTPForm
            email={form.email}
            code={otp}
            setCode={setOtp}
            error={error}
            onSubmit={handleOtp}
            onResend={handleResend}
            resendLoading={resendLoading}
            timer={timer}
          />
        )}
      </div>
    </div>
  )
}
