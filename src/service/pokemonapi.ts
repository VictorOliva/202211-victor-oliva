export class PokemonApi {
    urlDefault: string;
    constructor() {
        this.urlDefault = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0';
    }

    getPokemon(): Promise<Array<PokemonApi>> {
        return fetch(this.urlDefault).then((response) => response.json());
    }
    getCustomPage(nextUrl: string): Promise<any> {
        return fetch(nextUrl).then((response) => response.json());
    }
}
