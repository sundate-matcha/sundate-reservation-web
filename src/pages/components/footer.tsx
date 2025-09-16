import { FaFacebook, FaInstagram, FaThreads, FaTiktok } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#FFF8DE] py-4">
      <div className="container mx-auto flex items-center justify-center h-full gap-4 my-10">
        <img src="/images/Symbol.png" alt="logo" className="w-32" />
        <img
          src="/images/Typeeface (version 2).png"
          alt="logo"
          className="w-32"
        />
      </div>
      <div className="flex lg:flex-row lg:justify-center lg:gap-50 flex-col lg:items-center">
        <div>
          <div className="text-center mb-10">
            <div>A hidden cozy matcha shelter in District 7</div>
            <div>
              📍41 khu pho My Tu 3, Tan Phong Ward, District 7, HCM City
            </div>
          </div>
          <div className="flex justify-center gap-10 mb-10">
            <div
              className="cursor-pointer"
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
              className="cursor-pointer"
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
              className="cursor-pointer"
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
              className="cursor-pointer"
              onClick={() =>
                window.open("https://www.tiktok.com/@sundatematcha", "_blank")
              }
            >
              <FaTiktok size={30} />
            </div>
          </div>
          <div className="text-center mb-10">
            MONDAY - SUNDAY: 08:30 - 22:30
          </div>
        </div>

        <div className="flex justify-center mb-10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2030.1822625297707!2d106.71073522339475!3d10.72133051671206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f000795d46b%3A0xe63fdf036c81ef33!2sSundate_matcha%20holic%20shelter!5e0!3m2!1svi!2s!4v1756540482992!5m2!1svi!2s"
            width="600"
            height="300"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-2xl shadow-md w-[90%] md:w-[600px] h-[300px]"
          ></iframe>
        </div>
      </div>

      <div className="container mx-auto text-center text-sm text-gray-500">
        © 2025 Sundate. All rights reserved.
      </div>
    </footer>
  );
}
