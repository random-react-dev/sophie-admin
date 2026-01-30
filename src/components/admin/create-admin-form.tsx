"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAdminUser } from "@/app/(admin)/actions";

export function CreateAdminForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const result = await createAdminUser(email, password);

        if (result.success) {
            setMessage({ type: "success", text: `Admin user created successfully!` });
            setEmail("");
            setPassword("");
        } else {
            setMessage({ type: "error", text: result.error ?? "Failed to create admin user" });
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
                <div
                    className={`p-3 rounded-md text-sm ${
                        message.type === "success"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                >
                    {message.text}
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="admin-email" className="text-sm font-medium">
                    Email
                </label>
                <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="admin-password" className="text-sm font-medium">
                    Password
                </label>
                <Input
                    id="admin-password"
                    type="password"
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                />
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Admin User"}
            </Button>
        </form>
    );
}
