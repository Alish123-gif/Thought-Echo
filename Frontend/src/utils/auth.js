import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export const getAuthSession = async () => {
    const session = await getServerSession(options);
    return session;
};

export const getCurrentUser = async () => {
    try {
        const session = await getAuthSession();
        return session?.user;
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
};
