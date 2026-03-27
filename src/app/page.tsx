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
              <h1 className="font-semibold m-[20px] text-[45px] [font-family:var(--font-space-grotesk)]">Soft fabric.
                  Hard
                  presence.</h1>
              <hr className="border-gray-200 w-[80%]"/>
          </div>

          <div className="flex flex-wrap justify-center items-center  px-4 md:px-10 my-10">

              <div className="hidden xl:block w-72 flex-shrink-0">
                  <Image
                      src="/vertical (2).png"
                      width={288}
                      height={720}
                      className="w-full h-auto object-cover rounded-lg"
                      alt="SynisterWear model"
                  />
              </div>

              {/* Products wrapper */}
              <div className="flex flex-wrap justify-center gap-1 max-w-[1300px]">

                  <div className="w-[300px] sm:w-[300px]">
                      <SquareComponent
                          imagePath="/clothes/hoodie_front_cropped.jpg"
                          hoverImagePath="/clothes/hoodie_back_cropped.jpg"
                          squareHeading="Soft Hoodies"
                          link="https://www.instagram.com/synisterwearofficial/"
                      />
                  </div>

                  <div className="w-[300px] sm:w-[300px]">
                      <SquareComponent
                          imagePath="/clothes/tshirtcropped.jpg"
                          hoverImagePath="/clothes/tshirtcropped.jpg"
                          squareHeading="Streetwear Tees"
                          link="https://www.instagram.com/synisterwearofficial/"
                      />
                  </div>

                  <div className="w-[300px] sm:w-[300px]">
                      <SquareComponent
                          imagePath="/clothes/beanie.jpg"
                          hoverImagePath="/clothes/beanie.jpg"
                          squareHeading="Caps & Beanies"
                          link="https://www.instagram.com/synisterwearofficial/"
                      />
                  </div>

                  <div className="w-[300px] sm:w-[300px]">
                      <SquareComponent
                          imagePath="/clothes/front.jpg"
                          hoverImagePath="/clothes/back.jpg"
                          squareHeading="Limited Edition Tanks"
                          link="https://www.instagram.com/synisterwearofficial/"
                      />
                  </div>

              </div>

              {/* Right image (desktop only) */}
              <div className="hidden xl:block w-72 flex-shrink-0">
                  <Image
                      src="/vertical (2).png"
                      width={288}
                      height={720}
                      className="w-full h-auto object-cover rounded-lg"
                      alt="SynisterWear model"
                  />
              </div>

          </div>
          <Footer/>
      </div>
  );
}
