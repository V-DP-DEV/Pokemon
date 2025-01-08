//add search pokemon to top//change the input box to a select element maybe?//do more error handling
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");

const pokemonName = document.getElementById("pokemon");
const description = document.getElementById("description");
const weight = document.getElementById("weight");
const height = document.getElementById("height");
const generation = document.getElementById("generation");
const types = document.getElementById("types");
const frontImg = document.getElementById("frontImage");
const backImg = document.getElementById("backImage");

const battleStats = document.getElementById("battleStats");
const trainingStats = document.getElementById("trainingStats");
const breedingStats = document.getElementById("breedingStats")

const femaleLabel = breedingStats.rows[3].cells[1].children[1];
const maleLabel = breedingStats.rows[3].cells[1].children[0];
const genderlessLabel = breedingStats.rows[3].cells[1].children[2];

const abilityTable = document.getElementById("ability_table");

const defense = document.getElementById("defense")

const evoTree = document.getElementById("evoTree")

let maleIntervalId;
let shinyIntervalId;

let defenseMap = new Map();
const totalTypes = 18;

const heightOfBranch = 40;
let smallestWidthPercentage = 100; //in percentage

let tempBlock = document.createElement("div");
tempBlock.classList.add("discoverBlock");
let tempImg = document.createElement("img");
let tempName = document.createElement("div");
let tempStr = document.createElement("div");
let tempTypes = document.createElement("div");
let tempType = document.createElement("span");
tempType.classList.add('types')
tempBlock.appendChild(tempImg);
tempBlock.appendChild(tempName);
tempBlock.appendChild(tempStr);
tempBlock.appendChild(tempTypes);

loadDataIntoElements(getQueryParm("id"))

function getQueryParm(parm){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parm);  // Returns the value of the parameter
}

searchButton.addEventListener("click", async function(){
    text = searchInput.value;
    //loadDataIntoElements(text.toLowerCase());
    window.location.href = 'info.html?id='+text.toLowerCase();
});

searchInput.addEventListener("keypress", function(e){
    text = searchInput.value;
    if (e.key == "Enter"){
        window.location.href = 'info.html?id='+text.toLowerCase();
    }
})

//GET DATA OF POKEMON
async function getPokemonData(name){
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/"+name);
    const obj = await res.json();
    return obj
}

async function getData(url){
    const res = await fetch(url);
    const obj = await res.json();
    return obj
}

function getEnglishStr(object){
    for(let i = 0; i < object.length ; i++){
        if (object[i].language.name == "en"){return i;}
    }
}

function extract(description){
    let newText = description.split("\n").join(" ");
    newText = newText.split("\f").join(" ");
    return newText;
}

//DISPLAY DATA OF

async function loadDataIntoElements(nameOrId){
    //clearData();
    const obj = await getPokemonData(nameOrId);
    const obj2 = await getData("https://pokeapi.co/api/v2/pokemon-species/"+ obj.id+"/");
    console.log(obj);
    console.log(obj2);
    addDefenseAgainstTypes(obj.types);
    createEvoTree(obj2.evolution_chain.url);
    addEggGroup(obj2.egg_groups);

    let name = obj.species.name[0].toUpperCase()+obj.species.name.substr(1,obj.species.name.length);

    pokemonName.innerHTML = name + " #"+obj.id;
    description.innerHTML = "Description: "+ extract(obj2.flavor_text_entries[getEnglishStr(obj2.flavor_text_entries)].flavor_text);
    weight.innerHTML = "Weight: "+ (obj.weight/10) + " kg";
    height.innerHTML = "Height: " + (obj.height/10) + " m";
    generation.innerHTML = "Added in " + obj2.generation.name
    addTypes(obj.types,obj2.is_mythical,obj2.is_legendary)
    maleIntervalId = rotateBetweenImages(obj.sprites.front_default,obj.sprites.front_shiny,frontImg)
    shinyIntervalId =rotateBetweenImages(obj.sprites.back_default,obj.sprites.back_shiny,backImg)

    //battle stats
    battleStats.rows[1].cells[1].innerHTML = obj.stats[0].base_stat
    battleStats.rows[2].cells[1].innerHTML = obj.stats[1].base_stat
    battleStats.rows[3].cells[1].innerHTML = obj.stats[2].base_stat
    battleStats.rows[4].cells[1].innerHTML = obj.stats[3].base_stat
    battleStats.rows[5].cells[1].innerHTML = obj.stats[4].base_stat
    battleStats.rows[6].cells[1].innerHTML = obj.stats[5].base_stat
    battleStats.rows[7].cells[1].innerHTML = (obj.stats[0].base_stat+ obj.stats[1].base_stat + obj.stats[2].base_stat + obj.stats[3].base_stat + obj.stats[4].base_stat + obj.stats[5].base_stat)

    trainingStats.rows[1].cells[1].innerHTML =  obj2.capture_rate
    trainingStats.rows[2].cells[1].innerHTML = obj2.growth_rate.name
    trainingStats.rows[3].cells[1].innerHTML = obj2.base_happiness
    trainingStats.rows[4].cells[1].innerHTML = obj.base_experience
    
    breedingStats.rows[2].cells[1].innerHTML = obj2.hatch_counter;
    setGender(obj2.gender_rate);
    addAbilities(obj.abilities);
}

