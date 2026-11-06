import { notFound } from "next/navigation";

/* Catches any address inside a language that matches no other page, such as
   /en/anything-else, and hands it to the 404 page above. */
export default function CatchAllPage() {
    notFound();
}