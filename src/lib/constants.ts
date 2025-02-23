export enum Model {
    GPT = "GPT",
    Gemini = "Gemini"
}

export const MODEL: Record<number, Model> = {
    1: Model.GPT,
    2: Model.Gemini,
};

export const MODEL_IDS: Record<Model, number> = {
    [Model.GPT]: 1,
    [Model.Gemini]: 2,
};
