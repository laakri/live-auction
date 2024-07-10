import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

interface VerificationPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

const VerificationPrompt: React.FC<VerificationPromptProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Your Account</DialogTitle>
          <DialogDescription>
            You need to verify your account to start bidding and chatting in
            auctions.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <Button onClick={() => navigate("/UserVerification")}>
            Go to Verification Page
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Next Time
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationPrompt;
