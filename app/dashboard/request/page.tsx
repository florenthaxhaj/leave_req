"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { createLeaveRequest } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RequestLeave() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [leaveType, setLeaveType] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await createLeaveRequest(startDate, endDate, leaveType)
      toast({
        title: "Sukses",
        description: "Kërkesa për pushim u dërgua me sukses",
      })
      router.push("/dashboard")
    } catch (error: any) {
      setError(error.response?.data?.error || "Dërgimi i kërkesës dështoi. Ju lutem provoni përsëri.")
      toast({
        variant: "destructive",
        title: "Gabim",
        description: error.response?.data?.error || "Dërgimi i kërkesës dështoi",
      })
    } finally {
      setIsSubmitting(false)
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
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="endDate">Data e mbarimit</Label>
                <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="leaveType">Lloji i pushimit</Label>
                <Select value={leaveType} onValueChange={setLeaveType} required>
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
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </CardContent>
          <div className="flex justify-between p-4">
            <Button variant="outline" onClick={() => router.push("/dashboard")} type="button">
              Anulo
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Duke dërguar..." : "Dërgo Kërkesën"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

