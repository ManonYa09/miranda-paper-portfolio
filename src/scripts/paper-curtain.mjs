/** Independent paper transition renderer for this recreation.
 * Uses a textured WebGL sheet, curved edge, fine tear and fold lighting.
 * API follows the site's integration points; no reference shader is included.
 */
export default class PaperCurtainEffect {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = { duration: 2, color: '#1d1d1b', background: '#000000', backgroundOpacity: 0, ...options };
    this.progress = 0;
    this.image = null;
    this.inverted = false;
    this.curtain = {
      uniforms: { uHorizontal: { value: options.horizontal ? 1 : 0 } },
      setColor: (c) => { this.options.color = c; this.draw(); },
      setBackground: (c,a=1) => { this.options.background=c; this.options.backgroundOpacity=a; this.draw(); },
      setInverted: value => { this.inverted=value; },
      setImage: async url => { this.image=await this.loadTexture(url); this.draw(); }
    };
    this.gl = canvas?.getContext('webgl', { alpha:true, premultipliedAlpha:false, antialias:true });
    if (!this.gl) return;
    this.init();
    this.resize = () => {
      const dpr=Math.min(devicePixelRatio || 1,2);
      canvas.width=Math.round(innerWidth*dpr); canvas.height=Math.round(innerHeight*dpr);
      this.gl.viewport(0,0,canvas.width,canvas.height); this.draw();
    };
    addEventListener('resize',this.resize); this.resize();
    this.loadTexture(options.texture).then(texture=>{this.paper=texture;this.draw();});
  }
  init() {
    const gl=this.gl;
    const vertex='attribute vec2 position; varying vec2 uv; void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}';
    const fragment=`precision highp float;
      varying vec2 uv;
      uniform float progress, horizontal, hasImage, hasPaper, backgroundAlpha;
      uniform vec3 ink, backdrop;
      uniform vec2 viewport, imageSize;
      uniform sampler2D paper, picture;
      float grain(float x){return fract(sin(x*173.31+81.7)*41723.13);}
      float noise(float x){float n=floor(x),f=fract(x);return mix(grain(n),grain(n+1.),f*f*(3.-2.*f));}
      void main(){
        vec2 p=mix(uv,uv.yx,horizontal);
        float motion=sin(progress*3.14159265);
        float arch=sin(p.x*3.14159265)*.21 + sin(p.x*6.2831853+progress*2.)*.035;
        float tear=(noise(p.x*63.)-.5)*.014+(noise(p.x*431.)-.5)*.004;
        float edge=progress*1.34-.17 + motion*(arch+tear);
        float distance=edge-p.y;
        float coverage=smoothstep(-.001,.001,distance);
        float fold=exp(-abs(distance)*70.)*motion;
        vec3 tint=ink;
        if(hasPaper>.5){vec3 tex=texture2D(paper,uv).rgb;tint*=mix(vec3(.78),vec3(1.12),tex);}
        if(hasImage>.5){
          float screenRatio=viewport.x/viewport.y,ratio=imageSize.x/imageSize.y;
          vec2 crop=vec2(min(1.,screenRatio/ratio),min(1.,ratio/screenRatio));
          tint=texture2D(picture,(uv-.5)*crop+.5).rgb;
        }
        tint=tint*(1.-fold*.25)+fold*.07;
        float alpha=mix(backgroundAlpha,1.,coverage);
        vec3 rgb=mix(backdrop,tint,coverage);
        gl_FragColor=vec4(rgb,alpha);
      }`;
    const shader=(kind,source)=>{const s=gl.createShader(kind);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;};
    const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);gl.useProgram(program);this.program=program;
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const pos=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
    this.blank=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.blank);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([255,255,255,255]));
  }
  loadTexture(url) {
    if(!url||!this.gl)return Promise.resolve(null);
    return new Promise(resolve=>{
      const img=new Image();img.onload=()=>{
        const gl=this.gl,texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        resolve({texture,width:img.width,height:img.height});
      };img.onerror=()=>resolve(null);img.src=url;
    });
  }
  draw() {
    const gl=this.gl;if(!gl||!this.program)return;
    gl.useProgram(this.program);
    const loc=n=>gl.getUniformLocation(this.program,n),scalar=(n,v)=>gl.uniform1f(loc(n),v);
    const color=c=>{const h=c.replace('#','');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255);};
    scalar('progress',this.progress);scalar('horizontal',this.curtain.uniforms.uHorizontal.value);scalar('backgroundAlpha',this.options.backgroundOpacity);
    scalar('hasImage',this.image?1:0);scalar('hasPaper',this.paper?1:0);
    gl.uniform3fv(loc('ink'),color(this.options.color));gl.uniform3fv(loc('backdrop'),color(this.options.background));
    gl.uniform2f(loc('viewport'),this.canvas.width,this.canvas.height);gl.uniform2f(loc('imageSize'),this.image?.width||1,this.image?.height||1);
    gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.paper?.texture||this.blank);gl.uniform1i(loc('paper'),0);
    gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this.image?.texture||this.blank);gl.uniform1i(loc('picture'),1);gl.drawArrays(gl.TRIANGLES,0,6);
  }
  animate(target) {
    cancelAnimationFrame(this.frame);
    const start=performance.now(),from=this.progress,duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:this.options.duration*1000;
    const frame=now=>{
      const t=duration?Math.min((now-start)/duration,1):1;
      const ease=t<.5?8*t*t*t*t:1-Math.pow(-2*t+2,4)/2;
      this.progress=from+(target-from)*ease;this.draw();
      if(t<1)this.frame=requestAnimationFrame(frame);else document.body.dispatchEvent(new CustomEvent('paper-curtain'));
    };this.frame=requestAnimationFrame(frame);
  }
  in(){this.animate(1);}
  out(){this.animate(0);}
  destroy(){cancelAnimationFrame(this.frame);removeEventListener('resize',this.resize);this.gl?.getExtension('WEBGL_lose_context')?.loseContext();}
}
