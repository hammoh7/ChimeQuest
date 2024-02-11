# ChimeQuest
### Development in Progress

## Getting Started
1. Clone the project
2. Run the command:
   ```
   npm install
   ```
3. Create a .env file:
   Write your MongoDB URL, Clerk and Uploadthing API keys
   ```
   DATABASE_URL=""

   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=

   UPLOADTHING_SECRET=
   UPLOADTHING_APP_ID=
   ```
4. Run the following commands for prisma setup:
   ```
   npx prisma generate
   npx prisma db push
   ```  
5. Then run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

Open (http://localhost:3000) with your browser to see the result.
