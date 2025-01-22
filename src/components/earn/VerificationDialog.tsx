import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VerificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  verificationCode: string;
  onVerificationCodeChange: (code: string) => void;
  onVerify: () => void;
}

export const VerificationDialog = ({
  isOpen,
  onOpenChange,
  verificationCode,
  onVerificationCodeChange,
  onVerify,
}: VerificationDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-game-secondary border-2 border-game-text">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-game-text">Enter Verification Code</AlertDialogTitle>
          <AlertDialogDescription className="text-game-text/80">
            Please enter the verification code shown in the video to receive your coins.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          <Input
            type="text"
            placeholder="Enter code"
            value={verificationCode}
            onChange={(e) => onVerificationCodeChange(e.target.value)}
            className="bg-game-primary text-game-text border-game-text"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-game-accent text-game-text border-game-text hover:bg-game-primary">
            Cancel
          </AlertDialogCancel>
          <Button 
            onClick={onVerify}
            className="bg-game-primary text-game-text border-2 border-game-text hover:bg-game-accent"
          >
            Verify Code
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};