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
          <img src={resultImageUrl} alt="image" />
          {/* <p>Card Footer</p> */}
        </CardFooter>
      </Card>
    </div>
  );
};
