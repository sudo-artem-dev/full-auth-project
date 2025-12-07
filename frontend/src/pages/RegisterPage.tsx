import { useState, useEffect } from "react"
import { register, verifyRegisterOtp, resendOtp } from "@/services/auth.service"
import { SignupForm } from "@/components/shadcn/RegisterForm"
import { OTPForm } from "@/components/shadcn/OtpForm"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [otp, setOtp] = useState("")
  const [resendLoading, setResendLoading] = useState(false)
  const [timer, setTimer] = useState(30)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // TIMER 30s pour RESEND
  useEffect(() => {
    if (step !== 2) return
    if (timer <= 0) return

    const interval = setInterval(() => {
      setTimer((t) => t - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timer, step])

  // -----------------------------------------
  // STEP 1 : REGISTER
  // -----------------------------------------
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    // Validation password
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    const passwordRules = {
      length: form.password.length >= 8,
      upper: /[A-Z]/.test(form.password),
      lower: /[a-z]/.test(form.password),
      number: /[0-9]/.test(form.password),
      special: /[^A-Za-z0-9]/.test(form.password),
    }

    if (!Object.values(passwordRules).every(Boolean)) {
      setError("Le mot de passe ne respecte pas les règles de sécurité.")
      return
    }

    // Appel API
    const res = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
    })

    if (res.message?.includes("OTP")) {
      setStep(2)
      setTimer(30) // reset timer au moment d'afficher OTP
    } else {
      setError(res.message ?? "Erreur lors de l'inscription")
    }
  }

  // -----------------------------------------
  // STEP 2 : VERIFY OTP
  // -----------------------------------------
  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()

    const res = await verifyRegisterOtp(form.email, otp)

    if (res.accessToken) {
      localStorage.setItem("accessToken", res.accessToken)
      setUser(res.user)
      navigate("/")
    } else {
      setError("Code OTP incorrect")
    }
  }

  // -----------------------------------------
  // RESEND OTP
  // -----------------------------------------
  async function handleResend() {
    setResendLoading(true)

    const res = await resendOtp(form.email, "register")

    setResendLoading(false)

    if (res.message) {
      setError("New code sent to your email.")
      setTimer(30) // repartir à 30 sec
    }
  }

  // -----------------------------------------
  // RENDER
  // -----------------------------------------
  return (
    <div className="flex justify-center py-16 px-4">
      {step === 1 && (
        <SignupForm
          onSubmit={handleRegister}
          form={form}
          setForm={setForm}
          error={error}
        />
      )}

      {step === 2 && (
        <OTPForm
          email={form.email}
          code={otp}
          setCode={setOtp}
          error={error}
          onSubmit={handleVerify}
          onResend={handleResend}
          resendLoading={resendLoading}
          timer={timer}
          className="w-full max-w-md"
        />
      )}
    </div>
  )
}
