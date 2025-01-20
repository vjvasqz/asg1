// Wave.js
function drawWave() {
    // Array of triangle vertices and colors
    const WaveTriangles = [
        // Bottom row (triangles 1-8) - lightest blue
        [0.6,-0.4, 0.4,-0.4, 0.6,-0.2, 0.65, 0.75, 0.85],    // 1 -
        [0.6,-0.2, 0.4,-0.4, 0.4,-0.2, 0.6, 0.7, 0.9],    // 2 -

        [0.4,-0.4, 0.2,-0.4, 0.4,-0.2, 0.65, 0.75, 0.85],    // 3 - 
        [0.2,-0.4, 0.4,-0.2, 0.0,-0.2, 0.6, 0.7, 0.9],    // 4- 
        [0.2,-0.4, -0.2,-0.4, 0.0,-0.2, 0.65, 0.75, 0.85], // 5 - top point 0
        [-0.2,-0.4, -0.8,-0.2, 0.0,-0.2, 0.6, 0.7, 0.9], // 6- 
        [-0.6,-0.4, -0.2,-0.4, -0.4,-0.2, 0.65, 0.75, 0.85], // 7-
        [-0.6,-0.4, -0.8,-0.2, -0.4,-0.2, 0.6, 0.7, 0.9], // 8-
        [-0.8,-0.4, -0.6,-0.4, -0.8,-0.2, 0.65, 0.75, 0.85], // 9-
        [-0.8,-0.4, -0.95,-0.4, -0.8,-0.2, 0.45, 0.55, 0.75], // 10-


        // Top layer (triangles 9-13) 
        [0.0,-0.2, -0.4,-0.2, -0.2,0.0, 0.5, 0.6, 0.8], // 11-
        [-0.2,0.0, -0.03,-0.18, -0.03,0.18, 0.45, 0.55, 0.75], // 12-
        [-0.03,0.18, -0.4,-0.22, -0.55,0.18, 0.35, 0.45, 0.65], // 13-
        [-0.03,0.18, -0.29,0.46, -0.55,0.18, 0.3, 0.4, 0.6], // 14
        [-0.03,-0.08, -0.03,0.18, 0.25,0.18, 0.5, 0.6, 0.8], // 15-
        [0.25,0.46, -0.03,0.18, 0.25,0.18, 0.3, 0.4, 0.6], // 16-
        [-0.03,0.18, 0.25,0.46, -0.03,0.46, 0.15, 0.25, 0.45], // 17-
        [-0.03,0.18, -0.29,0.46, -0.03,0.46, 0.2, 0.3, 0.5], // 18-
        [0.25,0.46, 0.55,0.18, 0.25,0.18, 0.2, 0.3, 0.5], // 19- 
        [0.55,0.05, 0.55,0.18, 0.25,0.18, 0.15, 0.25, 0.5], // 20-
        [-0.8,-0.2, -0.4,-0.2, -0.55,0.18, 0.5, 0.6, 0.8], // 21-

    ];

    // Draw each triangle
    WaveTriangles.forEach((triangleData, index) => {
        const vertices = triangleData.slice(0, 6);  // Get vertex coordinates
        const color = triangleData.slice(6);        // Get color values

        // Create a buffer for the vertex coordinates
        const vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create buffer object');
            return;
        }

        // Bind the buffer and write the vertices to it
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Set the color for this triangle
        gl.uniform4f(u_FragColor, color[0], color[1], color[2], 1.0);

        // Connect the vertices to the vertex shader
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        // Draw the triangle
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    });
}
