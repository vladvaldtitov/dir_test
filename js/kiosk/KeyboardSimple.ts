/**
 * Created by VladHome on 6/9/2015.
 */
    /// <reference path="Registry.ts" />
module uplight{
    export class Keyboard {
        private keys:JQuery;

        view:JQuery
        private alphabet:string = '1,2,3,4,5,6,7,8,9,0,Q,W,E,R,T,Y,U,I,O,P,A,S,D,F,G,H,J,K,L,&nbsp;,Z,X,C,V,SPACE,B,N,M';
        R:Registry
        constructor(view:JQuery) {
            this.view = view;
            this.R=Registry.getInstance();
           // if(set && set.keyboard) this.initSettings(set.keyboard);
            this.keys = $('<div>');
            this.keys.html(this.parseKeys(this.alphabet.split(','))).appendTo(this.view);

           this.addListeners();


        }
        addListeners():void{

            this.keys.on(CLICK,'.kb-key',(evt)=>{this.onKeyClick($(evt.currentTarget))})
        }


        private onKeyClick(el):void{
            var txt = el.text().toLowerCase();
            if(txt=='\u00A0'){
                txt='del';
            }else if(txt=='space'){
                txt=' ';
            }
            this.R.dispatcher.triggerHandler(this.R.KEY_PRESSED,txt);
        }
        private parseKeys(ar: string[]):string{
            var out: string = '<div class="row1">';
            for (var i = 0, n = ar.length; i < n; i++) {
                if(i===10)out+='</div><div class="row2">';
                if(i===20) out+='</div><div class="row3">'
                if(i===30) out+='</div><div class="row4">'
                out += this.itemRenderer(ar[i]);
            }
            return out+'</div>';
        }
        private itemRenderer(item: string): string {
            var cl = 'Plastic031';
            if(item=='SPACE') cl+=' space';
            if(item == '&nbsp;')cl+=' back fa fa-caret-square-o-left';
            return '<div class="kb-key '+cl+'"><span>' + item + '</span></div>';
        }
    }

    export class SearchInput{
        view:JQuery
        input:JQuery;
        private btnClear:JQuery
        data:string;
        R:Registry;
        private isKw:boolean;
        constructor(view:JQuery){
            this.view=view;
            this.data='';
            this.input = this.view.find('input');
            this.R=Registry.getInstance();
            this.btnClear = view.find('[data-id=btnClear]:first');
            this.addListeners();
        }

        private addListeners():void{
            this.btnClear.on(CLICK,()=>this.onClearClick());
            this.R.dispatcher.on(this.R.KEY_PRESSED,(evt,txt)=>{this.onKeyPressed(txt)});
            this.R.dispatcher.on(this.R.KEYWORD_PRESSED,(evt,txt)=>{this.onKeyword(txt)});
        }
        private onKeyword(str:string):void{
            //this.isKw=true
            this.R.connector.Stat('kw',str);
            this.setText(str);
        }
        private onClearClick():void{
            this.setText('');
        }
        private setText(txt:string):void{
            this.data=txt;
            this.input.val(this.data);
            this.R.dispatcher.triggerHandler(this.R.SEARCH_CHANGED,this.data);
        }

        private timeout:number
        private onKeyPressed(txt:string):void{
            var str:string = this.data;
            if(str.length==0) str=txt.toUpperCase();
            else if(txt=='del'){
                if(str.length>1) str = str.substr(0,str.length-1);
                else str='';
            }else  str+=txt;


            this.setText(str);
            clearTimeout(this.timeout)
            this.timeout = setTimeout(function(){ Registry.getInstance().connector.Stat('sr',str);},1500);
            this.input.focus();
        }

    }


}