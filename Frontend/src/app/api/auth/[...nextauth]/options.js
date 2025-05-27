import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }), CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {                    // Make a request to your backend API
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:5000/api';
                    const res = await fetch(`${apiUrl}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });

                    const data = await res.json(); if (res.ok && data.user) {
                        // Return the user object and token
                        return {
                            id: data.user.id,
                            email: data.user.email,
                            isAdmin: data.user.isAdmin,
                            token: data.token
                        };
                    }

                    // Authentication failed
                    return null;
                } catch (error) {
                    console.error('Authentication error:', error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    }, callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Store the user id and token in the JWT token
                token.id = user.id;
                token.email = user.email;
                token.isAdmin = user.isAdmin;
                // Save the auth token from your backend
                token.accessToken = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                // Pass the token data to the client
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.isAdmin = token.isAdmin;
                session.accessToken = token.accessToken;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
};
