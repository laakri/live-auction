import React, { useState, useEffect } from "react";
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
import { socketService } from "../socketService";
import { AnimatePresence, motion } from "framer-motion";

interface InviteUsersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (emails: string[]) => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
  auctionId: string;
  invitedUsers: any[];
}

const InviteUsersDialog: React.FC<InviteUsersDialogProps> = ({
  isOpen,
  onClose,
  onInvite,
  onRemove,
  auctionId,
  invitedUsers: initialInvitedUsers,
}) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [invitedUsers, setInvitedUsers] = useState(initialInvitedUsers);
  const { toast } = useToast();

  useEffect(() => {
    socketService.on("user invited", (newUser: any) => {
      setInvitedUsers((prevUsers) => [...prevUsers, newUser]);
    });

    socketService.on("user removed", (removedUserId: string) => {
      setInvitedUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== removedUserId)
      );
    });

    return () => {
      socketService.off("user invited");
      socketService.off("user removed");
    };
  }, []);

  const renderUserInfo = (user: any) => {
    return `${user.email} (${user.username})`;
  };

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
      setEmails([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitations. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveInvitedUser = async (userId: string) => {
    try {
      await onRemove(userId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove user. Please try again.",
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
            <Label>New Invitations:</Label>
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
          <div className="space-y-2">
            <Label>Already Invited Users:</Label>
            <AnimatePresence>
              {invitedUsers.length > 0 ? (
                invitedUsers.map((user) => (
                  <motion.div
                    key={user._id || user.email}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between bg-gray-800 p-2 rounded"
                  >
                    <span>{renderUserInfo(user)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleRemoveInvitedUser(user._id || user.email)
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))
              ) : (
                <p>No invited users</p>
              )}
            </AnimatePresence>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleInvite}
            className="w-full"
            disabled={emails.length === 0}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Send Invitations
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUsersDialog;
