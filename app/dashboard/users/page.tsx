import { UserAccounts } from "@/components/user-accounts"
import { readFile } from "fs/promises"
import { join } from "path"

async function getUsers() {
  try {
    const filePath = join(process.cwd(), "data", "users.json")
    const fileContent = await readFile(filePath, "utf8")
    const data = JSON.parse(fileContent)
    return data.users || []
  } catch (error) {
    console.error("Error loading users:", error)
    return []
  }
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          User Accounts
        </h1>
        <p className="text-muted-foreground">Manage customer accounts and purchase history</p>
      </div>

      <UserAccounts users={users} />
    </div>
  )
}
