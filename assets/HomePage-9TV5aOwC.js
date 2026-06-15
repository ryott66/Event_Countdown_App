import{S as e,_ as t,b as n,d as r,f as i,i as a,n as o,p as s,r as c,v as l}from"./AuthContext-DRbf2k-P.js";import{i as u,t as d}from"./index-JRxWjbA-.js";import{t as f}from"./confetti.module-DN_WQ_R-.js";import{a as p,o as m,s as h,t as g}from"./eventService-dupWK3q_.js";var _=e(u()),v=e(n());function y(){var e=[...arguments];return(0,v.useMemo)(()=>t=>{e.forEach(e=>e(t))},e)}var b=typeof window<`u`&&window.document!==void 0&&window.document.createElement!==void 0;function x(e){let t=Object.prototype.toString.call(e);return t===`[object Window]`||t===`[object global]`}function S(e){return`nodeType`in e}function C(e){return e?x(e)?e:S(e)?e.ownerDocument?.defaultView??window:window:window}function w(e){let{Document:t}=C(e);return e instanceof t}function T(e){return x(e)?!1:e instanceof C(e).HTMLElement}function E(e){return e instanceof C(e).SVGElement}function D(e){return e?x(e)?e.document:S(e)?w(e)?e:T(e)||E(e)?e.ownerDocument:document:document:document}var O=b?v.useLayoutEffect:v.useEffect;function k(e){let t=(0,v.useRef)(e);return O(()=>{t.current=e}),(0,v.useCallback)(function(){var e=[...arguments];return t.current==null?void 0:t.current(...e)},[])}function ee(){let e=(0,v.useRef)(null);return[(0,v.useCallback)((t,n)=>{e.current=setInterval(t,n)},[]),(0,v.useCallback)(()=>{e.current!==null&&(clearInterval(e.current),e.current=null)},[])]}function te(e,t){t===void 0&&(t=[e]);let n=(0,v.useRef)(e);return O(()=>{n.current!==e&&(n.current=e)},t),n}function A(e,t){let n=(0,v.useRef)();return(0,v.useMemo)(()=>{let t=e(n.current);return n.current=t,t},[...t])}function j(e){let t=k(e),n=(0,v.useRef)(null);return[n,(0,v.useCallback)(e=>{e!==n.current&&t?.(e,n.current),n.current=e},[])]}function M(e){let t=(0,v.useRef)();return(0,v.useEffect)(()=>{t.current=e},[e]),t.current}var N={};function ne(e,t){return(0,v.useMemo)(()=>{if(t)return t;let n=N[e]==null?0:N[e]+1;return N[e]=n,e+`-`+n},[e,t])}function re(e){return function(t){return[...arguments].slice(1).reduce((t,n)=>{let r=Object.entries(n);for(let[n,i]of r){let r=t[n];r!=null&&(t[n]=r+e*i)}return t},{...t})}}var P=re(1),F=re(-1);function I(e){return`clientX`in e&&`clientY`in e}function L(e){if(!e)return!1;let{KeyboardEvent:t}=C(e.target);return t&&e instanceof t}function ie(e){if(!e)return!1;let{TouchEvent:t}=C(e.target);return t&&e instanceof t}function ae(e){if(ie(e)){if(e.touches&&e.touches.length){let{clientX:t,clientY:n}=e.touches[0];return{x:t,y:n}}else if(e.changedTouches&&e.changedTouches.length){let{clientX:t,clientY:n}=e.changedTouches[0];return{x:t,y:n}}}return I(e)?{x:e.clientX,y:e.clientY}:null}var R=Object.freeze({Translate:{toString(e){if(!e)return;let{x:t,y:n}=e;return`translate3d(`+(t?Math.round(t):0)+`px, `+(n?Math.round(n):0)+`px, 0)`}},Scale:{toString(e){if(!e)return;let{scaleX:t,scaleY:n}=e;return`scaleX(`+t+`) scaleY(`+n+`)`}},Transform:{toString(e){if(e)return[R.Translate.toString(e),R.Scale.toString(e)].join(` `)}},Transition:{toString(e){let{property:t,duration:n,easing:r}=e;return t+` `+n+`ms `+r}}}),oe=`a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled),*[tabindex]`;function z(e){return e.matches(oe)?e:e.querySelector(oe)}var B={display:`none`};function V(e){let{id:t,value:n}=e;return v.createElement(`div`,{id:t,style:B},n)}function se(e){let{id:t,announcement:n,ariaLiveType:r=`assertive`}=e;return v.createElement(`div`,{id:t,style:{position:`fixed`,top:0,left:0,width:1,height:1,margin:-1,border:0,padding:0,overflow:`hidden`,clip:`rect(0 0 0 0)`,clipPath:`inset(100%)`,whiteSpace:`nowrap`},role:`status`,"aria-live":r,"aria-atomic":!0},n)}function H(){let[e,t]=(0,v.useState)(``);return{announce:(0,v.useCallback)(e=>{e!=null&&t(e)},[]),announcement:e}}var ce=(0,v.createContext)(null);function le(e){let t=(0,v.useContext)(ce);(0,v.useEffect)(()=>{if(!t)throw Error(`useDndMonitor must be used within a children of <DndContext>`);return t(e)},[e,t])}function ue(){let[e]=(0,v.useState)(()=>new Set),t=(0,v.useCallback)(t=>(e.add(t),()=>e.delete(t)),[e]);return[(0,v.useCallback)(t=>{let{type:n,event:r}=t;e.forEach(e=>e[n]?.call(e,r))},[e]),t]}var U={draggable:`
    To pick up a draggable item, press the space bar.
    While dragging, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  `},de={onDragStart(e){let{active:t}=e;return`Picked up draggable item `+t.id+`.`},onDragOver(e){let{active:t,over:n}=e;return n?`Draggable item `+t.id+` was moved over droppable area `+n.id+`.`:`Draggable item `+t.id+` is no longer over a droppable area.`},onDragEnd(e){let{active:t,over:n}=e;return n?`Draggable item `+t.id+` was dropped over droppable area `+n.id:`Draggable item `+t.id+` was dropped.`},onDragCancel(e){let{active:t}=e;return`Dragging was cancelled. Draggable item `+t.id+` was dropped.`}};function fe(e){let{announcements:t=de,container:n,hiddenTextDescribedById:r,screenReaderInstructions:i=U}=e,{announce:a,announcement:o}=H(),s=ne(`DndLiveRegion`),[c,l]=(0,v.useState)(!1);if((0,v.useEffect)(()=>{l(!0)},[]),le((0,v.useMemo)(()=>({onDragStart(e){let{active:n}=e;a(t.onDragStart({active:n}))},onDragMove(e){let{active:n,over:r}=e;t.onDragMove&&a(t.onDragMove({active:n,over:r}))},onDragOver(e){let{active:n,over:r}=e;a(t.onDragOver({active:n,over:r}))},onDragEnd(e){let{active:n,over:r}=e;a(t.onDragEnd({active:n,over:r}))},onDragCancel(e){let{active:n,over:r}=e;a(t.onDragCancel({active:n,over:r}))}}),[a,t])),!c)return null;let u=v.createElement(v.Fragment,null,v.createElement(V,{id:r,value:i.draggable}),v.createElement(se,{id:s,announcement:o}));return n?(0,_.createPortal)(u,n):u}var W;(function(e){e.DragStart=`dragStart`,e.DragMove=`dragMove`,e.DragEnd=`dragEnd`,e.DragCancel=`dragCancel`,e.DragOver=`dragOver`,e.RegisterDroppable=`registerDroppable`,e.SetDroppableDisabled=`setDroppableDisabled`,e.UnregisterDroppable=`unregisterDroppable`})(W||={});function G(){}function pe(e,t){return(0,v.useMemo)(()=>({sensor:e,options:t??{}}),[e,t])}function me(){var e=[...arguments];return(0,v.useMemo)(()=>[...e].filter(e=>e!=null),[...e])}var K=Object.freeze({x:0,y:0});function q(e,t){return Math.sqrt((e.x-t.x)**2+(e.y-t.y)**2)}function he(e,t){let{data:{value:n}}=e,{data:{value:r}}=t;return n-r}function ge(e,t){let{data:{value:n}}=e,{data:{value:r}}=t;return r-n}function _e(e,t){if(!e||e.length===0)return null;let[n]=e;return t?n[t]:n}function ve(e,t,n){return t===void 0&&(t=e.left),n===void 0&&(n=e.top),{x:t+e.width*.5,y:n+e.height*.5}}var ye=e=>{let{collisionRect:t,droppableRects:n,droppableContainers:r}=e,i=ve(t,t.left,t.top),a=[];for(let e of r){let{id:t}=e,r=n.get(t);if(r){let n=q(ve(r),i);a.push({id:t,data:{droppableContainer:e,value:n}})}}return a.sort(he)};function be(e,t){let n=Math.max(t.top,e.top),r=Math.max(t.left,e.left),i=Math.min(t.left+t.width,e.left+e.width),a=Math.min(t.top+t.height,e.top+e.height),o=i-r,s=a-n;if(r<i&&n<a){let n=t.width*t.height,r=e.width*e.height,i=o*s,a=i/(n+r-i);return Number(a.toFixed(4))}return 0}var xe=e=>{let{collisionRect:t,droppableRects:n,droppableContainers:r}=e,i=[];for(let e of r){let{id:r}=e,a=n.get(r);if(a){let n=be(a,t);n>0&&i.push({id:r,data:{droppableContainer:e,value:n}})}}return i.sort(ge)};function Se(e,t,n){return{...e,scaleX:t&&n?t.width/n.width:1,scaleY:t&&n?t.height/n.height:1}}function Ce(e,t){return e&&t?{x:e.left-t.left,y:e.top-t.top}:K}function J(e){return function(t){return[...arguments].slice(1).reduce((t,n)=>({...t,top:t.top+e*n.y,bottom:t.bottom+e*n.y,left:t.left+e*n.x,right:t.right+e*n.x}),{...t})}}var we=J(1);function Te(e){if(e.startsWith(`matrix3d(`)){let t=e.slice(9,-1).split(/, /);return{x:+t[12],y:+t[13],scaleX:+t[0],scaleY:+t[5]}}else if(e.startsWith(`matrix(`)){let t=e.slice(7,-1).split(/, /);return{x:+t[4],y:+t[5],scaleX:+t[0],scaleY:+t[3]}}return null}function Ee(e,t,n){let r=Te(t);if(!r)return e;let{scaleX:i,scaleY:a,x:o,y:s}=r,c=e.left-o-(1-i)*parseFloat(n),l=e.top-s-(1-a)*parseFloat(n.slice(n.indexOf(` `)+1)),u=i?e.width/i:e.width,d=a?e.height/a:e.height;return{width:u,height:d,top:l,right:c+u,bottom:l+d,left:c}}var De={ignoreTransform:!1};function Y(e,t){t===void 0&&(t=De);let n=e.getBoundingClientRect();if(t.ignoreTransform){let{transform:t,transformOrigin:r}=C(e).getComputedStyle(e);t&&(n=Ee(n,t,r))}let{top:r,left:i,width:a,height:o,bottom:s,right:c}=n;return{top:r,left:i,width:a,height:o,bottom:s,right:c}}function Oe(e){return Y(e,{ignoreTransform:!0})}function ke(e){let t=e.innerWidth,n=e.innerHeight;return{top:0,left:0,right:t,bottom:n,width:t,height:n}}function Ae(e,t){return t===void 0&&(t=C(e).getComputedStyle(e)),t.position===`fixed`}function je(e,t){t===void 0&&(t=C(e).getComputedStyle(e));let n=/(auto|scroll|overlay)/;return[`overflow`,`overflowX`,`overflowY`].some(e=>{let r=t[e];return typeof r==`string`?n.test(r):!1})}function Me(e,t){let n=[];function r(i){if(t!=null&&n.length>=t||!i)return n;if(w(i)&&i.scrollingElement!=null&&!n.includes(i.scrollingElement))return n.push(i.scrollingElement),n;if(!T(i)||E(i)||n.includes(i))return n;let a=C(e).getComputedStyle(i);return i!==e&&je(i,a)&&n.push(i),Ae(i,a)?n:r(i.parentNode)}return e?r(e):n}function Ne(e){let[t]=Me(e,1);return t??null}function Pe(e){return!b||!e?null:x(e)?e:S(e)?w(e)||e===D(e).scrollingElement?window:T(e)?e:null:null}function Fe(e){return x(e)?e.scrollX:e.scrollLeft}function Ie(e){return x(e)?e.scrollY:e.scrollTop}function Le(e){return{x:Fe(e),y:Ie(e)}}var X;(function(e){e[e.Forward=1]=`Forward`,e[e.Backward=-1]=`Backward`})(X||={});function Re(e){return!b||!e?!1:e===document.scrollingElement}function ze(e){let t={x:0,y:0},n=Re(e)?{height:window.innerHeight,width:window.innerWidth}:{height:e.clientHeight,width:e.clientWidth},r={x:e.scrollWidth-n.width,y:e.scrollHeight-n.height};return{isTop:e.scrollTop<=t.y,isLeft:e.scrollLeft<=t.x,isBottom:e.scrollTop>=r.y,isRight:e.scrollLeft>=r.x,maxScroll:r,minScroll:t}}var Be={x:.2,y:.2};function Ve(e,t,n,r,i){let{top:a,left:o,right:s,bottom:c}=n;r===void 0&&(r=10),i===void 0&&(i=Be);let{isTop:l,isBottom:u,isLeft:d,isRight:f}=ze(e),p={x:0,y:0},m={x:0,y:0},h={height:t.height*i.y,width:t.width*i.x};return!l&&a<=t.top+h.height?(p.y=X.Backward,m.y=r*Math.abs((t.top+h.height-a)/h.height)):!u&&c>=t.bottom-h.height&&(p.y=X.Forward,m.y=r*Math.abs((t.bottom-h.height-c)/h.height)),!f&&s>=t.right-h.width?(p.x=X.Forward,m.x=r*Math.abs((t.right-h.width-s)/h.width)):!d&&o<=t.left+h.width&&(p.x=X.Backward,m.x=r*Math.abs((t.left+h.width-o)/h.width)),{direction:p,speed:m}}function He(e){if(e===document.scrollingElement){let{innerWidth:e,innerHeight:t}=window;return{top:0,left:0,right:e,bottom:t,width:e,height:t}}let{top:t,left:n,right:r,bottom:i}=e.getBoundingClientRect();return{top:t,left:n,right:r,bottom:i,width:e.clientWidth,height:e.clientHeight}}function Ue(e){return e.reduce((e,t)=>P(e,Le(t)),K)}function We(e){return e.reduce((e,t)=>e+Fe(t),0)}function Ge(e){return e.reduce((e,t)=>e+Ie(t),0)}function Ke(e,t){if(t===void 0&&(t=Y),!e)return;let{top:n,left:r,bottom:i,right:a}=t(e);Ne(e)&&(i<=0||a<=0||n>=window.innerHeight||r>=window.innerWidth)&&e.scrollIntoView({block:`center`,inline:`center`})}var qe=[[`x`,[`left`,`right`],We],[`y`,[`top`,`bottom`],Ge]],Je=class{constructor(e,t){this.rect=void 0,this.width=void 0,this.height=void 0,this.top=void 0,this.bottom=void 0,this.right=void 0,this.left=void 0;let n=Me(t),r=Ue(n);this.rect={...e},this.width=e.width,this.height=e.height;for(let[e,t,i]of qe)for(let a of t)Object.defineProperty(this,a,{get:()=>{let t=i(n),o=r[e]-t;return this.rect[a]+o},enumerable:!0});Object.defineProperty(this,`rect`,{enumerable:!1})}},Ye=class{constructor(e){this.target=void 0,this.listeners=[],this.removeAll=()=>{this.listeners.forEach(e=>this.target?.removeEventListener(...e))},this.target=e}add(e,t,n){var r;(r=this.target)==null||r.addEventListener(e,t,n),this.listeners.push([e,t,n])}};function Xe(e){let{EventTarget:t}=C(e);return e instanceof t?e:D(e)}function Ze(e,t){let n=Math.abs(e.x),r=Math.abs(e.y);return typeof t==`number`?Math.sqrt(n**2+r**2)>t:`x`in t&&`y`in t?n>t.x&&r>t.y:`x`in t?n>t.x:`y`in t?r>t.y:!1}var Z;(function(e){e.Click=`click`,e.DragStart=`dragstart`,e.Keydown=`keydown`,e.ContextMenu=`contextmenu`,e.Resize=`resize`,e.SelectionChange=`selectionchange`,e.VisibilityChange=`visibilitychange`})(Z||={});function Qe(e){e.preventDefault()}function $e(e){e.stopPropagation()}var Q;(function(e){e.Space=`Space`,e.Down=`ArrowDown`,e.Right=`ArrowRight`,e.Left=`ArrowLeft`,e.Up=`ArrowUp`,e.Esc=`Escape`,e.Enter=`Enter`,e.Tab=`Tab`})(Q||={});var et={start:[Q.Space,Q.Enter],cancel:[Q.Esc],end:[Q.Space,Q.Enter,Q.Tab]},tt=(e,t)=>{let{currentCoordinates:n}=t;switch(e.code){case Q.Right:return{...n,x:n.x+25};case Q.Left:return{...n,x:n.x-25};case Q.Down:return{...n,y:n.y+25};case Q.Up:return{...n,y:n.y-25}}},nt=class{constructor(e){this.props=void 0,this.autoScrollEnabled=!1,this.referenceCoordinates=void 0,this.listeners=void 0,this.windowListeners=void 0,this.props=e;let{event:{target:t}}=e;this.props=e,this.listeners=new Ye(D(t)),this.windowListeners=new Ye(C(t)),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleCancel=this.handleCancel.bind(this),this.attach()}attach(){this.handleStart(),this.windowListeners.add(Z.Resize,this.handleCancel),this.windowListeners.add(Z.VisibilityChange,this.handleCancel),setTimeout(()=>this.listeners.add(Z.Keydown,this.handleKeyDown))}handleStart(){let{activeNode:e,onStart:t}=this.props,n=e.node.current;n&&Ke(n),t(K)}handleKeyDown(e){if(L(e)){let{active:t,context:n,options:r}=this.props,{keyboardCodes:i=et,coordinateGetter:a=tt,scrollBehavior:o=`smooth`}=r,{code:s}=e;if(i.end.includes(s)){this.handleEnd(e);return}if(i.cancel.includes(s)){this.handleCancel(e);return}let{collisionRect:c}=n.current,l=c?{x:c.left,y:c.top}:K;this.referenceCoordinates||=l;let u=a(e,{active:t,context:n.current,currentCoordinates:l});if(u){let t=F(u,l),r={x:0,y:0},{scrollableAncestors:i}=n.current;for(let n of i){let i=e.code,{isTop:a,isRight:s,isLeft:c,isBottom:l,maxScroll:d,minScroll:f}=ze(n),p=He(n),m={x:Math.min(i===Q.Right?p.right-p.width/2:p.right,Math.max(i===Q.Right?p.left:p.left+p.width/2,u.x)),y:Math.min(i===Q.Down?p.bottom-p.height/2:p.bottom,Math.max(i===Q.Down?p.top:p.top+p.height/2,u.y))},h=i===Q.Right&&!s||i===Q.Left&&!c,g=i===Q.Down&&!l||i===Q.Up&&!a;if(h&&m.x!==u.x){let e=n.scrollLeft+t.x,a=i===Q.Right&&e<=d.x||i===Q.Left&&e>=f.x;if(a&&!t.y){n.scrollTo({left:e,behavior:o});return}a?r.x=n.scrollLeft-e:r.x=i===Q.Right?n.scrollLeft-d.x:n.scrollLeft-f.x,r.x&&n.scrollBy({left:-r.x,behavior:o});break}else if(g&&m.y!==u.y){let e=n.scrollTop+t.y,a=i===Q.Down&&e<=d.y||i===Q.Up&&e>=f.y;if(a&&!t.x){n.scrollTo({top:e,behavior:o});return}a?r.y=n.scrollTop-e:r.y=i===Q.Down?n.scrollTop-d.y:n.scrollTop-f.y,r.y&&n.scrollBy({top:-r.y,behavior:o});break}}this.handleMove(e,P(F(u,this.referenceCoordinates),r))}}}handleMove(e,t){let{onMove:n}=this.props;e.preventDefault(),n(t)}handleEnd(e){let{onEnd:t}=this.props;e.preventDefault(),this.detach(),t()}handleCancel(e){let{onCancel:t}=this.props;e.preventDefault(),this.detach(),t()}detach(){this.listeners.removeAll(),this.windowListeners.removeAll()}};nt.activators=[{eventName:`onKeyDown`,handler:(e,t,n)=>{let{keyboardCodes:r=et,onActivation:i}=t,{active:a}=n,{code:o}=e.nativeEvent;if(r.start.includes(o)){let t=a.activatorNode.current;return t&&e.target!==t?!1:(e.preventDefault(),i?.({event:e.nativeEvent}),!0)}return!1}}];function rt(e){return!!(e&&`distance`in e)}function it(e){return!!(e&&`delay`in e)}var at=class{constructor(e,t,n){n===void 0&&(n=Xe(e.event.target)),this.props=void 0,this.events=void 0,this.autoScrollEnabled=!0,this.document=void 0,this.activated=!1,this.initialCoordinates=void 0,this.timeoutId=null,this.listeners=void 0,this.documentListeners=void 0,this.windowListeners=void 0,this.props=e,this.events=t;let{event:r}=e,{target:i}=r;this.props=e,this.events=t,this.document=D(i),this.documentListeners=new Ye(this.document),this.listeners=new Ye(n),this.windowListeners=new Ye(C(i)),this.initialCoordinates=ae(r)??K,this.handleStart=this.handleStart.bind(this),this.handleMove=this.handleMove.bind(this),this.handleEnd=this.handleEnd.bind(this),this.handleCancel=this.handleCancel.bind(this),this.handleKeydown=this.handleKeydown.bind(this),this.removeTextSelection=this.removeTextSelection.bind(this),this.attach()}attach(){let{events:e,props:{options:{activationConstraint:t,bypassActivationConstraint:n}}}=this;if(this.listeners.add(e.move.name,this.handleMove,{passive:!1}),this.listeners.add(e.end.name,this.handleEnd),e.cancel&&this.listeners.add(e.cancel.name,this.handleCancel),this.windowListeners.add(Z.Resize,this.handleCancel),this.windowListeners.add(Z.DragStart,Qe),this.windowListeners.add(Z.VisibilityChange,this.handleCancel),this.windowListeners.add(Z.ContextMenu,Qe),this.documentListeners.add(Z.Keydown,this.handleKeydown),t){if(n!=null&&n({event:this.props.event,activeNode:this.props.activeNode,options:this.props.options}))return this.handleStart();if(it(t)){this.timeoutId=setTimeout(this.handleStart,t.delay),this.handlePending(t);return}if(rt(t)){this.handlePending(t);return}}this.handleStart()}detach(){this.listeners.removeAll(),this.windowListeners.removeAll(),setTimeout(this.documentListeners.removeAll,50),this.timeoutId!==null&&(clearTimeout(this.timeoutId),this.timeoutId=null)}handlePending(e,t){let{active:n,onPending:r}=this.props;r(n,e,this.initialCoordinates,t)}handleStart(){let{initialCoordinates:e}=this,{onStart:t}=this.props;e&&(this.activated=!0,this.documentListeners.add(Z.Click,$e,{capture:!0}),this.removeTextSelection(),this.documentListeners.add(Z.SelectionChange,this.removeTextSelection),t(e))}handleMove(e){let{activated:t,initialCoordinates:n,props:r}=this,{onMove:i,options:{activationConstraint:a}}=r;if(!n)return;let o=ae(e)??K,s=F(n,o);if(!t&&a){if(rt(a)){if(a.tolerance!=null&&Ze(s,a.tolerance))return this.handleCancel();if(Ze(s,a.distance))return this.handleStart()}if(it(a)&&Ze(s,a.tolerance))return this.handleCancel();this.handlePending(a,s);return}e.cancelable&&e.preventDefault(),i(o)}handleEnd(){let{onAbort:e,onEnd:t}=this.props;this.detach(),this.activated||e(this.props.active),t()}handleCancel(){let{onAbort:e,onCancel:t}=this.props;this.detach(),this.activated||e(this.props.active),t()}handleKeydown(e){e.code===Q.Esc&&this.handleCancel()}removeTextSelection(){var e;(e=this.document.getSelection())==null||e.removeAllRanges()}},ot={cancel:{name:`pointercancel`},move:{name:`pointermove`},end:{name:`pointerup`}},st=class extends at{constructor(e){let{event:t}=e,n=D(t.target);super(e,ot,n)}};st.activators=[{eventName:`onPointerDown`,handler:(e,t)=>{let{nativeEvent:n}=e,{onActivation:r}=t;return!n.isPrimary||n.button!==0?!1:(r?.({event:n}),!0)}}];var ct={move:{name:`mousemove`},end:{name:`mouseup`}},lt;(function(e){e[e.RightClick=2]=`RightClick`})(lt||={});var ut=class extends at{constructor(e){super(e,ct,D(e.event.target))}};ut.activators=[{eventName:`onMouseDown`,handler:(e,t)=>{let{nativeEvent:n}=e,{onActivation:r}=t;return n.button===lt.RightClick?!1:(r?.({event:n}),!0)}}];var dt={cancel:{name:`touchcancel`},move:{name:`touchmove`},end:{name:`touchend`}},ft=class extends at{constructor(e){super(e,dt)}static setup(){return window.addEventListener(dt.move.name,e,{capture:!1,passive:!1}),function(){window.removeEventListener(dt.move.name,e)};function e(){}}};ft.activators=[{eventName:`onTouchStart`,handler:(e,t)=>{let{nativeEvent:n}=e,{onActivation:r}=t,{touches:i}=n;return i.length>1?!1:(r?.({event:n}),!0)}}];var pt;(function(e){e[e.Pointer=0]=`Pointer`,e[e.DraggableRect=1]=`DraggableRect`})(pt||={});var mt;(function(e){e[e.TreeOrder=0]=`TreeOrder`,e[e.ReversedTreeOrder=1]=`ReversedTreeOrder`})(mt||={});function ht(e){let{acceleration:t,activator:n=pt.Pointer,canScroll:r,draggingRect:i,enabled:a,interval:o=5,order:s=mt.TreeOrder,pointerCoordinates:c,scrollableAncestors:l,scrollableAncestorRects:u,delta:d,threshold:f}=e,p=_t({delta:d,disabled:!a}),[m,h]=ee(),g=(0,v.useRef)({x:0,y:0}),_=(0,v.useRef)({x:0,y:0}),y=(0,v.useMemo)(()=>{switch(n){case pt.Pointer:return c?{top:c.y,bottom:c.y,left:c.x,right:c.x}:null;case pt.DraggableRect:return i}},[n,i,c]),b=(0,v.useRef)(null),x=(0,v.useCallback)(()=>{let e=b.current;if(!e)return;let t=g.current.x*_.current.x,n=g.current.y*_.current.y;e.scrollBy(t,n)},[]),S=(0,v.useMemo)(()=>s===mt.TreeOrder?[...l].reverse():l,[s,l]);(0,v.useEffect)(()=>{if(!a||!l.length||!y){h();return}for(let e of S){if(r?.(e)===!1)continue;let n=u[l.indexOf(e)];if(!n)continue;let{direction:i,speed:a}=Ve(e,n,y,t,f);for(let e of[`x`,`y`])p[e][i[e]]||(a[e]=0,i[e]=0);if(a.x>0||a.y>0){h(),b.current=e,m(x,o),g.current=a,_.current=i;return}}g.current={x:0,y:0},_.current={x:0,y:0},h()},[t,x,r,h,a,o,JSON.stringify(y),JSON.stringify(p),m,l,S,u,JSON.stringify(f)])}var gt={x:{[X.Backward]:!1,[X.Forward]:!1},y:{[X.Backward]:!1,[X.Forward]:!1}};function _t(e){let{delta:t,disabled:n}=e,r=M(t);return A(e=>{if(n||!r||!e)return gt;let i={x:Math.sign(t.x-r.x),y:Math.sign(t.y-r.y)};return{x:{[X.Backward]:e.x[X.Backward]||i.x===-1,[X.Forward]:e.x[X.Forward]||i.x===1},y:{[X.Backward]:e.y[X.Backward]||i.y===-1,[X.Forward]:e.y[X.Forward]||i.y===1}}},[n,t,r])}function vt(e,t){let n=t==null?void 0:e.get(t),r=n?n.node.current:null;return A(e=>t==null?null:r??e??null,[r,t])}function yt(e,t){return(0,v.useMemo)(()=>e.reduce((e,n)=>{let{sensor:r}=n,i=r.activators.map(e=>({eventName:e.eventName,handler:t(e.handler,n)}));return[...e,...i]},[]),[e,t])}var bt;(function(e){e[e.Always=0]=`Always`,e[e.BeforeDragging=1]=`BeforeDragging`,e[e.WhileDragging=2]=`WhileDragging`})(bt||={});var xt;(function(e){e.Optimized=`optimized`})(xt||={});var St=new Map;function Ct(e,t){let{dragging:n,dependencies:r,config:i}=t,[a,o]=(0,v.useState)(null),{frequency:s,measure:c,strategy:l}=i,u=(0,v.useRef)(e),d=g(),f=te(d),p=(0,v.useCallback)(function(e){e===void 0&&(e=[]),!f.current&&o(t=>t===null?e:t.concat(e.filter(e=>!t.includes(e))))},[f]),m=(0,v.useRef)(null),h=A(t=>{if(d&&!n)return St;if(!t||t===St||u.current!==e||a!=null){let t=new Map;for(let n of e){if(!n)continue;if(a&&a.length>0&&!a.includes(n.id)&&n.rect.current){t.set(n.id,n.rect.current);continue}let e=n.node.current,r=e?new Je(c(e),e):null;n.rect.current=r,r&&t.set(n.id,r)}return t}return t},[e,a,n,d,c]);return(0,v.useEffect)(()=>{u.current=e},[e]),(0,v.useEffect)(()=>{d||p()},[n,d]),(0,v.useEffect)(()=>{a&&a.length>0&&o(null)},[JSON.stringify(a)]),(0,v.useEffect)(()=>{d||typeof s!=`number`||m.current!==null||(m.current=setTimeout(()=>{p(),m.current=null},s))},[s,d,p,...r]),{droppableRects:h,measureDroppableContainers:p,measuringScheduled:a!=null};function g(){switch(l){case bt.Always:return!1;case bt.BeforeDragging:return n;default:return!n}}}function wt(e,t){return A(n=>e?n||(typeof t==`function`?t(e):e):null,[t,e])}function Tt(e,t){return wt(e,t)}function Et(e){let{callback:t,disabled:n}=e,r=k(t),i=(0,v.useMemo)(()=>{if(n||typeof window>`u`||window.MutationObserver===void 0)return;let{MutationObserver:e}=window;return new e(r)},[r,n]);return(0,v.useEffect)(()=>()=>i?.disconnect(),[i]),i}function Dt(e){let{callback:t,disabled:n}=e,r=k(t),i=(0,v.useMemo)(()=>{if(n||typeof window>`u`||window.ResizeObserver===void 0)return;let{ResizeObserver:e}=window;return new e(r)},[n]);return(0,v.useEffect)(()=>()=>i?.disconnect(),[i]),i}function Ot(e){return new Je(Y(e),e)}function kt(e,t,n){t===void 0&&(t=Ot);let[r,i]=(0,v.useState)(null);function a(){i(r=>{if(!e)return null;if(e.isConnected===!1)return r??n??null;let i=t(e);return JSON.stringify(r)===JSON.stringify(i)?r:i})}let o=Et({callback(t){if(e)for(let n of t){let{type:t,target:r}=n;if(t===`childList`&&r instanceof HTMLElement&&r.contains(e)){a();break}}}}),s=Dt({callback:a});return O(()=>{a(),e?(s?.observe(e),o?.observe(document.body,{childList:!0,subtree:!0})):(s?.disconnect(),o?.disconnect())},[e]),r}function At(e){return Ce(e,wt(e))}var jt=[];function Mt(e){let t=(0,v.useRef)(e),n=A(n=>e?n&&n!==jt&&e&&t.current&&e.parentNode===t.current.parentNode?n:Me(e):jt,[e]);return(0,v.useEffect)(()=>{t.current=e},[e]),n}function Nt(e){let[t,n]=(0,v.useState)(null),r=(0,v.useRef)(e),i=(0,v.useCallback)(e=>{let t=Pe(e.target);t&&n(e=>e?(e.set(t,Le(t)),new Map(e)):null)},[]);return(0,v.useEffect)(()=>{let t=r.current;if(e!==t){a(t);let o=e.map(e=>{let t=Pe(e);return t?(t.addEventListener(`scroll`,i,{passive:!0}),[t,Le(t)]):null}).filter(e=>e!=null);n(o.length?new Map(o):null),r.current=e}return()=>{a(e),a(t)};function a(e){e.forEach(e=>{Pe(e)?.removeEventListener(`scroll`,i)})}},[i,e]),(0,v.useMemo)(()=>e.length?t?Array.from(t.values()).reduce((e,t)=>P(e,t),K):Ue(e):K,[e,t])}function Pt(e,t){t===void 0&&(t=[]);let n=(0,v.useRef)(null);return(0,v.useEffect)(()=>{n.current=null},t),(0,v.useEffect)(()=>{let t=e!==K;t&&!n.current&&(n.current=e),!t&&n.current&&(n.current=null)},[e]),n.current?F(e,n.current):K}function Ft(e){(0,v.useEffect)(()=>{if(!b)return;let t=e.map(e=>{let{sensor:t}=e;return t.setup==null?void 0:t.setup()});return()=>{for(let e of t)e?.()}},e.map(e=>{let{sensor:t}=e;return t}))}function It(e,t){return(0,v.useMemo)(()=>e.reduce((e,n)=>{let{eventName:r,handler:i}=n;return e[r]=e=>{i(e,t)},e},{}),[e,t])}function Lt(e){return(0,v.useMemo)(()=>e?ke(e):null,[e])}var Rt=[];function zt(e,t){t===void 0&&(t=Y);let[n]=e,r=Lt(n?C(n):null),[i,a]=(0,v.useState)(Rt);function o(){a(()=>e.length?e.map(e=>Re(e)?r:new Je(t(e),e)):Rt)}let s=Dt({callback:o});return O(()=>{s?.disconnect(),o(),e.forEach(e=>s?.observe(e))},[e]),i}function Bt(e){if(!e)return null;if(e.children.length>1)return e;let t=e.children[0];return T(t)?t:e}function Vt(e){let{measure:t}=e,[n,r]=(0,v.useState)(null),i=Dt({callback:(0,v.useCallback)(e=>{for(let{target:n}of e)if(T(n)){r(e=>{let r=t(n);return e?{...e,width:r.width,height:r.height}:r});break}},[t])}),[a,o]=j((0,v.useCallback)(e=>{let n=Bt(e);i?.disconnect(),n&&i?.observe(n),r(n?t(n):null)},[t,i]));return(0,v.useMemo)(()=>({nodeRef:a,rect:n,setRef:o}),[n,a,o])}var Ht=[{sensor:st,options:{}},{sensor:nt,options:{}}],Ut={current:{}},Wt={draggable:{measure:Oe},droppable:{measure:Oe,strategy:bt.WhileDragging,frequency:xt.Optimized},dragOverlay:{measure:Y}},Gt=class extends Map{get(e){return e==null?void 0:super.get(e)??void 0}toArray(){return Array.from(this.values())}getEnabled(){return this.toArray().filter(e=>{let{disabled:t}=e;return!t})}getNodeFor(e){return this.get(e)?.node.current??void 0}},Kt={activatorEvent:null,active:null,activeNode:null,activeNodeRect:null,collisions:null,containerNodeRect:null,draggableNodes:new Map,droppableRects:new Map,droppableContainers:new Gt,over:null,dragOverlay:{nodeRef:{current:null},rect:null,setRef:G},scrollableAncestors:[],scrollableAncestorRects:[],measuringConfiguration:Wt,measureDroppableContainers:G,windowRect:null,measuringScheduled:!1},qt={activatorEvent:null,activators:[],active:null,activeNodeRect:null,ariaDescribedById:{draggable:``},dispatch:G,draggableNodes:new Map,over:null,measureDroppableContainers:G},Jt=(0,v.createContext)(qt),Yt=(0,v.createContext)(Kt);function Xt(){return{draggable:{active:null,initialCoordinates:{x:0,y:0},nodes:new Map,translate:{x:0,y:0}},droppable:{containers:new Gt}}}function Zt(e,t){switch(t.type){case W.DragStart:return{...e,draggable:{...e.draggable,initialCoordinates:t.initialCoordinates,active:t.active}};case W.DragMove:return e.draggable.active==null?e:{...e,draggable:{...e.draggable,translate:{x:t.coordinates.x-e.draggable.initialCoordinates.x,y:t.coordinates.y-e.draggable.initialCoordinates.y}}};case W.DragEnd:case W.DragCancel:return{...e,draggable:{...e.draggable,active:null,initialCoordinates:{x:0,y:0},translate:{x:0,y:0}}};case W.RegisterDroppable:{let{element:n}=t,{id:r}=n,i=new Gt(e.droppable.containers);return i.set(r,n),{...e,droppable:{...e.droppable,containers:i}}}case W.SetDroppableDisabled:{let{id:n,key:r,disabled:i}=t,a=e.droppable.containers.get(n);if(!a||r!==a.key)return e;let o=new Gt(e.droppable.containers);return o.set(n,{...a,disabled:i}),{...e,droppable:{...e.droppable,containers:o}}}case W.UnregisterDroppable:{let{id:n,key:r}=t,i=e.droppable.containers.get(n);if(!i||r!==i.key)return e;let a=new Gt(e.droppable.containers);return a.delete(n),{...e,droppable:{...e.droppable,containers:a}}}default:return e}}function Qt(e){let{disabled:t}=e,{active:n,activatorEvent:r,draggableNodes:i}=(0,v.useContext)(Jt),a=M(r),o=M(n?.id);return(0,v.useEffect)(()=>{if(!t&&!r&&a&&o!=null){if(!L(a)||document.activeElement===a.target)return;let e=i.get(o);if(!e)return;let{activatorNode:t,node:n}=e;if(!t.current&&!n.current)return;requestAnimationFrame(()=>{for(let e of[t.current,n.current]){if(!e)continue;let t=z(e);if(t){t.focus();break}}})}},[r,t,i,o,a]),null}function $t(e,t){let{transform:n,...r}=t;return e!=null&&e.length?e.reduce((e,t)=>t({transform:e,...r}),n):n}function en(e){return(0,v.useMemo)(()=>({draggable:{...Wt.draggable,...e?.draggable},droppable:{...Wt.droppable,...e?.droppable},dragOverlay:{...Wt.dragOverlay,...e?.dragOverlay}}),[e?.draggable,e?.droppable,e?.dragOverlay])}function tn(e){let{activeNode:t,measure:n,initialRect:r,config:i=!0}=e,a=(0,v.useRef)(!1),{x:o,y:s}=typeof i==`boolean`?{x:i,y:i}:i;O(()=>{if(!o&&!s||!t){a.current=!1;return}if(a.current||!r)return;let e=t?.node.current;if(!e||e.isConnected===!1)return;let i=Ce(n(e),r);if(o||(i.x=0),s||(i.y=0),a.current=!0,Math.abs(i.x)>0||Math.abs(i.y)>0){let t=Ne(e);t&&t.scrollBy({top:i.y,left:i.x})}},[t,o,s,r,n])}var nn=(0,v.createContext)({...K,scaleX:1,scaleY:1}),rn;(function(e){e[e.Uninitialized=0]=`Uninitialized`,e[e.Initializing=1]=`Initializing`,e[e.Initialized=2]=`Initialized`})(rn||={});var an=(0,v.memo)(function(e){let{id:t,accessibility:n,autoScroll:r=!0,children:i,sensors:a=Ht,collisionDetection:o=xe,measuring:s,modifiers:c,...l}=e,[u,d]=(0,v.useReducer)(Zt,void 0,Xt),[f,p]=ue(),[m,h]=(0,v.useState)(rn.Uninitialized),g=m===rn.Initialized,{draggable:{active:y,nodes:b,translate:x},droppable:{containers:S}}=u,w=y==null?null:b.get(y),T=(0,v.useRef)({initial:null,translated:null}),E=(0,v.useMemo)(()=>y==null?null:{id:y,data:w?.data??Ut,rect:T},[y,w]),D=(0,v.useRef)(null),[k,ee]=(0,v.useState)(null),[A,j]=(0,v.useState)(null),M=te(l,Object.values(l)),N=ne(`DndDescribedBy`,t),re=(0,v.useMemo)(()=>S.getEnabled(),[S]),F=en(s),{droppableRects:I,measureDroppableContainers:L,measuringScheduled:ie}=Ct(re,{dragging:g,dependencies:[x.x,x.y],config:F.droppable}),R=vt(b,y),oe=(0,v.useMemo)(()=>A?ae(A):null,[A]),z=Fe(),B=Tt(R,F.draggable.measure);tn({activeNode:y==null?null:b.get(y),config:z.layoutShiftCompensation,initialRect:B,measure:F.draggable.measure});let V=kt(R,F.draggable.measure,B),se=kt(R?R.parentElement:null),H=(0,v.useRef)({activatorEvent:null,active:null,activeNode:R,collisionRect:null,collisions:null,droppableRects:I,draggableNodes:b,draggingNode:null,draggingNodeRect:null,droppableContainers:S,over:null,scrollableAncestors:[],scrollAdjustedTranslate:null}),le=S.getNodeFor(H.current.over?.id),U=Vt({measure:F.dragOverlay.measure}),de=U.nodeRef.current??R,G=g?U.rect??V:null,pe=!!(U.nodeRef.current&&U.rect),me=At(pe?null:V),K=Lt(de?C(de):null),q=Mt(g?le??R:null),he=zt(q),ge=$t(c,{transform:{x:x.x-me.x,y:x.y-me.y,scaleX:1,scaleY:1},activatorEvent:A,active:E,activeNodeRect:V,containerNodeRect:se,draggingNodeRect:G,over:H.current.over,overlayNodeRect:U.rect,scrollableAncestors:q,scrollableAncestorRects:he,windowRect:K}),ve=oe?P(oe,x):null,ye=Nt(q),be=Pt(ye),Ce=Pt(ye,[V]),J=P(ge,be),Te=G?we(G,ge):null,Ee=E&&Te?o({active:E,collisionRect:Te,droppableRects:I,droppableContainers:re,pointerCoordinates:ve}):null,De=_e(Ee,`id`),[Y,Oe]=(0,v.useState)(null),ke=Se(pe?ge:P(ge,Ce),Y?.rect??null,V),Ae=(0,v.useRef)(null),je=(0,v.useCallback)((e,t)=>{let{sensor:n,options:r}=t;if(D.current==null)return;let i=b.get(D.current);if(!i)return;let a=e.nativeEvent;Ae.current=new n({active:D.current,activeNode:i,event:a,options:r,context:H,onAbort(e){if(!b.get(e))return;let{onDragAbort:t}=M.current,n={id:e};t?.(n),f({type:`onDragAbort`,event:n})},onPending(e,t,n,r){if(!b.get(e))return;let{onDragPending:i}=M.current,a={id:e,constraint:t,initialCoordinates:n,offset:r};i?.(a),f({type:`onDragPending`,event:a})},onStart(e){let t=D.current;if(t==null)return;let n=b.get(t);if(!n)return;let{onDragStart:r}=M.current,i={activatorEvent:a,active:{id:t,data:n.data,rect:T}};(0,_.unstable_batchedUpdates)(()=>{r?.(i),h(rn.Initializing),d({type:W.DragStart,initialCoordinates:e,active:t}),f({type:`onDragStart`,event:i}),ee(Ae.current),j(a)})},onMove(e){d({type:W.DragMove,coordinates:e})},onEnd:o(W.DragEnd),onCancel:o(W.DragCancel)});function o(e){return async function(){let{active:t,collisions:n,over:r,scrollAdjustedTranslate:i}=H.current,o=null;if(t&&i){let{cancelDrop:s}=M.current;o={activatorEvent:a,active:t,collisions:n,delta:i,over:r},e===W.DragEnd&&typeof s==`function`&&await Promise.resolve(s(o))&&(e=W.DragCancel)}D.current=null,(0,_.unstable_batchedUpdates)(()=>{d({type:e}),h(rn.Uninitialized),Oe(null),ee(null),j(null),Ae.current=null;let t=e===W.DragEnd?`onDragEnd`:`onDragCancel`;if(o){let e=M.current[t];e?.(o),f({type:t,event:o})}})}}},[b]),Me=yt(a,(0,v.useCallback)((e,t)=>(n,r)=>{let i=n.nativeEvent,a=b.get(r);if(D.current!==null||!a||i.dndKit||i.defaultPrevented)return;let o={active:a};e(n,t.options,o)===!0&&(i.dndKit={capturedBy:t.sensor},D.current=r,je(n,t))},[b,je]));Ft(a),O(()=>{V&&m===rn.Initializing&&h(rn.Initialized)},[V,m]),(0,v.useEffect)(()=>{let{onDragMove:e}=M.current,{active:t,activatorEvent:n,collisions:r,over:i}=H.current;if(!t||!n)return;let a={active:t,activatorEvent:n,collisions:r,delta:{x:J.x,y:J.y},over:i};(0,_.unstable_batchedUpdates)(()=>{e?.(a),f({type:`onDragMove`,event:a})})},[J.x,J.y]),(0,v.useEffect)(()=>{let{active:e,activatorEvent:t,collisions:n,droppableContainers:r,scrollAdjustedTranslate:i}=H.current;if(!e||D.current==null||!t||!i)return;let{onDragOver:a}=M.current,o=r.get(De),s=o&&o.rect.current?{id:o.id,rect:o.rect.current,data:o.data,disabled:o.disabled}:null,c={active:e,activatorEvent:t,collisions:n,delta:{x:i.x,y:i.y},over:s};(0,_.unstable_batchedUpdates)(()=>{Oe(s),a?.(c),f({type:`onDragOver`,event:c})})},[De]),O(()=>{H.current={activatorEvent:A,active:E,activeNode:R,collisionRect:Te,collisions:Ee,droppableRects:I,draggableNodes:b,draggingNode:de,draggingNodeRect:G,droppableContainers:S,over:Y,scrollableAncestors:q,scrollAdjustedTranslate:J},T.current={initial:G,translated:Te}},[E,R,Ee,Te,b,de,G,I,S,Y,q,J]),ht({...z,delta:x,draggingRect:Te,pointerCoordinates:ve,scrollableAncestors:q,scrollableAncestorRects:he});let Ne=(0,v.useMemo)(()=>({active:E,activeNode:R,activeNodeRect:V,activatorEvent:A,collisions:Ee,containerNodeRect:se,dragOverlay:U,draggableNodes:b,droppableContainers:S,droppableRects:I,over:Y,measureDroppableContainers:L,scrollableAncestors:q,scrollableAncestorRects:he,measuringConfiguration:F,measuringScheduled:ie,windowRect:K}),[E,R,V,A,Ee,se,U,b,S,I,Y,L,q,he,F,ie,K]),Pe=(0,v.useMemo)(()=>({activatorEvent:A,activators:Me,active:E,activeNodeRect:V,ariaDescribedById:{draggable:N},dispatch:d,draggableNodes:b,over:Y,measureDroppableContainers:L}),[A,Me,E,V,d,N,b,Y,L]);return v.createElement(ce.Provider,{value:p},v.createElement(Jt.Provider,{value:Pe},v.createElement(Yt.Provider,{value:Ne},v.createElement(nn.Provider,{value:ke},i)),v.createElement(Qt,{disabled:n?.restoreFocus===!1})),v.createElement(fe,{...n,hiddenTextDescribedById:N}));function Fe(){let e=k?.autoScrollEnabled===!1,t=typeof r==`object`?r.enabled===!1:r===!1,n=g&&!e&&!t;return typeof r==`object`?{...r,enabled:n}:{enabled:n}}}),on=(0,v.createContext)(null),sn=`button`,cn=`Draggable`;function ln(e){let{id:t,data:n,disabled:r=!1,attributes:i}=e,a=ne(cn),{activators:o,activatorEvent:s,active:c,activeNodeRect:l,ariaDescribedById:u,draggableNodes:d,over:f}=(0,v.useContext)(Jt),{role:p=sn,roleDescription:m=`draggable`,tabIndex:h=0}=i??{},g=c?.id===t,_=(0,v.useContext)(g?nn:on),[y,b]=j(),[x,S]=j(),C=It(o,t),w=te(n);return O(()=>(d.set(t,{id:t,key:a,node:y,activatorNode:x,data:w}),()=>{let e=d.get(t);e&&e.key===a&&d.delete(t)}),[d,t]),{active:c,activatorEvent:s,activeNodeRect:l,attributes:(0,v.useMemo)(()=>({role:p,tabIndex:h,"aria-disabled":r,"aria-pressed":g&&p===sn?!0:void 0,"aria-roledescription":m,"aria-describedby":u.draggable}),[r,p,h,g,m,u.draggable]),isDragging:g,listeners:r?void 0:C,node:y,over:f,setNodeRef:b,setActivatorNodeRef:S,transform:_}}function un(){return(0,v.useContext)(Yt)}var dn=`Droppable`,fn={timeout:25};function pn(e){let{data:t,disabled:n=!1,id:r,resizeObserverConfig:i}=e,a=ne(dn),{active:o,dispatch:s,over:c,measureDroppableContainers:l}=(0,v.useContext)(Jt),u=(0,v.useRef)({disabled:n}),d=(0,v.useRef)(!1),f=(0,v.useRef)(null),p=(0,v.useRef)(null),{disabled:m,updateMeasurementsFor:h,timeout:g}={...fn,...i},_=te(h??r),y=Dt({callback:(0,v.useCallback)(()=>{if(!d.current){d.current=!0;return}p.current!=null&&clearTimeout(p.current),p.current=setTimeout(()=>{l(Array.isArray(_.current)?_.current:[_.current]),p.current=null},g)},[g]),disabled:m||!o}),[b,x]=j((0,v.useCallback)((e,t)=>{y&&(t&&(y.unobserve(t),d.current=!1),e&&y.observe(e))},[y])),S=te(t);return(0,v.useEffect)(()=>{!y||!b.current||(y.disconnect(),d.current=!1,y.observe(b.current))},[b,y]),(0,v.useEffect)(()=>(s({type:W.RegisterDroppable,element:{id:r,key:a,disabled:n,node:b,rect:f,data:S}}),()=>s({type:W.UnregisterDroppable,key:a,id:r})),[r]),(0,v.useEffect)(()=>{n!==u.current.disabled&&(s({type:W.SetDroppableDisabled,id:r,key:a,disabled:n}),u.current.disabled=n)},[r,a,n,s]),{active:o,rect:f,isOver:c?.id===r,node:b,over:c,setNodeRef:x}}function mn(e,t,n){let r=e.slice();return r.splice(n<0?r.length+n:n,0,r.splice(t,1)[0]),r}function hn(e,t){return e.reduce((e,n,r)=>{let i=t.get(n);return i&&(e[r]=i),e},Array(e.length))}function gn(e){return e!==null&&e>=0}function _n(e,t){if(e===t)return!0;if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}function vn(e){return typeof e==`boolean`?{draggable:e,droppable:e}:e}var yn=e=>{let{rects:t,activeIndex:n,overIndex:r,index:i}=e,a=mn(t,r,n),o=t[i],s=a[i];return!s||!o?null:{x:s.left-o.left,y:s.top-o.top,scaleX:s.width/o.width,scaleY:s.height/o.height}},bn=`Sortable`,xn=v.createContext({activeIndex:-1,containerId:bn,disableTransforms:!1,items:[],overIndex:-1,useDragOverlay:!1,sortedRects:[],strategy:yn,disabled:{draggable:!1,droppable:!1}});function Sn(e){let{children:t,id:n,items:r,strategy:i=yn,disabled:a=!1}=e,{active:o,dragOverlay:s,droppableRects:c,over:l,measureDroppableContainers:u}=un(),d=ne(bn,n),f=s.rect!==null,p=(0,v.useMemo)(()=>r.map(e=>typeof e==`object`&&`id`in e?e.id:e),[r]),m=o!=null,h=o?p.indexOf(o.id):-1,g=l?p.indexOf(l.id):-1,_=(0,v.useRef)(p),y=!_n(p,_.current),b=g!==-1&&h===-1||y,x=vn(a);O(()=>{y&&m&&u(p)},[y,p,m,u]),(0,v.useEffect)(()=>{_.current=p},[p]);let S=(0,v.useMemo)(()=>({activeIndex:h,containerId:d,disabled:x,disableTransforms:b,items:p,overIndex:g,useDragOverlay:f,sortedRects:hn(p,c),strategy:i}),[h,d,x.draggable,x.droppable,b,p,g,c,f,i]);return v.createElement(xn.Provider,{value:S},t)}var Cn=e=>{let{id:t,items:n,activeIndex:r,overIndex:i}=e;return mn(n,r,i).indexOf(t)},wn=e=>{let{containerId:t,isSorting:n,wasDragging:r,index:i,items:a,newIndex:o,previousItems:s,previousContainerId:c,transition:l}=e;return!l||!r||s!==a&&i===o?!1:n?!0:o!==i&&t===c},Tn={duration:200,easing:`ease`},En=`transform`,Dn=R.Transition.toString({property:En,duration:0,easing:`linear`}),On={roleDescription:`sortable`};function kn(e){let{disabled:t,index:n,node:r,rect:i}=e,[a,o]=(0,v.useState)(null),s=(0,v.useRef)(n);return O(()=>{if(!t&&n!==s.current&&r.current){let e=i.current;if(e){let t=Y(r.current,{ignoreTransform:!0}),n={x:e.left-t.left,y:e.top-t.top,scaleX:e.width/t.width,scaleY:e.height/t.height};(n.x||n.y)&&o(n)}}n!==s.current&&(s.current=n)},[t,n,r,i]),(0,v.useEffect)(()=>{a&&o(null)},[a]),a}function An(e){let{animateLayoutChanges:t=wn,attributes:n,disabled:r,data:i,getNewIndex:a=Cn,id:o,strategy:s,resizeObserverConfig:c,transition:l=Tn}=e,{items:u,containerId:d,activeIndex:f,disabled:p,disableTransforms:m,sortedRects:h,overIndex:g,useDragOverlay:_,strategy:b}=(0,v.useContext)(xn),x=jn(r,p),S=u.indexOf(o),C=(0,v.useMemo)(()=>({sortable:{containerId:d,index:S,items:u},...i}),[d,i,S,u]),w=(0,v.useMemo)(()=>u.slice(u.indexOf(o)),[u,o]),{rect:T,node:E,isOver:D,setNodeRef:O}=pn({id:o,data:C,disabled:x.droppable,resizeObserverConfig:{updateMeasurementsFor:w,...c}}),{active:k,activatorEvent:ee,activeNodeRect:te,attributes:A,setNodeRef:j,listeners:M,isDragging:N,over:ne,setActivatorNodeRef:re,transform:P}=ln({id:o,data:C,attributes:{...On,...n},disabled:x.draggable}),F=y(O,j),I=!!k,ie=I&&!m&&gn(f)&&gn(g),ae=!_&&N,oe=ie?(ae&&ie?P:null)??(s??b)({rects:h,activeNodeRect:te,activeIndex:f,overIndex:g,index:S}):null,z=gn(f)&&gn(g)?a({id:o,items:u,activeIndex:f,overIndex:g}):S,B=k?.id,V=(0,v.useRef)({activeId:B,items:u,newIndex:z,containerId:d}),se=u!==V.current.items,H=t({active:k,containerId:d,isDragging:N,isSorting:I,id:o,index:S,items:u,newIndex:V.current.newIndex,previousItems:V.current.items,previousContainerId:V.current.containerId,transition:l,wasDragging:V.current.activeId!=null}),ce=kn({disabled:!H,index:S,node:E,rect:T});return(0,v.useEffect)(()=>{I&&V.current.newIndex!==z&&(V.current.newIndex=z),d!==V.current.containerId&&(V.current.containerId=d),u!==V.current.items&&(V.current.items=u)},[I,z,d,u]),(0,v.useEffect)(()=>{if(B===V.current.activeId)return;if(B!=null&&V.current.activeId==null){V.current.activeId=B;return}let e=setTimeout(()=>{V.current.activeId=B},50);return()=>clearTimeout(e)},[B]),{active:k,activeIndex:f,attributes:A,data:C,rect:T,index:S,newIndex:z,items:u,isOver:D,isSorting:I,isDragging:N,listeners:M,node:E,overIndex:g,over:ne,setNodeRef:F,setActivatorNodeRef:re,setDroppableNodeRef:O,setDraggableNodeRef:j,transform:ce??oe,transition:le()};function le(){if(ce||se&&V.current.newIndex===S)return Dn;if(!(ae&&!L(ee)||!l)&&(I||H))return R.Transition.toString({...l,property:En})}}function jn(e,t){return typeof e==`boolean`?{draggable:e,droppable:!1}:{draggable:e?.draggable??t.draggable,droppable:e?.droppable??t.droppable}}Q.Down,Q.Right,Q.Up,Q.Left;function Mn(){let[e,n]=(0,v.useState)([]),[o,c]=(0,v.useState)(!0);return(0,v.useEffect)(()=>r(s(t(a,`events`),i(`date`,`asc`)),e=>{n(e.docs.map(e=>({id:e.id,...e.data(),imageUrls:e.data().imageUrls??[],createdAt:e.data().createdAt?.toDate()??new Date,updatedAt:e.data().updatedAt?.toDate()??new Date}))),c(!1)}),[]),{events:e,loading:o}}function Nn(){let[e,t]=(0,v.useState)({mirrorUrls:[],cuteUrls:[]}),[n,i]=(0,v.useState)(!0);return(0,v.useEffect)(()=>r(l(a,`config`,`galleries`),e=>{if(e.exists()){let n=e.data();t({mirrorUrls:n.mirrorUrls??[],cuteUrls:n.cuteUrls??[]})}i(!1)}),[]),{galleries:e,loading:n}}var $=c();function Pn(e){let t=new Date;t.setHours(0,0,0,0);let n=new Date(e);return n.setHours(0,0,0,0),Math.round((n.getTime()-t.getTime())/(1e3*60*60*24))}function Fn({event:e,isPast:t}){let n=d(),r=Pn(e.date);return(0,$.jsxs)(`div`,{className:r===0&&!t?`ec-card ec-card-today`:`ec-card`,style:{opacity:t?.5:1},onClick:()=>n(`/events/${e.id}`),children:[(0,$.jsx)(`div`,{className:`ec-media`,children:e.iconUrl?(0,$.jsx)(`img`,{src:e.iconUrl,alt:``,className:`ec-photo`,loading:`eager`,decoding:`async`,fetchPriority:`high`}):(0,$.jsx)(`div`,{className:`ec-emoji-bg`,children:e.emoji})}),(0,$.jsxs)(`div`,{className:`ec-info`,children:[(0,$.jsx)(`div`,{className:`ec-title`,children:e.title}),(0,$.jsx)(`div`,{className:`ec-date`,children:e.date}),e.memo&&(0,$.jsx)(`div`,{className:`ec-memo`,children:e.memo}),(0,$.jsx)(`div`,{className:`ec-countdown`,children:r===0?(0,$.jsx)(`span`,{className:`ec-today`,children:`Today 🎉`}):t?(0,$.jsxs)(`span`,{className:`ec-past-days`,children:[Math.abs(r),`日前`]}):(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(`div`,{className:`ec-days`,children:r}),(0,$.jsx)(`div`,{className:`ec-days-label`,children:`days`})]})})]})]})}var In=`2024-09-21`,Ln=`/Event_Countdown_App/images/together.webp`;function Rn(e){let t=new Date(e);t.setHours(0,0,0,0);let n=new Date;n.setHours(0,0,0,0);let r=Math.max(0,Math.floor((n.getTime()-t.getTime())/864e5)),i=n.getFullYear()-t.getFullYear(),a=n.getMonth()-t.getMonth(),o=n.getDate()-t.getDate();if(o<0){--a;let e=new Date(n.getFullYear(),n.getMonth(),0);o+=e.getDate()}return a<0&&(--i,a+=12),{totalDays:r,years:i,months:a,days:o}}var zn=`
  .tc-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
  }
  .tc-trigger {
    background: rgba(229,166,220,0.18);
    border: 1px solid rgba(200, 185, 225, 0.55);
    border-radius: 50%;
    width: 2.6rem;
    height: 2.6rem;
    font-size: 1.3rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 0 0 2px rgba(200, 185, 225, 0.18);
  }
  .tc-trigger:hover {
    background: rgba(229,166,220,0.32);
    transform: scale(1.05);
    border-color: rgba(200, 185, 225, 0.75);
    box-shadow: 0 0 0 2px rgba(200, 185, 225, 0.28), 0 2px 8px rgba(200, 185, 225, 0.3);
  }
  .tc-trigger[aria-expanded="true"] {
    background: rgba(229,166,220,0.4);
    border-color: rgba(200, 185, 225, 0.75);
  }
  .tc-trigger-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .tc-popover {
    position: absolute;
    top: calc(100% + 0.55rem);
    left: 50%;
    transform: translateX(-50%);
    min-width: 16rem;
    padding: 1rem 1.25rem 1.05rem;
    background: rgba(255, 235, 245, 0.85);
    backdrop-filter: blur(12px) saturate(140%);
    -webkit-backdrop-filter: blur(12px) saturate(140%);
    border: 1px solid rgba(230, 138, 182, 0.4);
    border-radius: 1rem;
    box-shadow:
      0 12px 32px rgba(230, 138, 182, 0.18),
      0 2px 6px rgba(230, 138, 182, 0.08);
    text-align: center;
    z-index: 20;
    animation: tc-fadein 0.18s ease-out;
    pointer-events: auto;
  }
  /* 矢印: ポップオーバーと同じ枠線がVの字に繋がるように
     border-top + border-left だけを付ける（rotate(45deg)後に上向きの角になる辺） */
  .tc-popover::before {
    content: '';
    position: absolute;
    top: -0.42rem;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 0.75rem;
    height: 0.75rem;
    background: rgba(255, 235, 245, 0.85);
    backdrop-filter: blur(12px) saturate(140%);
    -webkit-backdrop-filter: blur(12px) saturate(140%);
    border-top: 1px solid rgba(230, 138, 182, 0.4);
    border-left: 1px solid rgba(230, 138, 182, 0.4);
  }
  @keyframes tc-fadein {
    from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  .tc-label {
    font-family: "Dancing Script", cursive;
    font-size: 1.3rem;
    color: var(--pink);
    line-height: 1;
    letter-spacing: 0.03em;
  }
  .tc-count {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.35rem;
    margin: 0.3rem 0 0.25rem;
  }
  .tc-days {
    font-family: "Dancing Script", cursive;
    font-size: 2.6rem;
    color: var(--pink-dark);
    line-height: 1;
  }
  .tc-unit {
    font-family: "Dancing Script", cursive;
    font-size: 1.05rem;
    color: var(--text-light);
  }
  .tc-sub {
    font-size: 0.82rem;
    color: var(--text-light);
    line-height: 1.4;
  }
  .tc-since {
    display: block;
    opacity: 0.6;
    font-size: 0.72rem;
    margin-top: 0.15rem;
  }

  @media (max-width: 767px) {
    .tc-trigger { width: 2.2rem; height: 2.2rem; font-size: 1.15rem; border-width: 1.2px; }
    .tc-popover { min-width: 14rem; padding: 0.85rem 1rem 0.95rem; }
    .tc-days { font-size: 2.2rem; }
    .tc-label { font-size: 1.15rem; }
  }
  @media (max-width: 480px) {
    .tc-trigger { width: 1.95rem; height: 1.95rem; font-size: 1rem; }
  }
`;function Bn(){let[e,t]=(0,v.useState)(()=>Rn(In)),[n,r]=(0,v.useState)(!1),[i,a]=(0,v.useState)(!1),o=(0,v.useRef)(null);(0,v.useEffect)(()=>{let e=window.setInterval(()=>t(Rn(In)),6e4);return()=>window.clearInterval(e)},[]),(0,v.useEffect)(()=>{let{totalDays:t,months:n,days:r}=e;if(t<=0)return;let i=n===0&&r===0,a=t%100==0;if(!i&&!a)return;let o=()=>f({particleCount:70,spread:65,colors:[`#e68ab6`,`#ffd1e0`,`#fff0f5`,`#f9c8d9`,`#ff9ec4`],origin:{y:.25}});o();let s=window.setTimeout(o,1800);return()=>window.clearTimeout(s)},[]),(0,v.useEffect)(()=>{if(!n)return;let e=e=>{o.current?.contains(e.target)||r(!1)};return document.addEventListener(`mousedown`,e),document.addEventListener(`touchstart`,e),()=>{document.removeEventListener(`mousedown`,e),document.removeEventListener(`touchstart`,e)}},[n]);let{totalDays:s,years:c,months:l,days:u}=e,d=[c>0?`${c}年`:``,l>0?`${l}ヶ月`:``,`${u}日`].filter(Boolean).join(``);return(0,$.jsxs)(`div`,{ref:o,className:`tc-wrap`,onMouseEnter:()=>r(!0),onMouseLeave:()=>r(!1),children:[(0,$.jsx)(`style`,{children:zn}),(0,$.jsx)(`button`,{type:`button`,className:`tc-trigger`,onClick:()=>r(e=>!e),"aria-label":`Together counter`,"aria-expanded":n,children:i?`👫`:(0,$.jsx)(`img`,{src:Ln,alt:``,className:`tc-trigger-img`,onError:()=>a(!0),draggable:!1})}),n&&(0,$.jsxs)(`div`,{className:`tc-popover`,role:`tooltip`,children:[(0,$.jsx)(`div`,{className:`tc-label`,children:`✨ Together ✨`}),(0,$.jsxs)(`div`,{className:`tc-count`,children:[(0,$.jsx)(`span`,{className:`tc-days`,children:s.toLocaleString()}),(0,$.jsx)(`span`,{className:`tc-unit`,children:`days`})]}),(0,$.jsxs)(`div`,{className:`tc-sub`,children:[d,(0,$.jsxs)(`span`,{className:`tc-since`,children:[`since `,`2024-09-21`]})]})]})]})}var Vn=`
  html { font-size: clamp(2px, 1.25vw, 16px); }
  .hp-body { background-color: #fff0f5; font-family: sans-serif; overflow-x: hidden; min-height: 100svh; }

  /* === Header === */
  .hp-header {
    height: 4rem; width: 100%;
    background-color: rgba(207,220,231,0.45);
    position: sticky; top: 0; z-index: 10;
    display: flex; align-items: center; padding: 0 1.2rem; gap: 0.8rem;
    backdrop-filter: blur(8px);
  }
  .hp-logo-wrap {
    flex: 1; display: flex; align-items: center; gap: 0.8rem; min-width: 0;
  }
  .hp-logo {
    font-family: "Dancing Script", cursive;
    font-size: 2.5rem; color: var(--pink);
    white-space: nowrap;
  }
  .hp-nav-btn {
    font-size: 1.2rem; font-family: "Dancing Script", cursive;
    padding: 0.45rem 1.15rem;
    background-color: rgba(229,166,220,0.7); color: #fff;
    border-radius: 0.65rem; box-shadow: 0 0.15rem #cbcbcb;
    border: none; cursor: pointer; white-space: nowrap;
  }
  .hp-nav-btn:active { position: relative; top: 0.15rem; box-shadow: none; }
  .hp-nav-btn:hover { background-color: rgba(229,166,220,0.85); }
  .hp-icon-btn {
    background: var(--pink); color: #fff;
    border-radius: 50%; width: 2.3rem; height: 2.3rem;
    font-size: 1.25rem; line-height: 1; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0.15rem #cbcbcb; border: none; cursor: pointer;
  }
  .hp-logout-btn {
    background: none; color: var(--text-light); font-size: 0.95rem;
    white-space: nowrap; border: none; cursor: pointer;
  }

  /* === Main 2-col Grid === */
  .hp-main {
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    gap: 1.8rem;
    max-width: 1400px; margin: 0 auto;
    padding: 1.5rem 2rem 3rem;
    align-items: start;
  }
  .hp-events-section { min-width: 0; }
  .hp-memories-section {
    background-color: #f9f0d7;
    border-radius: 1rem;
    padding: 1rem 1rem 1.5rem;
    position: sticky; top: 5rem;
    min-width: 0;
    box-shadow: 0 4px 18px rgba(180,150,80,0.12);
  }

  /* === Section title === */
  .hp-section-title {
    font-family: "Dancing Script", cursive;
    color: rgba(230,138,182,0.9);
    font-size: 2.2rem;
    margin: 0 0 0.8rem;
    text-align: left;
  }

  /* === Events === */
  .hp-sub-title {
    font-size: 1.15rem; color: var(--text-light);
    margin-bottom: 0.5rem; margin-top: 1rem;
    font-family: "Dancing Script", cursive;
  }
  .hp-sub-title:first-of-type { margin-top: 0; }
  .hp-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.7rem; }
  .hp-events-empty { color: var(--text-light); font-size: 0.9rem; }

  /* 過去イベントの開閉ボタン */
  .hp-past-toggle { display: flex; justify-content: center; margin-top: 0.8rem; }
  .hp-past-toggle-btn {
    font-size: 0.9rem; padding: 0.35rem 1rem;
    border-radius: 0.6rem; border: 1.5px solid var(--pink);
    color: var(--pink); background: rgba(255,255,255,0.6);
    cursor: pointer; transition: background 0.15s;
    font-family: inherit;
  }
  .hp-past-toggle-btn:hover { background: rgba(230,138,182,0.18); }

  /* === Event Cards === */
  .ec-card {
    background: var(--card-bg); border-radius: 1.2rem;
    box-shadow: var(--shadow); cursor: pointer; overflow: hidden;
    transition: transform 0.15s;
  }
  .ec-card:hover { transform: translateY(-3px); }

  /* 当日カード: 枠に光点を散らした静的キラキラ + ふんわり明滅 */
  .ec-card-today {
    position: relative;
    box-shadow: 0 4px 18px rgba(230, 138, 182, 0.22);
  }
  .ec-card-today::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 3.5px;
    border-radius: inherit;
    background: conic-gradient(
      from 0deg,
      rgba(230, 138, 182, 0.55) 0%,
      #ffffff 7%,
      rgba(230, 138, 182, 0.55) 14%,
      rgba(230, 138, 182, 0.45) 23%,
      #ffe4ef 30%,
      rgba(230, 138, 182, 0.45) 37%,
      rgba(230, 138, 182, 0.55) 48%,
      #ffffff 55%,
      rgba(230, 138, 182, 0.55) 62%,
      rgba(230, 138, 182, 0.45) 73%,
      #ffe4ef 80%,
      rgba(230, 138, 182, 0.45) 87%,
      rgba(230, 138, 182, 0.55) 100%
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    animation: ec-today-twinkle 2.6s ease-in-out infinite;
    pointer-events: none;
    z-index: 2;
  }
  @keyframes ec-today-twinkle {
    0%, 100% { opacity: 0.85; }
    50%      { opacity: 1; }
  }
  .ec-media { width: 100%; aspect-ratio: 4/3; position: relative; overflow: hidden; }
  .ec-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ec-emoji-bg {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #fce4ec, #f8bbd0);
    font-size: 2rem;
  }
  .ec-upload-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.28);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.2s; font-size: 2rem;
    cursor: pointer; pointer-events: none;
  }
  .ec-media:hover .ec-upload-overlay { opacity: 1; pointer-events: auto; }
  .ec-info { padding: 0.45rem 0.6rem 0.6rem; }
  .ec-title {
    font-family: "Dancing Script", cursive; font-size: 0.95rem; color: var(--text);
    display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
    overflow: hidden; word-break: break-word; line-height: 1.2;
  }
  .ec-date { font-size: 0.7rem; color: var(--text-light); margin-top: 0.1rem; }
  .ec-memo {
    font-size: 0.65rem; color: var(--text-light); margin-top: 0.15rem;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    opacity: 0.8;
  }
  .ec-countdown { margin-top: 0.2rem; text-align: right; }
  .ec-days { font-family: "Dancing Script", cursive; font-size: 1.2rem; color: var(--pink); line-height: 1; }
  .ec-days-label { font-size: 0.6rem; color: var(--text-light); }
  .ec-today { color: var(--pink); font-family: "Dancing Script", cursive; font-size: 1.7rem; line-height: 1; }
  .ec-past-days { color: var(--text-light); font-size: 0.7rem; }

  /* === Memories === */
  .hp-gallery-block { margin-bottom: 1.2rem; }
  .hp-gallery-block:last-child { margin-bottom: 0; }
  .hp-gallery-frame {
    background: linear-gradient(90deg, #b39855 0%, #fff9e6 50%, #b39855 100%);
    border: 0.35rem solid #c9c9c9;
    padding: 0.6rem 0.6rem 1.2rem;
  }
  .hp-gallery-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0; gap: 0.6rem; padding: 0 0.4rem;
  }
  .hp-gallery-name {
    font-family: "Kaushan Script", cursive;
    font-size: 1.6rem; color: rgb(140,140,140); margin: 0;
  }
  .hp-gallery-action-btn {
    font-size: 0.85rem; padding: 0.3rem 0.7rem;
    border-radius: 0.6rem; border: 1.5px solid var(--pink);
    color: var(--pink); background: rgba(255,255,255,0.6);
    white-space: nowrap; cursor: pointer;
  }
  .hp-gallery-action-btn:hover { background: rgba(230,138,182,0.25); }
  .hp-gallery-action-btn.done { background: var(--pink); color: #fff; }
  .hp-gallery-action-btn.done:hover { background: var(--pink-dark); }
  .hp-gallery-actions { display: flex; gap: 0.4rem; }

  /* 通常表示 */
  .hp-gallery-scroll {
    display: flex; overflow-x: auto;
    scroll-snap-type: x mandatory; gap: 0.6rem; padding: 0.8rem 0.5rem 0.5rem;
  }
  .hp-gallery-img {
    height: 15rem; border: 0.15rem solid rgb(128,128,128);
    border-radius: 0.6rem; object-fit: cover; display: block;
    scroll-snap-align: start; flex-shrink: 0;
    cursor: zoom-in; transition: transform 0.2s ease;
  }
  .hp-gallery-img:hover { transform: scale(1.02); }

  /* === Lightbox === */
  .hp-lightbox {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.85);
  }
  .hp-lightbox-scroll {
    width: 100%; height: 100%;
    display: flex; overflow-x: auto; overflow-y: hidden;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .hp-lightbox-scroll::-webkit-scrollbar { display: none; }
  .hp-lightbox-slide {
    flex: 0 0 100%; height: 100%;
    scroll-snap-align: center; scroll-snap-stop: always;
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem; box-sizing: border-box;
  }
  .hp-lightbox-slide img {
    max-width: 100%; max-height: 100%;
    border-radius: 1rem; object-fit: contain;
    box-shadow: 0 0 40px rgba(0,0,0,0.4);
  }
  .hp-lightbox-close {
    position: absolute; top: 0.75rem; right: 0.75rem;
    z-index: 1; border: none; background: rgba(255,255,255,0.95);
    color: #333; font-size: 2rem; width: 3rem; height: 3rem;
    border-radius: 50%; cursor: pointer; line-height: 1; padding: 0;
  }
  .hp-lightbox-close:hover { background: rgba(255,255,255,1); }
  .hp-lightbox-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    z-index: 1; border: none; background: rgba(255,255,255,0.9);
    color: #333; font-size: 2rem; width: 3rem; height: 3rem;
    border-radius: 50%; cursor: pointer; line-height: 1; padding: 0;
  }
  .hp-lightbox-nav.prev { left: 0.75rem; }
  .hp-lightbox-nav.next { right: 0.75rem; }
  .hp-lightbox-nav:hover { background: rgba(255,255,255,1); }
  .hp-lightbox-counter {
    position: absolute; bottom: 0.75rem; left: 50%;
    transform: translateX(-50%); z-index: 1;
    color: #fff; font-size: 0.9rem; padding: 0.3rem 0.8rem;
    background: rgba(0,0,0,0.4); border-radius: 1rem;
    pointer-events: none;
  }
  @media (max-width: 767px) {
    .hp-lightbox-nav { display: none; }
    .hp-lightbox-slide { padding: 0.5rem; }
  }

  /* 編集モード */
  .hp-edit-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem; padding: 0.8rem 0.5rem;
  }
  .hp-edit-photo {
    position: relative; border-radius: 0.4rem;
    overflow: hidden; aspect-ratio: 1; touch-action: none;
    border: 0.15rem solid rgb(128,128,128);
  }
  .hp-edit-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hp-delete-badge {
    position: absolute; top: 0.2rem; right: 0.2rem;
    background: rgba(220,0,50,0.85); color: #fff;
    border-radius: 50%; width: 1.5rem; height: 1.5rem;
    font-size: 0.9rem; line-height: 1.5rem; text-align: center;
    box-shadow: 0 1px 4px rgba(0,0,0,0.3); border: none; cursor: pointer;
  }
  .hp-drag-hint {
    position: absolute; bottom: 0.2rem; left: 0.3rem;
    color: rgba(255,255,255,0.85); font-size: 1rem; line-height: 1;
    pointer-events: none;
    text-shadow: 0 0 4px rgba(0,0,0,0.4);
  }
  .hp-gallery-empty {
    color: rgb(167,167,167); font-size: 0.9rem;
    padding: 1.5rem 0.5rem; text-align: center;
  }

  /* === Tablet: stack columns === */
  @media (max-width: 1023px) {
    .hp-main {
      grid-template-columns: 1fr;
      gap: 1.5rem; padding: 1.2rem 1.5rem 2.5rem;
    }
    .hp-memories-section { position: static; }
    .hp-gallery-img { height: 18rem; }
    .hp-cards { grid-template-columns: repeat(auto-fill, minmax(125px, 1fr)); gap: 0.6rem; }
  }

  /* === Mobile === */
  @media (max-width: 767px) {
    html { font-size: 13px; }
    .hp-header {
      height: auto; padding: 0.6rem 0.8rem; gap: 0.45rem;
      flex-wrap: wrap;
    }
    .hp-logo-wrap { gap: 0.55rem; }
    .hp-logo { font-size: 2.05rem; }
    .hp-nav-btn { font-size: 1.05rem; padding: 0.38rem 0.85rem; border-radius: 0.55rem; }
    .hp-icon-btn { width: 2.1rem; height: 2.1rem; font-size: 1.1rem; }
    .hp-logout-btn { font-size: 0.88rem; }

    .hp-main { padding: 0.8rem 0.8rem 2rem; gap: 1.2rem; }
    .hp-memories-section { padding: 0.7rem 0.7rem 1rem; border-radius: 0.7rem; }
    .hp-section-title { font-size: 1.8rem; margin-bottom: 0.6rem; }
    .hp-sub-title { font-size: 1rem; margin-top: 0.7rem; }
    .hp-events-empty { font-size: 0.85rem; }

    .hp-cards { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 0.5rem; }
    .ec-title { font-size: 0.9rem; }
    .ec-days { font-size: 1.15rem; }
    .ec-today { font-size: 1.55rem; }
    .ec-info { padding: 0.35rem 0.5rem 0.5rem; }
    .ec-emoji-bg { font-size: 1.8rem; }

    .hp-gallery-block { margin-bottom: 0.8rem; }
    .hp-gallery-frame { padding: 0.4rem 0.3rem 0.8rem; border-width: 0.2rem; }
    .hp-gallery-header { padding: 0 0.3rem; }
    .hp-gallery-name { font-size: 1.3rem; }
    .hp-gallery-action-btn { font-size: 0.75rem; padding: 0.25rem 0.55rem; }
    .hp-gallery-scroll { padding: 0.6rem 0.3rem 0.3rem; gap: 0.4rem; }
    .hp-gallery-img { height: 13rem; border-width: 0.12rem; border-radius: 0.4rem; }
    .hp-edit-grid { gap: 0.35rem; padding: 0.5rem 0.3rem; }
    .hp-delete-badge { width: 1.3rem; height: 1.3rem; font-size: 0.8rem; line-height: 1.3rem; }
    .hp-gallery-empty { font-size: 0.85rem; padding: 1rem 0.5rem; }
  }

  /* === Narrow phones (iPhone SE etc.) === */
  /* ヘッダーを1行に収めるため、ボタンとロゴをもう一段コンパクトに */
  @media (max-width: 480px) {
    .hp-header { padding: 0.5rem 0.55rem; gap: 0.35rem; }
    .hp-logo-wrap { gap: 0.4rem; }
    .hp-logo { font-size: 1.7rem; }
    .hp-nav-btn { font-size: 0.9rem; padding: 0.3rem 0.65rem; border-radius: 0.5rem; }
    .hp-icon-btn { width: 1.85rem; height: 1.85rem; font-size: 0.95rem; }
    .hp-logout-btn { font-size: 0.78rem; }
  }
`;function Hn({url:e,onDelete:t}){let{attributes:n,listeners:r,setNodeRef:i,transform:a,transition:o,isDragging:s}=An({id:e});return(0,$.jsxs)(`div`,{ref:i,className:`hp-edit-photo`,style:{transform:R.Transform.toString(a),transition:o,opacity:s?.5:1,cursor:s?`grabbing`:`grab`},...n,...r,children:[(0,$.jsx)(`img`,{src:e,alt:``,loading:`lazy`,decoding:`async`}),(0,$.jsx)(`button`,{className:`hp-delete-badge`,onPointerDown:e=>e.stopPropagation(),onClick:e=>{e.stopPropagation(),t()},children:`×`}),(0,$.jsx)(`span`,{className:`hp-drag-hint`,children:`⠿`})]})}function Un({title:e,urls:t,gallery:n,isAdmin:r,onOpen:i}){let[a,o]=(0,v.useState)(!1),[s,c]=(0,v.useState)([]),[l,u]=(0,v.useState)(!1),d=(0,v.useRef)(null),f=me(pe(st),pe(ft,{activationConstraint:{delay:200,tolerance:5}})),h=()=>{c([...t]),o(!0)},_=async()=>{o(!1),await p(n,s)},y=e=>{let{active:t,over:n}=e;n&&t.id!==n.id&&c(e=>mn(e,e.indexOf(t.id),e.indexOf(n.id)))},b=e=>{confirm(`この写真を削除しますか？`)&&c(t=>t.filter(t=>t!==e))},x=async e=>{u(!0);let t=[];for(let r of Array.from(e)){let e=await m(r,`galleries`,n,`gallery`);t.push(e),c(t=>[...t,e])}await g(n,t),u(!1)},S=a?s:t;return(0,$.jsx)(`div`,{className:`hp-gallery-block`,children:(0,$.jsxs)(`div`,{className:`hp-gallery-frame`,children:[(0,$.jsxs)(`div`,{className:`hp-gallery-header`,children:[(0,$.jsx)(`p`,{className:`hp-gallery-name`,children:e}),r&&(0,$.jsx)(`div`,{className:`hp-gallery-actions`,children:a?(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(`input`,{ref:d,type:`file`,accept:`image/*`,multiple:!0,style:{display:`none`},onChange:e=>e.target.files&&x(e.target.files)}),(0,$.jsx)(`button`,{className:`hp-gallery-action-btn`,onClick:()=>d.current?.click(),children:l?`追加中…`:`+ 追加`}),(0,$.jsx)(`button`,{className:`hp-gallery-action-btn done`,onClick:_,children:`完了`})]}):(0,$.jsx)(`button`,{className:`hp-gallery-action-btn`,onClick:h,children:`編集`})})]}),S.length===0?(0,$.jsx)(`p`,{className:`hp-gallery-empty`,children:`写真がまだありません`}):a?(0,$.jsx)(an,{sensors:f,collisionDetection:ye,onDragEnd:y,children:(0,$.jsx)(Sn,{items:s,strategy:yn,children:(0,$.jsx)(`div`,{className:`hp-edit-grid`,children:s.map(e=>(0,$.jsx)(Hn,{url:e,onDelete:()=>b(e)},e))})})}):(0,$.jsx)(`div`,{className:`hp-gallery-scroll`,children:S.map((e,t)=>(0,$.jsx)(qn,{src:e,index:t,onClick:()=>i(S,t)},t))})]})})}var Wn=3;function Gn(){let{user:e,signInWithGoogle:t,signOutUser:n}=o(),{events:r,loading:i}=Mn(),{galleries:a}=Nn(),s=d(),[c,l]=(0,v.useState)(null),[u,f]=(0,v.useState)(!1),p=(e,t)=>l({urls:e,index:t}),m=()=>l(null);(0,v.useEffect)(()=>{let e=document.getElementById(`root`);if(!e)return;let t=e.style.maxWidth;return e.style.maxWidth=`100%`,()=>{e.style.maxWidth=t}},[]);let g=new Date().toISOString().split(`T`)[0],_=r.filter(e=>e.date>=g),y=r.filter(e=>e.date<g).reverse(),b=e.state===`admin`,x=e=>document.getElementById(e)?.scrollIntoView({behavior:`smooth`});return(0,$.jsxs)(`div`,{className:`hp-body`,style:{minHeight:`100svh`},children:[(0,$.jsx)(`style`,{children:Vn}),(0,$.jsxs)(`header`,{className:`hp-header`,children:[(0,$.jsxs)(`div`,{className:`hp-logo-wrap`,children:[(0,$.jsx)(`span`,{className:`hp-logo`,children:`Our Home`}),(0,$.jsx)(Bn,{})]}),(0,$.jsx)(`button`,{className:`hp-nav-btn`,onClick:()=>x(`hp-events`),children:`Events`}),(0,$.jsx)(`button`,{className:`hp-nav-btn`,onClick:()=>x(`hp-galleries`),children:`Memories`}),b&&(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(`button`,{className:`hp-icon-btn`,onClick:()=>s(`/events/new`),children:`+`}),(0,$.jsx)(`button`,{className:`hp-logout-btn`,onClick:()=>{window.confirm(`ログアウトしますか？`)&&n()},children:`ログアウト`})]}),e.state===`guest`&&(0,$.jsx)(`button`,{className:`hp-logout-btn`,onClick:()=>t(),children:`ログイン`})]}),(0,$.jsxs)(`div`,{className:`hp-main`,children:[(0,$.jsxs)(`section`,{className:`hp-events-section`,id:`hp-events`,children:[(0,$.jsx)(`h2`,{className:`hp-section-title`,children:`Events`}),i?(0,$.jsx)(`p`,{className:`hp-events-empty`,children:`読み込み中...`}):(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(`p`,{className:`hp-sub-title`,children:`これから`}),_.length===0?(0,$.jsx)(`p`,{className:`hp-events-empty`,children:`イベントがありません`}):(0,$.jsx)(`div`,{className:`hp-cards`,children:_.map(e=>(0,$.jsx)(Fn,{event:e},e.id))}),y.length>0&&(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(`p`,{className:`hp-sub-title`,children:`過去`}),(0,$.jsx)(`div`,{className:`hp-cards`,children:(u?y:y.slice(0,Wn)).map(e=>(0,$.jsx)(Fn,{event:e,isPast:!0},e.id))}),y.length>Wn&&(0,$.jsx)(`div`,{className:`hp-past-toggle`,children:(0,$.jsx)(`button`,{className:`hp-past-toggle-btn`,onClick:()=>f(e=>!e),children:u?`閉じる`:`もっと見る (残り ${y.length-Wn} 件)`})})]})]})]}),(0,$.jsxs)(`aside`,{className:`hp-memories-section`,id:`hp-galleries`,children:[(0,$.jsx)(`h2`,{className:`hp-section-title`,children:`Memories`}),Object.entries(h).map(([e,t])=>(0,$.jsx)(Un,{title:t.title,urls:a[t.field]??[],gallery:e,isAdmin:b,onOpen:p},e))]})]}),c&&(0,$.jsx)(Jn,{urls:c.urls,initialIndex:c.index,onClose:m})]})}var Kn=`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 4'%3E%3C/svg%3E`;function qn({src:e,onClick:t,index:n}){let r=(0,v.useRef)(null),[i,a]=(0,v.useState)(!1);return(0,v.useEffect)(()=>{if(i)return;let e=r.current;if(!e)return;let t=new IntersectionObserver(e=>{e[0].isIntersecting&&(a(!0),t.disconnect())},{rootMargin:`400px`});t.observe(e);let o=600+n*80,s=window.setTimeout(()=>a(!0),o);return()=>{t.disconnect(),window.clearTimeout(s)}},[i,n]),(0,$.jsx)(`img`,{ref:r,src:i?e:Kn,alt:``,className:`hp-gallery-img`,decoding:`async`,onClick:t,style:i?void 0:{background:`rgba(230,138,182,0.12)`}})}function Jn({urls:e,initialIndex:t,onClose:n}){let[r,i]=(0,v.useState)(t),a=(0,v.useRef)(null);(0,v.useLayoutEffect)(()=>{let e=a.current;e&&e.scrollTo({left:e.clientWidth*t,behavior:`instant`})},[t]);let o=(0,v.useCallback)(t=>{let n=a.current;n&&i(r=>{let i=Math.max(0,Math.min(e.length-1,r+t));return i===r?r:(n.scrollTo({left:n.clientWidth*i,behavior:`smooth`}),i)})},[e.length]);return(0,v.useEffect)(()=>{let e=e=>{e.key===`Escape`?n():e.key===`ArrowLeft`?o(-1):e.key===`ArrowRight`&&o(1)},t=document.body.style.overflow;return document.body.style.overflow=`hidden`,window.addEventListener(`keydown`,e),()=>{document.body.style.overflow=t,window.removeEventListener(`keydown`,e)}},[o,n]),(0,$.jsxs)(`div`,{className:`hp-lightbox`,onClick:n,role:`dialog`,"aria-modal":`true`,children:[(0,$.jsx)(`button`,{type:`button`,className:`hp-lightbox-close`,onClick:n,"aria-label":`Close`,children:`×`}),(0,$.jsx)(`div`,{className:`hp-lightbox-scroll`,ref:a,onScroll:()=>{let e=a.current;if(!e)return;let t=Math.round(e.scrollLeft/e.clientWidth);i(e=>e===t?e:t)},children:e.map((e,t)=>(0,$.jsx)(`div`,{className:`hp-lightbox-slide`,children:(0,$.jsx)(`img`,{src:e,alt:``,onClick:e=>e.stopPropagation()})},t))}),r>0&&(0,$.jsx)(`button`,{type:`button`,className:`hp-lightbox-nav prev`,"aria-label":`Previous`,onClick:e=>{e.stopPropagation(),o(-1)},children:`‹`}),r<e.length-1&&(0,$.jsx)(`button`,{type:`button`,className:`hp-lightbox-nav next`,"aria-label":`Next`,onClick:e=>{e.stopPropagation(),o(1)},children:`›`}),e.length>1&&(0,$.jsxs)(`div`,{className:`hp-lightbox-counter`,children:[r+1,` / `,e.length]})]})}export{Gn as default};