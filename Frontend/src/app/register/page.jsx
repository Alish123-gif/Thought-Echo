import RegisterForm from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata = {
    title: "Register | Thought Echo",
    description: "Create a new account on Thought Echo",
};

export default function RegisterPage() {
    return (
        <div className="container">
            <RegisterForm />
        </div>
    );
}
