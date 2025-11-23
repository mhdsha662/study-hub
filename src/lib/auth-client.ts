"use client"

/**
 * Client-side authentication utilities
 * This provides a compatibility layer for NextAuth v5 with the existing signin implementation
 */

export async function signIn(
    provider: string,
    options?: {
        email?: string
        password?: string
        redirect?: boolean
        callbackUrl?: string
    }
) {
    if (provider === "credentials") {
        try {
            const response = await fetch("/api/auth/callback/credentials", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: options?.email,
                    password: options?.password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                return {
                    error: data.error || "Authentication failed",
                    ok: false,
                }
            }

            // If redirect is true, navigate to the callback URL or home page
            if (options?.redirect !== false) {
                window.location.href = options?.callbackUrl || "/"
                return { ok: true }
            }

            return { ok: true }
        } catch (error) {
            return {
                error: "An error occurred during authentication",
                ok: false,
            }
        }
    }

    return {
        error: "Unsupported provider",
        ok: false,
    }
}
