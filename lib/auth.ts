import prisma from "@/db";
import GoogleProvider from "next-auth/providers/google";

const avatars = [
  "https://cdn-icons-png.flaticon.com/512/8318/8318047.png",
  "https://cdn-icons-png.flaticon.com/512/2424/2424348.png",
  "https://cdn-icons-png.flaticon.com/512/6807/6807923.png",
  "https://cdn-icons-png.flaticon.com/256/4819/4819571.png",
  "https://cdn-icons-png.flaticon.com/512/1998/1998592.png",
  "https://cdn-icons-png.flaticon.com/512/3069/3069172.png",
  "https://cdn-icons-png.flaticon.com/512/1089/1089472.png",
  "https://cdn-icons-png.flaticon.com/512/2153/2153090.png",
  "https://cdn-icons-png.flaticon.com/512/3886/3886682.png",
]

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ token, session }: any) {
      const user = await prisma.user.findUnique({
        where: {
          email: token.email || session.user.email,
        },
      });

      if (user) {
        session.user.id = user.id; // Attach user ID to the session object
        session.user.viewName = user.viewName; // If you have a viewName field
        session.user.avatar = user.avatar
      } else {
        console.log("User not found in the database");
      }
      return session;
    },
    async signIn({ account, profile }: any) {
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      if (account?.provider === "google") {
        if (!profile?.email) {
          throw new Error("No email found in the profile");
        }

        // Use `upsert` to ensure the user is created or updated
        await prisma.user.upsert({
          where: {
            email: profile.email,
          },
          create: {
            name: profile.name || "Unnamed User",
            email: profile.email,
            viewName: profile.name?.split(" ")[0] || "User",
            avatar: randomAvatar as string
          },
          update: {
            name: profile.name,
          },
        });
        return true;
      }
      return false;
    },
  },
  pages: {
    signIn: "/signin", // Custom sign-in page
  },
};
