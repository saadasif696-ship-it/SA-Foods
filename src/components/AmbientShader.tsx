import React, { useEffect, useRef } from 'react';

export const AmbientShader: React.FC<{ opacity?: number }> = ({ opacity = 0.25 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = Math.min(w, 1920);
        canvas.height = Math.min(h, 1080);
      }
    }

    syncSize();
    window.addEventListener('resize', syncSize);

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_texCoord;

      float rand(vec2 n) {
        return fract(sin(dot(n, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 u = fract(p);
        u = u * u * (3.0 - 2.0 * u);
        return mix(
          mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
          mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float sum = 0.0;
        float amp = 0.5;
        for(int i = 0; i < 3; i++) {
          sum += amp * noise(p);
          p *= 2.0;
          amp *= 0.5;
        }
        return sum;
      }

      void main() {
        vec2 st = v_texCoord;
        vec2 pos = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        float time = u_time * 0.25;

        vec2 q = vec2(fbm(pos + time * 0.15), fbm(pos + vec2(1.0)));
        vec2 r = vec2(fbm(pos + q + time * 0.2), fbm(pos + q + time * 0.15));
        float f = fbm(pos + r);

        // Palette: Deep Black (#070707), Luxury Gold (#D9A35F), Burnt Orange (#C97A2B)
        vec3 col1 = vec3(0.027, 0.027, 0.027); // #070707 base
        vec3 col2 = vec3(0.85, 0.64, 0.37);    // Gold #D9A35F
        vec3 col3 = vec3(0.78, 0.48, 0.17);    // Burnt Orange #C97A2B

        vec3 color = mix(col1, col2, clamp(f * 1.2, 0.0, 1.0));
        color = mix(color, col3, clamp(length(q) * 0.6, 0.0, 1.0));

        // Center vignette & fade off to dark borders
        float dist = length(pos);
        color *= smoothstep(1.3, 0.1, dist);

        // Gentle ember twinkle
        float spark = pow(rand(st * 15.0 + time), 35.0) * 1.5;
        color += vec3(0.9, 0.75, 0.45) * spark * (1.0 - smoothstep(0.0, 1.0, dist));

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function compileShader(type: number, source: string) {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    }

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        mouseX = ((e.clientX - rect.left) / rect.width) * canvas.width;
        mouseY = (1.0 - (e.clientY - rect.top) / rect.height) * canvas.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animId: number;
    function render(t: number) {
      if (!gl || !canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', syncSize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ opacity }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ display: 'block' }}
      />
    </div>
  );
};
