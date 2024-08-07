import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { X, UserPlus } from "lucide-react";
import { useToast } from "../../../components/ui/use-toast";

interface InviteUsersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (emails: string[]) => Promise<void>;
  auctionId: string;
}

const InviteUsersDialog: React.FC<InviteUsersDialogProps> = ({
  isOpen,
  onClose,
  onInvite,
  auctionId,
}) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const { toast } = useToast();

  const handleAddEmail = () => {
    if (currentEmail && !emails.includes(currentEmail)) {
      setEmails([...emails, currentEmail]);
      setCurrentEmail("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const handleInvite = async () => {
    try {
      await onInvite(emails);
      toast({
        title: "Invitations Sent",
        description: `Invitations have been sent to ${emails.length} user(s).`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitations. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Users to Private Auction</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              id="email"
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              placeholder="Enter email address"
            />
            <Button onClick={handleAddEmail} size="sm">
              Add
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Invited Users:</Label>
            {emails.map((email) => (
              <div
                key={email}
                className="flex items-center justify-between bg-gray-800 p-2 rounded"
              >
                <span>{email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveEmail(email)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleInvite} className="w-full">
            <UserPlus className="mr-2 h-4 w-4" />
            Send Invitations
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUsersDialog;
