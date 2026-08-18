import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="grid min-h-screen place-content-center gap-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Kivotos Railway</h1>
      <p className="text-muted-foreground">Welcome to kivotosrailway-website-v2.</p>
      <Button className="mx-auto w-fit">Get started</Button>
    </main>
  );
}
