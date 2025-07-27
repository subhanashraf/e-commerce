import { Card, CardContent } from "@/components/ui/card"
import { readFile } from "fs/promises"
import { join } from "path"

async function getCompanyData() {
  const filePath = join(process.cwd(), "data", "company.json")
  const fileContent = await readFile(filePath, "utf8")
  const data = JSON.parse(fileContent)
  return data.company
}

export async function CompanySection() {
  const company = await getCompanyData()

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            About {company.name}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{company.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
              <p className="text-muted-foreground">{company.mission}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
              <p className="text-muted-foreground">{company.vision}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-3">Founded</h3>
              <p className="text-2xl font-bold text-primary">{company.founded}</p>
              <p className="text-muted-foreground">{company.employees} employees</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6">Our Values</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {company.values.map((value, index) => (
              <div
                key={index}
                className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium hover:bg-primary/20 transition-colors"
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
