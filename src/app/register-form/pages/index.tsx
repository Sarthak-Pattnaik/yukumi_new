
import { Toaster } from "sonner"
import { RegisterForm } from "../app/register-form"

export default function Home() {
  return (
    <>
      <RegisterForm />
      <Toaster position="top-center" />
    </>
  )
}