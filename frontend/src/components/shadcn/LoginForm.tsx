import * as React from "react"
import { cn } from "@/lib/utils"
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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export type LoginFormProps = {
  onSubmit: (e: React.FormEvent) => void
  form: {
    email: string
    password: string
  }
  setForm: React.Dispatch<
    React.SetStateAction<{ email: string; password: string }>
  >
  error: string

  rememberDevice: boolean
  setRememberDevice: (v: boolean) => void
} & React.ComponentProps<"div">

export function LoginForm({
  onSubmit,
  form,
  setForm,
  error,
  className,
  rememberDevice,
  setRememberDevice,
  ...props
}: LoginFormProps) {
    const [showPassword, setShowPassword] = React.useState(false) // 👈 state

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    className="pr-10" // espace pour l'icône à droite
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </Field>

              <Field>
              <label className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                    checked={rememberDevice}
                    onCheckedChange={(v) => setRememberDevice(Boolean(v))}
                    />
                    <span className="text-sm">Remember this device</span>
                </label>

                <Button type="submit" className="w-full">
                  Login
                </Button>

                <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={() => window.location.href = "http://localhost:3000/auth/google"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                    Login with Google
                </Button>


                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/register"
                    className="underline underline-offset-2 hover:text-primary"
                  >
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
