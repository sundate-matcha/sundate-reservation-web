import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import ReservationResultModal from "./ReservationResultModal";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

type ReservationData = {
  fullName: string;
  phone: string;
  guest: number;
  date: string;
  time: string;
  tableCategory: string;
  notes?: string;
};

type TableCategory = {
  _id: string;
  name: string;
  capacity: number;
};

export default function ReservationForm() {
  const [form, setForm] = useState<ReservationData>({
    fullName: "",
    phone: "",
    guest: 1,
    date: "",
    time: "",
    tableCategory: "",
    notes: "",
  });

  const [tableCategories, setTableCategories] = useState<TableCategory[]>([]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ReservationData, string>>
  >({});
  const [modalOpen, setModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch danh sách TableCategory từ API
  useEffect(() => {
    fetch("https://sundate.justdemo.work/api/table-categories")
      .then((res) => res.json())
      .then((data) => {
        // Kiểm tra nếu server trả về object chứa mảng
        if (Array.isArray(data)) {
          setTableCategories(data);
        } else if (Array.isArray(data.tableCategories)) {
          setTableCategories(data.tableCategories);
        } else {
          console.error("Unexpected API response:", data);
          setTableCategories([]);
        }
      })
      .catch((err) => console.error("Error fetching table categories:", err));
  }, []);

  const mutation = useMutation({
    mutationFn: async (newReservation: ReservationData) => {
      let phone = newReservation.phone.trim();
      if (phone.startsWith("0")) {
        phone = "+84" + phone.slice(1);
      } else if (!phone.startsWith("+84")) {
        phone = "+84" + phone; // fallback nếu người dùng nhập thiếu
      }

      const payload = {
        name: newReservation.fullName,
        phone,
        date: dayjs(newReservation.date).format("YYYY-MM-DD"),
        time: newReservation.time,
        guests: newReservation.guest,
        tableCategory: newReservation.tableCategory,
        notes: newReservation.notes,
      };

      const res = await fetch(
        "https://sundate.justdemo.work/api/reservations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      console.log("Submitted data:", payload);

      // ✅ NÊN parse lỗi đúng kiểu backend trả về
      const data = await res.json();
      if (!res.ok) {
        // ném luôn object lỗi để onError nhận được toàn bộ JSON backend
        throw data;
      }

      return data;
    },

    // ✅ Khi thành công
    onSuccess: () => {
      setIsSuccess(true);
      setModalOpen(true);
      setForm({
        fullName: "",
        phone: "",
        guest: 1,
        date: "",
        time: "",
        tableCategory: "",
        notes: "",
      });
      setErrors({});
    },

    // ✅ Khi lỗi
    onError: (error: any) => {
      console.error("Server returned error:", error);
      setIsSuccess(false);
      setModalOpen(true);
    },
  });

  const handleChange = (
    key: keyof ReservationData,
    value: string | number | string[]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ReservationData, string>> = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (form.guest < 1) newErrors.guest = "Number of guests must be at least 1";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.time) newErrors.time = "Time is required";
    if (!form.tableCategory)
      newErrors.tableCategory = "Please select a table category";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    if (!current) return false;
    const isPast = current < dayjs().startOf("day");
    return isPast;
  };

  const disabledTime = (date?: dayjs.Dayjs | null) => {
    const now = dayjs();
    return {
      disabledHours: () => {
        const hours: number[] = [];
        for (let i = 0; i < 24; i++) {
          if (i < 8 || i > 21) hours.push(i);
        }
        if (date && date.isSame(now, "day")) {
          for (let i = 8; i <= 21; i++) {
            if (i < now.hour() && !hours.includes(i)) hours.push(i);
          }
        }
        return hours;
      },
      disabledMinutes: (hour: number) => {
        const minutes: number[] = [];
        if (hour === 21) {
          for (let i = 1; i < 60; i++) minutes.push(i);
          return minutes;
        }
        for (let i = 0; i < 60; i++) {
          if (i % 15 !== 0) minutes.push(i);
        }
        if (date && date.isSame(now, "day") && hour === now.hour()) {
          for (let i = 0; i < now.minute(); i++) {
            if (!minutes.includes(i)) minutes.push(i);
          }
        }
        return minutes;
      },
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate(form);
  };

  const maxGuests =
    tableCategories.find((cat) => cat._id === form.tableCategory)?.name ===
    "Bàn quầy bar"
      ? 2
      : 8;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="p-4 grid gap-4 w-full mx-auto bg-[#ffffff88] rounded-lg"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-[#fff8de]">
          Reservation
        </h1>

        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-[#fff8de] mb-2">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" className="text-[#fff8de] mb-2">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Guests & Table */}
        <div className="w-full grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="guestCount" className="text-[#fff8de] mb-2">
              Number of Guests
            </Label>
            <Select
              value={form.guest.toString()}
              onValueChange={(val) => handleChange("guest", Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Số lượng khách" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(maxGuests)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.guest && (
              <p className="text-red-500 text-sm mt-1">{errors.guest}</p>
            )}
          </div>

          <div>
            <Label className="text-[#fff8de]">Table</Label>
            <div className="mt-2">
              <Select
                value={form.tableCategory}
                onValueChange={(val) => handleChange("tableCategory", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn bàn" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(tableCategories) &&
                  tableCategories.length > 0 ? (
                    tableCategories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="no-category">
                      No categories available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {errors.tableCategory && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tableCategory}
              </p>
            )}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date" className="text-[#fff8de] mb-2">
              Date
            </Label>
            <DatePicker
              id="date"
              className="w-full"
              format="YYYY-MM-DD"
              disabledDate={disabledDate}
              value={form.date ? dayjs(form.date) : null}
              onChange={(_, dateString) => handleChange("date", dateString)}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>
          <div>
            <Label htmlFor="time" className="text-[#fff8de] mb-2">
              Time
            </Label>
            <TimePicker
              id="time"
              className="w-full"
              format="HH:mm"
              minuteStep={15}
              hideDisabledOptions
              disabledTime={() =>
                disabledTime(form.date ? dayjs(form.date) : null)
              }
              value={form.time ? dayjs(form.time, "HH:mm") : null}
              onChange={(_, timeString) => handleChange("time", timeString)}
            />
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes" className="text-[#fff8de] mb-2">
            Note (optional)
          </Label>
          <Textarea
            id="notes"
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
        </div>

        {/* Submit */}
        <div className="mt-6 flex justify-center h-[60%]">
          <Button
            type="submit"
            variant={"default"}
            disabled={mutation.isPending}
            className="w-[40%] h-full !text-xl"
          >
            {mutation.isPending ? "PROCESSING..." : "BOOK NOW"}
          </Button>
        </div>
      </form>

      <ReservationResultModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        success={isSuccess}
        response={mutation.isSuccess ? mutation.data : mutation.error}
      />
    </>
  );
}
