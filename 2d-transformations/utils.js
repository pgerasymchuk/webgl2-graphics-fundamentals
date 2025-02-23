function createProgramFromSources(gl, shaderSources) {
    const defaultShaderType = [
        'VERTEX_SHADER',
        'FRAGMENT_SHADER',
    ];

    const program = gl.createProgram();

    for (let i = 0; i < shaderSources.length; ++i) {
        const shader = gl.createShader(gl[defaultShaderType[i]]);
        gl.shaderSource(shader, shaderSources[i]);
        gl.compileShader(shader);
        gl.attachShader(program, shader);
    }
    gl.linkProgram(program);

    return program;
}

export {createProgramFromSources};
