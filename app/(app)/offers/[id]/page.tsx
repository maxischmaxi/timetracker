import { getOfferById } from "@/lib/server-api";
import { CreateOffer } from "../create";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const id = (await params).id;

  const offer = await getOfferById(id);

  return <CreateOffer offer={offer} />;
}
