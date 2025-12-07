import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import * as React from "react"

export type SignupFormProps = {
  onSubmit: (e: React.FormEvent) => void
  form: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
  }
  setForm: React.Dispatch<
    React.SetStateAction<{
      firstName: string
      lastName: string
      email: string
      password: string
      confirmPassword: string
    }>
  >
  error: string
} & React.ComponentProps<typeof Card>

export function SignupForm({
  onSubmit,
  form,
  setForm,
  error,
  ...props
}: SignupFormProps) {

    const [showPassword, setShowPassword] = React.useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
    const password = form.password

    // Computed validation
    const passwordValid = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }
    
    const allValid = Object.values(passwordValid).every(Boolean)
    
  const passwordsMatch = form.password === form.confirmPassword

  return (
    <Card className="w-full max-w-md" {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information to register
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <FieldGroup>

            <Field>
              <FieldLabel>First Name</FieldLabel>
              <Input
                placeholder="John"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Last Name</FieldLabel>
              <Input
                placeholder="Doe"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                placeholder="test@mail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Field>

            {/** PASSWORD */}
            <Field>
              <FieldLabel>Password</FieldLabel>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="mt-2 text-sm">
                <p className="font-medium">Your password must contain:</p>

                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li className={passwordValid.length ? "text-green-600" : "text-white"}>
                    • At least 8 characters
                  </li>
                  <li className={passwordValid.upper ? "text-green-600" : "text-white"}>
                    • One uppercase letter
                  </li>
                  <li className={passwordValid.lower ? "text-green-600" : "text-white"}>
                    • One lowercase letter
                  </li>
                  <li className={passwordValid.number ? "text-green-600" : "text-white"}>
                    • One number
                  </li>
                  <li className={passwordValid.special ? "text-green-600" : "text-white"}>
                    • One special character
                  </li>
                </ul>
              </div>
            </Field>

            {/** CONFIRM PASSWORD */}
            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  required
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {!passwordsMatch && form.confirmPassword.length > 0 && (
                <p className="text-sm text-red-600 mt-1">
                  Passwords do not match.
                </p>
              )}
            </Field>

            <Button
              type="submit"
              className="w-full"
              disabled={!allValid || !passwordsMatch}
            >
              Create Account
            </Button>

            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="underline underline-offset-2 hover:text-primary"
              >
                Sign in
              </Link>
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
