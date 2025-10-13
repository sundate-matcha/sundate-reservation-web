import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

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
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (open) {
      setCountdown(10);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // Delay onClose ra ngoài vòng render
            setTimeout(() => onClose(), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [open, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" showCloseButton={false} forceMount>
        <DialogHeader>
          <DialogTitle>
            {success ? "Reservation Confirmed" : "Reservation Failed"}
          </DialogTitle>
          {success ? (
            <img src="/public/images/check.png" alt="" className="w-[50%] mx-auto" />
          ) : (
            <img src="/public/images/remove.png" alt="" className="w-[50%] mx-auto" />
          )}
          <DialogDescription asChild>
            <div>
              <p className="text-center mt-4">
                {success
                  ? "Bạn đã đặt bàn thành công. Sundate sẽ giữ bàn của bạn trong vòng 15 phút, bạn vui lòng đến đúng giờ nhé!"
                  : "Chúng tôi không thể xử lý đặt chỗ của bạn. Vui lòng thử lại."}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>Đóng ({countdown})</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
