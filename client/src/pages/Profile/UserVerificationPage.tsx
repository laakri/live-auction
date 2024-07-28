import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/ui/use-toast";
import useAuthStore from "../../stores/authStore";
import { User, MapPin, Phone, CreditCard } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  icon: React.ReactNode;
  error?: string;
}

const InputWithIcon: React.FC<InputWithIconProps> = ({
  icon,
  error,
  ...props
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      {icon}
    </div>
    {props.type === "textarea" ? (
      <Textarea {...props} className="pl-10 w-full" />
    ) : (
      <Input {...props} className="pl-10 w-full" />
    )}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const UserVerificationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    address: "",
    phoneNumber: "",
    idNumber: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    address: "",
    phoneNumber: "",
    idNumber: "",
  });
  const { updateUser } = useAuthStore();
  const { toast } = useToast();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (formData.username.length < 3) {
      newErrors.username = "Name must be at least 3 characters long";
      isValid = false;
    } else {
      newErrors.username = "";
    }

    if (formData.address.trim() === "") {
      newErrors.address = "Address is required";
      isValid = false;
    } else {
      newErrors.address = "";
    }

    if (!/^\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 8 digits";
      isValid = false;
    } else {
      newErrors.phoneNumber = "";
    }

    if (!/^\d{8}$/.test(formData.idNumber)) {
      newErrors.idNumber = "ID number must be 8 digits";
      isValid = false;
    } else {
      newErrors.idNumber = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await updateUser(formData, toast);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "phoneNumber" || name === "idNumber") {
      newValue = value.replace(/\D/g, "").slice(0, 8);
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const inputFields = [
    {
      name: "username",
      icon: <User className="w-5 h-5" />,
      placeholder: "Full Name",
      type: "text",
    },
    {
      name: "address",
      icon: <MapPin className="w-5 h-5" />,
      placeholder: "Address",
      as: "textarea",
    },
    {
      name: "phoneNumber",
      icon: <Phone className="w-5 h-5" />,
      placeholder: "Phone Number",
      type: "tel",
    },
    {
      name: "idNumber",
      icon: <CreditCard className="w-5 h-5" />,
      placeholder: "ID Number",
      type: "tel",
    },
  ];

  return (
    <div className="w-full bg-transparent flex items-center justify-center p-4 relative top-0 right-0 bottom-0 left-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full relative z-10 mt-14"
      >
        <div>
          <h1 className="text-[4rem] text-center font-light">Welcome to</h1>
          <h1 className="text-[4rem] text-center font-light">
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
              Verify your account to start bidding
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {inputFields.map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <InputWithIcon
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleInputChange}
                    {...field}
                    error={errors[field.name as keyof typeof errors]}
                    {...field}
                  />
                </motion.div>
              ))}
              <Button
                type="submit"
                className="w-full font-bold py-3 transition duration-300"
              >
                Verify and Join
              </Button>
            </form>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-sm">
            Start your luxury auction journey with just 20 DT
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserVerificationPage;
