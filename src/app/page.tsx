import Image from "next/image";
import Navbar from "../comps/Navbar"
import SquareComponent from "@/comps/SquareComponent";
import Footer from "@/comps/footer";

export default function Home() {
  return (
      <div className="flex flex-col ">
          <Navbar/>
          <div className="relative w-full h-[720px] bg-[#D9D9D9] visible">
              <Image
                  src="/banner.png"
                  alt="SynisterWear streetwear banner"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover opacity-70"
              />
          </div>

          <div className="flex flex-col m-[40px] items-center justify-center">
              <hr className="border-gray-200 w-[80%]"/>
              <h1 className="font-semibold m-[20px] text-[45px] [font-family:var(--font-space-grotesk)]">Soft fabric. Hard
                  presence.</h1>
              <hr className="border-gray-200 w-[80%]"/>
          </div>

          <div className="flex justify-center items-center gap-8 mx-10 my-10">
              {/* Left vertical image */}
              <Image
                  src="/vertical%20(2).png"
                  width={288}
                  height={720}
                  className="w-72 h-auto object-cover flex-shrink-0"
                  alt="SynisterWear model"
              />

              <SquareComponent
                  imagePath="/clothes/hoodie_front_cropped.jpg"
                  hoverImagePath="/clothes/hoodie_back_cropped.jpg"
                  squareHeading="Soft Hoodies"
                  link="https://www.instagram.com/synisterwearofficial/"
              />

              <SquareComponent
                  imagePath="/clothes/tshirtcropped.jpg"
                  hoverImagePath="/clothes/tshirtcropped.jpg"
                  squareHeading="Streetwear Tees"
                  link="https://www.instagram.com/synisterwearofficial/"
              />

              <SquareComponent
                  imagePath="/clothes/beanie.jpg"
                  hoverImagePath="/clothes/beanie.jpg"
                  squareHeading="Caps & Beanies"
                  link="https://www.instagram.com/synisterwearofficial/"
              />
              <SquareComponent
                  imagePath="/clothes/front.jpg"
                  hoverImagePath="/clothes/back.jpg"
                  squareHeading="Limited Edition Tanks"
                  link="https://www.instagram.com/synisterwearofficial/"
              />

              <Image
                  src="/vertical%20(2).png"
                  width={288}
                  height={720}
                  className="w-72 h-auto object-cover flex-shrink-0"
                  alt="SynisterWear model"
              />
          </div>
          <Footer/>
      </div>
  );
}
