export const getApiUrl = (path: string): string => {
    const BASE_URL = import.meta.env.VITE_API_URL;

    if (path.startsWith("/auth/token")) {
        return `${BASE_URL}/auth/token${path.replace("/auth/token", "")}`;
    }

    if (path.startsWith("/auth/me")) {{
        return `${BASE_URL}/auth/me${path.replace("/auth/me", "")}`;
    }}

    if (path.startsWith("/chat/response")) {{
        return `${BASE_URL}/chat/response${path.replace("/chat/response", "")}`;
    }}

    if (path.startsWith("/chat/history")) {{
        return `${BASE_URL}/history${path.replace("/history", "")}`;
    }}

    if (path.startsWith("/chat/chatrooms")) {{
        return `${BASE_URL}/room${path.replace("/room", "")}`;
    }}

    return `${BASE_URL}${path}`;
}
