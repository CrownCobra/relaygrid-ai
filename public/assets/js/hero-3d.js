// Optional real-time 3D hero visual. CSS orb remains as a fallback if WebGL/CDN is unavailable.
const canvas = document.querySelector('#hero-canvas');
if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js').then(THREE => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 6.1);
    const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true, powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    const group = new THREE.Group(); scene.add(group);
    const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1.04, 5), new THREE.MeshPhysicalMaterial({color:0x259f8b, metalness:.62, roughness:.22, emissive:0x0a4a42, emissiveIntensity:.45, clearcoat:1, clearcoatRoughness:.17}));
    group.add(sphere);
    const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.055, 2), new THREE.MeshBasicMaterial({color:0x8af7d9, wireframe:true, transparent:true, opacity:.18})); group.add(wire);
    const ringMat = new THREE.MeshBasicMaterial({color:0x7ef0cc, transparent:true, opacity:.56});
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.48,.008,8,180), ringMat); ring1.rotation.set(.72,.25,-.36); group.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.8,.006,8,180), new THREE.MeshBasicMaterial({color:0x71c8e8,transparent:true,opacity:.3})); ring2.rotation.set(1.06,-.38,.6); group.add(ring2);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(1.26,.004,8,180), new THREE.MeshBasicMaterial({color:0xc6f277,transparent:true,opacity:.28})); ring3.rotation.set(.15,.92,.8); group.add(ring3);
    const nodes = [];
    const nodeGeo = new THREE.SphereGeometry(.045,12,12);
    [[1.55,.35,.1],[-1.45,.25,.15],[.2,1.5,-.1],[-.35,-1.58,.25],[1.22,-.68,.2]].forEach((p,i)=>{
      const m = new THREE.Mesh(nodeGeo,new THREE.MeshBasicMaterial({color:i%2?0xc6f277:0x9effdf})); m.position.set(...p); group.add(m); nodes.push(m);
    });
    const starCount = 420, positions = new Float32Array(starCount*3);
    for(let i=0;i<starCount;i++){ positions[i*3]=(Math.random()-.5)*8; positions[i*3+1]=(Math.random()-.5)*6; positions[i*3+2]=(Math.random()-.5)*4-1; }
    const starsGeo = new THREE.BufferGeometry(); starsGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const stars = new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0x8bdcc9,size:.012,transparent:true,opacity:.5})); scene.add(stars);
    scene.add(new THREE.AmbientLight(0x8bfff0,1.05));
    const key = new THREE.PointLight(0x8bffdf,30,12); key.position.set(3,3,4); scene.add(key);
    const rim = new THREE.PointLight(0x6aa9ff,16,12); rim.position.set(-3,-2,1); scene.add(rim);
    let width=1,height=1;
    const resize=()=>{const rect=canvas.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();};
    resize(); window.addEventListener('resize',resize,{passive:true});
    let raf=0;
    const draw=()=>{ group.rotation.y+=.0025; group.rotation.x=Math.sin(Date.now()*.00025)*.045; stars.rotation.y-=.00012; nodes.forEach((n,i)=>{n.scale.setScalar(1+Math.sin(Date.now()*.002+i)*.18)}); renderer.render(scene,camera); raf=requestAnimationFrame(draw); };
    const reducedOffscreen = new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){if(!raf)draw()}else if(raf){cancelAnimationFrame(raf);raf=0;}})});
    reducedOffscreen.observe(canvas);
    document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf){cancelAnimationFrame(raf);raf=0}}else if(!raf)draw()});
  }).catch(()=>{/* Keep the accessible CSS fallback visible. */});
}