function setGender(gender){
    maleLabel.innerHTML = "";
    femaleLabel.innerHTML = "";
    genderlessLabel.innerHTML = "";

    if (gender == -1){
        genderlessLabel.innerHTML = "Genderless";
    }
    else{
        maleLabel.innerHTML = ((8 - gender)*12.5) + "% male";
        femaleLabel.innerHTML = (gender*12.5)+ "% female  "
    }
}

async function addAbilities(abilities){
    for(let i = 0; i < abilities.length; i++){
        let row = abilityTable.insertRow(-1);
        let cel1 = row.insertCell(-1);
        let cel2 = row.insertCell(-1);
        const res = await fetch(abilities[i].ability.url);
        ability = await res.json();
        cel1.innerHTML = ability.name;
        cel2.innerHTML = ability.effect_entries[getEnglishStr(ability.effect_entries)].short_effect;
    }
}

function addTypes(typesList,is_mythical,is_legendary){
    for (let i = 0; i < typesList.length; i++) {
        let type = tempType.cloneNode(true);
        type.innerHTML = typesList[i].type.name;
        type.classList.add(typesList[i].type.name)
        types.appendChild(type);
    }
    if(is_legendary){
        let type = tempType.cloneNode(true);
        type.innerHTML = "legendary";
        type.classList.add('legendary')
        types.appendChild(type);
    }
    if(is_mythical){
        let type = tempType.cloneNode(true);
        type.innerHTML = "mythical";
        type.classList.add('mythical')
        types.appendChild(type);
    }
}

async function addDefenseAgainstTypes(typesList){
    defenseMap.clear();
    const defenseTypesObj = await getData("https://pokeapi.co/api/v2/type/");
    for (let i = 0; i < defenseTypesObj.results.length-1; i++){
        defenseMap.set(defenseTypesObj.results[i].name,1)
    }
    for (let i = 0; i <typesList.length ; i++) {
        const typeData = await getData(typesList[i].type.url);
        multiplyDefenses(typeData.damage_relations.double_damage_from,2);
        multiplyDefenses(typeData.damage_relations.half_damage_from,0.5);
        multiplyDefenses(typeData.damage_relations.no_damage_from,0);
    }

    let totalColInRow = 0;
    const maxInARow = 10;
    let row = defense.insertRow();
    let row2 = defense.insertRow();

    for(let i = 0; i < defenseMap.size; i++){
        if (totalColInRow == maxInARow){
            row = defense.insertRow();
            row2 = defense.insertRow();
            totalColInRow = 0
        }

        let name = defenseTypesObj.results[i].name
        let cell = row.insertCell();
        cell.innerHTML = name.substr(0,3).toUpperCase()
        cell.classList.add("types");
        cell.classList.add(name);
        cell.style.textAlign = "center"

        let cell2 = row2.insertCell();
        cell2.innerHTML = defenseMap.get(name);
        cell2.style.textAlign = "center"

        totalColInRow++
    }
    console.log(defenseMap);
}

function multiplyDefenses(list, multiplier){
    for (let i = 0; i < list.length; i++){
        let name = list[i].name;
        defenseMap.set(name,(defenseMap.get(name) *multiplier))
    }
}

