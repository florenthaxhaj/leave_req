import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { LogIn, UserPlus, Calendar, ClipboardList, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Sistemi i Kërkesave për Pushim</CardTitle>
          <CardDescription>Menaxhoni kërkesat tuaja për pushim në mënyrë efikase dhe transparente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/auth/login">
              <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <CardHeader>
                  <LogIn className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle className="text-lg">Kyçu</CardTitle>
                  <CardDescription>Qasuni në llogarinë tuaj</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/auth/register">
              <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <CardHeader>
                  <UserPlus className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle className="text-lg">Regjistrohu</CardTitle>
                  <CardDescription>Krijo një llogari të re</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/dashboard/request">
              <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <CardHeader>
                  <Calendar className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle className="text-lg">Bëj Kërkesë</CardTitle>
                  <CardDescription>Kërko pushim të ri</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/dashboard">
              <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <CardHeader>
                  <ClipboardList className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle className="text-lg">Kërkesat e Mia</CardTitle>
                  <CardDescription>Shiko kërkesat tuaja</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin">
              <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <CardHeader>
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle className="text-lg">Admin</CardTitle>
                  <CardDescription>Menaxho përdoruesit dhe kërkesat</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

