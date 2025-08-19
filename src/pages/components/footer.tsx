import { FaFacebook, FaInstagram, FaThreads, FaTiktok } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#FFF8DE] py-4">
      <div className="container mx-auto flex items-center justify-center h-full gap-4 my-10">
        <img src="/public/images/Symbol.png" alt="logo" className="w-32" />
        <img
          src="/public/images/Typeeface (version 2).png"
          alt="logo"
          className="w-32"
        />
      </div>
      <div className="text-center mb-10">
        <div>A hidden cozy matcha shelter in District 7</div>
        <div>📍41 khu pho My Tu 3, Tan Phong Ward, District 7, HCM City</div>
      </div>
      <div className="flex justify-center gap-10 mb-10">
        <div
          onClick={() =>
            window.open(
              "https://www.facebook.com/profile.php?id=61576618956568",
              "_blank"
            )
          }
        >
          <FaFacebook size={30} />
        </div>
        <div
          onClick={() =>
            window.open(
              "https://www.instagram.com/sundate.matchashelter",
              "_blank"
            )
          }
        >
          <FaInstagram size={30} />
        </div>
        <div
          onClick={() =>
            window.open(
              "https://www.threads.com/@sundate.matchashelter",
              "_blank"
            )
          }
        >
          <FaThreads size={30} />
        </div>
        <div
          onClick={() =>
            window.open("https://www.tiktok.com/@sundatematcha", "_blank")
          }
        >
          <FaTiktok size={30} />
        </div>
      </div>
      <div className="text-center mb-10">MONDAY - SUNDAY: 08:30 - 22:30</div>

      <div className="container mx-auto text-center text-sm text-gray-500">
        © 2025 Sundate. All rights reserved.
      </div>
    </footer>
  );
}
