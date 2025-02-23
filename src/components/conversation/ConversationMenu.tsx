import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchChatroomHistory } from "@/lib/api";
import { Model } from "@/lib/constants";
import { HistoryItemType, ChatroomHistoryItemType } from "@/lib/types";
import { MODEL } from "@/lib/constants";

const ConversationMenu = ({
    setSelectedModel,
    history: parentHistory,
    setHistory,
    setPrompts,
}: {
    setSelectedModel: (model: Model, id: number) => void;
    history: HistoryItemType[];
    setHistory: (history: HistoryItemType[]) => void;
    setPrompts: (updatedPrompts: { [key: string]: string[] }) => void;
}) => {
    const [history, setLocalHistory] =
        useState<HistoryItemType[]>(parentHistory);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuth();

    const handleUserClick = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleHistoryClick = async (roomId: number) => {
        console.log(`History item clicked: ${roomId}`);

        localStorage.setItem("current_room_id", roomId.toString());

        const chatroomHistory = await fetchChatroomHistory(roomId);

        const uniqueModels = new Set(
            chatroomHistory
                .map((item: ChatroomHistoryItemType) => item.llm_id)
                .filter(Boolean)
        );

        const selectedModels: [string, number][] = Array.from(uniqueModels).map(
            (id) => [MODEL[id as number], id as number]
        );

        selectedModels.forEach(([model, id]) => setSelectedModel(model as Model, id));

        const updatedPrompts: { [key: string]: string[] } = {};
        selectedModels.forEach(([model]) => (updatedPrompts[model] = []));

        chatroomHistory.forEach(
            ({
                content,
                role,
                llm_id,
            }: {
                content: string;
                role: boolean;
                llm_id: number | null;
            }) => {
                if (!llm_id) return;
                const model = MODEL[llm_id];
                if (model) {
                    updatedPrompts[model].push(role ? content : `> ${content}`);
                }
            }
        );

        setPrompts(updatedPrompts);
    };

    useEffect(() => {
        setLocalHistory(parentHistory);
    }, [parentHistory]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <aside className="w-1/4 max-w-[230px] bg-gray-50 flex flex-col h-screen">
            <div className="flex-[0.5] flex items-center justify-between p-2 border-b-[2px] border-dotted">
                <div className="mx-auto text-2xl">AI比較</div>
            </div>

            <div className="flex-[1] p-2 border-b-[2px] border-dotted">
                <h2 className="text-lg font-bold mb-2">AIモデル</h2>
                <div className="space-y-2">
                    <button
                        className="w-full text-left text-gray-700 font-medium flex items-center justify-between hover:bg-gray-300 p-2 rounded-md transition"
                        onClick={() => setSelectedModel(Model.GPT, 1)}
                    >
                        ChatGPT
                    </button>
                    <button
                        className="w-full text-left text-gray-700 font-medium flex items-center justify-between hover:bg-gray-300 p-2 rounded-md transition"
                        onClick={() => setSelectedModel(Model.Gemini, 2)}
                    >
                        Gemini
                    </button>
                </div>
            </div>

            <div className="flex-[4] p-2 overflow-y-auto scrollbar-none border-b-[2px] border-dotted">
                <h2 className="text-lg font-bold mb-2">履歴</h2>
                <ul className="space-y-2">
                    {history.length > 0 ? (
                        [...history].reverse().map((item) => (
                            <li
                                key={item.id}
                                className="p-2 bg-white shadow-md rounded-md cursor-pointer hover:bg-gray-200"
                                onClick={() => handleHistoryClick(item.id)}
                            >
                                {item.title}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500">履歴なし</li>
                    )}
                </ul>
            </div>

            <div
                className="flex-[1] flex flex-col justify-end p-2 relative"
                ref={dropdownRef}
            >
                {isDropdownOpen && (
                    <div className="w-full bg-white shadow-lg rounded-md py-2 mb-1">
                        <button
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={logout}
                        >
                            ログアウト
                        </button>
                    </div>
                )}

                <button
                    className="w-full text-left text-gray-700 font-medium flex items-center justify-between hover:bg-gray-300 p-2 rounded-md transition"
                    onClick={handleUserClick}
                >
                    <span className="mx-auto">
                        {localStorage.getItem("user_email") || "test"}
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default ConversationMenu;
