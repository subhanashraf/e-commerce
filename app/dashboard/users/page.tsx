import { UserAccounts } from "@/components/user-accounts"
import { getUsers } from "@/app/actions/user"

export default async function UsersPage() {
  const users = await getUsers()
  
  
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          User Accounts
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage customer accounts and purchase history</p>
      </div>

      <UserAccounts users={users} />
    </div>
  )
}
