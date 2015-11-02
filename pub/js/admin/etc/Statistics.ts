/**
 * Created by VladHome on 8/8/2015.
 */
    ///<reference path="../../typing/chart.d.ts"/>
    /// <reference path="../DirsAdmin.ts" />

module uplight{
    export class Statistics{
        R:RegA;
        private data:VOStat[];
       private colors:string[]=['#9F9977','#B2592D','#BDC2C7','#BC8777',' #996398','#839182','#708EB3','#BC749A'];
        private fromTo:string
        constructor(contauner:JQuery){
            this.R = RegA.getInstance();
            contauner.load('htms/admin/Statistics.htm',()=>this.init());
        }

        private init():void{
           // var today = new Date()
          //  var priorDate = new Date(today.getTime() - 30*24*60*60*1000);

           this.R.connector.getStatistics().done((res)=>this.onData(res));

            var today = new Date()
            var priorDate = new Date(today.getTime() - 30*24*60*60*1000);
            this.fromTo = 'from '+today.toDateString().substr(4) +' to '+priorDate.toDateString().substr(4);
            var kiosksChart:KiosksChart = new KiosksChart($('#KiosksChart'),this.colors,this.fromTo);
            var devices:DevicesData = new DevicesData($('#DevicesData'),this.colors);

        }

        private onData(res:any):void{
            var cats =  res.categories;
            var dests = res.destinations;
          //  var search = res.search;

          //  console.log(res);

            var categ:CategoriesChart  = new CategoriesChart($('#CategoriesChart'),cats,this.colors);

            var destinTopDestinations = new TopDestinations($('#TopDestinations'),dests);
            var searches:TopSearches = new TopSearches($('#TopSearches'), res.search,res.keywords);

        }
    }

    export class VODevice{
        id:number;
        name:string;
        maxdelay:number;
        S_time:number=0;
        K_time:number=0;
        ip:string='';
        ping:number=0;
        start_at:number=0;
        timer:number=15000;
        template:string;
        constructor(obj:any){
            for(var str in obj) this[str] = obj[str];
        }
    }
    export class DeviceModel extends VODevice {
        status:number;
        constructor(dev:VODevice,s_time:number){
            super(dev);
            var delta:number = s_time-dev.S_time
            if(delta< dev.maxdelay)this.status=1;
           else this.status=0;

        }
    }
    export class DevicesData {
        private data:VODevice[];
        private devices:DeviceModel[];
        private s_time:number;
        private list:JQuery;
       // private greenLite:JQuery;
        constructor(private view:JQuery,private colors:string[]){
            console.log('DevicesData');
            this.list = view.find('[data-id=list]:first');
           // this.greenLite=view.find('[data-view=greenLite]:first');
            this.loadData();
        }
        private loadData():void{
           this.list.find('.status').detach();
            RegA.getInstance().connector.getDevices().done((res)=>this.onKiosks(res));
        }
        private onKiosks(res:VOResult):void{
            this.data=res.result;
            this.s_time = Number(res.success);
            //console.log(this.data);
           // console.log(this.s_time);
            this.render();
           // RegA.getInstance().connector.  getServerTime().done((res)=>{
              //  this.s_time = Number(res);
              //  this.render();
          //  });


        }

        private render():void {
            var s_time=this.s_time;
            var ar:VODevice[] =  this.data
            var out='';
            var ks:DeviceModel[]=[];
            for(var i=0,n=ar.length;i<n;i++){
                var k:DeviceModel = new DeviceModel(ar[i],s_time);
                ks.push(k);
                out+=this.createDevice(k);
            }
            this.devices = ks;
            this.list.html(out) ;
            setTimeout(()=>this.loadData(),10000);
        }

        private createDevice(obj:DeviceModel):string{

            var color:string='#0F0';
            var statusStr='Working fine';
            var  cl ='fa-circle';
           if(obj.status === 0){
               color = '#ECCC6B';
               cl='fa-exclamation-triangle';
               statusStr = 'Experienced delays';
           }




            var stsrtTime:string= obj.start_at?new Date(obj.start_at*1000).toLocaleString():'';
            var lastTime:string =obj.K_time? new Date(obj.K_time*1000).toLocaleString():'';
            return '<tr>' +
                '<td>'+obj.name+'</td>' +
                '<td><a target="_blank" href="'+obj.template+'?kiosk='+obj.id+'&mode=preview" ><span class="fa fa-external-link"></span></a></td>' +
                '<td><span title="'+statusStr+'" class="status fa '+cl+'" style="color:'+color+'">&nbsp</span></td>' +
                '<td>'+obj.ip+'</td>' +
                '<td>'+obj.ping+'</td>' +
                '<td class="text-right">'+stsrtTime+'</td>' +
                '<td class="text-right">'+lastTime+'</td>' +
                '</tr>';


        }



    }
    export class VoRate{
        value:any;
        rate:number;
        constructor(ar:any[]){
            this.value=ar[0];
            this.rate = ar[1];
    }
    }
    class TopSearches{

