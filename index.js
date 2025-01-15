const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");

const discovery= document.getElementById("discovery")
const generationPickerBar = document.getElementById("generation_picker")
const loadMoreButton = document.getElementById("load_more")
const generationHeader = document.getElementById("generation_header")

let increment = 30;
let totalPokemonLoaded = 0;
let totalPokemonInGeneration;
let firstIdInGeneration;
const generationsFirstId = [1,152,252,387,494,650,722,810,906,1026]
let totalGenerations = generationsFirstId.length-1;

let tempBlock = createDisplayBlock();
let tempType = document.createElement("span");
tempType.classList.add('types')

main();

async function main(){
    createGenerationButtons();
    await setDiscoveryGeneration(1);
    await loadBatchPokemon();
}

//event listeners
loadMoreButton.addEventListener("click",function(){
    loadBatchPokemon();
})

searchInput.addEventListener("keypress", function(e){
    text = searchInput.value;
    if (e.key == "Enter"){
        window.location.href = 'info.html?id='+text.toLowerCase();
    }
})

searchButton.addEventListener("click", async function(){
    text = searchInput.value;
    window.location.href = 'info.html?id='+text.toLowerCase();
});

//CREATE DISPLAY BLOCK
function createDisplayBlock(){
    let block = document.createElement("div");
    block.classList.add("discoverBlock");
    let img = document.createElement("img");
    let id = document.createElement("div");
    let name = document.createElement("div");
    let str = document.createElement("div");
    let types = document.createElement("div");
    block.appendChild(img);
    block.appendChild(id);
    block.appendChild(name);
    block.appendChild(str);
    block.appendChild(types);
    return block;
}

//GENERATION AND BATCH RETRIEVAL
function  createGenerationButtons(){
    for(let i = 1; i <= totalGenerations; i++){
        let newLabel = document.createElement("button");
        newLabel.innerHTML = i;
        newLabel.classList.add("generationButton")
        newLabel.addEventListener("click",function(){
            discovery.innerHTML = ""
            setDiscoveryGeneration(i);
            loadBatchPokemon();
        })
        generationPickerBar.appendChild(newLabel);
    }
}

async function setDiscoveryGeneration(a){
    totalPokemonLoaded = 0;
    totalPokemonInGeneration = generationsFirstId[a]-generationsFirstId[a-1]
    firstIdInGeneration = generationsFirstId[a-1];
    loadMoreButton.style.display = "block";
    generationHeader.innerHTML = "Generation " + a;
}

async function loadBatchPokemon(){
    let begin = totalPokemonLoaded+firstIdInGeneration;
    let end = totalPokemonLoaded+increment+firstIdInGeneration-1;
    if ( (end-firstIdInGeneration+1) >= totalPokemonInGeneration){
        end = totalPokemonInGeneration+firstIdInGeneration-1;
        load_more.style.display = "none";
    }
    for(let i = begin; i <= end; i++){
        let copy = tempBlock.cloneNode(true);
        copy.children[0].addEventListener("click",function(){
            window.location.href = ('info.html?id='+i);
        })
        discovery.appendChild(copy)
    }
    for(let i = begin; i <= end; i++){
        loadPokemonIntoBlock(i,discovery.children[i-firstIdInGeneration]);
    }
    totalPokemonLoaded += increment;
}

async function loadPokemonIntoBlock(id, block){
    const currentPokemon = await getPokemonData(id)
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