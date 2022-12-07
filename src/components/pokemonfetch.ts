import { Pokemons } from '../models/pokemoninterface.js';
import { Component } from './component.js';
import { PokemonApi } from '../service/pokemonapi.js';

export class PokemonPrint extends Component {
    template!: string;
    pokemons: any;
    pokemonsInfo: Array<string>;
    api: PokemonApi;
    pokemonsByPage: Array<number>;

    constructor(public selector: string) {
        super();
        this.api = new PokemonApi();
        this.pokemons = [];
        this.pokemonsInfo = [];
        this.startFirstFetch();
        this.pokemonsByPage = [20, 0];
    }

    async startFirstFetch() {
        this.pokemons = await this.api.getPokemon();
        this.pokemonsByPage[1] = this.pokemons.count;

        const pokemonArray: Array<string> = [];
        this.pokemons.results.forEach((item: Pokemons) => {
            pokemonArray.push(item.url);
        });

        this.pokemonsInfo = await Promise.all(
            pokemonArray.map((url: string) => fetch(url).then((r) => r.json()))
        );

        this.manageComponent();
    }

    manageComponent() {
        this.template = this.createTemplate();
        this.render(this.selector, this.template);
        //nos faltaría ir al pokemon
    }
    createTemplate() {
        this.template = '';
        this.pokemonsInfo.forEach((pokemon: any) => {
            this.template += `<div class = "pokemon">`;
            this.template += `<h2 class="pokemon__h2">${pokemon.species.name}</h2>`;
            this.template += `<img src="${pokemon.sprites.other.home.front_shiny}" alt="Pokemon Image" id = "${pokemon.species.name}" width="100" class="pokemon__img"/>`;
            this.template += `</div>`;
        });
        this.template += `<div class='pokemon__buttons'><button type="submit" class="pokemon__buttons__prev"><</button>`;
        this.template += `<p class='pokemon__buttons__p'>${this.pokemonsByPage[0]} / ${this.pokemonsByPage[1]}</p>`;
        this.template += `<button type="submit" class="pokemon__buttons__next">></button></div>`;
        return this.template;
    }
}
