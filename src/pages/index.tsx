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
// import { cn } from "@/lib/utils";
import { INTERNAL_VERSION } from "@/config/site";
import { HomePageConfig } from "@/config/homepage";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

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
      {/* <PageLayout> */}
      {/* <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10"> */}
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          {HomePageConfig.title}
          <br className="hidden sm:inline" />
          {/* built with Radix UI and Tailwind CSS. */}
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          {HomePageConfig.subtitle}
          {hello.data && <>. {hello.data.greeting}</>}
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          Documentation
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          GitHub
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
            {HomePageConfig.content.features.map(
              (feature: { title: string; description: string }) => (
                <>
                  <li className="my-6 ml-6 list-disc [&>li]:mt-2">
                    <span>{feature.title} </span> {feature.description}
                  </li>
                </>
              )
            )}
          </ul>
        </div>
        <div>
          <ul>
            {HomePageConfig.content.features2.map((feature: string) => (
              <li>{feature}</li>
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
