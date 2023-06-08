import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StoryResult } from "@/types";
const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

type Props = { title: string; resultText: string; resultImageUrl: string };
export const StoryResultDiv = ({
  title,
  resultText,
  resultImageUrl,
}: Props) => {
  // if (!title) return null;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="scroll-m-20  font-extrabold tracking-tight lg:text-5xl">
            {/* <h3 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"> */}
            {title}
            {/* </h3> */}
          </CardTitle>
          {/* <CardDescription>{resultText} </CardDescription> */}
        </CardHeader>
        <CardContent className="flex justify-start align-middle">
          {/* <Image src={resultImageUrl} width={1250} height={1250} alt={title} /> */}

          <p className="leading-7 [&:not(:first-child)]:mt-6">{resultText}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          {/* <img src={resultImageUrl} alt="image" /> */}
          {/* <p>Card Footer</p> */}
          <div className="h-[350px]  w-full bg-[url('/blur-2.png')] bg-cover bg-center bg-no-repeat">
            {/* <img src="/blur-2.png" alt="image" /> */}
            <Image
              src={resultImageUrl}
              width={1850}
              height={1850}
              alt={title}
              // loading="lazy"
              placeholder="blur"
              blurDataURL="/blur-2.png"
              // blurDataURL={rgbDataURL(238, 237, 234)}
            />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
