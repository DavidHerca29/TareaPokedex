
export interface PokemonsInterface {
    id: Number,
    name: string,
    description: string,
    abilities: [{
        primary: Number,
        secondary?: Number,
    }]
}
