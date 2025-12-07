import { ModeToggle } from "@/components/shadcn/mode-toggle"

export default function ThemeBar() {
  return (
    <div className="w-full flex justify-end px-4 py-2 bg-background border-b">
      <ModeToggle />
    </div>
  )
}
