import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SummarizeResult = ({ result }: { result: string }) => {
  // if (!result) return null;
  const bulletPoints: string[] = result.split("*");
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Summarize</CardTitle>
          <CardDescription>Original Text place holder </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-start align-middle">
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            {bulletPoints.map((bulletPoint: string) => (
              <li key={bulletPoint} className="text-left">
                {bulletPoint}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>{/* <p>Card Footer</p> */}</CardFooter>
      </Card>
    </div>
  );
};
