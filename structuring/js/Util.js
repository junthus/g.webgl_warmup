function Util() {

}

Util.prototype.initGl = function(canvas) {
    var gl;

    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        gl.aspect = canvas.width/canvas.height;
    } catch (e) {

    }

    if (!gl) {
        throw new Error(['fail to init gl']);
    }

    return gl;
};

Util.prototype.initShaders = function(gl, vertexAttrFieldId, mvMatId, pMatId) {
    var shaderProgram,
        fs = this.getShader(gl, 'shader-fs'),
        vs = this.getShader(gl, 'shader-vs');

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vs);
    gl.attachShader(shaderProgram, fs);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }

    gl.useProgram(shaderProgram);

    shaderProgram[vertexAttrFieldId] = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(shaderProgram[vertexAttrFieldId]);

    shaderProgram[mvMatId] = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
    shaderProgram[pMatId] = gl.getUniformLocation(shaderProgram, 'uPMatrix');

    return shaderProgram;
};

Util.prototype.getShader = function(gl, id) {
    var shaderScript = document.getElementById(id);

    if (!shaderScript) {
        return null;
    }

    var str = '',
        k = shaderScript.firstChild,
        shader;

    while (k) {
        if (k.nodeType === 3) {//Textnode
            str += k.textContent;
            k = k.nextSibling;
        }
    }

    if (shaderScript.type === 'x-shader/x-fragment') {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type === 'x-shader/x-vertex') {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
};

Util.prototype.initBuffer = function(gl, vertices, eachItemSize, numOfItems) {
    var buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    buffer.itemSize = eachItemSize;
    buffer.numItems = numOfItems;

    return buffer;
};

Util.prototype.setUniform = function(gl, location, val) {
    gl.uniformMatrix4fv(location, false, val);
};



function log(m) {
    var str = '';

    for (var i = 0, len = m.length; i < len; i++) {
        str += (i!==0 && i%4===0) ? '\n'+ m[i] + ', ' : m[i] + ', '
    }

    console.log(str);
}

















