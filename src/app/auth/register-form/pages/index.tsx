
import { Toaster } from "sonner"
import { RegisterForm } from "../page"

export default function Home() {
  return (
    <>
      <RegisterForm />
      <Toaster position="top-center" />
    </>
  )
}