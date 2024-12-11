let obj; //add a css file//add search pokemon to top//add name to middle/change the input box to a select element maybe?//change names at line 66 rotateBetweenImages()//do more error handling
let obj2; 

const buttonElement = document.getElementById("button1");
const textElement = document.getElementById("pokemonName");
const weight = document.getElementById("weight");
const height = document.getElementById("height");
const types = document.getElementById("types");
const maleImg = document.getElementById("maleImage");
const maleShinyImg = document.getElementById("maleShinyImage");

const hp = document.getElementById("hp");
const attack = document.getElementById("attack");
const defense = document.getElementById("defense");
const special_attack = document.getElementById("special_attack");
const special_defense = document.getElementById("special_defense");
const speed = document.getElementById("speed");
const baseTotal = document.getElementById("base_total");
const description = document.getElementById("description");
const habitat = document.getElementById("habitat");
const generation = document.getElementById("generation");
const happiness = document.getElementById("happiness")
const capture_rate = document.getElementById("capture_rate")
const growth_rate = document.getElementById("growth_rate")
const abilityTable = document.getElementById("ability_table");
const pokemonName = document.getElementById("pokemon");
const base_exp = document.getElementById("base_experience");
const hatch_counter = document.getElementById("hatch_counter");
const gender_rate = document.getElementById("gender_rate")
const discovery = document.getElementById("discovery")

const generation_picker = document.getElementById("generation_picker")
const load_more = document.getElementById("load_more")

const generation_header = document.getElementById("generation_header")

let increment = 30;
let totalPokemonLoaded = 0;
let totalPokemonInGeneration;
let firstIdInGeneration;


let generations = [];

let maleIntervalId;
let shinyIntervalId;

async function main(){
    await populateGenerations();
    const res = await fetch("https://pokeapi.co/api/v2/generation/2");
    obj = await res.json();
    console.log(obj);
    //await fillDiscovery(1);
    await setDiscoveryGeneration(1);
    await loadBatchPokemon();
    buttonElement.addEventListener("click", async function(){
        text = textElement.value;
        loadDataIntoElements(text.toLowerCase());
    });
    createGenerationPicker();
}

async function populateGenerations(){
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

async function loadDataIntoElements(nameOrId){
    clearData();
    obj = await getPokemonData(nameOrId);
    const res = await fetch("https://pokeapi.co/api/v2/pokemon-species/"+ obj.id+"/");
    obj2 = await res.json();
    console.log(obj);
    console.log(obj2);
    const res2 = await fetch("https://pokeapi.co/api/v2/evolution-chain/10/");
    let obj3 = await res2.json();
    console.log(obj3)
    

    weight.innerHTML = "Weight: "+ (obj.weight/10) + " kg";
    height.innerHTML = "Height: " + (obj.height/10) + " m";
    pokemonName.innerHTML = obj.species.name+ " ["+obj.id+"]";
    base_exp.innerHTML = obj.base_experience;
    hp.innerHTML = obj.stats[0].base_stat;
    attack.innerHTML = obj.stats[1].base_stat;
    defense.innerHTML = obj.stats[2].base_stat;
    special_attack.innerHTML = obj.stats[3].base_stat;
    special_defense.innerHTML = obj.stats[4].base_stat;
    speed.innerHTML = obj.stats[5].base_stat;
    baseTotal.innerHTML = (obj.stats[0].base_stat+ obj.stats[1].base_stat + obj.stats[2].base_stat + obj.stats[3].base_stat + obj.stats[4].base_stat + obj.stats[5].base_stat)
    description.innerHTML = "Description: "+ extract(obj2.flavor_text_entries[getEnglish(obj2.flavor_text_entries)].flavor_text);
    generation.innerHTML = "Added in " + obj2.generation.name
    happiness.innerHTML = obj2.base_happiness
    capture_rate.innerHTML = obj2.capture_rate;
    growth_rate.innerHTML = obj2.growth_rate.name;
    hatch_counter.innerHTML = 5;
    setGender();
    addAbilities();
    addTypes()
    maleIntervalId = rotateBetweenImages(obj.sprites.front_default,obj.sprites.front_shiny,maleImg)
    shinyIntervalId =rotateBetweenImages(obj.sprites.back_default,obj.sprites.back_shiny,maleShinyImg)
}

let tempType = document.createElement("label");
tempType.classList.add('types')

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
    if ( (end-firstIdInGeneration+1) > totalPokemonInGeneration){
        end = totalPokemonInGeneration+firstIdInGeneration-1;
        load_more.style.display = "none";
    }
    for(let i = begin; i <= end; i++){
        console.log(i);
        let copy = tempBlock.cloneNode(true);
        copy.children[0].addEventListener("click",function(){
            alert("A new pokemon has been selected")
            loadDataIntoElements(i);
        })
        discovery.appendChild(copy)
    }
    for(let i = begin; i <= end; i++){
        pokemonToDiscovery(i,firstIdInGeneration)
    }
    totalPokemonLoaded += increment;
}

