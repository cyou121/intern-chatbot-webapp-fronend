import { useRef, useEffect } from "react";

const ConversationMain = ({
    selectedModel,
    prompts,
    handleRemoveModel,
}: {
    selectedModel: string;
    prompts: string[];
    handleRemoveModel: (model: string) => void;
}) => {
    const promptEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (promptEndRef.current) {
            promptEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [prompts]);

    return (
        <div className="flex-1 min-w-[300px] flex flex-col bg-gray-50 p-4 rounded-lg shadow-lg relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveModel(selectedModel);
                }}
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition"
            >
                ✖
            </button>

            <h2 className="text-xl font-bold">{selectedModel}</h2>
            <div className="h-1 w-full bg-gray-300 my-1"></div>
            <div className="flex-1 overflow-y-auto p-2 border-t max-h-[calc(100vh-300px)]">
                {prompts.map((prompt, index) => (
                    <div key={index} className="flex flex-col">
                        {/* //TODO: determined based on llm or human flag */}
                        {index % 2 === 0 ? (
                            <div
                                className="bg-blue-500 text-white p-2 rounded-lg self-end max-w-[80%] mb-2"
                                style={{ whiteSpace: "pre-wrap" }}
                            >
                                {prompt}
                            </div>
                        ) : (
                            <div
                                className="bg-gray-200 text-black p-2 rounded-lg self-start max-w-[80%] mb-2"
                                style={{ whiteSpace: "pre-wrap" }}
                            >
                                {prompt}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={promptEndRef} />
            </div>
        </div>
    );
};

export default ConversationMain;