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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

type OTPFormProps = {
  email: string
  code: string
  setCode: (value: string) => void
  error: string
  onSubmit: (e: React.FormEvent) => void
  onResend: () => void
  resendLoading: boolean
  timer: number
} & React.ComponentProps<typeof Card>

export function OTPForm({
  email,
  code,
  setCode,
  error,
  onSubmit,
  onResend,
  resendLoading,
  timer,
  ...props
}: OTPFormProps) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Enter verification code</CardTitle>
        <CardDescription>
          We sent a 6-digit code to <b>{email}</b>.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp">Verification code</FieldLabel>

              <InputOTP
                id="otp"
                maxLength={6}
                value={code}
                onChange={setCode}
                required
              >
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
              )}
            </Field>

            <FieldGroup>
              <Button type="submit" className="w-full">
                Verify
              </Button>

              <FieldDescription className="text-center mt-3">
                {timer > 0 ? (
                  <span className="opacity-60">
                    Resend available in <b>{timer}s</b>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={onResend}
                    disabled={resendLoading}
                    className="underline hover:text-primary disabled:opacity-50"
                  >
                    {resendLoading ? "Sending..." : "Resend code"}
                  </button>
                )}
              </FieldDescription>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
