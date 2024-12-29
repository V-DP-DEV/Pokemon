const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");

const discovery = document.getElementById("discovery")
const generation_picker = document.getElementById("generation_picker")
const load_more = document.getElementById("load_more")
const generation_header = document.getElementById("generation_header")

let increment = 30;
let totalPokemonLoaded = 0;
let totalPokemonInGeneration;
let firstIdInGeneration;
let generations = [];

//FOR DISCOVER BY GENERATION
let tempBlock = document.createElement("div");
tempBlock.classList.add("discoverBlock");
let tempImg = document.createElement("img");
let tempId = document.createElement("div");
let tempName = document.createElement("div");
let tempStr = document.createElement("div");
let tempTypes = document.createElement("div");
let tempType = document.createElement("label");
tempType.classList.add('types')
tempBlock.appendChild(tempImg);
tempBlock.appendChild(tempId);
tempBlock.appendChild(tempName);
tempBlock.appendChild(tempStr);
tempBlock.appendChild(tempTypes);


load_more.addEventListener("click",function(){
    loadBatchPokemon();
})

searchButton.addEventListener("click", async function(){
    text = searchInput.value;
    window.open('info.html?id='+text.toLowerCase());
});

main();

async function main(){
    await loadGenerationsData();
    await setDiscoveryGeneration(1);
    await loadBatchPokemon();
    createGenerationButtons();
}

//GENERATION AND BATCH RETRIEVAL
function  createGenerationButtons(){
    for(let i = 1; i <= 9; i++){
        let newLabel = document.createElement("button");
        newLabel.innerHTML = i;
        newLabel.classList.add("generationButton")
        newLabel.addEventListener("click",function(){
            discovery.innerHTML = ""
            setDiscoveryGeneration(i);
            loadBatchPokemon();
        })
        generation_picker.appendChild(newLabel);
    }
}

async function loadGenerationsData(){
    const res = await fetch("https://pokeapi.co/api/v2/generation");
    generationsData = await res.json();
    let total = 0
    generations[0] = 0;
    for(let i = 1; i <= generationsData.count; i++ ){
        const res2 = await fetch("https://pokeapi.co/api/v2/generation/"+i+"");
        generationData = await res2.json();
        total += generationData.pokemon_species.length;
        generations[i] = total;
    }
    console.log(generations)
}

async function setDiscoveryGeneration(a){
    totalPokemonLoaded = 0;
    totalPokemonInGeneration = generations[a]- generations[a-1];
    firstIdInGeneration = generations[a-1]+1;
    load_more.style.display = "block";
    generation_header.innerHTML = "Generation " + a;
}

async function loadBatchPokemon(){
    let begin = totalPokemonLoaded+firstIdInGeneration;
    let end = totalPokemonLoaded+increment+firstIdInGeneration-1;
    if ( (end-firstIdInGeneration+1) >= totalPokemonInGeneration){
        end = totalPokemonInGeneration+firstIdInGeneration-1;
        load_more.style.display = "none";
    }
    for(let i = begin; i <= end; i++){
        console.log(i);
        let copy = tempBlock.cloneNode(true);
        copy.children[0].addEventListener("click",function(){
            alert("A new pokemon has been selected")
            window.open('info.html?id='+i);
        })
        discovery.appendChild(copy)
    }
    for(let i = begin; i <= end; i++){
        pokemonToDiscovery(i,firstIdInGeneration)
    }
    totalPokemonLoaded += increment;
}

async function pokemonToDiscovery(id,generationFirstId){
    loadPokemonIntoBlock(id,discovery.children[id-generationFirstId]);
}

async function loadPokemonIntoBlock(id, block){
    const res2 = await fetch("https://pokeapi.co/api/v2/pokemon/"+(id));
    currentPokemon = await res2.json();
    block.children[0].src = currentPokemon.sprites.front_default;
    block.children[1].innerHTML = "#" + currentPokemon.id;
    block.children[2].innerHTML = currentPokemon.name;
    block.children[3].innerHTML = "Str:  " + (currentPokemon.stats[0].base_stat+currentPokemon.stats[1].base_stat+currentPokemon.stats[2].base_stat+currentPokemon.stats[3].base_stat+currentPokemon.stats[4].base_stat+currentPokemon.stats[5].base_stat)
    for (let i = 0; i <  currentPokemon.types.length ; i++) {
        let currentType= tempType.cloneNode(true);
        currentType.innerHTML = currentPokemon.types[i].type.name;
        currentType.classList.add(currentPokemon.types[i].type.name)
        block.children[4].appendChild(currentType);
    }
}

//GET DATA OF POKEMON
async function getPokemonData(name){
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/"+name);
    const obj = await res.json();
    return obj
}