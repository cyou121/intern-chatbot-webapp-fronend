import { useState, useEffect } from "react";
import { handleSend, fetchHistory } from "@/lib/api";
import ConversationMenu from "@/components/conversation/ConversationMenu";
import ConversationMain from "@/components/conversation/ConversationMain";
import PromptArea from "@/components/conversation/PromptArea";
import { Model } from "@/lib/constants";
import { HistoryItemType } from "@/lib/types";
import { MODEL_IDS } from "@/lib/constants";

const Conversation: React.FC = () => {
    const [selectedModels, setSelectedModels] = useState<[Model, number][]>([
        [Model.GPT, MODEL_IDS[Model.GPT]],
    ]);

    const [prompts, setPrompts] = useState<{ [key: string]: string[] }>({
        GPT: [],
    });

    const [currentInput, setCurrentInput] = useState("");
    const [history, setHistory] = useState<HistoryItemType[]>([]);

    const handleAddModel = (model: Model) => {
        const modelId = MODEL_IDS[model];
        if (!selectedModels.some(([m]) => m === model)) {
            setSelectedModels([...selectedModels, [model, modelId]]);
            setPrompts({ ...prompts, [model]: [] });
        }
    };

    const handleRemoveModel = (model: string) => {
        setSelectedModels(selectedModels.filter(([m]) => m !== model));
        const updatedPrompts = { ...prompts };
        delete updatedPrompts[model];
        setPrompts(updatedPrompts);
    };

    useEffect(() => {
        const loadHistory = async () => {
            const data = await fetchHistory();
            setHistory(data);
        };
        loadHistory();
    }, []);

    return (
        <div className="flex min-h-screen">
            <ConversationMenu
                setSelectedModel={handleAddModel}
                history={history}
                setHistory={setHistory}
                setPrompts={setPrompts}
            />
            <div className="flex flex-col flex-1 bg-gray-200">
                <div className="flex-[7] flex p-2 gap-4">
                    {selectedModels.map(([model]) => (
                        <ConversationMain
                            key={model}
                            selectedModel={model}
                            prompts={prompts[model]}
                            handleRemoveModel={handleRemoveModel}
                        />
                    ))}
                </div>
                <div className="flex-[1] p-2">
                    <PromptArea
                        prompt={currentInput}
                        setPrompt={setCurrentInput}
                        handleSend={() =>
                            handleSend(
                                currentInput,
                                selectedModels,
                                prompts,
                                setPrompts,
                                setCurrentInput
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default Conversation;