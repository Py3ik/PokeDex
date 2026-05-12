export const pokemonListKeys = {
  all: ["pokemon"] as const,
  list: (params?: object) =>
    params
      ? ([...pokemonListKeys.all, "list", params] as const)
      : ([...pokemonListKeys.all, "list"] as const),
};
