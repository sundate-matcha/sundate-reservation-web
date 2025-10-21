import Header from "../components/header";
import Footer from "../components/footer";
import ReservationForm from "./ReservationForm";

export default function ReservationPage() {
  return (
    <div className="flex relative flex-col min-h-screen h-full w-full">
      <div className="z-10">
        <Header />
      </div>
      <div className="relative flex items-center justify-center w-full h-fit z-10">
        <div className="relative w-full lg:aspect-[16/9] aspect-[9/16]">
          <img
            src="/images/chawan_photo2.jpg"
            alt=""
            className="w-full h-full object-cover hidden lg:block"
          />

          <div className="block lg:hidden w-full h-full bg-gradient-to-br from-[#831B1B] to-[#2b0808]"></div>
        </div>

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
