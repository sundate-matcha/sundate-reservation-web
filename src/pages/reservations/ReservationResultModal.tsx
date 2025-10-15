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
  response?: any; // thêm: dữ liệu trả về từ backend (có thể là lỗi)
};

export default function ReservationResultModal({
  open,
  onClose,
  success,
  response,
}: Props) {
  const [countdown, setCountdown] = useState(10);

  // ✅ Dịch lỗi từ backend sang tiếng Việt
  const translateError = (res: any): string => {
    if (!res) return "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";

    if (res.error === "Validation failed") {
      const fields = res.details?.map((d: any) => `• ${d.msg}`).join("\n");
      return `Dữ liệu không hợp lệ:\n${
        fields || "Vui lòng kiểm tra lại thông tin."
      }`;
    }

    if (res.error === "Reservation not available") {
      return "Rất tiếc, bàn bạn chọn đã hết chỗ vào thời điểm này. Vui lòng chọn khung giờ hoặc bàn khác.";
    }

    if (res.error === "Duplicate reservation") {
      return "Bạn đã có một đặt bàn khác tại thời gian này. Vui lòng kiểm tra lại.";
    }

    if (res.error === "Reservation not found") {
      return "Không tìm thấy thông tin đặt bàn.";
    }

    if (res.error === "Cannot modify reservation") {
      return "Đặt bàn này không thể chỉnh sửa do đã bị hủy hoặc hoàn tất.";
    }

    if (res.error === "Failed to create reservation") {
      return "Không thể tạo đặt bàn do lỗi hệ thống. Vui lòng thử lại sau.";
    }

    return res.message || "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.";
  };

  const errorMessage = !success && response ? translateError(response) : null;

  const renderMessage = () => {
    if (success) {
      return (
        <p className="whitespace-pre-line text-green-600 text-sm mt-3 bg-green-50 border border-green-200 p-2 rounded-md">
          Bạn đã đặt bàn thành công. Sundate sẽ giữ bàn của bạn trong vòng 15
          phút, bạn vui lòng đến đúng giờ nhé!
        </p>
      );
    } else {
      return (
        <p className="whitespace-pre-line text-red-600 text-sm mt-3 bg-red-50 border border-red-200 p-2 rounded-md">
          {errorMessage}
        </p>
      );
    }
  };

  useEffect(() => {
    if (open) {
      setCountdown(10);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
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
            <img
              src="/public/images/check.png"
              alt=""
              className="w-[50%] mx-auto"
            />
          ) : (
            <img
              src="/public/images/remove.png"
              alt=""
              className="w-[50%] mx-auto"
            />
          )}

          <DialogDescription asChild>
            <div>
              <div className="mt-4 text-center">
                {renderMessage()}
              </div>
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
