import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Environment variable validation with proper fallbacks
const requiredEnvVars = {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
};

// Log missing environment variables in development only
if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
    Object.entries(requiredEnvVars).forEach(([key, value]) => {
        if (!value) {
            console.warn(`[NextAuth] Missing environment variable: ${key}`);
        }
    });
}

export const options = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    // Make a request to your backend API
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:5000/api';
                    const res = await fetch(`${apiUrl}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });
                    const data = await res.json();

                    console.log('Backend response:', data); if (res.ok && data.user) {
                        // Return the user object and token
                        const userObj = {
                            id: data.user.id,
                            email: data.user.email,
                            name: data.user.name,
                            avatar: data.user.avatar,
                            isAdmin: data.user.isAdmin,
                            token: data.token
                        };
                        console.log('Returning user object:', userObj);
                        return userObj;
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
        error: "/login", // Redirect to login page on errors
    },
    debug: process.env.NEXT_PUBLIC_NODE_ENV === "development",
    logger: {
        error(code, metadata) {
            console.error("[NextAuth Error]", code, metadata);
        },
        warn(code) {
            console.warn("[NextAuth Warning]", code);
        },
        debug(code, metadata) {

        }
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                console.log('JWT callback - user received:', user);
                // Store the user id and token in the JWT token
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.avatar = user.avatar;
                token.isAdmin = user.isAdmin;
                // Save the auth token from your backend
                token.accessToken = user.token;
            }
            return token;
        }, async session({ session, token }) {
            if (token) {
                // Pass the token data to the client
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.avatar = token.avatar || null;
                session.user.isAdmin = token.isAdmin;
                session.accessToken = token.accessToken;
                console.log('Session callback - session after update:', session);
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
    session: {
        strategy: "jwt",
    },
};
