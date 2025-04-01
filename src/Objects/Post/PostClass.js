export class PostClass {
    constructor(      id,      host_id,      week_name, upload_date,   app,     content,      context,permissions={me:false,friends:false,screenka:false},week_tag=false,    comment=null,      view=null,   top_number=null,     is_highlighted=null
    ) {
      /***/ this.id = id; //data przekonwertowana na string np. 2023_0322_1301
      this.host_id = host_id;// if host==null then post uniwersalny
      this.week_name = week_name; //mozna pofiltrowac, mozna info odrazu poznac (bo jest to pewnego rodzaju context - a na tym nam zalezy zby week_name mialo znaczenie i bylo czesto oznaczane), jesli null to uniwersalny - wiadomo
      this.upload_date = upload_date;
      this.app = app;
      this.content = content; 
      this.context = context; //dlaczego uploader zdecydowal sie to spostowac, jaki przekaz za soba niesie? co czujesz? dodaj nieco tla do uploadowanej relacji!
      this.permissions=permissions //post.permissions.me bedzie reprezentowal usuniecie narazie.  //aka permissions, przy userze sa preferences
      
      /*?*/ this.comment = comment; // ref to comment app post
      /*?*/ this.view = view; //kto

      this.week_tag = week_tag;
      /*?*/ //this.apps_merge = apps_merge;//refs array to posts
      /*?*/ //this.tags = tags;//refs array to tags app posts
      
      /*?*/ this.top_number = top_number;
      /*?*/ this.is_highlighted = is_highlighted;

      /*NO*/ //judge score - wystarczy komentarz, ocene i ostateczni werdykt zostawiamy hotowi
      /*NO*/ //this.co_comment = co_comment; // komentarz jurora, jednego jurora , potrzebne do jugding-time // jeden komentarz period
      /*MAYBE */ //?tag - ???? np tapeta itp. a pozniej sortowanko
    }
    static fromDoc=(doc)=>{
      return doc?new PostClass(doc.id,doc.host_id,doc.week_name,doc.upload_date.toDate(),doc.app,doc.content,doc.context,doc.permissions,doc.week_tag,doc.comment,doc.view,doc.top_number,doc.is_highlighted):null;
  }

    toDoc = ()=>{
      return {
        host_id:this.host_id,
        week_name:this.week_name,
        upload_date:this.upload_date,
        app:this.app,
        content:this.content,
        context:this.context,
        permissions:this.permissions,
        week_tag:this.week_tag,
        view:null,
        }
    }

  }

  
  