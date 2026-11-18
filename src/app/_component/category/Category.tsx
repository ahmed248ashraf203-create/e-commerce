import { connection } from "next/server";
import { getCategories } from "@/lib/api";
import CategoryView from "./CategoryView";

export default async function Category() {
  await connection();
  const result = await getCategories();
  return <CategoryView categories={result.ok ? result.data : []} failed={!result.ok} />;
}
