# Content Publisher

## Project Overview

Content Publisher is a web application designed to seamlessly integrate with Notion, allowing users to publish and manage their content effortlessly. This project aims to bridge the gap between Notion's powerful content creation tools and public-facing platforms, enabling content creators to reach a wider audience without compromising on their preferred workflow.

## Live Demo

The project is deployed and can be accessed at: [https://content-management-production.vercel.app/](https://content-management-production.vercel.app/)

## Technical Stack

- **Frontend Framework**: Next.js 13+ (with App Router), Typescript
- **UI Library**: Tailwindcss
- **Testing**: Jest 29+, React Testing Library 14+
- **Deployment**: Vercel
- **Environment**: Preview  | Production

## Key Features

1. **Notion Integration**: Publish content directly from Notion to a public platform.
2. **Responsive Design**: Fully responsive layout that works on desktop and mobile devices.
3. **Dark Mode Support**: Toggle between light and dark themes for comfortable viewing.
4. **Blog Showcase**: Display published content in an attractive, grid-based layout.
5. **Feedback System**: Allow readers to provide feedback on published content.
6. **Custom Access Control**: Options for managing content visibility and access.

## Project Structure
```

├── LICENSE
├── README.md
├── commitlint.config.cjs
├── jest.config.ts
├── jest.setup.ts
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── next.svg
│   └── vercel.svg
├── src
│   ├── app
│   │   ├── __tests__
│   │   │   ├── layout.test.tsx
│   │   │   └── page.test.tsx
│   │   ├── api
│   │   │   ├── __tests__
│   │   │   ├── blog
│   │   │   └── daily-records
│   │   ├── blog
│   │   │   ├── [id]
│   │   │   ├── __tests__
│   │   │   └── page.tsx
│   │   ├── components
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── __tests__
│   │   │   └── notion-blocks
│   │   ├── contact
│   │   │   ├── __test__
│   │   │   └── page.tsx
│   │   ├── daily-record
│   │   │   ├── __test__
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib
│   └── utils
│       ├── __tests__
│       │   └── api.test.ts
│       └── api.ts
├── tailwind.config.ts
└── tsconfig.json
```
## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/NZMia/content-publisher.git
   cd content-publisher
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   NOTION_SECRET=your_notion_secret
   PAGE_ID=your_notion_page_id
   TODO_DATABASE_ID=your_notion_database_id
   BLOG_DATABASE_ID=your_notion_database_id

   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Running Tests

To run the test suite:
```lint test
   npm run lint
```
```lint fix
   npm run lint:fix
```
```unit test
   npm run test
```
## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

For more information about custom solutions or to provide feedback, please open an issue in this repository or contact the maintainers directly.
