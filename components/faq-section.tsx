import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { readFile } from "fs/promises"
import { join } from "path"

async function getFAQData() {
  const filePath = join(process.cwd(), "data", "company.json")
  const fileContent = await readFile(filePath, "utf8")
  const data = JSON.parse(fileContent)
  return data.faq
}

export async function FAQSection() {
  const faq = await getFAQData()

  return (
    <section className="py-16 px-4 bg-muted/20">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about our products and services
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faq.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
