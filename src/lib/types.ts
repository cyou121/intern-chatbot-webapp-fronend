export type HistoryItemType = {
    id: number;
    created_at: string;
    user_id: number;
    title: string;
};

export type ChatroomHistoryItemType = {
    room_id: number;
    id: number;
    content: string;
    created_at: string;
    role: boolean;
    llm_id: number | null;
    web_search_flag: boolean;
};