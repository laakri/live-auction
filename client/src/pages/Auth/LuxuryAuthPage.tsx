import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../hooks/useAuth";

const LuxuryAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login, signup, error, isLoading, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (isLogin) {
      await login(email, password);
    } else {
      await signup(name, email, password);
    }
  };

  return (
    <div className=" w-full bg-transparent flex items-center justify-center p-4 relative top-0 right-0 bottom-0 left-0 overflow-hidden">
      {/* Subtle background pattern */}
      {/* <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='8000' height='8000' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM0 28l14.142 14.142-1.414 1.414L0 30.828V28zm0 5.657L11.314 44.97 9.9 46.386l-9.9-9.9v-2.828zm0 5.657L8.485 47.8 7.07 49.212 0 42.143v-2.83zm0 5.657l5.657 5.657-1.414 1.415L0 47.8v-2.83zm0 5.657l2.828 2.83-1.414 1.413L0 53.456v-2.83zM54.627 60L30 35.373 5.373 60H8.2L30 38.2 51.8 60h2.827zm-5.656 0L30 41.03 11.03 60h2.828L30 43.858 46.142 60h2.83zm-5.656 0L30 46.686 16.686 60h2.83L30 49.515 40.485 60h2.83zm-5.657 0L30 52.343 22.343 60h2.83L30 55.172 34.828 60h2.83zM32 60l-2-2-2 2h4zM59.716 0l-28 28 1.414 1.414L60 2.544V0h-.284zM60 5.373L34.544 30.828l1.414 1.415L60 8.2V5.374zm0 5.656L37.373 33.656l1.414 1.414L60 13.86v-2.83zm0 5.656l-19.8 19.8 1.415 1.413L60 19.514v-2.83zm0 5.657l-16.97 16.97 1.414 1.415L60 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413L30 11.8l7.07 7.07zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      /> */}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full relative z-10  mt-14"
      >
        <div>
          <h1 className="text-[4rem]  text-center font-light ">
            Explore Premium
          </h1>
          <h1 className="text-[4rem]  text-center  font-light ">
            With{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-purple-700 dark:from-gray-50 dark:to-purple-400">
              LEXURA
            </span>
          </h1>
        </div>
        <div className=" rounded-lg overflow-hidden border max-w-lg mx-auto my-4 light:bg-primary-foreground ">
          <motion.div
            className="p-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl  text-center font-bold  mb-6">
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full "
                  />
                </motion.div>
              )}
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full "
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full "
              />
              {error && <p className="text-red-500 text-center">{error}</p>}
              {isLogin && (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full  font-bold py-3 transition duration-300 "
                >
                  Continue With Google
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full  font-bold py-3 transition duration-300 "
              >
                {isLoading
                  ? "Processing..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </Button>
            </form>
          </motion.div>
          <div className="p-4  ">
            <p className="text-center ">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button
                variant={"link"}
                onClick={() => setIsLogin(!isLogin)}
                className="   font-semibold"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </Button>
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 text-center"
        >
          <p className=" text-sm">
            By signing in, you agree to our
            <a href="#" className="underline ">
              Terms of Service
            </a>
            and
            <a href="#" className="underline ">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LuxuryAuthPage;
