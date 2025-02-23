import { useEffect, useRef, useState } from "react";

const MAX_CHAR_COUNT = 10000;

const PromptArea = ({
    prompt,
    setPrompt,
    handleSend,
}: {
    prompt: string;
    setPrompt: (value: string) => void;
    handleSend: () => void;
}) => {
    const promptRef = useRef<HTMLDivElement>(null);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            if (prompt.trim() !== "") {
                handleSendClick();
            }
        }
    };

    const handleInput = () => {
        if (promptRef.current) {
            const textWithNewLines = promptRef.current.innerHTML
                .replace(/<div>/g, "\n")
                .replace(/<\/div>/g, "")
                .replace(/<br>/g, "\n");
            setPrompt(textWithNewLines.trim());
        }
    };

    const handleSendClick = () => {
        if (prompt.trim() === "" || isSending)  return;

        setIsSending(true);

        handleSend();
        console.log("Get response from the server");

        if (promptRef.current) {
            promptRef.current.innerHTML = "";
        }
        setPrompt("");
        setIsSending(false);
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleSend]);

    return (
        <div className="flex flex-col p-4 bg-white rounded-2xl shadow-md relative border border-gray-300 max-h-[25vh] overflow-y-auto">
            <div
                ref={promptRef}
                contentEditable
                role="textbox"
                aria-multiline="true"
                data-placeholder="Ctrl+ENTER / ⌘+ENTERで送信する"
                onInput={handleInput}
                className="flex-1 min-h-[50px] text-gray-900 focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 whitespace-pre-wrap"
                style={{ maxHeight: "25vh", overflowY: "auto" }}
            ></div>

            <div className="flex justify-between items-center mt-2 relative">
                <button
                    className={`flex items-center px-2 py-1 rounded-lg transition ${
                        isSearchActive
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setIsSearchActive(!isSearchActive)}
                >
                    検索する
                </button>

                <div className="flex items-center space-x-3 absolute right-2 bottom-2">
                    <span className="text-gray-500 text-sm">
                        {prompt.length}/{MAX_CHAR_COUNT}
                    </span>

                    <button
                        className={`flex items-center justify-center rounded-full w-9 h-9 transition ${
                            prompt.trim() === ""
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-black text-white hover:bg-gray-700"
                        }`}
                        onClick={handleSendClick}
                        disabled={prompt.trim() === "" || isSending}
                    >
                        ⬆
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromptArea;