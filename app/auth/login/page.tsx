"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/api"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await login(username, password)
      localStorage.setItem("token", response.data.access_token)
      router.push("/dashboard")
    } catch (error) {
      setError("Emri i përdoruesit ose fjalëkalimi është i pasaktë")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Kyçu</CardTitle>
          <CardDescription>Qasuni në llogarinë tuaj</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Emri i përdoruesit</Label>
                <Input
                  id="username"
                  placeholder="Shkruani emrin e përdoruesit"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Fjalëkalimi</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Shkruani fjalëkalimin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/")}>
              Anulo
            </Button>
            <Button type="submit">Kyçu</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

