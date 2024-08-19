import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/ui/use-toast";
import { NavigateFunction } from "react-router-dom";

import VerificationPrompt from "../../pagesComponents/VerificationPrompt";
import useAuthStore from "../../stores/authStore";

const LuxuryAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { login, signup, isLoading } = useAuth();
  const { toast } = useToast();
  const {
    shouldShowVerificationPrompt,
    user,
    clearError: clearAuthError,
  } = useAuthStore();
  const [showPrompt, setShowPrompt] = useState(false);
  const shouldShowPrompt = useAuthStore((state) =>
    state.shouldShowVerificationPrompt()
  );

  useEffect(() => {
    setShowPrompt(shouldShowPrompt);
  }, [user, shouldShowPrompt]);

  const handleClosePrompt = () => {
    setShowPrompt(false);
    useAuthStore
      .getState()
      .updateUser({ lastVerificationPrompt: Date.now() }, toast);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //clearError();
    if (isLogin) {
      await login(email, password, toast);
    } else {
      await signup(username, email, password, toast);
    }
  };

  return (
    <div className="w-full bg-transparent flex items-center justify-center p-4 relative top-0 right-0 bottom-0 left-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full relative z-10 mt-14"
      >
        <div>
          <h1 className="text-[4rem] text-center font-light">
            Explore Premium
          </h1>
          <h1 className="text-[4rem] text-center font-light">
            With{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-purple-700 dark:from-gray-50 dark:to-purple-400">
              LEXURA
            </span>
          </h1>
        </div>
        <div className="rounded-lg overflow-hidden max-w-lg mx-auto my-4 light:bg-primary-foreground">
          <motion.div
            className="p-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl text-center font-bold mb-6">
              {isLogin ? "Welcome Back" : "Join the Elite"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full"
                  />
                </motion.div>
              )}
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
           {/**  {error && <p className="text-red-500 text-center">{error}</p>}*/}  
              {isLogin && (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full font-bold py-3 transition duration-300"
                >
                  Continue With Google
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-bold py-3 transition duration-300"
              >
                {isLoading
                  ? "Processing..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </Button>
            </form>
          </motion.div>
          <div className="p-4">
            <p className="text-center">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button
                variant={"link"}
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </Button>
            </p>
          </div>
        </div>
      </motion.div>

      <VerificationPrompt isOpen={showPrompt} onClose={handleClosePrompt} />
    </div>
  );
};

export default LuxuryAuthPage;
