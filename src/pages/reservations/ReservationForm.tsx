import { useState } from "react";
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
  tableType: string;
  description?: string;
};

export default function ReservationForm() {
  const [form, setForm] = useState<ReservationData>({
    fullName: "",
    phone: "",
    guest: 1,
    date: "",
    time: "",
    tableType: "",
    description: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: async (newReservation: ReservationData) => {
      const res = await fetch(
        "https://68a2a89fc5a31eb7bb1d6794.mockapi.io/api/reservation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReservation),
        }
      );
      if (!res.ok) throw new Error("Request failed");
      return res.json();
    },
    onSuccess: () => {
      setIsSuccess(true);
      setModalOpen(true);
      setForm({
        fullName: "",
        phone: "",
        guest: 1,
        date: "",
        time: "",
        tableType: "",
        description: "",
      });
    },
    onError: () => {
      setIsSuccess(false);
      setModalOpen(true);
    },
  });

  const handleChange = (
    key: keyof ReservationData,
    value: string | number | string[]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    if (!current) return false;
    return current < dayjs().startOf("day");
  };

  const disabledTime = (date?: dayjs.Dayjs | null) => {
    const now = dayjs();
    return {
      disabledHours: () => {
        const hours: number[] = [];
        for (let i = 0; i < 24; i++) {
          // chỉ cho chọn từ 8h đến 21h
          if (i < 8 || i > 21) {
            hours.push(i);
          }
        }

        // Nếu chọn hôm nay thì disable giờ đã qua
        if (date && date.isSame(now, "day")) {
          for (let i = 8; i <= 21; i++) {
            if (i < now.hour()) {
              if (!hours.includes(i)) hours.push(i);
            }
          }
        }

        return hours;
      },
      disabledMinutes: (hour: number) => {
        const minutes: number[] = [];

        // chỉ cho phép phút chia hết cho 15
        for (let i = 0; i < 60; i++) {
          if (i % 15 !== 0) minutes.push(i);
        }

        // Nếu chọn hôm nay và đúng giờ hiện tại thì disable phút đã qua
        if (date && date.isSame(now, "day") && hour === now.hour()) {
          for (let i = 0; i < now.minute(); i++) {
            if (!minutes.includes(i)) minutes.push(i);
          }
        }

        // Giới hạn đặc biệt: 8h chỉ từ 8:30 trở đi
        if (hour === 8) {
          minutes.push(0, 15);
        }
        // Giới hạn đặc biệt: 21h chỉ cho đến 21:00
        if (hour === 21) {
          minutes.push(15, 30, 45);
        }

        return minutes;
      },
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="p-4 grid gap-4 w-full mx-auto bg-[#ffffff57] rounded-lg"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-[#fff8de]">
          Reservation
        </h1>
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
            required
          />
        </div>
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
            required
          />
        </div>
        <div>
          <Label htmlFor="guestCount" className="text-[#fff8de] mb-2">
            Number of Guests
          </Label>
          <Input
            id="guestCount"
            type="number"
            value={form.guest}
            onChange={(e) => handleChange("guest", Number(e.target.value))}
            required
          />
        </div>
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
          </div>
        </div>
        <div>
          <Label className="text-[#fff8de]">Table Type</Label>
          <div className="mt-2">
            <Select
              value={form.tableType}
              onValueChange={(val) => handleChange("tableType", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại bàn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bàn cửa sổ">Bàn cửa sổ</SelectItem>
                <SelectItem value="Bàn quầy bar">Bàn quầy bar</SelectItem>
                <SelectItem value="Bàn ngoài trời">Bàn ngoài trời</SelectItem>
                <SelectItem value="Bàn dài (5-6 người)">
                  Bàn dài (5-6 người)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="description" className="text-[#fff8de] mb-2">
            Description (optional)
          </Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
        <div className="mt-6 flex justify-center h-[60%] ">
          <Button type="submit" variant={'default'} disabled={mutation.isPending} className="w-[40%] h-full !text-xl">
            {mutation.isPending ? "Đang đặt..." : "BOOK NOW"}
          </Button>
        </div>
      </form>
      <ReservationResultModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        success={isSuccess}
      />
    </>
  );
}
