import Header from "../components/header";
import Footer from "../components/footer";
import ReservationForm from "./ReservationForm";

export default function ReservationPage() {
  return (
    <div className="flex relative flex-col min-h-screen h-full w-full">
      <div className="z-10">
        <Header />
      </div>

      {/* Background section */}
      <div className="relative flex items-center justify-center w-full h-fit z-10">
        {/* Container cho ảnh và màu nền */}
        <div className="relative w-full lg:aspect-[16/9] aspect-[9/16]">

          {/* Ảnh nền - chỉ hiện trên màn hình lớn */}
          <img
            src="/images/chawan_photo2.jpg"
            alt=""
            className="w-full h-full object-cover hidden lg:block"
          />

          {/* Nền đỏ - chỉ hiện trên mobile */}
          <div className="block lg:hidden w-full h-full bg-[#831B1B]"></div>
        </div>

        {/* Form đặt bàn */}
        <div className="absolute lg:top-1/2 left-1/2 lg:left-1/4 lg:-translate-y-1/2 -translate-x-1/2 z-10 w-[90%] lg:w-[30%]">
          <ReservationForm />
        </div>
      </div>

      <div className="z-10">
        <Footer />
      </div>
    </div>
  );
}
