import{C as e,S as t,n,r,x as i}from"./AuthContext-IjMqDus0.js";import{t as a}from"./index-jFwLvjPX.js";import{t as o}from"./confetti.module-DN_WQ_R-.js";import{n as s,t as c}from"./EventGallery-Crbhavdf.js";var l=t(((e,t)=>{(function(n,r){typeof e==`object`&&t!==void 0?r(e):typeof define==`function`&&define.amd?define([`exports`],r):r((n||=self).St={})})(e,(function(e){class t{constructor(e,t){this.state={angle:0,area:[],position:{x:0,y:0},hardAngle:0,hardDrawingAngle:0},this.createdDensity=t,this.nowDrawingDensity=this.createdDensity,this.render=e}setDensity(e){this.createdDensity=e,this.nowDrawingDensity=e}setDrawingDensity(e){this.nowDrawingDensity=e}setPosition(e){this.state.position=e}setAngle(e){this.state.angle=e}setArea(e){this.state.area=e}setHardDrawingAngle(e){this.state.hardDrawingAngle=e}setHardAngle(e){this.state.hardAngle=e,this.state.hardDrawingAngle=e}setOrientation(e){this.orientation=e}getDrawingDensity(){return this.nowDrawingDensity}getDensity(){return this.createdDensity}getHardAngle(){return this.state.hardAngle}}class n extends t{constructor(e,t,n){super(e,n),this.image=null,this.isLoad=!1,this.loadingAngle=0,this.image=new Image,this.image.src=t}draw(e){let t=this.render.getContext(),n=this.render.convertToGlobal(this.state.position),r=this.render.getRect().pageWidth,i=this.render.getRect().height;t.save(),t.translate(n.x,n.y),t.beginPath();for(let e of this.state.area)e!==null&&(e=this.render.convertToGlobal(e),t.lineTo(e.x-n.x,e.y-n.y));t.rotate(this.state.angle),t.clip(),this.isLoad?t.drawImage(this.image,0,0,r,i):this.drawLoader(t,{x:0,y:0},r,i),t.restore()}simpleDraw(e){let t=this.render.getRect(),n=this.render.getContext(),r=t.pageWidth,i=t.height,a=e===1?t.left+t.pageWidth:t.left,o=t.top;this.isLoad?n.drawImage(this.image,a,o,r,i):this.drawLoader(n,{x:a,y:o},r,i)}drawLoader(e,t,n,r){e.beginPath(),e.strokeStyle=`rgb(200, 200, 200)`,e.fillStyle=`rgb(255, 255, 255)`,e.lineWidth=1,e.rect(t.x+1,t.y+1,n-1,r-1),e.stroke(),e.fill();let i={x:t.x+n/2,y:t.y+r/2};e.beginPath(),e.lineWidth=10,e.arc(i.x,i.y,20,this.loadingAngle,3*Math.PI/2+this.loadingAngle),e.stroke(),e.closePath(),this.loadingAngle+=.07,this.loadingAngle>=2*Math.PI&&(this.loadingAngle=0)}load(){this.isLoad||(this.image.onload=()=>{this.isLoad=!0})}newTemporaryCopy(){return this}getTemporaryCopy(){return this}hideTemporaryCopy(){}}class r{constructor(e,t){this.pages=[],this.currentPageIndex=0,this.currentSpreadIndex=0,this.landscapeSpread=[],this.portraitSpread=[],this.render=t,this.app=e,this.currentPageIndex=0,this.isShowCover=this.app.getSettings().showCover}destroy(){this.pages=[]}createSpread(){this.landscapeSpread=[],this.portraitSpread=[];for(let e=0;e<this.pages.length;e++)this.portraitSpread.push([e]);let e=0;this.isShowCover&&(this.pages[0].setDensity(`hard`),this.landscapeSpread.push([e]),e++);for(let t=e;t<this.pages.length;t+=2)t<this.pages.length-1?this.landscapeSpread.push([t,t+1]):(this.landscapeSpread.push([t]),this.pages[t].setDensity(`hard`))}getSpread(){return this.render.getOrientation()===`landscape`?this.landscapeSpread:this.portraitSpread}getSpreadIndexByPage(e){let t=this.getSpread();for(let n=0;n<t.length;n++)if(e===t[n][0]||e===t[n][1])return n;return null}getPageCount(){return this.pages.length}getPages(){return this.pages}getPage(e){if(e>=0&&e<this.pages.length)return this.pages[e];throw Error(`Invalid page number`)}nextBy(e){let t=this.pages.indexOf(e);return t<this.pages.length-1?this.pages[t+1]:null}prevBy(e){let t=this.pages.indexOf(e);return t>0?this.pages[t-1]:null}getFlippingPage(e){let t=this.currentSpreadIndex;if(this.render.getOrientation()===`portrait`)return e===0?this.pages[t].newTemporaryCopy():this.pages[t-1];{let n=e===0?this.getSpread()[t+1]:this.getSpread()[t-1];return n.length===1||e===0?this.pages[n[0]]:this.pages[n[1]]}}getBottomPage(e){let t=this.currentSpreadIndex;if(this.render.getOrientation()===`portrait`)return e===0?this.pages[t+1]:this.pages[t-1];{let n=e===0?this.getSpread()[t+1]:this.getSpread()[t-1];return n.length===1?this.pages[n[0]]:e===0?this.pages[n[1]]:this.pages[n[0]]}}showNext(){this.currentSpreadIndex<this.getSpread().length&&(this.currentSpreadIndex++,this.showSpread())}showPrev(){this.currentSpreadIndex>0&&(this.currentSpreadIndex--,this.showSpread())}getCurrentPageIndex(){return this.currentPageIndex}show(e=null){if(e===null&&(e=this.currentPageIndex),e<0||e>=this.pages.length)return;let t=this.getSpreadIndexByPage(e);t!==null&&(this.currentSpreadIndex=t,this.showSpread())}getCurrentSpreadIndex(){return this.currentSpreadIndex}setCurrentSpreadIndex(e){if(!(e>=0&&e<this.getSpread().length))throw Error(`Invalid page`);this.currentSpreadIndex=e}showSpread(){let e=this.getSpread()[this.currentSpreadIndex];e.length===2?(this.render.setLeftPage(this.pages[e[0]]),this.render.setRightPage(this.pages[e[1]])):this.render.getOrientation()===`landscape`&&e[0]===this.pages.length-1?(this.render.setLeftPage(this.pages[e[0]]),this.render.setRightPage(null)):(this.render.setLeftPage(null),this.render.setRightPage(this.pages[e[0]])),this.currentPageIndex=e[0],this.app.updatePageIndex(this.currentPageIndex)}}class i extends r{constructor(e,t,n){super(e,t),this.imagesHref=n}load(){for(let e of this.imagesHref){let t=new n(this.render,e,`soft`);t.load(),this.pages.push(t)}this.createSpread()}}class a{static GetDistanceBetweenTwoPoint(e,t){return e===null||t===null?1/0:Math.sqrt((t.x-e.x)**2+(t.y-e.y)**2)}static GetSegmentLength(e){return a.GetDistanceBetweenTwoPoint(e[0],e[1])}static GetAngleBetweenTwoLine(e,t){let n=e[0].y-e[1].y,r=t[0].y-t[1].y,i=e[1].x-e[0].x,a=t[1].x-t[0].x;return Math.acos((n*r+i*a)/(Math.sqrt(n*n+i*i)*Math.sqrt(r*r+a*a)))}static PointInRect(e,t){return t===null?null:t.x>=e.left&&t.x<=e.width+e.left&&t.y>=e.top&&t.y<=e.top+e.height?t:null}static GetRotatedPoint(e,t,n){return{x:e.x*Math.cos(n)+e.y*Math.sin(n)+t.x,y:e.y*Math.cos(n)-e.x*Math.sin(n)+t.y}}static LimitPointToCircle(e,t,n){if(a.GetDistanceBetweenTwoPoint(e,n)<=t)return n;let r=e.x,i=e.y,o=n.x,s=n.y,c=Math.sqrt(t**2*(r-o)**2/((r-o)**2+(i-s)**2))+r;n.x<0&&(c*=-1);let l=(c-r)*(i-s)/(r-o)+i;return r-o+i===0&&(l=t),{x:c,y:l}}static GetIntersectBetweenTwoSegment(e,t,n){return a.PointInRect(e,a.GetIntersectBeetwenTwoLine(t,n))}static GetIntersectBeetwenTwoLine(e,t){let n=e[0].y-e[1].y,r=t[0].y-t[1].y,i=e[1].x-e[0].x,a=t[1].x-t[0].x,o=e[0].x*e[1].y-e[1].x*e[0].y,s=t[0].x*t[1].y-t[1].x*t[0].y,c=n*s-r*o,l=i*s-a*o,u=-(o*a-s*i)/(n*a-r*i),d=-(n*s-r*o)/(n*a-r*i);if(isFinite(u)&&isFinite(d))return{x:u,y:d};if(Math.abs(c-l)<.1)throw Error(`Segment included`);return null}static GetCordsFromTwoPoint(e,t){let n=Math.abs(e.x-t.x),r=Math.abs(e.y-t.y),i=Math.max(n,r),a=[e];function o(e,t,n,r,i){return t>e?e+n/r*i:t<e?e-n/r*i:e}for(let s=1;s<=i;s+=1)a.push({x:o(e.x,t.x,n,i,s),y:o(e.y,t.y,r,i,s)});return a}}class o extends t{constructor(e,t,n){super(e,n),this.copiedElement=null,this.temporaryCopy=null,this.isLoad=!1,this.element=t,this.element.classList.add(`stf__item`),this.element.classList.add(`--`+n)}newTemporaryCopy(){return this.nowDrawingDensity===`hard`?this:(this.temporaryCopy===null&&(this.copiedElement=this.element.cloneNode(!0),this.element.parentElement.appendChild(this.copiedElement),this.temporaryCopy=new o(this.render,this.copiedElement,this.nowDrawingDensity)),this.getTemporaryCopy())}getTemporaryCopy(){return this.temporaryCopy}hideTemporaryCopy(){this.temporaryCopy!==null&&(this.copiedElement.remove(),this.copiedElement=null,this.temporaryCopy=null)}draw(e){let t=e||this.nowDrawingDensity,n=this.render.convertToGlobal(this.state.position),r=this.render.getRect().pageWidth,i=this.render.getRect().height;this.element.classList.remove(`--simple`);let a=`\n            display: block;\n            z-index: ${this.element.style.zIndex};\n            left: 0;\n            top: 0;\n            width: ${r}px;\n            height: ${i}px;\n        `;t===`hard`?this.drawHard(a):this.drawSoft(n,a)}drawHard(e=``){let t=this.render.getRect().left+this.render.getRect().width/2,n=this.state.hardDrawingAngle,r=e+`
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                clip-path: none;
                -webkit-clip-path: none;
            `+(this.orientation===0?`transform-origin: ${this.render.getRect().pageWidth}px 0; \n                   transform: translate3d(0, 0, 0) rotateY(${n}deg);`:`transform-origin: 0 0; \n                   transform: translate3d(${t}px, 0, 0) rotateY(${n}deg);`);this.element.style.cssText=r}drawSoft(e,t=``){let n=`polygon( `;for(let e of this.state.area)if(e!==null){let t=this.render.getDirection()===1?{x:-e.x+this.state.position.x,y:e.y-this.state.position.y}:{x:e.x-this.state.position.x,y:e.y-this.state.position.y};t=a.GetRotatedPoint(t,{x:0,y:0},this.state.angle),n+=t.x+`px `+t.y+`px, `}n=n.slice(0,-2),n+=`)`;let r=t+`transform-origin: 0 0; clip-path: ${n}; -webkit-clip-path: ${n};`+(this.render.isSafari()&&this.state.angle===0?`transform: translate(${e.x}px, ${e.y}px);`:`transform: translate3d(${e.x}px, ${e.y}px, 0) rotate(${this.state.angle}rad);`);this.element.style.cssText=r}simpleDraw(e){let t=this.render.getRect(),n=t.pageWidth,r=t.height,i=e===1?t.left+t.pageWidth:t.left,a=t.top;this.element.classList.add(`--simple`),this.element.style.cssText=`\n            position: absolute; \n            display: block; \n            height: ${r}px; \n            left: ${i}px; \n            top: ${a}px; \n            width: ${n}px; \n            z-index: ${this.render.getSettings().startZIndex+1};`}getElement(){return this.element}load(){this.isLoad=!0}setOrientation(e){super.setOrientation(e),this.element.classList.remove(`--left`,`--right`),this.element.classList.add(e===1?`--right`:`--left`)}setDrawingDensity(e){this.element.classList.remove(`--soft`,`--hard`),this.element.classList.add(`--`+e),super.setDrawingDensity(e)}}class s extends r{constructor(e,t,n,r){super(e,t),this.element=n,this.pagesElement=r}load(){for(let e of this.pagesElement){let t=new o(this.render,e,e.dataset.density===`hard`?`hard`:`soft`);t.load(),this.pages.push(t)}this.createSpread()}}class c{constructor(e,t,n,r){this.direction=e,this.corner=t,this.topIntersectPoint=null,this.sideIntersectPoint=null,this.bottomIntersectPoint=null,this.pageWidth=parseInt(n,10),this.pageHeight=parseInt(r,10)}calc(e){try{return this.position=this.calcAngleAndPosition(e),this.calculateIntersectPoint(this.position),!0}catch{return!1}}getFlippingClipArea(){let e=[],t=!1;return e.push(this.rect.topLeft),e.push(this.topIntersectPoint),this.sideIntersectPoint===null?t=!0:(e.push(this.sideIntersectPoint),this.bottomIntersectPoint===null&&(t=!1)),e.push(this.bottomIntersectPoint),(t||this.corner===`bottom`)&&e.push(this.rect.bottomLeft),e}getBottomClipArea(){let e=[];return e.push(this.topIntersectPoint),this.corner===`top`?e.push({x:this.pageWidth,y:0}):(this.topIntersectPoint!==null&&e.push({x:this.pageWidth,y:0}),e.push({x:this.pageWidth,y:this.pageHeight})),this.sideIntersectPoint===null?this.corner===`top`&&e.push({x:this.pageWidth,y:this.pageHeight}):a.GetDistanceBetweenTwoPoint(this.sideIntersectPoint,this.topIntersectPoint)>=10&&e.push(this.sideIntersectPoint),e.push(this.bottomIntersectPoint),e.push(this.topIntersectPoint),e}getAngle(){return this.direction===0?-this.angle:this.angle}getRect(){return this.rect}getPosition(){return this.position}getActiveCorner(){return this.direction===0?this.rect.topLeft:this.rect.topRight}getDirection(){return this.direction}getFlippingProgress(){return Math.abs((this.position.x-this.pageWidth)/(2*this.pageWidth)*100)}getCorner(){return this.corner}getBottomPagePosition(){return this.direction===1?{x:this.pageWidth,y:0}:{x:0,y:0}}getShadowStartPoint(){return this.corner===`top`||this.sideIntersectPoint===null?this.topIntersectPoint:this.sideIntersectPoint}getShadowAngle(){let e=a.GetAngleBetweenTwoLine(this.getSegmentToShadowLine(),[{x:0,y:0},{x:this.pageWidth,y:0}]);return this.direction===0?e:Math.PI-e}calcAngleAndPosition(e){let t=e;if(this.updateAngleAndGeometry(t),t=this.corner===`top`?this.checkPositionAtCenterLine(t,{x:0,y:0},{x:0,y:this.pageHeight}):this.checkPositionAtCenterLine(t,{x:0,y:this.pageHeight},{x:0,y:0}),Math.abs(t.x-this.pageWidth)<1&&Math.abs(t.y)<1)throw Error(`Point is too small`);return t}updateAngleAndGeometry(e){this.angle=this.calculateAngle(e),this.rect=this.getPageRect(e)}calculateAngle(e){let t=this.pageWidth-e.x+1,n=this.corner===`bottom`?this.pageHeight-e.y:e.y,r=2*Math.acos(t/Math.sqrt(n*n+t*t));n<0&&(r=-r);let i=Math.PI-r;if(!isFinite(r)||i>=0&&i<.003)throw Error(`The G point is too small`);return this.corner===`bottom`&&(r=-r),r}getPageRect(e){return this.corner===`top`?this.getRectFromBasePoint([{x:0,y:0},{x:this.pageWidth,y:0},{x:0,y:this.pageHeight},{x:this.pageWidth,y:this.pageHeight}],e):this.getRectFromBasePoint([{x:0,y:-this.pageHeight},{x:this.pageWidth,y:-this.pageHeight},{x:0,y:0},{x:this.pageWidth,y:0}],e)}getRectFromBasePoint(e,t){return{topLeft:this.getRotatedPoint(e[0],t),topRight:this.getRotatedPoint(e[1],t),bottomLeft:this.getRotatedPoint(e[2],t),bottomRight:this.getRotatedPoint(e[3],t)}}getRotatedPoint(e,t){return{x:e.x*Math.cos(this.angle)+e.y*Math.sin(this.angle)+t.x,y:e.y*Math.cos(this.angle)-e.x*Math.sin(this.angle)+t.y}}calculateIntersectPoint(e){let t={left:-1,top:-1,width:this.pageWidth+2,height:this.pageHeight+2};this.corner===`top`?(this.topIntersectPoint=a.GetIntersectBetweenTwoSegment(t,[e,this.rect.topRight],[{x:0,y:0},{x:this.pageWidth,y:0}]),this.sideIntersectPoint=a.GetIntersectBetweenTwoSegment(t,[e,this.rect.bottomLeft],[{x:this.pageWidth,y:0},{x:this.pageWidth,y:this.pageHeight}]),this.bottomIntersectPoint=a.GetIntersectBetweenTwoSegment(t,[this.rect.bottomLeft,this.rect.bottomRight],[{x:0,y:this.pageHeight},{x:this.pageWidth,y:this.pageHeight}])):(this.topIntersectPoint=a.GetIntersectBetweenTwoSegment(t,[this.rect.topLeft,this.rect.topRight],[{x:0,y:0},{x:this.pageWidth,y:0}]),this.sideIntersectPoint=a.GetIntersectBetweenTwoSegment(t,[e,this.rect.topLeft],[{x:this.pageWidth,y:0},{x:this.pageWidth,y:this.pageHeight}]),this.bottomIntersectPoint=a.GetIntersectBetweenTwoSegment(t,[this.rect.bottomLeft,this.rect.bottomRight],[{x:0,y:this.pageHeight},{x:this.pageWidth,y:this.pageHeight}]))}checkPositionAtCenterLine(e,t,n){let r=e,i=a.LimitPointToCircle(t,this.pageWidth,r);r!==i&&(r=i,this.updateAngleAndGeometry(r));let o=Math.sqrt(this.pageWidth**2+this.pageHeight**2),s=this.rect.bottomRight,c=this.rect.topLeft;if(this.corner===`bottom`&&(s=this.rect.topRight,c=this.rect.bottomLeft),s.x<=0){let e=a.LimitPointToCircle(n,o,c);e!==r&&(r=e,this.updateAngleAndGeometry(r))}return r}getSegmentToShadowLine(){let e=this.getShadowStartPoint();return[e,e!==this.sideIntersectPoint&&this.sideIntersectPoint!==null?this.sideIntersectPoint:this.bottomIntersectPoint]}}class l{constructor(e,t){this.flippingPage=null,this.bottomPage=null,this.calc=null,this.state=`read`,this.render=e,this.app=t}fold(e){this.setState(`user_fold`),this.calc===null&&this.start(e),this.do(this.render.convertToPage(e))}flip(e){if(this.app.getSettings().disableFlipByClick&&!this.isPointOnCorners(e)||(this.calc!==null&&this.render.finishAnimation(),!this.start(e)))return;let t=this.getBoundsRect();this.setState(`flipping`);let n=t.height/10,r=this.calc.getCorner()===`bottom`?t.height-n:n,i=this.calc.getCorner()===`bottom`?t.height:0;this.calc.calc({x:t.pageWidth-n,y:r}),this.animateFlippingTo({x:t.pageWidth-n,y:r},{x:-t.pageWidth,y:i},!0)}start(e){this.reset();let t=this.render.convertToBook(e),n=this.getBoundsRect(),r=this.getDirectionByPoint(t),i=t.y>=n.height/2?`bottom`:`top`;if(!this.checkDirection(r))return!1;try{if(this.flippingPage=this.app.getPageCollection().getFlippingPage(r),this.bottomPage=this.app.getPageCollection().getBottomPage(r),this.render.getOrientation()===`landscape`)if(r===1){let e=this.app.getPageCollection().nextBy(this.flippingPage);e!==null&&this.flippingPage.getDensity()!==e.getDensity()&&(this.flippingPage.setDrawingDensity(`hard`),e.setDrawingDensity(`hard`))}else{let e=this.app.getPageCollection().prevBy(this.flippingPage);e!==null&&this.flippingPage.getDensity()!==e.getDensity()&&(this.flippingPage.setDrawingDensity(`hard`),e.setDrawingDensity(`hard`))}return this.render.setDirection(r),this.calc=new c(r,i,n.pageWidth.toString(10),n.height.toString(10)),!0}catch{return!1}}do(e){if(this.calc!==null&&this.calc.calc(e)){let e=this.calc.getFlippingProgress();this.bottomPage.setArea(this.calc.getBottomClipArea()),this.bottomPage.setPosition(this.calc.getBottomPagePosition()),this.bottomPage.setAngle(0),this.bottomPage.setHardAngle(0),this.flippingPage.setArea(this.calc.getFlippingClipArea()),this.flippingPage.setPosition(this.calc.getActiveCorner()),this.flippingPage.setAngle(this.calc.getAngle()),this.calc.getDirection()===0?this.flippingPage.setHardAngle(90*(200-2*e)/100):this.flippingPage.setHardAngle(-90*(200-2*e)/100),this.render.setPageRect(this.calc.getRect()),this.render.setBottomPage(this.bottomPage),this.render.setFlippingPage(this.flippingPage),this.render.setShadowData(this.calc.getShadowStartPoint(),this.calc.getShadowAngle(),e,this.calc.getDirection())}}flipToPage(e,t){let n=this.app.getPageCollection().getCurrentSpreadIndex(),r=this.app.getPageCollection().getSpreadIndexByPage(e);try{r>n&&(this.app.getPageCollection().setCurrentSpreadIndex(r-1),this.flipNext(t)),r<n&&(this.app.getPageCollection().setCurrentSpreadIndex(r+1),this.flipPrev(t))}catch{}}flipNext(e){this.flip({x:this.render.getRect().left+2*this.render.getRect().pageWidth-10,y:e===`top`?1:this.render.getRect().height-2})}flipPrev(e){this.flip({x:10,y:e===`top`?1:this.render.getRect().height-2})}stopMove(){if(this.calc===null)return;let e=this.calc.getPosition(),t=this.getBoundsRect(),n=this.calc.getCorner()===`bottom`?t.height:0;e.x<=0?this.animateFlippingTo(e,{x:-t.pageWidth,y:n},!0):this.animateFlippingTo(e,{x:t.pageWidth,y:n},!1)}showCorner(e){if(!this.checkState(`read`,`fold_corner`))return;let t=this.getBoundsRect(),n=t.pageWidth;if(this.isPointOnCorners(e))if(this.calc===null){if(!this.start(e))return;this.setState(`fold_corner`),this.calc.calc({x:n-1,y:1});let r=this.calc.getCorner()===`bottom`?t.height-1:1,i=this.calc.getCorner()===`bottom`?t.height-50:50;this.animateFlippingTo({x:n-1,y:r},{x:n-50,y:i},!1,!1)}else this.do(this.render.convertToPage(e));else this.setState(`read`),this.render.finishAnimation(),this.stopMove()}animateFlippingTo(e,t,n,r=!0){let i=a.GetCordsFromTwoPoint(e,t),o=[];for(let e of i)o.push(()=>this.do(e));let s=this.getAnimationDuration(i.length);this.render.startAnimation(o,s,()=>{this.calc&&(n&&(this.calc.getDirection()===1?this.app.turnToPrevPage():this.app.turnToNextPage()),r&&(this.render.setBottomPage(null),this.render.setFlippingPage(null),this.render.clearShadow(),this.setState(`read`),this.reset()))})}getCalculation(){return this.calc}getState(){return this.state}setState(e){this.state!==e&&(this.app.updateState(e),this.state=e)}getDirectionByPoint(e){let t=this.getBoundsRect();if(this.render.getOrientation()===`portrait`){if(e.x-t.pageWidth<=t.width/5)return 1}else if(e.x<t.width/2)return 1;return 0}getAnimationDuration(e){let t=this.app.getSettings().flippingTime;return e>=1e3?t:e/1e3*t}checkDirection(e){return e===0?this.app.getCurrentPageIndex()<this.app.getPageCount()-1:this.app.getCurrentPageIndex()>=1}reset(){this.calc=null,this.flippingPage=null,this.bottomPage=null}getBoundsRect(){return this.render.getRect()}checkState(...e){for(let t of e)if(this.state===t)return!0;return!1}isPointOnCorners(e){let t=this.getBoundsRect(),n=t.pageWidth,r=Math.sqrt(n**2+t.height**2)/5,i=this.render.convertToBook(e);return i.x>0&&i.y>0&&i.x<t.width&&i.y<t.height&&(i.x<r||i.x>t.width-r)&&(i.y<r||i.y>t.height-r)}}class u{constructor(e,t){this.leftPage=null,this.rightPage=null,this.flippingPage=null,this.bottomPage=null,this.direction=null,this.orientation=null,this.shadow=null,this.animation=null,this.pageRect=null,this.boundsRect=null,this.timer=0,this.safari=!1,this.setting=t,this.app=e;let n=RegExp(`Version\\/[\\d\\.]+.*Safari/`);this.safari=n.exec(window.navigator.userAgent)!==null}render(e){if(this.animation!==null){let t=Math.round((e-this.animation.startedAt)/this.animation.durationFrame);t<this.animation.frames.length?this.animation.frames[t]():(this.animation.onAnimateEnd(),this.animation=null)}this.timer=e,this.drawFrame()}start(){this.update();let e=t=>{this.render(t),requestAnimationFrame(e)};requestAnimationFrame(e)}startAnimation(e,t,n){this.finishAnimation(),this.animation={frames:e,duration:t,durationFrame:t/e.length,onAnimateEnd:n,startedAt:this.timer}}finishAnimation(){this.animation!==null&&(this.animation.frames[this.animation.frames.length-1](),this.animation.onAnimateEnd!==null&&this.animation.onAnimateEnd()),this.animation=null}update(){this.boundsRect=null;let e=this.calculateBoundsRect();this.orientation!==e&&(this.orientation=e,this.app.updateOrientation(e))}calculateBoundsRect(){let e=`landscape`,t=this.getBlockWidth(),n=t/2,r=this.getBlockHeight()/2,i=this.setting.width/this.setting.height,a=this.setting.width,o=this.setting.height,s=n-a;return this.setting.size===`stretch`?(t<2*this.setting.minWidth&&this.app.getSettings().usePortrait&&(e=`portrait`),a=e===`portrait`?this.getBlockWidth():this.getBlockWidth()/2,a>this.setting.maxWidth&&(a=this.setting.maxWidth),o=a/i,o>this.getBlockHeight()&&(o=this.getBlockHeight(),a=o*i),s=e===`portrait`?n-a/2-a:n-a):t<2*a&&this.app.getSettings().usePortrait&&(e=`portrait`,s=n-a/2-a),this.boundsRect={left:s,top:r-o/2,width:2*a,height:o,pageWidth:a},e}setShadowData(e,t,n,r){if(!this.app.getSettings().drawShadow)return;let i=100*this.getSettings().maxShadowOpacity;this.shadow={pos:e,angle:t,width:3*this.getRect().pageWidth/4*n/100,opacity:(100-n)*i/100/100,direction:r,progress:2*n}}clearShadow(){this.shadow=null}getBlockWidth(){return this.app.getUI().getDistElement().offsetWidth}getBlockHeight(){return this.app.getUI().getDistElement().offsetHeight}getDirection(){return this.direction}getRect(){return this.boundsRect===null&&this.calculateBoundsRect(),this.boundsRect}getSettings(){return this.app.getSettings()}getOrientation(){return this.orientation}setPageRect(e){this.pageRect=e}setDirection(e){this.direction=e}setRightPage(e){e!==null&&e.setOrientation(1),this.rightPage=e}setLeftPage(e){e!==null&&e.setOrientation(0),this.leftPage=e}setBottomPage(e){e!==null&&e.setOrientation(this.direction===1?0:1),this.bottomPage=e}setFlippingPage(e){e!==null&&e.setOrientation(this.direction===0&&this.orientation!==`portrait`?0:1),this.flippingPage=e}convertToBook(e){let t=this.getRect();return{x:e.x-t.left,y:e.y-t.top}}isSafari(){return this.safari}convertToPage(e,t){t||=this.direction;let n=this.getRect();return{x:t===0?e.x-n.left-n.width/2:n.width/2-e.x+n.left,y:e.y-n.top}}convertToGlobal(e,t){if(t||=this.direction,e==null)return null;let n=this.getRect();return{x:t===0?e.x+n.left+n.width/2:n.width/2-e.x+n.left,y:e.y+n.top}}convertRectToGlobal(e,t){return t||=this.direction,{topLeft:this.convertToGlobal(e.topLeft,t),topRight:this.convertToGlobal(e.topRight,t),bottomLeft:this.convertToGlobal(e.bottomLeft,t),bottomRight:this.convertToGlobal(e.bottomRight,t)}}}class d extends u{constructor(e,t,n){super(e,t),this.canvas=n,this.ctx=n.getContext(`2d`)}getContext(){return this.ctx}reload(){}drawFrame(){this.clear(),this.orientation!==`portrait`&&this.leftPage!=null&&this.leftPage.simpleDraw(0),this.rightPage!=null&&this.rightPage.simpleDraw(1),this.bottomPage!=null&&this.bottomPage.draw(),this.drawBookShadow(),this.flippingPage!=null&&this.flippingPage.draw(),this.shadow!=null&&(this.drawOuterShadow(),this.drawInnerShadow());let e=this.getRect();this.orientation===`portrait`&&(this.ctx.beginPath(),this.ctx.rect(e.left+e.pageWidth,e.top,e.width,e.height),this.ctx.clip())}drawBookShadow(){let e=this.getRect();this.ctx.save(),this.ctx.beginPath();let t=e.width/20;this.ctx.rect(e.left,e.top,e.width,e.height);let n={x:e.left+e.width/2-t/2,y:0};this.ctx.translate(n.x,n.y);let r=this.ctx.createLinearGradient(0,0,t,0);r.addColorStop(0,`rgba(0, 0, 0, 0)`),r.addColorStop(.4,`rgba(0, 0, 0, 0.2)`),r.addColorStop(.49,`rgba(0, 0, 0, 0.1)`),r.addColorStop(.5,`rgba(0, 0, 0, 0.5)`),r.addColorStop(.51,`rgba(0, 0, 0, 0.4)`),r.addColorStop(1,`rgba(0, 0, 0, 0)`),this.ctx.clip(),this.ctx.fillStyle=r,this.ctx.fillRect(0,0,t,2*e.height),this.ctx.restore()}drawOuterShadow(){let e=this.getRect();this.ctx.save(),this.ctx.beginPath(),this.ctx.rect(e.left,e.top,e.width,e.height);let t=this.convertToGlobal({x:this.shadow.pos.x,y:this.shadow.pos.y});this.ctx.translate(t.x,t.y),this.ctx.rotate(Math.PI+this.shadow.angle+Math.PI/2);let n=this.ctx.createLinearGradient(0,0,this.shadow.width,0);this.shadow.direction===0?(this.ctx.translate(0,-100),n.addColorStop(0,`rgba(0, 0, 0, `+this.shadow.opacity+`)`),n.addColorStop(1,`rgba(0, 0, 0, 0)`)):(this.ctx.translate(-this.shadow.width,-100),n.addColorStop(0,`rgba(0, 0, 0, 0)`),n.addColorStop(1,`rgba(0, 0, 0, `+this.shadow.opacity+`)`)),this.ctx.clip(),this.ctx.fillStyle=n,this.ctx.fillRect(0,0,this.shadow.width,2*e.height),this.ctx.restore()}drawInnerShadow(){let e=this.getRect();this.ctx.save(),this.ctx.beginPath();let t=this.convertToGlobal({x:this.shadow.pos.x,y:this.shadow.pos.y}),n=this.convertRectToGlobal(this.pageRect);this.ctx.moveTo(n.topLeft.x,n.topLeft.y),this.ctx.lineTo(n.topRight.x,n.topRight.y),this.ctx.lineTo(n.bottomRight.x,n.bottomRight.y),this.ctx.lineTo(n.bottomLeft.x,n.bottomLeft.y),this.ctx.translate(t.x,t.y),this.ctx.rotate(Math.PI+this.shadow.angle+Math.PI/2);let r=3*this.shadow.width/4,i=this.ctx.createLinearGradient(0,0,r,0);this.shadow.direction===0?(this.ctx.translate(-r,-100),i.addColorStop(1,`rgba(0, 0, 0, `+this.shadow.opacity+`)`),i.addColorStop(.9,`rgba(0, 0, 0, 0.05)`),i.addColorStop(.7,`rgba(0, 0, 0, `+this.shadow.opacity+`)`),i.addColorStop(0,`rgba(0, 0, 0, 0)`)):(this.ctx.translate(0,-100),i.addColorStop(0,`rgba(0, 0, 0, `+this.shadow.opacity+`)`),i.addColorStop(.1,`rgba(0, 0, 0, 0.05)`),i.addColorStop(.3,`rgba(0, 0, 0, `+this.shadow.opacity+`)`),i.addColorStop(1,`rgba(0, 0, 0, 0)`)),this.ctx.clip(),this.ctx.fillStyle=i,this.ctx.fillRect(0,0,r,2*e.height),this.ctx.restore()}clear(){this.ctx.fillStyle=`white`,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)}}class f{constructor(e,t,n){this.touchPoint=null,this.swipeTimeout=250,this.onResize=()=>{this.update()},this.onMouseDown=e=>{if(this.checkTarget(e.target)){let t=this.getMousePos(e.clientX,e.clientY);this.app.startUserTouch(t),e.preventDefault()}},this.onTouchStart=e=>{if(this.checkTarget(e.target)&&e.changedTouches.length>0){let t=e.changedTouches[0],n=this.getMousePos(t.clientX,t.clientY);this.touchPoint={point:n,time:Date.now()},setTimeout(()=>{this.touchPoint!==null&&this.app.startUserTouch(n)},this.swipeTimeout),this.app.getSettings().mobileScrollSupport||e.preventDefault()}},this.onMouseUp=e=>{let t=this.getMousePos(e.clientX,e.clientY);this.app.userStop(t)},this.onMouseMove=e=>{let t=this.getMousePos(e.clientX,e.clientY);this.app.userMove(t,!1)},this.onTouchMove=e=>{if(e.changedTouches.length>0){let t=e.changedTouches[0],n=this.getMousePos(t.clientX,t.clientY);this.app.getSettings().mobileScrollSupport?(this.touchPoint!==null&&(Math.abs(this.touchPoint.point.x-n.x)>10||this.app.getState()!==`read`)&&e.cancelable&&this.app.userMove(n,!0),this.app.getState()!==`read`&&e.preventDefault()):this.app.userMove(n,!0)}},this.onTouchEnd=e=>{if(e.changedTouches.length>0){let t=e.changedTouches[0],n=this.getMousePos(t.clientX,t.clientY),r=!1;if(this.touchPoint!==null){let e=n.x-this.touchPoint.point.x,t=Math.abs(n.y-this.touchPoint.point.y);Math.abs(e)>this.swipeDistance&&t<2*this.swipeDistance&&Date.now()-this.touchPoint.time<this.swipeTimeout&&(e>0?this.app.flipPrev(this.touchPoint.point.y<this.app.getRender().getRect().height/2?`top`:`bottom`):this.app.flipNext(this.touchPoint.point.y<this.app.getRender().getRect().height/2?`top`:`bottom`),r=!0),this.touchPoint=null}this.app.userStop(n,r)}},this.parentElement=e,e.classList.add(`stf__parent`),e.insertAdjacentHTML(`afterbegin`,`<div class="stf__wrapper"></div>`),this.wrapper=e.querySelector(`.stf__wrapper`),this.app=t;let r=this.app.getSettings().usePortrait?1:2;e.style.minWidth=n.minWidth*r+`px`,e.style.minHeight=n.minHeight+`px`,n.size===`fixed`&&(e.style.minWidth=n.width*r+`px`,e.style.minHeight=n.height+`px`),n.autoSize&&(e.style.width=`100%`,e.style.maxWidth=2*n.maxWidth+`px`),e.style.display=`block`,window.addEventListener(`resize`,this.onResize,!1),this.swipeDistance=n.swipeDistance}destroy(){this.app.getSettings().useMouseEvents&&this.removeHandlers(),this.distElement.remove(),this.wrapper.remove()}getDistElement(){return this.distElement}getWrapper(){return this.wrapper}setOrientationStyle(e){this.wrapper.classList.remove(`--portrait`,`--landscape`),e===`portrait`?(this.app.getSettings().autoSize&&(this.wrapper.style.paddingBottom=this.app.getSettings().height/this.app.getSettings().width*100+`%`),this.wrapper.classList.add(`--portrait`)):(this.app.getSettings().autoSize&&(this.wrapper.style.paddingBottom=this.app.getSettings().height/(2*this.app.getSettings().width)*100+`%`),this.wrapper.classList.add(`--landscape`)),this.update()}removeHandlers(){window.removeEventListener(`resize`,this.onResize),this.distElement.removeEventListener(`mousedown`,this.onMouseDown),this.distElement.removeEventListener(`touchstart`,this.onTouchStart),window.removeEventListener(`mousemove`,this.onMouseMove),window.removeEventListener(`touchmove`,this.onTouchMove),window.removeEventListener(`mouseup`,this.onMouseUp),window.removeEventListener(`touchend`,this.onTouchEnd)}setHandlers(){window.addEventListener(`resize`,this.onResize,!1),this.app.getSettings().useMouseEvents&&(this.distElement.addEventListener(`mousedown`,this.onMouseDown),this.distElement.addEventListener(`touchstart`,this.onTouchStart),window.addEventListener(`mousemove`,this.onMouseMove),window.addEventListener(`touchmove`,this.onTouchMove,{passive:!this.app.getSettings().mobileScrollSupport}),window.addEventListener(`mouseup`,this.onMouseUp),window.addEventListener(`touchend`,this.onTouchEnd))}getMousePos(e,t){let n=this.distElement.getBoundingClientRect();return{x:e-n.left,y:t-n.top}}checkTarget(e){return!this.app.getSettings().clickEventForward||![`a`,`button`].includes(e.tagName.toLowerCase())}}class p extends f{constructor(e,t,n,r){super(e,t,n),this.wrapper.insertAdjacentHTML(`afterbegin`,`<div class="stf__block"></div>`),this.distElement=e.querySelector(`.stf__block`),this.items=r;for(let e of r)this.distElement.appendChild(e);this.setHandlers()}clear(){for(let e of this.items)this.parentElement.appendChild(e)}updateItems(e){this.removeHandlers(),this.distElement.innerHTML=``;for(let t of e)this.distElement.appendChild(t);this.items=e,this.setHandlers()}update(){this.app.getRender().update()}}class m extends f{constructor(e,t,n){super(e,t,n),this.wrapper.innerHTML=`<canvas class="stf__canvas"></canvas>`,this.canvas=e.querySelectorAll(`canvas`)[0],this.distElement=this.canvas,this.resizeCanvas(),this.setHandlers()}resizeCanvas(){let e=getComputedStyle(this.canvas),t=parseInt(e.getPropertyValue(`width`),10),n=parseInt(e.getPropertyValue(`height`),10);this.canvas.width=t,this.canvas.height=n}getCanvas(){return this.canvas}update(){this.resizeCanvas(),this.app.getRender().update()}}class h extends u{constructor(e,t,n){super(e,t),this.outerShadow=null,this.innerShadow=null,this.hardShadow=null,this.hardInnerShadow=null,this.element=n,this.createShadows()}createShadows(){this.element.insertAdjacentHTML(`beforeend`,`<div class="stf__outerShadow"></div>
             <div class="stf__innerShadow"></div>
             <div class="stf__hardShadow"></div>
             <div class="stf__hardInnerShadow"></div>`),this.outerShadow=this.element.querySelector(`.stf__outerShadow`),this.innerShadow=this.element.querySelector(`.stf__innerShadow`),this.hardShadow=this.element.querySelector(`.stf__hardShadow`),this.hardInnerShadow=this.element.querySelector(`.stf__hardInnerShadow`)}clearShadow(){super.clearShadow(),this.outerShadow.style.cssText=`display: none`,this.innerShadow.style.cssText=`display: none`,this.hardShadow.style.cssText=`display: none`,this.hardInnerShadow.style.cssText=`display: none`}reload(){this.element.querySelector(`.stf__outerShadow`)||this.createShadows()}drawHardInnerShadow(){let e=this.getRect(),t=this.shadow.progress>100?200-this.shadow.progress:this.shadow.progress,n=(100-t)*(2.5*e.pageWidth)/100+20;n>e.pageWidth&&(n=e.pageWidth);let r=`\n            display: block;\n            z-index: ${(this.getSettings().startZIndex+5).toString(10)};\n            width: ${n}px;\n            height: ${e.height}px;\n            background: linear-gradient(to right,\n                rgba(0, 0, 0, ${this.shadow.opacity*t/100}) 5%,\n                rgba(0, 0, 0, 0) 100%);\n            left: ${e.left+e.width/2}px;\n            transform-origin: 0 0;\n        `;r+=this.getDirection()===0&&this.shadow.progress>100||this.getDirection()===1&&this.shadow.progress<=100?`transform: translate3d(0, 0, 0);`:`transform: translate3d(0, 0, 0) rotateY(180deg);`,this.hardInnerShadow.style.cssText=r}drawHardOuterShadow(){let e=this.getRect(),t=(100-(this.shadow.progress>100?200-this.shadow.progress:this.shadow.progress))*(2.5*e.pageWidth)/100+20;t>e.pageWidth&&(t=e.pageWidth);let n=`\n            display: block;\n            z-index: ${(this.getSettings().startZIndex+4).toString(10)};\n            width: ${t}px;\n            height: ${e.height}px;\n            background: linear-gradient(to left, rgba(0, 0, 0, ${this.shadow.opacity}) 5%, rgba(0, 0, 0, 0) 100%);\n            left: ${e.left+e.width/2}px;\n            transform-origin: 0 0;\n        `;n+=this.getDirection()===0&&this.shadow.progress>100||this.getDirection()===1&&this.shadow.progress<=100?`transform: translate3d(0, 0, 0) rotateY(180deg);`:`transform: translate3d(0, 0, 0);`,this.hardShadow.style.cssText=n}drawInnerShadow(){let e=this.getRect(),t=3*this.shadow.width/4,n=this.getDirection()===0?t:0,r=this.getDirection()===0?`to left`:`to right`,i=this.convertToGlobal(this.shadow.pos),o=this.shadow.angle+3*Math.PI/2,s=[this.pageRect.topLeft,this.pageRect.topRight,this.pageRect.bottomRight,this.pageRect.bottomLeft],c=`polygon( `;for(let e of s){let t=this.getDirection()===1?{x:-e.x+this.shadow.pos.x,y:e.y-this.shadow.pos.y}:{x:e.x-this.shadow.pos.x,y:e.y-this.shadow.pos.y};t=a.GetRotatedPoint(t,{x:n,y:100},o),c+=t.x+`px `+t.y+`px, `}c=c.slice(0,-2),c+=`)`;let l=`\n            display: block;\n            z-index: ${(this.getSettings().startZIndex+10).toString(10)};\n            width: ${t}px;\n            height: ${2*e.height}px;\n            background: linear-gradient(${r},\n                rgba(0, 0, 0, ${this.shadow.opacity}) 5%,\n                rgba(0, 0, 0, 0.05) 15%,\n                rgba(0, 0, 0, ${this.shadow.opacity}) 35%,\n                rgba(0, 0, 0, 0) 100%);\n            transform-origin: ${n}px 100px;\n            transform: translate3d(${i.x-n}px, ${i.y-100}px, 0) rotate(${o}rad);\n            clip-path: ${c};\n            -webkit-clip-path: ${c};\n        `;this.innerShadow.style.cssText=l}drawOuterShadow(){let e=this.getRect(),t=this.convertToGlobal({x:this.shadow.pos.x,y:this.shadow.pos.y}),n=this.shadow.angle+3*Math.PI/2,r=this.getDirection()===1?this.shadow.width:0,i=this.getDirection()===0?`to right`:`to left`,o=[{x:0,y:0},{x:e.pageWidth,y:0},{x:e.pageWidth,y:e.height},{x:0,y:e.height}],s=`polygon( `;for(let e of o)if(e!==null){let t=this.getDirection()===1?{x:-e.x+this.shadow.pos.x,y:e.y-this.shadow.pos.y}:{x:e.x-this.shadow.pos.x,y:e.y-this.shadow.pos.y};t=a.GetRotatedPoint(t,{x:r,y:100},n),s+=t.x+`px `+t.y+`px, `}s=s.slice(0,-2),s+=`)`;let c=`\n            display: block;\n            z-index: ${(this.getSettings().startZIndex+10).toString(10)};\n            width: ${this.shadow.width}px;\n            height: ${2*e.height}px;\n            background: linear-gradient(${i}, rgba(0, 0, 0, ${this.shadow.opacity}), rgba(0, 0, 0, 0));\n            transform-origin: ${r}px 100px;\n            transform: translate3d(${t.x-r}px, ${t.y-100}px, 0) rotate(${n}rad);\n            clip-path: ${s};\n            -webkit-clip-path: ${s};\n        `;this.outerShadow.style.cssText=c}drawLeftPage(){this.orientation!==`portrait`&&this.leftPage!==null&&(this.direction===1&&this.flippingPage!==null&&this.flippingPage.getDrawingDensity()===`hard`?(this.leftPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10),this.leftPage.setHardDrawingAngle(180+this.flippingPage.getHardAngle()),this.leftPage.draw(this.flippingPage.getDrawingDensity())):this.leftPage.simpleDraw(0))}drawRightPage(){this.rightPage!==null&&(this.direction===0&&this.flippingPage!==null&&this.flippingPage.getDrawingDensity()===`hard`?(this.rightPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10),this.rightPage.setHardDrawingAngle(180+this.flippingPage.getHardAngle()),this.rightPage.draw(this.flippingPage.getDrawingDensity())):this.rightPage.simpleDraw(1))}drawBottomPage(){if(this.bottomPage===null)return;let e=this.flippingPage==null?null:this.flippingPage.getDrawingDensity();this.orientation===`portrait`&&this.direction===1||(this.bottomPage.getElement().style.zIndex=(this.getSettings().startZIndex+3).toString(10),this.bottomPage.draw(e))}drawFrame(){this.clear(),this.drawLeftPage(),this.drawRightPage(),this.drawBottomPage(),this.flippingPage!=null&&(this.flippingPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10),this.flippingPage.draw()),this.shadow!=null&&this.flippingPage!==null&&(this.flippingPage.getDrawingDensity()===`soft`?(this.drawOuterShadow(),this.drawInnerShadow()):(this.drawHardOuterShadow(),this.drawHardInnerShadow()))}clear(){for(let e of this.app.getPageCollection().getPages())e!==this.leftPage&&e!==this.rightPage&&e!==this.flippingPage&&e!==this.bottomPage&&(e.getElement().style.cssText=`display: none`),e.getTemporaryCopy()!==this.flippingPage&&e.hideTemporaryCopy()}update(){super.update(),this.rightPage!==null&&this.rightPage.setOrientation(1),this.leftPage!==null&&this.leftPage.setOrientation(0)}}class g{constructor(){this._default={startPage:0,size:`fixed`,width:0,height:0,minWidth:0,maxWidth:0,minHeight:0,maxHeight:0,drawShadow:!0,flippingTime:1e3,usePortrait:!0,startZIndex:0,autoSize:!0,maxShadowOpacity:1,showCover:!1,mobileScrollSupport:!0,swipeDistance:30,clickEventForward:!0,useMouseEvents:!0,showPageCorners:!0,disableFlipByClick:!1}}getSettings(e){let t=this._default;if(Object.assign(t,e),t.size!==`stretch`&&t.size!==`fixed`)throw Error(`Invalid size type. Available only "fixed" and "stretch" value`);if(t.width<=0||t.height<=0)throw Error(`Invalid width or height`);if(t.flippingTime<=0)throw Error(`Invalid flipping time`);return t.size===`stretch`?(t.minWidth<=0&&(t.minWidth=100),t.maxWidth<t.minWidth&&(t.maxWidth=2e3),t.minHeight<=0&&(t.minHeight=100),t.maxHeight<t.minHeight&&(t.maxHeight=2e3)):(t.minWidth=t.width,t.maxWidth=t.width,t.minHeight=t.height,t.maxHeight=t.height),t}}(function(e,t){t===void 0&&(t={});var n=t.insertAt;if(e&&typeof document<`u`){var r=document.head||document.getElementsByTagName(`head`)[0],i=document.createElement(`style`);i.type=`text/css`,n===`top`&&r.firstChild?r.insertBefore(i,r.firstChild):r.appendChild(i),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(document.createTextNode(e))}})(`.stf__parent {
  position: relative;
  display: block;
  box-sizing: border-box;
  transform: translateZ(0);

  -ms-touch-action: pan-y;
  touch-action: pan-y;
}

.sft__wrapper {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.stf__parent canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

.stf__block {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  perspective: 2000px;
}

.stf__item {
  display: none;
  position: absolute;
  transform-style: preserve-3d;
}

.stf__outerShadow {
  position: absolute;
  left: 0;
  top: 0;
}

.stf__innerShadow {
  position: absolute;
  left: 0;
  top: 0;
}

.stf__hardShadow {
  position: absolute;
  left: 0;
  top: 0;
}

.stf__hardInnerShadow {
  position: absolute;
  left: 0;
  top: 0;
}`),e.PageFlip=class extends class{constructor(){this.events=new Map}on(e,t){return this.events.has(e)?this.events.get(e).push(t):this.events.set(e,[t]),this}off(e){this.events.delete(e)}trigger(e,t,n=null){if(this.events.has(e))for(let r of this.events.get(e))r({data:n,object:t})}}{constructor(e,t){super(),this.isUserTouch=!1,this.isUserMove=!1,this.setting=null,this.pages=null,this.setting=new g().getSettings(t),this.block=e}destroy(){this.ui.destroy(),this.block.remove()}update(){this.render.update(),this.pages.show()}loadFromImages(e){this.ui=new m(this.block,this,this.setting);let t=this.ui.getCanvas();this.render=new d(this,this.setting,t),this.flipController=new l(this.render,this),this.pages=new i(this,this.render,e),this.pages.load(),this.render.start(),this.pages.show(this.setting.startPage),setTimeout(()=>{this.ui.update(),this.trigger(`init`,this,{page:this.setting.startPage,mode:this.render.getOrientation()})},1)}loadFromHTML(e){this.ui=new p(this.block,this,this.setting,e),this.render=new h(this,this.setting,this.ui.getDistElement()),this.flipController=new l(this.render,this),this.pages=new s(this,this.render,this.ui.getDistElement(),e),this.pages.load(),this.render.start(),this.pages.show(this.setting.startPage),setTimeout(()=>{this.ui.update(),this.trigger(`init`,this,{page:this.setting.startPage,mode:this.render.getOrientation()})},1)}updateFromImages(e){let t=this.pages.getCurrentPageIndex();this.pages.destroy(),this.pages=new i(this,this.render,e),this.pages.load(),this.pages.show(t),this.trigger(`update`,this,{page:t,mode:this.render.getOrientation()})}updateFromHtml(e){let t=this.pages.getCurrentPageIndex();this.pages.destroy(),this.pages=new s(this,this.render,this.ui.getDistElement(),e),this.pages.load(),this.ui.updateItems(e),this.render.reload(),this.pages.show(t),this.trigger(`update`,this,{page:t,mode:this.render.getOrientation()})}clear(){this.pages.destroy(),this.ui.clear()}turnToPrevPage(){this.pages.showPrev()}turnToNextPage(){this.pages.showNext()}turnToPage(e){this.pages.show(e)}flipNext(e=`top`){this.flipController.flipNext(e)}flipPrev(e=`top`){this.flipController.flipPrev(e)}flip(e,t=`top`){this.flipController.flipToPage(e,t)}updateState(e){this.trigger(`changeState`,this,e)}updatePageIndex(e){this.trigger(`flip`,this,e)}updateOrientation(e){this.ui.setOrientationStyle(e),this.update(),this.trigger(`changeOrientation`,this,e)}getPageCount(){return this.pages.getPageCount()}getCurrentPageIndex(){return this.pages.getCurrentPageIndex()}getPage(e){return this.pages.getPage(e)}getRender(){return this.render}getFlipController(){return this.flipController}getOrientation(){return this.render.getOrientation()}getBoundsRect(){return this.render.getRect()}getSettings(){return this.setting}getUI(){return this.ui}getState(){return this.flipController.getState()}getPageCollection(){return this.pages}startUserTouch(e){this.mousePosition=e,this.isUserTouch=!0,this.isUserMove=!1}userMove(e,t){this.isUserTouch||t||!this.setting.showPageCorners?this.isUserTouch&&a.GetDistanceBetweenTwoPoint(this.mousePosition,e)>5&&(this.isUserMove=!0,this.flipController.fold(e)):this.flipController.showCorner(e)}userStop(e,t=!1){this.isUserTouch&&(this.isUserTouch=!1,t||(this.isUserMove?this.flipController.stopMove():this.flipController.flip(e)))}},Object.defineProperty(e,`__esModule`,{value:!0})}))})),u=e(i()),d=l(),f=u.forwardRef((e,t)=>{let n=(0,u.useRef)(null),r=(0,u.useRef)([]),i=(0,u.useRef)(),[a,o]=(0,u.useState)([]);(0,u.useImperativeHandle)(t,()=>({pageFlip:()=>i.current}));let s=(0,u.useCallback)(()=>{i.current&&i.current.clear()},[]),c=(0,u.useCallback)(()=>{let e=i.current;e&&(e.off(`flip`),e.off(`changeOrientation`),e.off(`changeState`),e.off(`init`),e.off(`update`))},[]);return(0,u.useEffect)(()=>{if(r.current=[],e.children){let t=u.Children.map(e.children,e=>u.cloneElement(e,{ref:e=>{e&&r.current.push(e)}}));(!e.renderOnlyPageLengthChange||a.length!==t.length)&&(t.length<a.length&&s(),o(t))}},[e.children]),(0,u.useEffect)(()=>{a.length>0&&r.current.length>0&&(c(),n.current&&!i.current&&(i.current=new d.PageFlip(n.current,e)),i.current.getFlipController()?i.current.updateFromHtml(r.current):i.current.loadFromHTML(r.current),(()=>{let t=i.current;t&&(e.onFlip&&t.on(`flip`,t=>e.onFlip(t)),e.onChangeOrientation&&t.on(`changeOrientation`,t=>e.onChangeOrientation(t)),e.onChangeState&&t.on(`changeState`,t=>e.onChangeState(t)),e.onInit&&t.on(`init`,t=>e.onInit(t)),e.onUpdate&&t.on(`update`,t=>e.onUpdate(t)))})())},[a]),u.createElement(`div`,{ref:n,className:e.className,style:e.style},a)}),p=u.memo(f);function m(e,t,n,r){if(n||!e)return;t(!0),e.classList.add(r),setTimeout(()=>e.classList.remove(r),200);let i=setInterval(()=>{e.classList.add(r),setTimeout(()=>e.classList.remove(r),200)},600);setTimeout(()=>{clearInterval(i),t(!1)},1200)}var h=r();function g({title:e,accent:t=`#e68ab6`,defaultOpen:n=!0,titleSize:r=`clamp(1.5rem, 5vw, 2.2rem)`,children:i}){let[a,o]=(0,u.useState)(n),s=(0,u.useId)();return(0,h.jsxs)(`div`,{style:{maxWidth:`1100px`,margin:`0 auto`,padding:`1.5rem 0.75rem 0`},children:[(0,h.jsx)(`style`,{children:`
        .cl-bar { transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease; }
        .cl-bar:hover { transform: translateY(-1px); box-shadow: 0 10px 26px rgba(0,0,0,0.12); }
        .cl-bar:active { transform: translateY(0); }
        .cl-chev { transition: transform 0.25s ease; }
        .cl-body { animation: clFade 0.25s ease; }
        @keyframes clFade { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
      `}),(0,h.jsxs)(`button`,{type:`button`,className:`cl-bar`,onClick:()=>o(e=>!e),"aria-expanded":a,"aria-controls":s,style:{width:`100%`,display:`flex`,alignItems:`center`,justifyContent:`space-between`,gap:`1rem`,padding:`0.7rem 0.9rem 0.7rem 1.4rem`,background:`#fff`,border:`1.5px solid ${t}40`,borderRadius:`999px`,boxShadow:`0 4px 14px rgba(0,0,0,0.07)`,cursor:`pointer`},children:[(0,h.jsx)(`span`,{style:{fontFamily:`"Dancing Script", cursive`,color:t,fontSize:r,lineHeight:1.1},children:e}),(0,h.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`0.5rem`},children:[(0,h.jsx)(`span`,{style:{color:t,opacity:.75,fontSize:`0.72rem`,fontWeight:600,whiteSpace:`nowrap`},children:a?`閉じる`:`開く`}),(0,h.jsx)(`span`,{className:`cl-chev`,style:{display:`flex`,alignItems:`center`,justifyContent:`center`,width:`2.1rem`,height:`2.1rem`,borderRadius:`50%`,background:t,color:`#fff`,fontSize:`1rem`,lineHeight:1,flexShrink:0,transform:a?`rotate(180deg)`:`none`},children:`▾`})]})]}),a&&(0,h.jsx)(`div`,{id:s,className:`cl-body`,style:{marginTop:`1rem`},children:i})]})}var _=`/Event_Countdown_App/`;function v(){o({particleCount:300,angle:60,spread:100,origin:{x:0,y:.5},colors:[`#ff69b4`,`#ffd700`,`#87cefa`]}),o({particleCount:300,angle:120,spread:100,origin:{x:1,y:.5},colors:[`#ff69b4`,`#ffd700`,`#87cefa`]}),o({particleCount:600,angle:90,spread:200,startVelocity:50,origin:{x:.5,y:0},colors:[`#ff69b4`,`#ffffff`,`#ffd700`]})}function y(e){let[t,n]=(0,u.useState)({days:0,hours:0,minutes:0,seconds:0,isToday:!1}),[r,i]=(0,u.useState)(!1);return(0,u.useEffect)(()=>{let t=setInterval(()=>{let t=new Date,a=new Date(e);if(t.getFullYear()===a.getFullYear()&&t.getMonth()===a.getMonth()&&t.getDate()===a.getDate()){n({days:0,hours:0,minutes:0,seconds:0,isToday:!0}),r||(v(),i(!0));return}let o=a.getTime()-t.getTime();if(o>0){let e=Math.floor(o/1e3);n({days:Math.floor(e/86400),hours:Math.floor(e%86400/3600),minutes:Math.floor(e%3600/60),seconds:e%60,isToday:!1})}},1e3);return()=>clearInterval(t)},[r,e]),t}function b({event:e}){let t=a(),{user:r}=n(),{days:i,hours:o,minutes:l,seconds:d,isToday:f}=y(e.date),[v,b]=(0,u.useState)(!1),[x,S]=(0,u.useState)(!1),C=(0,u.useRef)(null),w=(0,u.useRef)(null),[T,E]=(0,u.useState)(()=>window.innerWidth),[D,O]=(0,u.useState)(!1),k=f||D,A=e.customData??{},j=new Date(e.date).getFullYear(),M=A.name??e.title,N=A.coupleName??e.title,P=typeof A.birthYear==`number`?j-A.birthYear:null,F=A.bookImages??[],I=A.trip,L=!!(I&&(I.title||I.dates||I.message)),R=I?.heading??`思い出`,z=A.footerMessage??``;(0,u.useEffect)(()=>{let e=document.getElementById(`root`);if(!e)return;let t=e.style.maxWidth;return e.style.maxWidth=`100%`,()=>{e.style.maxWidth=t}},[]),(0,u.useEffect)(()=>{let e=()=>E(window.innerWidth);return window.addEventListener(`resize`,e),()=>window.removeEventListener(`resize`,e)},[]);let B=T<768,V=B?Math.min(T-80,250):400,H=Math.round(V*1.4);return(0,h.jsxs)(`div`,{className:`b26-body`,children:[(0,h.jsx)(`style`,{children:`
    html { font-size: clamp(2px, 1.25vw, 16px); }
    .b26-body { background-color: #fff0f5; font-family: sans-serif; margin: 0; overflow-x: hidden; }

    /* === Header === */
    .b26-header {
      height: 5rem; width: 100%;
      background-color: rgba(207,220,231,0.4);
      position: fixed; top: 0; z-index: 10;
    }
    .b26-back-btn {
      font-size: 1.5rem; padding: 0.5rem 1rem;
      background: none; border: none; color: #e68ab6; cursor: pointer;
      float: left; margin-left: 0.5rem;
    }
    .b26-edit-btn {
      font-size: 1.6rem; font-family: 'Dancing Script', sans-serif;
      float: left; margin: 0.7rem 0 0 0.5rem;
      padding: 0.55rem 1.3rem;
      background-color: rgba(229,166,220,0.55); color: #fff;
      border-radius: 0.9rem; box-shadow: 0 0.3rem #cbcbcb;
      border: none; cursor: pointer;
    }
    .b26-edit-btn:active { position: relative; top: 0.3rem; box-shadow: none; }
    .b26-edit-btn:hover { background-color: rgba(229,166,220,0.78); }
    .b26-header-left { float: left; margin: 0 1.5rem; }
    #b26-cake {
      font-size: 4rem; color: #e2a8c4; margin: 0.7rem 0;
      transition: transform 0.2s ease, color 0.2s ease; cursor: pointer;
    }
    #b26-cake.bigcake { color: rgb(252,127,167); transform: scale(1.1); }
    .b26-header nav { float: left; }
    .b26-header-btn {
      font-size: 2rem; font-family: 'Dancing Script', sans-serif;
      float: left; margin: 0.7rem 1.5rem; padding: 0.7rem 2rem;
      background-color: rgba(229,166,220,0.7); color: #fff;
      border-radius: 1rem; box-shadow: 0 0.3rem #cbcbcb;
      border: none; cursor: pointer; text-decoration: none;
      display: inline-block;
    }
    .b26-header-btn:active { position: relative; top: 0.3rem; box-shadow: none; }
    .b26-header-btn:hover { background-color: rgba(229,166,220,0.85); }
    .b26-header-right {
      float: left; transition: all 0.5s;
      margin-top: 1rem; margin-right: 2rem;
    }
    .b26-header-right a {
      color: #e68ab6; font-size: 2rem; font-weight: bold;
      opacity: 0.8; text-decoration: none;
    }

    /* 中間幅では右端の名前リンクがヘッダ内に収まらず折り返すため非表示 */
    @media (max-width: 1100px) {
      .b26-header-right { display: none; }
    }

    /* === Main === */
    .b26-main {
      height: auto; min-height: calc(100vh - 5rem); width: 100%; margin-top: 5rem;
      background-image: url("${_}images/background_main.webp");
      background-size: cover; background-position: center 15%;
      background-repeat: no-repeat;
      text-align: center;
      display: flex; flex-direction: column; justify-content: center;
    }
    #b26-first {
      font-size: 8rem; font-family: 'Dancing Script', sans-serif;
      letter-spacing: 0.8rem; color: rgb(241,230,238); opacity: 0.9;
      padding: 3rem 0 8rem 0; margin: 0;
    }
    #b26-countdown {
      padding: 3rem 0; font-size: 6rem;
      font-family: 'Dancing Script', sans-serif; font-weight: bold;
      background-color: rgba(255,255,255,0.3);
      color: rgb(200,247,255); opacity: 0.9; letter-spacing: 0.1rem;
    }
    .b26-cdtime { font-family: sans-serif; font-size: 4rem; }
    .b26-birthday-script { font-size: 8rem; font-weight: 1000; color: rgb(200,247,255); }
    .b26-birthday-num { font-family: 'HappyBirthday'; font-size: 12rem; font-weight: 100; color: rgb(200,247,255); }

    /* === Book === */
    .b26-book-section {
      width: 100%; height: 60rem;
      background-color: #f9f0d7; text-align: center;
    }
    .book { margin: 0 auto; }
    .b26-booksection-title {
      font-family: 'Dancing Script', cursive;
      color: rgba(230,138,182,0.8);
      font-size: 5rem;
      padding-top: 8rem; padding-bottom: 3rem; margin: 0;
    }

    /* === Memories === */
    .b26-memories {
      padding: 5rem 0 8rem 0; height: auto;
      text-align: center; width: 85%; margin: 0 auto;
    }
    .b26-memory-title {
      font-family: 'Dancing Script', cursive;
      color: rgba(230,138,182,0.8);
      font-size: 5rem;
      padding-top: 8rem; padding-bottom: 3rem; margin: 0;
    }
    .b26-galleries {
      background: linear-gradient(90deg, #b39855 0%, #fff9e6 50%, #b39855 100%);
      border: 0.7rem solid #c9c9c9;
      padding: 1rem 1rem 3rem 1rem;
      margin-bottom: 8rem;
    }
    .b26-gallery-title {
      font-size: 3rem; font-family: 'Kaushan Script', cursive;
      color: rgb(167,167,167);
    }
    .b26-pic-gallery {
      display: flex; overflow-x: auto;
      scroll-snap-type: x mandatory; gap: 1rem; padding: 2rem;
    }
    .b26-pic-gallery img {
      height: 20rem; border: 0.25rem solid rgb(128,128,128);
      border-radius: 1rem; scroll-snap-align: start;
      object-fit: cover; flex-shrink: 0;
    }

    /* === Trip === */
    #b26-trip {
      height: 50rem; margin: 0;
      background-image: url("${_}images/Trip.webp");
      background-size: cover; background-position: center;
      background-repeat: no-repeat;
    }
    .b26-trip-title {
      text-align: center; font-family: 'Dancing Script', cursive;
      font-size: 4.5rem; color: rgb(224,143,81);
      padding-top: 6rem; margin: 0;
    }
    .b26-trip-message {
      text-align: center; font-style: italic;
      font-family: 'Dancing Script', cursive;
      margin: 0 8rem; padding: 2rem; line-height: 1.8;
      color: rgb(255,255,255); font-size: 5rem;
      animation: b26blink 2s infinite;
    }
    @keyframes b26blink { 0%,100%{opacity:1} 50%{opacity:0.4} }

    /* === New memories (Storage) === */
    .b26-new-memories {
      padding: 5rem 0 8rem 0; text-align: center;
      width: 85%; margin: 0 auto;
    }
    .b26-new-gallery {
      display: flex; overflow-x: auto;
      scroll-snap-type: x mandatory; gap: 1rem; padding: 2rem;
    }
    .b26-new-gallery img {
      height: 20rem; border-radius: 1rem;
      scroll-snap-align: start;
      object-fit: cover; flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      cursor: zoom-in;
      transition: transform 0.2s ease;
    }
    .b26-new-gallery img:hover { transform: scale(1.02); }

    .b26-lightbox {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.85); display: flex;
      align-items: center; justify-content: center;
      padding: 1rem;
    }
    .b26-lightbox-inner {
      position: relative; max-width: 95%; max-height: 95%;
      width: 100%; display: flex; align-items: center; justify-content: center;
    }
    .b26-lightbox-inner img {
      max-width: 100%; max-height: 100%; border-radius: 1rem;
      box-shadow: 0 0 40px rgba(0,0,0,0.4);
    }
    .b26-lightbox-close {
      position: absolute; top: 0.75rem; right: 0.75rem;
      z-index: 1; border: none; background: rgba(255,255,255,0.95);
      color: #333; font-size: 2rem; width: 3rem; height: 3rem;
      border-radius: 50%; cursor: pointer; line-height: 1; padding: 0;
    }
    .b26-lightbox-close:hover { background: rgba(255,255,255,1); }

    /* === Footer === */
    .b26-footer { height: 12rem; padding-top: 3rem; }
    .b26-footer-left {
      font-size: 5rem; color: rgb(249,119,156);
      margin-left: 5rem; float: left;
    }
    #b26-heart { transition: transform 0.2s ease, color 0.2s ease; cursor: pointer; }
    #b26-heart.bigheart { color: rgb(246,73,128); transform: scale(1.1); }
    .b26-footer-right {
      font-size: 2.5rem; padding-top: 2rem; padding-left: 5rem;
      float: left; color: rgb(254,139,181);
    }
    .b26-footer-end {
      font-size: 2rem; font-family: 'Dancing Script', cursive;
      margin-top: 7rem; margin-right: 3rem; float: right;
    }

    /* ========== Mobile (<= 767px) ========== */
    @media (max-width: 767px) {
      html { font-size: 13px; }

      /* Header: 1行に収まるようサイズダウン、右リンクは非表示 */
      .b26-header {
        height: auto; min-height: 3.5rem;
        padding: 0.3rem 0.2rem;
        display: flex; flex-wrap: wrap; align-items: center;
      }
      .b26-header-left, .b26-header nav, .b26-header-right { float: none; }
      .b26-header-left { margin: 0 0.4rem; }
      .b26-back-btn { float: none; font-size: 1.2rem; padding: 0.3rem 0.5rem; margin: 0; }
      .b26-edit-btn { float: none; font-size: 1rem; padding: 0.3rem 0.7rem; margin: 0.2rem 0.25rem; box-shadow: 0 0.15rem #cbcbcb; }
      .b26-header-btn {
        float: none; font-size: 1rem; padding: 0.35rem 0.8rem;
        margin: 0.2rem 0.25rem; border-radius: 0.6rem;
        box-shadow: 0 0.15rem #cbcbcb;
      }
      #b26-cake { font-size: 1.8rem; margin: 0.2rem 0.3rem; }
      .b26-header-right { display: none; }

      /* Main: タイトルとカウントダウンを画面に収める */
      .b26-main { margin-top: 5rem; min-height: 50vh; padding: 0 0.5rem; }
      #b26-first {
        font-size: 3.5rem; letter-spacing: 0.15rem;
        padding: 1.5rem 0 2.5rem 0;
      }
      #b26-countdown {
        font-size: 2.3rem; padding: 1.5rem 0.6rem;
        border-radius: 0.5rem; letter-spacing: 0;
      }
      .b26-cdtime { font-size: 1.8rem; }
      .b26-birthday-script { font-size: 3rem; }
      .b26-birthday-num { font-size: 5rem; }

      /* Book: 動的サイズに合わせて高さauto */
      .b26-book-section {
        height: auto; padding: 2.5rem 0 3rem;
      }
      .b26-booksection-title {
        font-size: 2.8rem;
        padding-top: 0; padding-bottom: 2rem;
      }

      /* Memories */
      .b26-memories, .b26-new-memories {
        width: 95%; padding: 2.5rem 0 4rem;
      }
      .b26-memory-title {
        font-size: 2.8rem;
        padding-top: 2rem; padding-bottom: 2rem;
      }
      .b26-galleries {
        padding: 0.5rem 0.4rem 1.2rem;
        margin-bottom: 3rem; border-width: 0.25rem;
      }
      .b26-gallery-title { font-size: 1.6rem; }
      .b26-pic-gallery { padding: 1rem 0.5rem; gap: 0.5rem; }
      .b26-pic-gallery img { height: 10rem; border-width: 0.15rem; border-radius: 0.5rem; }
      .b26-new-gallery { padding: 1rem 0.5rem; gap: 0.5rem; }
      .b26-new-gallery img { height: 11rem; }

      /* Trip */
      #b26-trip {
        height: auto; min-height: 22rem;
        padding: 3rem 0; display: flex;
        flex-direction: column; justify-content: center;
      }
      .b26-trip-title { font-size: 2.5rem; padding-top: 0; }
      .b26-trip-message {
        font-size: 2rem; margin: 0 1rem;
        padding: 1rem; line-height: 1.5;
      }

      /* Footer: floatを解除してflex */
      .b26-footer {
        height: auto; padding: 1.2rem 1rem;
        display: flex; flex-wrap: wrap;
        align-items: center; gap: 0.8rem;
      }
      .b26-footer-left {
        font-size: 2.2rem; margin-left: 0;
        float: none; line-height: 1;
      }
      .b26-footer-right {
        font-size: 1.1rem; padding: 0;
        float: none; flex: 1; min-width: 8rem;
      }
      .b26-footer-end {
        font-size: 1rem; margin: 0;
        float: none; margin-left: auto;
      }
    }
  `}),(0,h.jsxs)(`header`,{className:`b26-header`,children:[(0,h.jsx)(`button`,{className:`b26-back-btn`,onClick:()=>t(`/`),children:`←`}),r.state===`admin`&&(0,h.jsx)(`button`,{className:`b26-edit-btn`,onClick:()=>t(`/events/${e.id}/edit`),children:`Edit`}),(0,h.jsx)(`div`,{className:`b26-header-left`,children:(0,h.jsx)(`i`,{ref:C,id:`b26-cake`,className:`fa-solid fa-cake-candles`,onClick:()=>m(C.current,b,v,`bigcake`)})}),(0,h.jsxs)(`nav`,{children:[(0,h.jsx)(`a`,{href:`#b26-countdown`,className:`b26-header-btn`,onClick:e=>{e.preventDefault(),document.getElementById(`b26-countdown`)?.scrollIntoView({behavior:`smooth`})},children:`Countdown`}),L&&(0,h.jsx)(`a`,{href:`#b26-trip`,className:`b26-header-btn`,onClick:e=>{e.preventDefault(),document.getElementById(`b26-trip`)?.scrollIntoView({behavior:`smooth`})},children:`Date`})]}),(0,h.jsx)(`div`,{className:`b26-header-right`,children:(0,h.jsxs)(`a`,{href:`#b26-first`,onClick:e=>{e.preventDefault(),document.getElementById(`b26-first`)?.scrollIntoView({behavior:`smooth`})},children:[M,`'s Birthday`]})})]}),(0,h.jsxs)(`div`,{className:`b26-main`,children:[(0,h.jsx)(`h1`,{id:`b26-first`,children:N}),(0,h.jsx)(`div`,{id:`b26-countdown`,children:k?(0,h.jsxs)(h.Fragment,{children:[`🎉 `,(0,h.jsx)(`span`,{className:`b26-birthday-script`,children:`Happy Birthday`}),` 🎉`,(0,h.jsx)(`br`,{}),(0,h.jsxs)(`span`,{className:`b26-birthday-script`,children:[`　`,M]}),P!==null&&(0,h.jsx)(`span`,{className:`b26-birthday-num`,children:P})]}):(0,h.jsxs)(h.Fragment,{children:[`Countdown to Birthday:`,(0,h.jsx)(`br`,{}),(0,h.jsxs)(`span`,{className:`b26-cdtime`,children:[i,` days `,String(o).padStart(2,`0`),`:`,String(l).padStart(2,`0`),`:`,String(d).padStart(2,`0`)]})]})})]}),F.length>0&&(0,h.jsx)(g,{title:`Book`,accent:`rgba(230,138,182,0.9)`,defaultOpen:!0,children:(0,h.jsx)(`div`,{className:`b26-book-section`,style:{height:`auto`,paddingBottom:`3rem`},children:(0,h.jsx)(p,{width:V,height:H,size:`fixed`,minWidth:150,maxWidth:1e3,minHeight:200,maxHeight:1536,maxShadowOpacity:B?.3:.5,showCover:!1,mobileScrollSupport:!0,startPage:0,drawShadow:!0,flippingTime:B?600:1e3,usePortrait:B,startZIndex:0,autoSize:!1,clickEventForward:!0,useMouseEvents:!0,showPageCorners:!0,disableFlipByClick:!1,style:{},className:`book`,children:F.map((e,t)=>(0,h.jsx)(`div`,{className:`page`,children:(0,h.jsx)(`img`,{src:e,width:V,height:H,alt:``,loading:t===0?`eager`:`lazy`,decoding:`async`})},t))})})}),L&&(0,h.jsx)(g,{title:R,accent:`rgb(224,143,81)`,defaultOpen:!1,children:(0,h.jsxs)(`div`,{id:`b26-trip`,children:[(0,h.jsxs)(`h2`,{className:`b26-trip-title`,children:[I?.title,I?.dates&&(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(`br`,{}),I.dates]})]}),I?.message&&(0,h.jsx)(`div`,{className:`b26-trip-message`,children:(0,h.jsx)(`p`,{children:I.message})})]})}),(0,h.jsx)(`div`,{style:{padding:`3rem 0`},children:(0,h.jsx)(c,{event:e,accent:`#e68ab6`,title:`Memories`})}),(0,h.jsx)(s,{event:e,accent:`#e68ab6`}),(0,h.jsxs)(`footer`,{className:`b26-footer`,children:[(0,h.jsx)(`div`,{className:`b26-footer-left`,children:(0,h.jsx)(`i`,{ref:w,id:`b26-heart`,className:`fa-solid fa-heart`,onClick:()=>m(w.current,S,x,`bigheart`)})}),z&&(0,h.jsx)(`div`,{className:`b26-footer-right`,children:z}),(0,h.jsx)(`p`,{className:`b26-footer-end`,children:`Created by Ryo`})]}),!1]})}export{b as default};