        constructor(private view:JQuery,search:any[][],keywords:any[][]){

            var kws:VoRate[]= this.parseData(keywords);
            var kbs:VoRate[]= this.parseData(search);

           // console.log(kws);
           // console.log(kbs);



           // kws = _.sortBy(kws,'rate').reverse();
          //  kbs= _.sortBy(kbs,'rate').reverse();
            this.showKewords(kws);
           this.showKeyboard(kbs);

        }

        private parseData(ar:any[][]):VoRate[]{
            var out:VoRate[]=[];
            for(var i=0,n=ar.length;i<n;i++) out.push(new VoRate(ar[i]));
            return out;
        }
        private  showKewords(ar:VoRate[]):void{
            var out='<table class="table"><thead><tr><td>Keyword</td><td>Times</td></tr></thead><tbody>';
            for(var i=0,n=ar.length;i<n;i++){
                out+='<tr><td> '+ar[i].value+' </td><td> '+ar[i].rate+' </td></tr>';
            }
            out+='</tbody></table>';
            this.view.find('[data-id=list1]:first').html(out)

        }
        private  showKeyboard(ar:VoRate[]):void{
            var out='<table class="table"><thead><tr><td>Search</td><td>Times</td></tr></thead><tbody>';
            for(var i=0,n=ar.length;i<n;i++){
                out+='<tr><td> '+ar[i].value+' </td><td> '+ar[i].rate+' </td></tr>';
            }
            out+='</tbody></table>';
            this.view.find('[data-id=list2]:first').html(out)
        }
    }


    class TopDestinations{
        constructor(private view:JQuery,private data:any){
        this.render(data)
           // RegA.getInstance().connector.getDestinations().done((res:any)=>this.onDestinations(res))
        }



        private render(ar:any[]):void{
           // console.log(ar);
            var dests:any =    RegA.getInstance().model.getDestinationsIndexed();
//console.log(dests);
            var out='<thead><tr><td>Clicks</td><td>Name</td><td>Unit</td></tr></thead><tbody>';
            for(var i=0,n=ar.length;i<n;i++){
               var dest  = dests[ar[i][0]];
                if(dest)  out+=this.renderItem(dest,ar[i][1]);
                else console.log('error no destination with id: '+ar[i][0]);
            }

            out+='</tbody>';

            var list=$('<table>').addClass('table').html(out).appendTo(this.view.find('[data-id=list]:first'));



        }

        private renderItem(item:VODestination,clicks):string{
            return '<tr><td>'+clicks+'</td><td>'+item.name+'</td><td >'+item.unit+'</td></tr>';
        }
    }


    class CategoriesChart{
        list:JQuery;
        constructor(private view:JQuery,private data:any,private colors:string[]){
           // console.log(data);

            var ar = data
            var out:any={};
            var max:number=0;
            for(var i=0,n=ar.length;i<n;i++){
                var val:number = ar[i][1];
                if(isNaN(val)) val=10000;
                val=10000-val;
                if(val>max) max=val;
               out[ar[i][0]]=val;
            }

            for(var str in out) out[str] -=max;


            this.render(out);
               //RegA.getInstance().connector.getCategories().done((res)=>this.onCategories(res))

        }

     /* private getCategryStat(id:number){
          var ar = this.data
          for(var i=0,n=ar.length;i<n;i++){
              var item = ar[i];
          }
        }
*/
       /* private parseData(cats:any,data:any):void{
           console.log(data);
            var ar = data
            for(var i=0,n=ar.length;i<n;i++){
                if(ar[i].type=='cp'){ cats[ar[i].val]++}
                else if(ar[i].type=='cm'){cats[ar[i].val]--};
            }

        }

        private rateCategories(cats:VOCategory[],obj:any):VOPie[]{
            var ar = cats;
            var out:VOPie[]=[]
            for(var i=0,n=ar.length;i<n;i++){
                var item = ar[i];
                var vo:VOPie = new VOPie();
                vo.color=ar[i].color;
                vo.label = ar[i].label;
                vo.value = obj[ar[i].id];
                out.push(vo);
            }
            return out;
        }
        private cats:any;*/

