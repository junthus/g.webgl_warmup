function Start(canvasId) {
    this.canvas = document.getElementById(canvasId);

    this.model = {
        triangle: [
                         0.0,  1.0,  0.0,
                        -1.0, -1.0,  0.0,
                         1.0, -1.0,  0.0
                    ],
        square: [
                     1.0,  1.0,  0.0,
                    -1.0,  1.0,  0.0,
                     1.0, -1.0,  0.0,
                    -1.0, -1.0,  0.0
                ]
    };

    this.vertexAttrFieldId = 'vertexAttrLocation';
    this.mvMatId = 'mvMatUniform';
    this.pMatId = 'pMatUniform';
    this.mvMat = mat4.create();
    this.pMat = mat4.create();

    this.setting();
    this.sceneSetting();

    this.draw([-1.5, 0.0, -7.0], this.triangleVPositionBuffer, this.gl.TRIANGLES);
    this.draw([3.0, 0.0, 0.0], this.squareVPositionBuffer, this.gl.TRIANGLE_STRIP);
}

Start.prototype = Object.create(Util.prototype);
Start.prototype.constructor = Start;

Start.prototype.setting = function() {
    this.gl = this.initGl(this.canvas);

    this.shaderProgram = this.initShaders(this.gl, this.vertexAttrFieldId, this.mvMatId, this.pMatId);

    this.triangleVPositionBuffer = this.initBuffer(this.gl, this.model.triangle, 3, 3);
    this.squareVPositionBuffer = this.initBuffer(this.gl, this.model.square, 3, 4);
};

Start.prototype.doDepthTest = function() {
    this.gl.enable(gl.DEPTH_TEST);
};

Start.prototype.sceneSetting = function() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, this.gl.aspect, 0.1, 100.0, this.pMat);//fov, aspect, near, far
    mat4.identity(this.mvMat);
};

Start.prototype.draw = function(translateD, vPositionBufferToDraw, drawmode) {
    mat4.translate(this.mvMat, translateD);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vPositionBufferToDraw);
    this.gl.vertexAttribPointer(this.shaderProgram[this.vertexAttrFieldId], this.triangleVPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

    this.setUniform(this.gl, this.shaderProgram[this.mvMat], this.mvMat);
    this.setUniform(this.gl, this.shaderProgram[this.pMat], this.pMat);

    this.gl.drawArrays(drawmode, 0, vPositionBufferToDraw.numItems);
};
