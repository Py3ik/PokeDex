import type { Collection } from "@/types/collection";

export const exportCollectionToBlob = (
  data: Collection,
  showToast: (message: string, type: "success" | "error") => void,
) => {
  const exportData = {
    name: data.name,
    pokemons: data.pokemons.map(({ id, name, weight, image, types }) => ({
      id,
      name,
      weight,
      image,
      types,
    })),
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.name}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Collection downloaded successfully", "success");
};

export const parseCollectionFile = async (
  file: File,
): Promise<{ name: string; pokemons: any[] }> => {
  const text = await file.text();
  return JSON.parse(text);
};
