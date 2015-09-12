/**
 * Created by VladHome on 8/12/2015.
 */
    /// <reference path="../Registry.ts" />
/// <reference path="../../typing/svgjs.d.ts" />

module uplight{
    export class TouchClip{
        view: JQuery
        private rec1: svgjs.Element;
        private rec2: svgjs.Element;
        private text: svgjs.Element;
        private interval:number

        start(): JQuery {
            clearInterval(this.interval);
            this.runIn();
            return this.view
        }

        stop(): JQuery {
            clearInterval(this.interval);
            return this.view
        }

        constructor(){
            var el = document.createElement('div');
            el.id = 'Touchclip';
            var draw = SVG(el);
            var rect = draw.rect(1920, 80).fill({ color: '#000', opacity: 0.5 }).y(20);;

            this.rec1 = draw.rect(1920, 15).fill({ color: '#a90329', opacity: 1.0 }).y(105);
            this.rec2 = draw.rect(1920, 15).fill({ color: '#a90329', opacity: 1.0 })
            this.text = draw.text('TOUCH TO BEGIN').fill('#fff').y(0);

            this.text.font({
                family: 'Arial'
                , size: 60
                // , anchor: 'middle'
                //, leading: 1
            })

            this.view = $(el);


            Registry.getInstance().dispatcher.on( Registry.getInstance().SS_START,()=>this.start());
            Registry.getInstance().dispatcher.on( Registry.getInstance().SS_STOP,()=>this.stop());
        }

        private runOut(): void {

        }

        private runIn(): void {
            this.text.x(2000);
            this.rec1.x(2000);
            this.rec2.x(-2000);
            this.rec1.animate().x(0);
            this.rec2.animate().x(0);
            this.text.animate(500, '>', 1000).x(280);
            this.interval = setTimeout(()=>this.removeText(),5000);

        }

        private removeText(): void {
            this.text.animate(500).x(-1000);
            setTimeout(() => this.runIn(), 700);
        }



    }
}