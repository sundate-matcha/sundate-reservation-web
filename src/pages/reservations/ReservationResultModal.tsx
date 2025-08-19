import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  success: boolean;
};

export default function ReservationResultModal({
  open,
  onClose,
  success,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            {success ? "Reservation Confirmed" : "Reservation Failed"}
          </DialogTitle>
          <DialogDescription>
            {success
              ? "Your table has been reserved successfully. We look forward to welcoming you."
              : "We couldn’t process your reservation. Please try again."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