        private render(data){

            var list=$('<ul>');
            var out='';
               // var ar = res
            var obj={};
            var pies:VOPie[]=[];

            var ar:VOCategory[]= RegA.getInstance().model.getCategories();

          var total:number =0;
                for(var i=0,n=ar.length;i<n;i++){
                   // var cat:VOCategory = new VOCategory(ar[i]);
                    var vo:VOPie = new VOPie();
                    vo.color=this.colors[i];
                    vo.label= ar[i].label;
                    var val:number = data[ar[i].id] || 1;
                    if(val===0) val=1;
                    val= 1/Math.abs(val)
                    total += val;
                    vo.value = val;// 100+(data[cat.id] || 0);
                    pies.push(vo);
                    out+='<li><span class="glyphicon glyphicon-stop" style="color:'+vo.color+';"></span> <span> '+vo.label+'</span></li>';
                 /// console.log(cat);
                }

            for(var i=0,n=pies.length;i<n;i++){
                pies[i].value = pies[i].value/total *100;
            }

           // console.log(pies);

           // this.parseData(obj,this.data);
         ///  var vis =  this.rateCategories(cats,obj);


           // console.log(cats);

           list.html(out);
            this.list= list;
            list.appendTo(this.view.find('[data-id=list]:first'));

            var canvas:JQuery = this.view.find('[data-id=canvas]:first');

           //console.log('vis',vis);
            var myPieChart = new Chart(canvas.get(0).getContext("2d")).Pie(pies,this.getOptions());
            //console.log(res);
        }

        private getOptions():any{
            return {
                //Boolean - Whether we should show a stroke on each segment
                segmentShowStroke : true,
                //String - The colour of each segment stroke
                segmentStrokeColor : "#fff",
                //Number - The width of each segment stroke
                segmentStrokeWidth : 2,
                //Number - The percentage of the chart that we cut out of the middle
                percentageInnerCutout : 0, // This is 0 for Pie charts
                //Number - Amount of animation steps
                animationSteps : 100,
                //String - Animation easing effect
                animationEasing : "easeOutBounce",
                //Boolean - Whether we animate the rotation of the Doughnut
                animateRotate : true,
                //Boolean - Whether we animate scaling the Doughnut from the centre
                animateScale : false
                //String - A legend template
               // legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

            }
        }
    }

    class VOPie{
        id:number;
        value:number;
        color:string;
        label:string;
    }
    class VOKs{
        constructor(public id:number){}
        name:string;
        clicks:number[]=[];
        buildDays():number[]{
            var out:number[];
            var ar = this.clicks;
            for(var i=0,n=ar.length;i<n;i++){
                var date:Date = new Date(ar[i]*1000);
                var day:number = date.getDay();
                if(!out[day])out[day]=0;
                out[day]++;
            }
            return out;
        }
    }

    class KiosksChart{
        constructor(private view:JQuery,private colors:string[],fromto:string){
          //  console.log(clicks);
           this.view.find('[data-id=fromto]:first').text(fromto);
            RegA.getInstance().connector.getData('kiosks.json').done((res)=>this.onKiosks(res));
        }

        private craeateTimeline():number[]{
            var now:Date = new Date();
            var dates:number[]=[];
            dates.push(now.getDate());
            for(var i=0,n=30;i<n;i++){
                now.setDate(now.getDate()-1);
                dates.push(now.getDate());
            }
            return dates.reverse();


        }
        private breakeClicksInDays(clicks:number[]){
            var ar = clicks;
            for(var i=0,n=ar.length;i<n;i++){
                var date:Date = new Date(ar[i]*1000);
            }
           var from:Date = new Date(clicks[0]*1000);
            var to:Date  = new Date(clicks[clicks.length-1]*1000);
           console.log(from);
            console.log(to);
        }



        private convertClicks(ar:number[]):number[]{
            var out:number[]=[];
           // console.log(ar);
            for(var i=0,n=ar.length;i<n;i++){
                var date:Date = new Date(ar[i]*1000);
                var day:number = date.getDate();
                if(!out[day])out[day]=0;
                out[day]++;
            }
            return out;
        }

        private mapClicks(ar:number[],clicks:number[]):number[]{
            var out:number[]=[]
            for(var i=0,n=ar.length;i<n;i++)out.push(clicks[ar[i]] || 0);
            return out;
        }

