export const vsSource = `#version 300 es
    precision highp float;
    layout(location=0) in vec3 aVertexPosition;
    layout(location=1) in vec4 aVertexColor;

    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform vec3 eye_pos;

    out lowp vec4 vColor;
    out vec3 ray;
    flat out vec3 eye;

    void main(void) {
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
        vColor = aVertexColor;
        ray = aVertexPosition - eye_pos;
        eye = eye_pos - vec3(-32.0, -32.0, -32.0);
    }
`;

export const fsSource = `#version 300 es
    precision highp float;
    in lowp vec4 vColor;
    in vec3 ray;
    flat in vec3 eye;

    uniform highp sampler3D volume;

    out vec4 fragColor;

    int FRONT = 1, BACK = 2, LEFT = 3, RIGHT = 4, TOP = 5, BOTTOM = 6, NONE = 0;

    bool hit(out int face, inout vec3 hit_point, vec3 ray_dir) {
        if (hit_point.x >= 0.0 && hit_point.x <= 64.0 && hit_point.y >= 0.0 && hit_point.y <= 64.0 && hit_point.z >= 0.0 && hit_point.z <= 64.0) {
            float magX = 0.0, magY = 0.0, magZ = 0.0;

            if (ray_dir.x != 0.0) {
                
            }
                
            return false;
        } else {
            float x = ray_dir.x == 0.0 ? -1.0 : ray_dir.x < 0.0 ? 64.0 : 0.0,
                y = ray_dir.y == 0.0 ? -1.0 : ray_dir.y < 0.0 ? 64.0 : 0.0,
                z = ray_dir.z == 0.0 ? -1.0 : ray_dir.z < 0.0 ? 64.0 : 0.0;
            vec3 h, newHit;

            if (x != -1.0) {
                float mag = (x - hit_point.x) / ray_dir.x;
                if (mag > 0.0) {
                    h = hit_point + ray_dir * mag;
                    if (h.y > 0.0 && h.y < 64.0 && h.z > 0.0 && h.z < 64.0) {
                        face = ray_dir.x < 0.0 ? RIGHT : LEFT;
                        newHit = h;
                        newHit.x = x;
                    }
                }
            }

            if (y != -1.0 && face == NONE) {
                float mag = (y - hit_point.y) / ray_dir.y;
                if (mag > 0.0) {
                    h = hit_point + ray_dir * mag;
                    if (h.x > 0.0 && h.x < 64.0 && h.z > 0.0 && h.z < 64.0) {
                        face = ray_dir.y < 0.0 ? FRONT : BACK;
                        newHit = h;
                        newHit.y = y;
                    }
                }
            }

            if (z != -1.0 && face == NONE) {
                float mag = (z - hit_point.z) / ray_dir.z;
                if (mag > 0.0) {
                    h = hit_point + ray_dir * mag;
                    if (h.x > 0.0 && h.x < 64.0 && h.y > 0.0 && h.y < 64.0) {
                        face = ray_dir.z < 0.0 ? TOP : BOTTOM;
                        newHit = h;
                        newHit.z = z;
                    }
                }
            }

            hit_point = newHit;
        }

        if (face == RIGHT) hit_point.x -= 1.0;
        if (face == FRONT) hit_point.y -= 1.0;
        if (face == TOP) hit_point.z -= 1.0;

        if (texture(volume, floor(hit_point) / 64.0).w == 1.0) {
            return true;
        }
        face = NONE;
        return false;
    }

    void main(void) {
        int face = NONE;
        vec3 ray_dir = normalize(ray);
        vec3 hit_point = eye;

        int hitCount = 10;
        while(hitCount > 0) {
            if (hit(face, hit_point, ray_dir)) {
                break;
            }
            hitCount--;
        }

        if (face == LEFT) {
            fragColor = vec4(1.0, 0.0, 0.0, 1.0);
            return;
        }
        if (face == RIGHT) {
            fragColor = vec4(0.0, 1.0, 0.0, 1.0);
            return;
        }
        if (face == TOP) {
            fragColor = vec4(0.0, 0.0, 1.0, 1.0);
            return;
        }
        if (face == BOTTOM) {
            fragColor = vec4(1.0, 1.0, 0.0, 1.0);
            return;
        }
        if (face == FRONT) {
            fragColor = vec4(0.0, 1.0, 1.0, 1.0);
            return;
        }
        if (face == BACK) {
            fragColor = vec4(1.0, 0.0, 1.0, 1.0);
            return;
        }
        discard;
    }
`;

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) {
        console.log(`Failed to load shader: ${source}`);
        return null;
    }

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(
        `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
        );
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

export const initShaderProgram = (gl: WebGLRenderingContext, vsSource: string, fsSource: string) => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) {
        return null;
    }
  
    // Create the shader program
  
    const shaderProgram = gl.createProgram();
    if (!shaderProgram) {
        console.log("Failed to create shader program");
        return null;
    }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
  
    // If creating the shader program failed, alert
  
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.log(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(
          shaderProgram
        )}`
      );
      return null;
    }
  
    return shaderProgram;
  }