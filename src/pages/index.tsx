import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  SignIn,
  useUser,
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { api } from "@/utils/api";
import { type NextPage } from "next";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

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
          GPTool kit, tools and more <br className="hidden sm:inline" />
          built with Radix UI and Tailwind CSS.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Accessible and customizable components that you can copy and paste
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
