import * as z from "zod";


export const ResultSchema = z.object({
    "name": z.string(),
    "url": z.string(),
});
export type Result = z.infer<typeof ResultSchema>;

export const PokemonSchema = z.object({
    "count": z.number(),
    "next": z.string(),
    "previous": z.null(),
    "results": z.array(ResultSchema),
});
export type Pokemon = z.infer<typeof PokemonSchema>;
