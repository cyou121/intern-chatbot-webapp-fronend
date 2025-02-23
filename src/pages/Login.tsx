import Button from "@/components/ui/button";
import { useState } from "react";
import { validatePassword } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const Login: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailMessage, setEmailMessage] =
        useState("メールアドレスを入力してください");
    const [passwordMessage, setPasswordMessage] =
        useState("パスワードを入力してください");
    const [loading, setLoading] = useState(false);

    const handleEmailChange = (value: string) => {
        setEmail(value);
        setEmailMessage(
            value.trim() === "" ? "メールアドレスを入力してください" : ""
        );
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setPasswordMessage(validatePassword(value));
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await login(email, password);
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <p className="text-gray-600 text-center mb-6 text-sm">
                ログイン画面
            </p>

            <form
                onSubmit={handleLoginSubmit}
                className="px-12 py-8 w-full max-w-xl flex flex-col justify-center items-center rounded-lg shadow-lg"
            >
                <h2 className="text-3xl font-semibold mb-6">ログイン</h2>

                <div className="w-full max-w-lg flex flex-col gap-6 p-6 rounded-md">
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            メールアドレス
                        </label>
                        <input
                            type="email"
                            className="w-full h-16 p-4 border rounded-md focus:outline-blue-500"
                            placeholder="メールアドレス"
                            value={email}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            required
                        />
                        <p
                            className={`text-red-500 text-sm ${
                                emailMessage ? "" : "invisible"
                            }`}
                        >
                            {emailMessage || "プレースホルダー"}
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            パスワード
                        </label>
                        <input
                            type="password"
                            className="w-full h-16 p-4 border rounded-md focus:outline-blue-500"
                            placeholder="パスワード"
                            value={password}
                            onChange={(e) =>
                                handlePasswordChange(e.target.value)
                            }
                            required
                        />
                        <p
                            className={`text-red-500 text-sm ${
                                passwordMessage ? "" : "invisible"
                            }`}
                        >
                            {passwordMessage || "プレースホルダー"}
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="mt-6 w-full h-14 text-2xl"
                        disabled={loading}
                    >
                        {loading ? "ログイン中..." : "ログイン"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Login;