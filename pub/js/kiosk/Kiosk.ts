﻿/// <reference path="arch/Details.ts" />
/// <reference path="mainview.ts" />
/// <reference path="banner.ts" />
/// <reference path="als/ScreenSaver.ts" />
/// <reference path="infopage.ts" />

/// <reference path="arch/KeyboardView.ts" />
/// <reference path="search/Keyboard.ts" />
/// <reference path="search/SearchResult.ts" />
/// <reference path="Registry.ts" />
/// <reference path="search/models.ts" />
/// <reference path="search/Categories.ts" />
/// <reference path="Connector.ts" />
/// <reference path="search/Keywords.ts" />
/// <reference path="MainMenu.ts" />

declare var u_settings:any;

module uplight {
   export class Kiosk {     
       private searchResult: SearchResult;
       private R: Registry;
       private keyboard: Keyboard;
       private timeout:number
       private dest:SearchDetailsLarge


       private onMouseDown(evt:MouseEvent):void{

           if(this.isBlocked){
               evt.preventDefault();
               evt.stopPropagation();
               evt.stopImmediatePropagation();
           }else{
               setTimeout(()=>this.unblock(),500);
               this.isBlocked = true;
           }
       }

       shoeSearch():void{
           $('#toolsview').animate({scrollTop:'365'});
           this.showSearchResult();
       }
       showMenu():void{
           $('#toolsview').animate({scrollTop:'0'});
       }


       showSearchResult():void{
           $('#mainport').animate({scrollLeft:0});
       }
       showPages(item):void{
           console.log('show pages');
           $('#mainport').animate({scrollLeft:725});
       }
       onMenuClick(item:any):void{
            this.showPages(item);
       }
       errors:string='';
       error(str:string):void{
           this.errors+=str+"\n";
       }
       warns:string='';
       warn(str:string):void{
           this.warns+=str+"\n";
       }
       constructor() {

           console.log('kiodk');
           document.addEventListener('mousedown',(evt)=>this.onMouseDown(evt),true);
           var r:Registry = Registry.getInstance();
           r.connector = new Connector();
           r.connector.id=u_settings.kiosk;
           r.connector.who='kiosk';
           r.model = new Model(r.connector,(w)=>this.warn(w));
           r.settings = u_settings;
           r.dispatcher = $({});

           this.R=r;
          this.keyboard = new Keyboard();
           var si = new SearchInput($('#searchinput'));
           var kw = new Keywords($('#kw-container'));
           var cats= new Categories();
           var mm = new MainMenu();
           mm.onClick = (item)=>this.onMenuClick(item);

          this.dest = new SearchDetailsLarge($('#DetailsLarge'));
           console.log(this.dest);


           $('#btnSearch').click(()=>this.shoeSearch());
           $('#SearchView [data-id=btnClose]').click(()=>this.showMenu())
           $('#SearchView [data-id=btnShowMenu]').click(()=>this.showMenu())


         this.searchResult = new SearchResult();

           if(!u_settings.hasOwnProperty('norelay'))  var relay:Relay = new Relay(u_settings.timer);
            r.dispatcher.on(r.SS_START,function(){r.dispatcher.triggerHandler(r.RESET_ALL)});

          // Registry.getInstance().connector.Log('kiosk started succesguly');
         // Registry.getInstance().connector.Error('kiosk started succesguly');

       }



       private prevHash;
       private isBlocked: boolean;

       private unblock(): void {
           this.isBlocked = false;
       }

       private onHachChange(): void {
           var h:string = document.location.hash;
           if (this.isBlocked) {
               document.location.hash = h;
               return;
           }
           this.prevHash = h;
           this.isBlocked = true;
           setTimeout(() => this.unblock(), 500);
           
           var hash: string[] = h.split('/');
           switch (hash[0]) {
               case '#category':
                 //  this.keyboardView.hideKeyboard();
                  // var cat: VOItem = this.menu.getCategoryById(Number(hash[1]));
                  // this.maiView.showView(this.searchResult.getListByCategory(cat));
                   break;
               case '#destid':
                   this.dest.showDest(Number(hash[1]));
                 //  this.keyboardView.hideKeyboard();
                 //  this.maiView.showView(this.details.getDetailsById(Number(hash[1])));
                   break;

           }
       }

    }

    export class Relay{
        constructor(delay:number){
            if(isNaN(delay) || delay<2) delay = 2;
            this.timer =(new Date()).getTime();
            setInterval(()=>this.relay(),delay*1000);
        }

        private stamp:number=0;
        private ping:number=0;
        private timer:number

        private relay():void{
            var that=this;
            var now=(new Date()).getTime();
            var timer=now- this.timer;
            this.timer=now;
            Registry.getInstance().connector.relay(this.stamp,Math.round(now/1000),this.ping,timer,Registry.status).done(function(res:string){
                that.ping=(new Date()).getTime()-now;
                var vo:VOResult
                try{
                    vo = JSON.parse(res)
                }catch(e){
                    console.warn('relay doesnt work '+ res);
                    return;
                }

                switch(vo.success){
                    case 'reload':
                        window.location.reload();
                        break;
                    case 'load':
                        window.location.href=vo.result;
                        break;
                    case 'stamp':
                        that.stamp = Number(vo.result);
                        break;
                }


            })
        }
    }
    
}

$(document).ready(()=>{
   var k = new uplight.Kiosk();
});