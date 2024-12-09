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

let maleIntervalId;
let shinyIntervalId;

async function main(){
    await fillDiscovery();
    buttonElement.addEventListener("click", async function(){
        text = textElement.value;
        obj = await getPokemonData(text.toLowerCase());
        const res = await fetch("https://pokeapi.co/api/v2/pokemon-species/"+ obj.id+"/");
        obj2 = await res.json();
        console.log(obj);
        console.log(obj2);
        loadDataIntoElements();
    });
}

function loadDataIntoElements(){
    clearData();
    weight.innerHTML = "Weight: "+ obj.weight;
    height.innerHTML = "Height: " + obj.height;
    pokemonName.innerHTML = obj.species.name+ " ["+obj.id+"]";
    base_exp.innerHTML = obj.base_experience;
    hp.innerHTML = obj.stats[0].base_stat;
    attack.innerHTML = obj.stats[1].base_stat;
    defense.innerHTML = obj.stats[2].base_stat;
    special_attack.innerHTML = obj.stats[3].base_stat;
    special_defense.innerHTML = obj.stats[4].base_stat;
    speed.innerHTML = obj.stats[5].base_stat;
    baseTotal.innerHTML = (obj.stats[0].base_stat+ obj.stats[1].base_stat + obj.stats[2].base_stat + obj.stats[3].base_stat + obj.stats[4].base_stat + obj.stats[5].base_stat)
    description.innerHTML = "Description: "+ extract(obj2.flavor_text_entries[1].flavor_text);
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

async function fillDiscovery(){
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=40");
    pokemons = await res.json();
    console.log(pokemons)

    let tempType = document.createElement("label");
    tempType.classList.add('types')

    for(let i = 0; i < 40; i++){
        let newRow = discovery.insertRow(-1);
        let celImage = newRow.insertCell(-1);
        let celId = newRow.insertCell(-1);
        let celBaseTotal = newRow.insertCell(-1);
        let celGeneration = newRow.insertCell(-1);                                              
        let celTypes = newRow.insertCell(-1);

        const res2 = await fetch(pokemons.results[i].url);
        currentPokemon = await res2.json();

        newRow.addEventListener("click",async function(){
            obj = await getPokemonData(celId.innerHTML);
            const res = await fetch("https://pokeapi.co/api/v2/pokemon-species/"+ celId.innerHTML+"/");
            obj2 = await res.json();
            console.log(obj);
            console.log(obj2);
            loadDataIntoElements();
            alert("A new pokemon has been selected")
        })
        let currentSprite = document.createElement("img");
        currentSprite.src = currentPokemon.sprites.front_default
        celImage.appendChild(currentSprite);
        celId.innerHTML = currentPokemon.id;

        celBaseTotal.innerHTML = (currentPokemon.stats[0].base_stat+currentPokemon.stats[1].base_stat+currentPokemon.stats[2].base_stat+currentPokemon.stats[3].base_stat+currentPokemon.stats[4].base_stat+currentPokemon.stats[5].base_stat);
        for (let i = 0; i <  currentPokemon.types.length ; i++) {
            let currentType= tempType.cloneNode(true);
            currentType.innerHTML = currentPokemon.types[i].type.name;
            currentType.classList.add(currentPokemon.types[i].type.name)
            celTypes.appendChild(currentType);
        }
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
        cel2.innerHTML = ability.effect_entries[1].short_effect;
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

main();