import { getItemTags } from "@/app/admin/actions/item-tags";
import { ItemTagsManager } from "@/components/admin/ItemTagsManager";

export default async function ItemTagsPage() {
  const tags = await getItemTags();
  return <ItemTagsManager initialTags={tags} />;
}
