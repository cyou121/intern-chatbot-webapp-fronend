import { getApiUrl } from "./config";
import { jwtDecode } from "jwt-decode";
import { Model } from "@/lib/constants";

export const fetchHistory = async () => {
    if (import.meta.env.MODE === "development") {
        const testHistory = await import("@/mock/history.json");
        return testHistory.default;
    }

    try {
        const url = getApiUrl("/history");
        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch history");

        return await response.json();
    } catch (error) {
        console.error("Error fetching history:", error);
        return [];
    }
};

export const fetchChatroomHistory = async (roomId: number) => {
    if (import.meta.env.MODE === "development") {
        const testChatroomHistory = await import("@/mock/chatroom.json");
        return testChatroomHistory.default.filter(
            (item) => item.room_id === roomId
        );
    }

    try {
        const url = getApiUrl(`/chat/chatrooms/${roomId}`);
        const response = await fetch(url);

        if (!response.ok) throw new Error("Failed to fetch chatroom history");

        return await response.json();
    } catch (error) {
        console.error("Error fetching chatroom history:", error);
        return [];
    }
};

export const handleSend = (
    currentInput: string,
    selectedModels: [Model, number][],
    prompts: { [key: string]: string[] },
    setPrompts: (updatedPrompts: { [key: string]: string[] }) => void,
    setCurrentInput: (input: string) => void
) => {
    if (!currentInput.trim()) return;

    const userEmail = localStorage.getItem("user_email") || "default_user";
    const storedRoomId = localStorage.getItem("current_room_id");
    const updatedPrompts = { ...prompts };
    const url: string = getApiUrl("/chat/response");

    selectedModels.forEach(async ([model, modelId]) => {
        const userPrompt: string = `${currentInput}`;
        let response: string = "";

        let request: {
            room_id: string | null;
            user_id: string | null;
            user_message: string;
            llm_ids: string;
        } = {
            room_id: storedRoomId || null,
            user_id: storedRoomId ? null : userEmail,
            user_message: currentInput,
            llm_ids: modelId.toString(),
        };

        if (process.env.NODE_ENV === "development") {
            response = `Response from: ${userPrompt}`;
        } else {
            try {
                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(request),
                });
                const data = await res.json();
                response = data.response;

                if (!storedRoomId && data.room_id) {
                    localStorage.setItem("current_room_id", data.room_id);
                }
            } catch (err) {
                console.error(err);
            }
        }

        updatedPrompts[model] = [
            ...updatedPrompts[model],
            userPrompt,
            response,
        ];
    });

    setPrompts(updatedPrompts);
    setCurrentInput("");
};

export const loginUser = async (email: string, password: string) => {
    try {
        let url: string;
        let response: Response;

        url = getApiUrl("/auth/token");

        if (import.meta.env.MODE === "development") {
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({ email, password }),
            });
        } else {
            response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
        }

        if (!response.ok) throw new Error("ログインに失敗しました。");

        const data = await response.json();
        const accessToken = data?.access_token || null;

        if (!accessToken) throw new Error("認証トークンが見つかりません。");

        localStorage.setItem("access_token", accessToken);

        const decoded: { sub: string; exp: number } = jwtDecode(accessToken);

        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime)
            throw new Error("認証トークンの有効期限が切れています。");

        localStorage.setItem("user_email", decoded.sub);

        return { user: decoded.sub, token: accessToken };
    } catch (error) {
        console.error("ログインエラー:", error);
        return null;
    }
};