async function fillDiscovery(a){
    let begin = generations[a-1]+1;
    let end = generations[a];
    for(let i = begin; i <= end; i++){
        console.log(i);
        let copy = tempBlock.cloneNode(true);
        copy.children[0].addEventListener("click",function(){
            alert("A new pokemon has been selected")
            loadDataIntoElements(i);
        })
        discovery.appendChild(copy)
    }
    for(let i = begin; i <= end; i++){
        pokemonToDiscovery(i,begin)
    }
}

//used to speed up the system
async function pokemonToDiscovery(id,generationFirstId){
    const res2 = await fetch("https://pokeapi.co/api/v2/pokemon/"+(id));
    currentPokemon = await res2.json();
    let copy = discovery.children[id-generationFirstId];
    copy.children[0].src = currentPokemon.sprites.front_default;
    copy.children[1].innerHTML = "#" + currentPokemon.id;
    copy.children[2].innerHTML = currentPokemon.name;
    copy.children[3].innerHTML = "Str:  " + (currentPokemon.stats[0].base_stat+currentPokemon.stats[1].base_stat+currentPokemon.stats[2].base_stat+currentPokemon.stats[3].base_stat+currentPokemon.stats[4].base_stat+currentPokemon.stats[5].base_stat)
    for (let i = 0; i <  currentPokemon.types.length ; i++) {
        let currentType= tempType.cloneNode(true);
        currentType.innerHTML = currentPokemon.types[i].type.name;
        currentType.classList.add(currentPokemon.types[i].type.name)
        copy.children[4].appendChild(currentType);
    }
}

function  createGenerationPicker(){
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

function setGender(){
    let rate = obj2.gender_rate;
    if (rate == -1){
        gender_rate.innerHTML = "Genderless"
    }
    else{
        gender_rate.innerHTML = rate;
    }
}

function getEnglish(object){
    for(let i = 0; i < object.length ; i++){
        if (object[i].language.name == "en"){
            return i;
        }
    }
}

function clearData(){
    deleteAbilities();
    if(maleIntervalId != null){
        clearInterval(maleIntervalId)
    }
    if(shinyIntervalId != null){
        clearInterval(shinyIntervalId)
    }
    deleteTypes()
}

async function addAbilities(){
    for(let i = 0; i < obj.abilities.length; i++){
        let row = abilityTable.insertRow(-1);
        let cel1 = row.insertCell(-1);
        let cel2 = row.insertCell(-1);
        const res = await fetch(obj.abilities[i].ability.url);
        ability = await res.json();
        console.log(ability);
        cel1.innerHTML = ability.name;
        cel2.innerHTML = ability.effect_entries[getEnglish(ability.effect_entries)].short_effect;
    }
}

function addTypes(){
    for (let i = 0; i < obj.types.length; i++) {
        let type = document.createElement("label");
        type.innerHTML = obj.types[i].type.name;
        type.classList.add('types')
        type.classList.add(obj.types[i].type.name)
        types.appendChild(type);
    }
    if(obj2.is_legendary){
        let type= document.createElement("label");
        type.innerHTML = "legendary";
        type.classList.add('types')
        type.classList.add('legendary')
        types.appendChild(type);
    }
    if(obj2.is_mythical){
        let type = document.createElement("label");
        type.innerHTML = "mythical";
        type.classList.add('types')
        type.classList.add('mythical')
        types.appendChild(type);
    }
}

function deleteTypes(){
    let length =  types.children.length;
    for (let i = 0; i < length; i++) {
        types.children[0].remove();
    }
}

function deleteAbilities(){
    if (abilityTable.rows.length == 1){
        return;
    }
    let length = abilityTable.rows.length;
    for(let i = 0; i < length-1; i++ ){
        abilityTable.deleteRow(abilityTable.rows.length-1)
    }
}

function extract(description){
    let newText = description.split("\n").join(" ");
    newText = newText.split("\f").join(" ");
    return newText;
}

function rotateBetweenImages(frontImg, backImg, imgElement){
    let currentImg = frontImg;
    imgElement.src = currentImg;

    if (frontImg == null || backImg == null){
        imgElement.style.width = "0px";
        return;
    }
    else{
        imgElement.style.width = "150px"
    }
    id = setInterval(function(){
        if(currentImg == frontImg){
            currentImg = backImg;
        }
        else{
            currentImg = frontImg;
        }
        imgElement.src = currentImg;
    },4000);
    return id;
}

async function getPokemonData(name){
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/"+name);
    const obj = await res.json();
    return obj
}

let tempBlock = document.createElement("div");
tempBlock.classList.add("discoverBlock");
let tempImg = document.createElement("img");
let tempId = document.createElement("div");
let tempName = document.createElement("div");
let tempStr = document.createElement("div");
let tempTypes = document.createElement("div");
tempBlock.appendChild(tempImg);
tempBlock.appendChild(tempId);
tempBlock.appendChild(tempName);
tempBlock.appendChild(tempStr);
tempBlock.appendChild(tempTypes);


load_more.addEventListener("click",function(){
    loadBatchPokemon();
})

main();
