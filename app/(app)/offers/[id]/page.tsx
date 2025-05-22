import { getOfferById } from "@/lib/server-api";
import dynamic from "next/dynamic";

const OfferForm = dynamic(
  () => import("@/components/offer-page").then((mod) => mod.OfferForm),
  {
    ssr: !!false,
  },
);

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const id = (await params).id;

  const offer = await getOfferById(id);

  return <OfferForm offer={offer} />;
}
