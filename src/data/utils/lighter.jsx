export const setupLighter = (p, context) => {
    const drawContext = {
        t: 0,
        pointsNum: 300,
        points: [],
        palette: context.palette,
    };

    for (let i = 0; i < drawContext.pointsNum; i++) {
        drawContext.points.push({
            x: p.random(p.width / 4, (p.width / 4) * 3),
            y: p.random(p.height / 4, (p.height / 4) * 3),
            offset: p.random(200),
        });
    }

    return drawContext;
};

export const drawLighter = (p, context) => {
    const { fft, palette, drawContext } = context;
    const { points, t } = drawContext;

    const { octaveBands } = fft;

    const lowEnergy = octaveBands.slice(0, 9).reduce((sum, band) => sum + band.energy, 0);
    const highEnergy = octaveBands.slice(9, 20).reduce((sum, band) => sum + band.energy, 0);

    const motionScale = p.map(lowEnergy, 0, 255 * 9, 1, 5) + p.map(highEnergy, 0, 255 * 11, 0, 3);

    p.blendMode(p.BLEND);
    p.noStroke();
    p.fill(p.color(palette.background + "1A"), 5);
    p.rect(0, 0, p.width, p.height);

    p.blendMode(p.SCREEN);
    p.noFill();
    p.strokeWeight(1);

    const totalEnergy = Object.values(fft.energies).reduce((sum, value) => sum + value, 0);
    const colorIndex = Math.floor(p.map(totalEnergy, 0, 255 * 5, 0, palette.colors.length - 1));
    const strokeColor = palette.colors[colorIndex];

    p.stroke(p.color(strokeColor + "60"));

    let l = p.map(totalEnergy, 0, 255 * 5, 0, 2)
    p.beginShape();
    for (let i = 0; i < points.length; i++) {
        const point = points[i];

        const noiseX = p.noise(point.offset, fft.energies.bass / 50) * p.width;
        const noiseY = p.noise(point.offset + 1000, fft.energies.highMid / 50) * p.height;

        point.x += (noiseX - point.x) * 0.01 * motionScale * l;
        point.y += (noiseY - point.y) * 0.01 * motionScale * l;

        point.x = (point.x + p.width) % p.width;
        point.y = (point.y + p.height) % p.height;

        p.curveVertex(point.x, point.y);
    }
    p.endShape();

    drawContext.t += 0.0001;
};
