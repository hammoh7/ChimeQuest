# ChimeQuest
### Development in Progress

## Getting Started
1. Clone the project by using below command:
   ```
   git clone https://github.com/hammoh7/ChimeQuest.git
   ```
2. Run the command:
   ```
   npm install
   ```
3. Create a .env file, and paste the required keys and URL:
   <br />
   I have used Clerk (for authentication), MongoDB (for database) and Uploadthing (for file upload functionality)
   ```
   DATABASE_URL=""

   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=

   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/signin
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

   UPLOADTHING_SECRET=
   UPLOADTHING_APP_ID=
   ```
4. Then run the development server:
   ```
   npm run dev
   ```

5. Open (http://localhost:3000) with your browser to see the result.
