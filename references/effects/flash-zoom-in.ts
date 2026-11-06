// 开场"闪白模糊缩放"入场：画面从放大+径向模糊+过曝状态快速收回清晰
const shader: ShaderDefinition = {
  id: "flash-zoom-in-fragment",
  source: `#version 300 es
precision highp float;
uniform sampler2D u_input;
uniform float u_p;        // 0 = 起始（最强），1 = 结束（原画）
uniform float u_zoom;
uniform float u_blur;
uniform float u_flash;
in vec2 v_texCoord;
out vec4 fragColor;
void main() {
  float k = 1.0 - u_p;
  float scale = 1.0 + u_zoom * k;
  vec2 c = vec2(0.5, 0.42);
  vec2 uv = c + (v_texCoord - c) / scale;
  vec4 acc = vec4(0.0);
  float strength = u_blur * k;
  for (int i = 0; i < 16; i++) {
    float t = float(i) / 15.0;
    vec2 suv = c + (uv - c) * (1.0 - strength * t);
    acc += texture(u_input, clamp(suv, 0.0, 1.0));
  }
  vec4 col = acc / 16.0;
  vec3 lit = col.rgb + (vec3(1.0) - col.rgb) * (u_flash * k);
  lit *= 1.0 + 0.35 * u_flash * k;
  fragColor = vec4(clamp(lit, 0.0, 1.0), col.a);
}`,
};

export class FlashZoomIn extends EffectProcessor {
  async initialize(ctx: ShaderInitContext): Promise<void> {
    ctx.compileShader({ id: "flash-zoom-in", fragmentShader: shader });
  }

  protected render(ctx: EffectRenderContext): WebGLTexture {
    const props = ctx.properties || {};
    const dur = Math.max(0.05, Number(props.duration ?? 0.2));
    const raw = Math.min(1, Math.max(0, ctx.time / dur));
    if (raw >= 1) return ctx.inputTexture;
    const p = 1 - Math.pow(1 - raw, 3); // ease-out
    return ctx.renderPass({
      id: "flash-zoom-in",
      textures: { u_input: { texture: ctx.inputTexture, filter: "linear" } },
      uniforms: {
        u_p: p,
        u_zoom: Number(props.zoom ?? 0.3),
        u_blur: Number(props.blur ?? 0.25),
        u_flash: Number(props.flash ?? 0.55),
      },
    });
  }
}
