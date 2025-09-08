import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
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
      setCountdown(10); // reset khi mở modal
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onClose(); // tự đóng khi hết thời gian
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
          <DialogDescription>
            {success ? (
              <DotLottieReact
                src="https://lottie.host/13a53afb-e00a-44c0-b417-c5d15281027c/4eV1Xi3FCx.lottie"
                autoplay
                className="w-64 h-64 my-10 mx-auto"
              />
            ) : (
              <DotLottieReact
                src="https://lottie.host/e04332b3-2853-471c-8cc7-87d0ec51fdfa/CBiVtY9WXh.lottie"
                autoplay
                className="w-64 h-64 my-10 mx-auto"
              />
            )}
            {success
              ? "Bạn đã đặt bàn thành công. Sundate sẽ giữ bàn của bạn trong vòng 15 phút, bạn vui lòng đến đúng giờ nhé!"
              : "Chúng tôi không thể xử lý đặt chỗ của bạn. Vui lòng thử lại."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>Đóng ({countdown})</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
