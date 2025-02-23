import { motion, AnimatePresence } from "framer-motion";
import Login from "@/pages/Login";
import Conversation from "@/pages/Conversation";
import { AuthProvider, useAuth } from "@/context/AuthContext";

const AppContent = () => {
    const { user } = useAuth();

    // Animation variants
    const pageVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            y: -30,
            transition: { duration: 0.3, ease: "easeIn" },
        },
    };

    return (
        <div className="flex flex-col justify-center min-h-screen">
            <AnimatePresence mode="wait">
                {user ? (
                    <motion.div
                        key="conversation"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={pageVariants}
                    >
                        <Conversation />
                    </motion.div>
                ) : (
                    <motion.div
                        key="login"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={pageVariants}
                    >
                        <Login />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const App = () => (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
);

export default App;
