export const setupXtal = (p, context) => {
    const { palette, fft } = context;

    const drawContext = {
        amplitude: 0,
        frequencyX: 0,
        frequencyY: 0,
        pattern: "ABCxyz01═|+:. ",
        speedFactor: 0,
        fftData: fft,
        palette,
    };

    return drawContext;
};

export const drawXtal = (p, context) => {
    const { fft, palette, drawContext } = context;

    const { octaveBands, energies } = fft;

    drawContext.amplitude = p.map(
        octaveBands.slice(0, 5).reduce((sum, band) => sum + band.energy, 0),
        0,
        255 * 5,
        10,
        50
    );

    drawContext.frequencyX = p.map(
        octaveBands.slice(10, 14).reduce((sum, band) => sum + band.energy, 0),
        0,
        255 * 4,
        0.001,
        0.01
    ) / context.fft.sampleRate;

    drawContext.frequencyY = p.map(
        octaveBands[31]?.energy || 0,
        0,
        255,
        0.005,
        0.05
    );

    drawContext.speedFactor = p.map(
        energies.bass,
        0,
        255,
        0.00005,
        0.0005
    );

    p.background(palette.background || "#000");

    let t = p.map(fft.energies.bass + fft.energies.highMid/100, 0, 255 + 255/100, 0.1, 1)
    if (fft.energies.treble < 130 & fft.energies.bass < 235) {
        drawContext.frequencyX *= 0.1
        drawContext.frequencyY *= 0.5
        t = drawContext.speedFactor * p.map(fft.energies.bass, 0, 255, 0, 1);
    }

    const gridSize = 65;
    const cellSize = p.width / gridSize;

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(cellSize * 0.8);
    p.noStroke();

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            const coordX = x * cellSize;
            const coordY = y * cellSize;

            const offset = Math.sin(
                coordY * coordX * Math.sin(t / 10)/10 * drawContext.frequencyX +
                    coordY * drawContext.frequencyY 
            ) * drawContext.amplitude/2;
            const patternIndex = Math.round(Math.abs(coordX + coordY + offset)) % drawContext.pattern.length;
            const char = drawContext.pattern[patternIndex];

            const colorIndex = patternIndex % palette.colors.length;
            p.fill(p.color(palette.colors[colorIndex]));

            p.text(char, coordX + cellSize / 2, coordY + cellSize / 2);
        }
    }
};
