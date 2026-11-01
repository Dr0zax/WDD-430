import { createServerClient } from "../db/supabase.js";

const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    path: "/",
};

export function setAuthCookies(cookies, session) {
    cookies.set("sb-access-token", session.access_token, {
        ...cookieOptions,
        maxAge: Math.max(1, Math.floor(Number(session.expires_in) || 0)),
    });
    cookies.set("sb-refresh-token", session.refresh_token, cookieOptions);
}

export function clearAuthCookies(cookies) {
    cookies.delete("sb-access-token", cookieOptions);
    cookies.delete("sb-refresh-token", cookieOptions);
}

export async function getAdminUser(cookies) {
    const session = await getAdminSession(cookies);
    return session?.user || null;
}

export async function getAdminSession(cookies) {
    const accessToken = cookies.get("sb-access-token")?.value;
    const refreshToken = cookies.get("sb-refresh-token")?.value;
    if (!accessToken || !refreshToken) return null;

    // Validate the access token first. Refreshing on every request can rotate
    // the refresh token and make a concurrent POST look unauthenticated.
    const currentClient = createServerClient(accessToken);
    const current = await currentClient.auth.getUser(accessToken);
    if (!current.error && current.data.user && isAdmin(current.data.user)) {
        return { user: current.data.user, accessToken };
    }

    const refreshClient = createServerClient();
    const { data, error } = await refreshClient.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    if (error || !data.user || !isAdmin(data.user) || !data.session) {
        return null;
    }
    if (data.session) setAuthCookies(cookies, data.session);
    return {
        user: data.user,
        accessToken: data.session.access_token,
    };
}

export function isAdmin(user) {
    const configuredAdminEmail = import.meta.env.SUPABASE_ADMIN_EMAIL;
    return user.app_metadata?.role === "admin"
        || (configuredAdminEmail && user.email === configuredAdminEmail);
}

export async function requireAdmin(Astro) {
    const session = await getAdminSession(Astro.cookies);
    if (!session) return Astro.redirect("/admin/login");
    Astro.locals.supabase = createServerClient(session.accessToken);
    return session.user;
}

export function clean(value) {
    const trimmed = String(value ?? "").trim();
    return trimmed || null;
}

export function asBoolean(value) {
    return value === "on" || value === "true" || value === "1";
}

export function formError(error) {
    return error?.message || "The request could not be completed.";
}
