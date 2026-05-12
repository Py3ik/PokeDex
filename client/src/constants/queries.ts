export const pokemonListKeys = {
  all: ["pokemon"] as const,
  list: (params?: object) =>
    params
      ? ([...pokemonListKeys.all, "list", params] as const)
      : ([...pokemonListKeys.all, "list"] as const),
};

export const collectionKeys = {
  all: ["collection"] as const,
  detail: (id: string) => [...collectionKeys.all, "detail", id] as const,
  list: (params?: object) =>
    params
      ? ([...collectionKeys.all, "list", params] as const)
      : ([...collectionKeys.all, "list"] as const),
};
