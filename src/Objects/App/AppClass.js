export const AppType = {Personalized:0,Popular:1,Group:2,SuperPersonalized:3,SuperPopular:4}

export const Format = { None:"none", String:"string",LongString:"long_string" ,Url:"url", Path:"path",}

export const LABEL_STEP = 10

export class AppClass {
    constructor(name,miniDescription,description,format,label) { 
      /***/ this.name = name; //to nie bedzie zmieniane, nie ma sensu ALE co z Spotify co bedziemy chcieli zastapi Apple Music????
      this.miniDescription = miniDescription;
      this.description = description;// przykladowe elementy w formacie
      this.format=  format;
      this.label=label;
    }

    static Default = new AppClass("Default","","",Format.None,100)

    getGroup = ()=>(this.label/LABEL_STEP) | 0
    toString = ()=>this.name;
    valueOf = ()=> this.name;
}