"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createLeaveRequest } from "@/lib/api"

export default function RequestLeave() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [leaveType, setLeaveType] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createLeaveRequest(startDate, endDate, leaveType)
      router.push("/dashboard")
    } catch (error) {
      setError("Dërgimi i kërkesës dështoi. Ju lutemi provoni përsëri.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Bëj Kërkesë për Pushim</CardTitle>
          <CardDescription>Plotësoni detajet e kërkesës suaj për pushim</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="startDate">Data e fillimit</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="endDate">Data e mbarimit</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="leaveType">Lloji i pushimit</Label>
                <Select value={leaveType} onValueChange={setLeaveType}>
                  <SelectTrigger id="leaveType">
                    <SelectValue placeholder="Zgjidhni llojin e pushimit" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="annual">Pushim vjetor</SelectItem>
                    <SelectItem value="sick">Pushim mjekësor</SelectItem>
                    <SelectItem value="personal">Pushim personal</SelectItem>
                    <SelectItem value="other">Tjetër</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </CardContent>
          <div className="flex justify-between p-4">
            {" "}
            {/* Added CardFooter div */}
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Anulo
            </Button>
            <Button type="submit">Dërgo Kërkesën</Button>
          </div>{" "}
          {/* Added CardFooter div */}
        </form>
      </Card>
    </div>
  )
}

