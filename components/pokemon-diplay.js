app.component('pokemon-diplay', {
    template:
    /*html*/
    `
    <div id=research>
    <input type="search" name="pokemonResearcher" placeholder="search your pokemon..." v-on:keyup="search()" id="pokemonResearcher" ref="input">
    </div>
    
    
    <div id="moreinfo" class="moreinfos" v-if="isReady">
        <img id="myButton" v-on:click="closeinfos()" src="./assets/button.png"> </img>
       
        <h2 id="detailedname"> #{{result.id}} {{result.name}}</h2>
        <img id="detailedimage"v-bind:src="getimage(myindice)"></img>
        <div id="details">    
            <p>Height: {{result.height/10}} m</p>
            <p>Weight: {{result.weight/10}} Kg</p>
        </div>
    </div>

    <div id="pokemondisplay">
        <ul v-if="!isSearching"> <li id="prevbutton" v-if="displayprevbutton" v-on:click="prevpage()"> PREVIOUS PAGE </li>
            <li id=eachpokemon v-for="pokemon in allpokemons" v-on:click="getpokemon(GetIndice(pokemon))" :key="pokemon.url">
                <p id="pokemonname"># {{GetIndice(pokemon)}} {{pokemon.name}} </p>
                <img id="pokeimage" v-bind:src="getimage(GetIndice(pokemon))"></img>
            </li>
        
        <a href="#pokemondisplay">
        <li id=nextbutton v-if="displaynextbutton" v-on:click="nextpage()"> NEXT PAGE </li></a>
        </ul>
        
        <ul v-if="hasresult && isSearching">
        <li id=eachsearchedpokemon v-for="pokemon in pokesearched" v-on:click="getpokemon(pokemon.id)">
            <p id="pokemonname"># {{pokemon.id}} {{pokemon.name}} </p>
            <img id="pokeimage" v-bind:src="getimage(pokemon.id)"></img>
        </li>
        </ul>
        <div id="noresult" v-if="!hasresult">
        <p> NO RESULTS </p>
        </div>



    </div>
    

    `, 
    methods:{
        GetIndice(pokemon){
        return this.allpokemons.indexOf(pokemon) +this.page+1
    },
    
    
    
    async nextpage(){
        if(this.page==500){
            this.page+=50;
            this.displaynextbutton=false;
        }
        else{
            this.page+=50;
            console.log(this.page)
        }
        if(this.page>49){
            this.displayprevbutton=true
        }
        await axios.get("https://pokeapi.co/api/v2/pokemon?offset="+this.page+"&limit=50")
        .then(response => this.allpokemons=(response.data.results))   
    },
    async prevpage(){
        if(this.page>50){
            this.page-=50;
        }
        else{
            this.page-=50;
            console.log(this.page)
        }
        if(this.page==0){
            this.displayprevbutton=false
        }
        if(this.page==500){
            this.displaynextbutton=false
        }
        if(this.page==500){
            this.displaynextbutton=true
        }
        await axios.get("https://pokeapi.co/api/v2/pokemon?offset="+this.page+"&limit=50")
        .then(response => this.allpokemons=(response.data.results))    
    },
    

    getimage(indice){
        mystring="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/"+indice+".svg";
        return mystring
    },

    async getpokemon(indice){
        await axios.get('https://pokeapi.co/api/v2/pokemon/'+indice+'/')
        .then(response=>this.result=(response.data))
        this.isReady=true
        this.myindice=indice
    },

    closeinfos(){
        this.isReady=false
    },


    search(){
        this.hasresult=true;
        this.pokesearched=[{}]
        this.research = this.$refs.input.value.toLowerCase();
        if(this.research===""){
            this.isSearching=false;
        }
        else{
            this.isSearching=true;
        }
        let name=[]
        for (i in this.allnames){
            name.push(this.allnames[i].name)
        }
        console.log("MA RECHERCHE: "+this.research)
        pokesearchedindice=0;
        var Pokemon={}
        for(i=0;i<=648;i++)
        {
            pokename=name[i]

            if (pokename.startsWith(this.research)){
               
                Pokemon.name=name[i]
                Pokemon.id=i+1
                this.pokesearched[pokesearchedindice]=Pokemon
                pokesearchedindice+=1
            }
            Pokemon={}
        }
        if (pokesearchedindice==0){
            this.hasresult=false;
        }
    }


},
    data(){
        return{
            allpokemons:[{}],
            allnames:[{}],
            result:[{}],
            isReady:false,
            myindice:0,
            page:0,
            displaynextbutton:true,
            displayprevbutton:false,
            research:"",
            isSearching:false,
            pokesearched:[{}],
            hasresult:true
        } 
    },       
    mounted () {
         axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${this.page}&limit=50`)
         .then(response => this.allpokemons=(response.data.results))
    ,
         axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=649`)
         .then(response => this.allnames=(response.data.results))
    }
 })
