import { Pokemons } from '../models/pokemoninterface.js';
import { Component } from './component.js';
import { PokemonApi } from '../service/pokemonapi.js';

export class PokemonPrint extends Component {
    template!: string;
    pokemons: any;
    pokemonsInfo: Array<string>;
    api: PokemonApi;
    pokemonsByPage: Array<number>;
    pokemonNext: any;
    pokemonsPrev: any;
    pokemonsPrevInfo: Array<string>;
    pokemonPrevious: any;
    pokemonsNextInfo: Array<string>;

    constructor(public selector: string) {
        super();
        this.api = new PokemonApi();
        this.pokemons = [];
        this.pokemonsInfo = [];
        this.pokemonNext = [];
        this.pokemonsPrev = [];
        this.pokemonsNextInfo = [];
        this.pokemonPrevious = [];
        this.pokemonsPrevInfo = [];
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
        this.startNextFetch();
        this.manageComponent();
    }

    async startPrevFetch() {
        this.pokemonsPrev = await this.api.getCustomPage(
            this.pokemons.previous
        );

        const pokemonArrPrev: Array<string> = [];
        this.pokemonsPrev.results.forEach((item: any) => {
            pokemonArrPrev.push(item.url);
        });

        this.pokemonsPrevInfo = await Promise.all(
            pokemonArrPrev.map((url: string) =>
                fetch(url).then((r) => r.json())
            )
        );
    }
    async startNextFetch() {
        this.pokemonNext = await this.api.getCustomPage(this.pokemons.next);
        const pokemonArrNext: any = [];
        this.pokemonNext.results.forEach((item: any) => {
            pokemonArrNext.push(item.url);
        });
        this.pokemonsNextInfo = await Promise.all(
            pokemonArrNext.map((url: string) =>
                fetch(url).then((r) => r.json())
            )
        );
    }
    manageComponent() {
        this.template = this.createTemplate();
        this.render(this.selector, this.template);
        this.buttons();
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

    buttons() {
        const buttonNext = document.querySelector('.pokemon__buttons__next');
        buttonNext?.addEventListener('click', () => {
            this.pokemonsByPage[0] += 20;
            this.pokemons = this.pokemonNext;
            this.pokemonsInfo = this.pokemonsNextInfo;
            this.startNextFetch();
            this.startPrevFetch();
            this.manageComponent();
        });
        if (this.pokemonsByPage[0] > 20) {
            const buttonPrev = document.querySelector(
                '.pokemon__buttons__prev'
            );
            buttonPrev?.addEventListener('click', () => {
                this.pokemonsByPage[0] -= 20;
                this.pokemons = this.pokemonsPrev;
                this.pokemonsInfo = this.pokemonsPrevInfo;
                this.startNextFetch();
                this.startPrevFetch();
                this.manageComponent();
            });
        }
    }
}
