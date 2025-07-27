import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface User {
  id: string
  name: string
  email: string
  address: string
  totalSpent: number
  orders: string[]
}

interface UserAccountsProps {
  users: User[]
}

export function UserAccounts({ users }: UserAccountsProps) {
  if (!users || users.length === 0) {
    return (
      <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-card/95">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            User Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No users found.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <Card
          key={user.id}
          className="hover:shadow-lg transition-shadow hover:scale-105 transform duration-200 bg-gradient-to-br from-card to-card/95 border border-primary/20"
        >
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 bg-gradient-to-r from-primary to-purple-600">
                <AvatarFallback className="text-lg bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  {user.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 text-foreground">Address</h4>
              <p className="text-sm text-muted-foreground">{user.address}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-foreground">Total Spent</h4>
              <Badge
                variant="secondary"
                className="text-lg px-3 py-1 bg-gradient-to-r from-primary/20 to-purple-600/20 text-primary"
              >
                ${user.totalSpent.toFixed(2)}
              </Badge>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-foreground">Orders</h4>
              <Badge variant="outline" className="text-sm border-primary/30">
                {user.orders.length} order{user.orders.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
