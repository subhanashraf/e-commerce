E-commerce AI Product Assistant
A modern e-commerce platform featuring an AI-powered chatbot to streamline product listing creation and management. This application leverages the power of Google's Gemini API to provide intelligent guidance for product details, ensuring efficient inventory management and a smooth user experience.

✨ Features
AI-Powered Product Guidance: An interactive chat interface where users can describe a product, and the AI assistant (powered by Gemini 1.5 Flash) will provide structured suggestions for:

Product Name

Suggested Price

Short & Long Descriptions

Category & Brand

Meta Tags

Relevant Image URLs (always from unsplash.com)

Conversational AI: The chatbot intelligently handles general greetings and off-topic questions, maintaining a helpful and engaging tone.

Responsive Chat UI: A beautifully designed, responsive chat interface built with Tailwind CSS, ensuring optimal display and usability across all devices (mobile, tablet, desktop) without horizontal overflow issues.

Product Listing Management: A dedicated section to view and manage existing products in your inventory.

Modern Tech Stack: Built with cutting-edge web technologies for performance, scalability, and developer experience.

🚀 Technologies Used
Next.js: React framework for production, enabling server-side rendering and API routes.

React: For building interactive user interfaces.

Tailwind CSS: A utility-first CSS framework for rapid and responsive styling.

Shadcn/ui: Reusable UI components built with Radix UI and Tailwind CSS.

Google Gemini API (gemini-1.5-flash): For intelligent AI product guidance and conversational capabilities.

TypeScript: For type safety and improved developer experience.

📦 Getting Started
To get a copy of the project up and running on your local machine for development and testing purposes, follow these steps:

Clone the repository:

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

(Remember to replace your-username/your-repo-name.git with your actual repository URL)

Install dependencies:

npm install
# or
yarn install

Set up environment variables:
Create a .env.local file in the root of your project and add your Google Gemini API key:

GEMINI_API_KEY=YOUR_GEMINI_API_KEY

You can obtain a Gemini API key from Google AI Studio.

Run the development server:

npm run dev
# or
yarn dev

Open http://localhost:3000 in your browser to see the application.

💡 Future Enhancements
Integration with a database (e.g., Firestore) for persistent product storage.

Ability to directly add suggested products from the chat interface to the product list.

More advanced AI capabilities for product image generation or detailed market analysis.

User authentication and authorization.
