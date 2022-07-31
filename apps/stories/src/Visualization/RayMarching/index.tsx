import React, { lazy, Suspense } from 'react';
import { Loading } from '@/utils';

const ShaderPanel = lazy(() => import('../Panels/ShaderPanel'));

const RayMarching: React.FC<any> = () => {
  const vertexShader = `
    void main()
    {
      gl_Position = vec4(position, 1.0f);
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform vec2 resolution;

    #define PI 3.1415926535897932384626433832795

    float getDist(vec3 source, vec4 sphere)
    {
      return length(source - sphere.xyz) - sphere.w;
    }

    vec3 rayMarch(vec3 eye, vec3 ray, vec4 sphere)
    {
      vec3 src = eye;
      float dist = 0.f;

      for (int i = 0; i < 100; i++) {
        dist = getDist(src, sphere);
        src = src + ray * dist;

        if (dist < 0.01f) {
          return src;
        }
      }

      return vec3(0.f, 0.f, -1.f);
    }

    void main()
    {
      vec3 eye = vec3(0.f, 0.f, -200.f);
      vec4 sphere = vec4(0.f, 0.f, 300.f, 200.f);
      vec3 pointLight = vec3(160.f, 300.f, 50.f);

      float deltaArc = time / 10000.f * 2.f * PI;
      pointLight.xz += vec2(sin(deltaArc), cos(deltaArc)) * 300.f;

      vec3 fragCoord = vec3(gl_FragCoord.x - resolution.x / 2.f, gl_FragCoord.y - resolution.y / 2.f, 0.f);
      vec3 ray = normalize(fragCoord - eye);

      vec3 hit = rayMarch(eye, ray, sphere);

      if (hit.z < 0.f) {
        pc_fragColor = vec4(0.8f, 0.9f, 0.9f, 1.0f);
      } else {
        vec3 normal = normalize(hit - sphere.xyz);
        vec3 light = normalize(pointLight - hit);

        float dif = clamp(dot(normal, light), 0., 1.);

        pc_fragColor = vec4(dif, dif, dif, 1.0f);
      }
    }
  `;

  return (
    <Suspense fallback={<Loading />}>
      <ShaderPanel desc='Ray marching算法渲染球体。' vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </Suspense>
  );
};

export default RayMarching;
