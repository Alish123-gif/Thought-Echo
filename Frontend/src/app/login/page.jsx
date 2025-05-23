import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata = {
    title: "Login | Thought Echo",
    description: "Login to your Thought Echo account",
};

export default function LoginPage() {
    return (
        <div className="container">
            <LoginForm />
        </div>
    );
}
