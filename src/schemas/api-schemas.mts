import * as z from "zod";


export const PokemonSchema = z.object({
    "characters": z.string(),
    "locations": z.string(),
    "episodes": z.string(),
});
export type Pokemon = z.infer<typeof PokemonSchema>;
