"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { register } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Register() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("employee")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(username, password, role)
      router.push("/auth/login")
    } catch (error) {
      setError("Regjistrimi dështoi. Ju lutemi provoni përsëri.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Regjistrohu</CardTitle>
          <CardDescription>Krijo një llogari të re</CardDescription>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Fjalëkalimi</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Shkruani fjalëkalimin"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="role">Roli</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Zgjidhni rolin" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="employee">Punonjës</SelectItem>
                    <SelectItem value="manager">Menaxher</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </CardContent>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/")}>
              Anulo
            </Button>
            <Button type="submit">Regjistrohu</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

