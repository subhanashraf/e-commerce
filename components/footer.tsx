import Link from "next/link"
import { readFile } from "fs/promises"
import { join } from "path"

async function getCompanyData() {
  const filePath = join(process.cwd(), "data", "company.json")
  const fileContent = await readFile(filePath, "utf8")
  const data = JSON.parse(fileContent)
  return data.company
}

export async function Footer() {
  const company = await getCompanyData()

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{company.name}</h3>
            <p className="text-muted-foreground text-sm">{company.tagline}</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{company.contact.address}</p>
              <p>{company.contact.phone}</p>
              <p>{company.contact.email}</p>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link href="/careers" className="block text-muted-foreground hover:text-foreground transition-colors">
                Careers
              </Link>
              <Link href="/press" className="block text-muted-foreground hover:text-foreground transition-colors">
                Press
              </Link>
            </div>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <div className="space-y-2 text-sm">
              <Link href="/help" className="block text-muted-foreground hover:text-foreground transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
              <Link href="/shipping" className="block text-muted-foreground hover:text-foreground transition-colors">
                Shipping Info
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Follow Us</h4>
            <div className="space-y-2 text-sm">
              <a
                href={company.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Facebook
              </a>
              <a
                href={company.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Twitter
              </a>
              <a
                href={company.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 {company.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
