import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  // SignIn,
  // useUser,
  // ClerkProvider,
  // SignedIn,
  SignedOut,
  SignInButton,
  // UserButton,
} from "@clerk/nextjs";
import { api } from "@/utils/api";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { HomePageConfig } from "@/config/homepage";
// import { cn } from "@/lib/utils";
import { INTERNAL_VERSION } from "@/config/site";
import { Separator } from "@/components/ui/separator";

const Home: NextPage = () => {
  console.log("%c---------------------------------", "color: yellow");
  console.log("VERSION:", INTERNAL_VERSION);
  console.log("%c---------------------------------", "color: yellow");

  return (
    <>
      <Head>
        <title>test4</title>
        <meta name="description" content="GPTool kit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex max-w-[980px] flex-col items-start gap-4">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          {HomePageConfig.title}
          <br className="hidden sm:inline" />
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          {HomePageConfig.subtitle}
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/chat"
          // target="_blank"
          // rel="noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          Chat
        </Link>
        <Link
          // rel="noreferrer"
          href="/translate"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Translate
        </Link>
        <Link
          // rel="noreferrer"
          href="/summarize"
          className={buttonVariants({ variant: "secondary", size: "lg" })}
        >
          Summarize
        </Link>
        <Link
          // rel="noreferrer"
          href="/story"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Story
        </Link>
        <Link
          // rel="noreferrer"
          href="/games"
          className={buttonVariants({ variant: "secondary", size: "lg" })}
        >
          Games
        </Link>
      </div>
      <section>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {HomePageConfig.content.paragraph1}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {HomePageConfig.content.paragraph2}
        </p>
      </section>
      <section>
        <div>
          <ul>
            {HomePageConfig.content.features1.map(
              (feature: { title: string; description: string }) => (
                <li
                  key={feature.title}
                  className="my-6 ml-6 list-disc [&>li]:mt-2"
                >
                  <span>{feature.title} </span> {feature.description}
                </li>
              )
            )}
          </ul>
        </div>
        <Separator />
        <div>
          <ul>
            {HomePageConfig.content.features2.map((feature: string) => (
              <li key={feature} className="my-6 ml-6 list-disc [&>li]:mt-2">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <SignedOut>
        {/* Signed out users get sign in button */}
        <SignInButton />
      </SignedOut>
      {/* <AuthShowcase /> */}
      {/* </section> */}
      {/* </PageLayout> */}
    </>
  );
};

export default Home;