function rotateBetweenImages(normalImg, shinyImg, imgElement){
    if (normalImg == null || shinyImg == null){
        imgElement.style.width = "0px";
        return;
    }
    else{
        imgElement.style.width = "150px"
    }
    imgElement.src = normalImg;
    id = setInterval(function(){
        if(imgElement.src == normalImg){
            imgElement.src = shinyImg;
        }
        else{
            imgElement.src = normalImg;
        }
    },4000);
    return id;
}

async function createEvoTree(chainUrl){
    const evoChain = await getData(chainUrl);
    const smallestWidth = 200;
    if (evoChain.chain.evolves_to.length == 0){
        evoTree.parentNode.innerHTML = "This pokemon has no evolutions";
        return;
    }
    addBranch(evoTree,evoChain.chain,100);
    let totalWidth = 100*smallestWidth / smallestWidthPercentage;

    if (totalWidth > evoTree.parentElement.clientWidth){
        evoTree.style.width = totalWidth+"px";
    }
    else{
        evoTree.style.width = "100%";
    }
}

async function addBranch(parent, basePokemon,widthPercentage) {
    let block = tempBlock.cloneNode(true);
    loadPokemonIntoBlock(basePokemon.species.name,block)
    parent.appendChild(block)

    const branches = basePokemon.evolves_to.length
    if (branches == 0){
        return;
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper")
    const space = 100 / branches;

    if (branches !=1 ){
        let selfArrow = document.createElement("div");
        selfArrow.classList.add("arrow");
        parent.appendChild(selfArrow);

        let line = document.createElement("div")
        line.classList.add("branchLine")
        line.style.marginLeft = (space/2)+"%"
        line.style.marginRight = (space/2)+"%";

        parent.appendChild(line);
    }

    const newPercentage = space/100 *widthPercentage; 
    if (newPercentage < smallestWidthPercentage){
        smallestWidthPercentage = newPercentage;
    }

    for(let i = 0; i < branches;i++){
        let subBranch = document.createElement("div");
        subBranch.classList.add("evolutionRow");
        subBranch.style.width = space + "%";
        let arrow = document.createElement("div");
        arrow.classList.add("arrow");

        addBranch(subBranch,basePokemon.evolves_to[i],newPercentage);

        subBranch.insertAdjacentElement("afterbegin",arrow)

        wrapper.appendChild(subBranch);
    }
    parent.appendChild(wrapper);
}

async function loadPokemonIntoBlock(id,block){
    currentPokemon = await getPokemonData(id);
    block.children[0].src = currentPokemon.sprites.front_default;
    block.children[1].innerHTML = currentPokemon.name;
    block.children[2].innerHTML = "Str:  " + (currentPokemon.stats[0].base_stat+currentPokemon.stats[1].base_stat+currentPokemon.stats[2].base_stat+currentPokemon.stats[3].base_stat+currentPokemon.stats[4].base_stat+currentPokemon.stats[5].base_stat)
    for (let i = 0; i <  currentPokemon.types.length ; i++) {
        let currentType= tempType.cloneNode(true);
        currentType.innerHTML = currentPokemon.types[i].type.name;
        currentType.classList.add(currentPokemon.types[i].type.name)
        block.children[3].appendChild(currentType);
    }
}

function clearData(){
    let length = abilityTable.rows.length;
    for(let i = 1; i < length; i++ ){abilityTable.deleteRow(1)}
    if(maleIntervalId != null){clearInterval(maleIntervalId)}
    if(shinyIntervalId != null){clearInterval(shinyIntervalId)}
    types.innerHTML = "";
    evoTree.innerHTML = ""
    defense.innerHTML = "";
    for (let [key,value] of defenseMap) {
        defenseMap.set(key,1);
    }
}

function addEggGroup(eggGroups){
    if (eggGroups.length == 0){
        breedingStats.rows[1].cells[1].innerHTML = "No egg group";
        return;
    }
    let str = "";
    for (let i = 0; i < eggGroups.length-1 ; i++){
        str+= eggGroups[i].name+', ';
    }
    
    str+= eggGroups[eggGroups.length-1].name;
    breedingStats.rows[1].cells[1].innerHTML = str;
}