        private renderKiosk(obj:any):string{
            return '<li title="kiosk id '+obj.id+'"><span class="glyphicon glyphicon-stop" style="color:'+obj.color+';"></span> <span> '+obj.name+'</span></li>';
        }

        private onData(res):void{
           // console.log('usage',res);
            var timeline:number[]=  this.craeateTimeline();
            var ar=[];
            for(var str in res){
               var item = this.devices[str];
                var clicks = this.convertClicks(res[str]);
                item.clicks = this.mapClicks(timeline,clicks);
                ar.push(item);
            }

            this.drawGraph(timeline.map(String),ar);
        }

        drawGraph(timeline,ar:any[]):void{
            var datasets:any[]=[];
            for(var i=0,n=ar.length;i<n;i++) {
                var ds:any = {};
                ds.label = ar[i].name;
                ds.strokeColor = ar[i].color;
                ds.pointColor = ar[i].color;
                ds.pointHighlightStroke = "rgba(220,220,220,1)";
                ds.pointStrokeColor = "#fff";
                ds.pointHighlightFill = "#666";
                ds.data = ar[i].clicks;
                datasets.push(ds);
            }

            var data = {
                labels: timeline.map(String),
                datasets:datasets
            };

            var canvas = this.view.find('[data-id=canvas]:first');
            var ctx=canvas.get(0).getContext("2d");
            var myLineChart:any = new Chart(ctx).Line(data, this.getOptions());


        }


        private devices:any;
        private onKiosks(res):void{
            var ids:string[]=[];


           // var timeline:number[]=  this.craeateTimeline();
           var ks= JSON.parse(res);
           // console.log(ks);
            var ar = ks;
            var list = $('<ul>');
            var out='';
            var datasets:any[]=[];

            var devices={};
            for(var i=0,n=ar.length;i<n;i++){
                var item = ar[i];
              //  var id:string = 'kiosk'+item.id;
                ids.push(item.index);
                devices[item.index] = ar[i];

               // var clicks:number[] = this.clicks[ar[i].id];
                //if(!clicks) clicks=[];
                //clicks = this.convertClicks(clicks);
                //ar[i].clicks = this.mapClicks(timeline,clicks);
                ar[i].color=this.colors[i];
                out+=this.renderKiosk(ar[i]);
             // var ds:any={};
              //  ds.label=ar[i].name;
               // ds.strokeColor=ar[i].color;
               // ds.pointColor=ar[i].color;
               // ds.pointHighlightStroke = "rgba(220,220,220,1)";
               // ds.pointStrokeColor="#fff";
               //  ds.pointHighlightFill= "#666";
               // ds.data = ar[i].clicks;
               // datasets.push(ds);

            }
            this.devices = devices;

            RegA.getInstance().connector.getUsage(ids.join(','),'-30 days','now').done((res)=>this.onData(res));
            list.html(out);
            this.view.find('[data-id=list]:first').append(list);
            return;

var timeline;

            var data = {
                labels: timeline.map(String),
                datasets:datasets /*[
                    {
                        label: "My First dataset",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: ks[0].clicks
                    },
                    {
                        label: "My Second dataset",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: ks[1].clicks
                    }
                ]*/
            };




            var canvas = this.view.find('[data-id=canvas]:first');
            var ctx=canvas.get(0).getContext("2d");
           var myLineChart:any = new Chart(ctx).Line(data, this.getOptions());


        }

        private getOptions():any{
            return {
                ///Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines : true,
                //String - Colour of the grid lines
                scaleGridLineColor : "rgba(0,0,0,.05)",
                //Number - Width of the grid lines
                scaleGridLineWidth : 1,
                //Boolean - Whether to show horizontal lines (except X axis)
                scaleShowHorizontalLines: true,
                //Boolean - Whether to show vertical lines (except Y axis)
                scaleShowVerticalLines: true,
                //Boolean - Whether the line is curved between points
                bezierCurve : true,
                //Number - Tension of the bezier curve between points
                bezierCurveTension : 0.4,
                //Boolean - Whether to show a dot for each point
                pointDot : true,
                //Number - Radius of each point dot in pixels
                pointDotRadius : 4,
                //Number - Pixel width of point dot stroke
                pointDotStrokeWidth : 1,
                //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
                pointHitDetectionRadius : 5,
                //Boolean - Whether to show a stroke for datasets
                datasetStroke : true,
                //Number - Pixel width of dataset stroke
                datasetStrokeWidth : 2,
                //Boolean - Whether to fill the dataset with a colour
                datasetFill : false
                //String - A legend template
               // legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

            };
        }
    }




}