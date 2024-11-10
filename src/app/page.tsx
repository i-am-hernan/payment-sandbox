import BlurIn from "@/components/ui/blur-in";
import Image from "next/image";
import { DotPattern } from "@/components/ui/dot-pattern";

import React from "react";
import { cn } from "@/utils/utils";

const Page: React.FC = () => {
  return (
    <div className="w-full space-y-24">
      <section id="hero" className="px-14 py-16  space-y-12">
        <BlurIn
          word="A complete Payment Sandbox built for Adyen. Launch and iterate faster"
          className="text-4xl font-bold text-black dark:text-white"
        />
        <ul className="list-disc list-inside mx-auto  max-w-lg text-xl">
          <li>🚀 reduce build time by 50%</li>
          <li>💡 build and share composable Proof of Concepts</li>
          <li>⚙️ modify your entire integration including Frontend and Backend Capabilities</li>
          <li>💻 choose pre-built integrations from the Marketplace</li>
        </ul>
        <video
          className="mx-auto"
          src="/images/paymentSandbox.mov"
          width={500}
          height={240}
          autoPlay
          loop
          muted
        ></video>
      </section>
      <section id="section1" className="p-y-64 px-14">
        <div className="flex flex-col-reverse lg:flex-row lg:space-x-48">
          <div>
            <Image src={"/images/screenshot.jpeg"} alt="section1" width={900} height={500} />
          </div>
          <div className="w-full m-auto ">
            <h2 className="text-3xl">Accelerate Your Proof of Concepts</h2>
            <br></br>
            <p>
              Building and iterating on payment solutions can be time-consuming. With Payment Sandbox, develop and share
              composable Proof of Concepts tailored for specific merchant needs in record time.
            </p>
            <br></br>

            <ul className="list-disc">
              <li>Build custom payment flows to showcase the full potential of Adyen.</li>
              <li>Cut build times by 50% to bring your ideas to life faster.</li>
              <li>
                Easily share prototypes with your merchants with <span className="font-bold">shareable links</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section id="section2" className="p-y-64 px-14">
        <div className="flex flex-col-reverse lg:flex-row lg:space-x-48">
          {/* <div><Image src={"/images/screenshot.jpeg"} alt="section1" width={900} height={500} /></div> */}
          <div className="w-full m-auto">
            <h2 className="text-3xl">Full Integration Flexibility—From Frontend to Backend</h2>
            <br></br>
            <p>
              Go beyond standard sandbox environments with complete integration modification capabilities. Customize
              every aspect of your integration, whether it's frontend flows or backend configurations, all within a
              unified platform.
            </p>
            <br></br>

            <ul className="list-disc">
              <li>Modify all integration layers to meet specific project requirements.</li>
              <li>Create a realistic testing environment that mimics live performance with full Adyen API support.</li>
              <li>
                Refine both user experience and backend processes, ensuring your solutions are as functional as they are
                user-friendly.
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section id="section2" className="p-y-64 px-14">
        <div className="flex flex-col-reverse lg:flex-row lg:space-x-48">
          <div>
            <div className="relative flex size-full items-center justify-center overflow-hidden rounded-lg border bg-background p-20 md:shadow-xl">
              <Image src={"/images/marketplaceScreenshot.png"} alt="section1" width={1500} height={1000} />
              <DotPattern
                width={20}
                height={20}
                cx={1}
                cy={1}
                cr={1}
                className={cn("[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ")}
              />
            </div>
          </div>
          <div className="w-full m-auto">
            <h2 className="text-3xl">Tap Into Ready-Made Integrations with Our Marketplace</h2>
            <br></br>
            <p>
              Why start from scratch? Access a robust Marketplace with pre-built, fully configurable integrations that
              serve as a foundation for your projects. Quickly customize and deploy solutions without sacrificing
              quality, freeing up valuable resources to focus on high-impact work.
            </p>
            <br></br>

            <ul className="list-disc">
              <li>Choose from a variety of integration templates to speed up deployment.</li>
              <li>Leverage tried-and-tested solutions designed for seamless performance with Adyen.</li>
              <li>Save time and resources by building on proven integration frameworks.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
