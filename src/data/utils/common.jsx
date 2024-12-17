export const analysisVisual = (p, context) => {
    const { fft, palette } = context;
    const { energies, spectrum, centroid, octaveBands } = fft;

    p.background(palette.background);

    const halfWidth = p.width / 2;
    const energyHeight = p.height / Object.keys(energies).length;
    const spectrumBarWidth = halfWidth / spectrum.length;

    Object.entries(energies).forEach(([band, value], index) => {
        let y = index * energyHeight;
        let color = palette.background;

        if (value > 230) {
            color = palette.colors[5];
        } else if (value > 200) {
            color = palette.colors[4];
        } else if (value > 150) {
            color = palette.colors[3];
        } else if (value > 100) {
            color = palette.colors[2];
        }
        p.fill(color);
        p.noStroke();

        let barWidth = p.map(value, 0, 255, 0, halfWidth);
        p.rect(0, y, barWidth, energyHeight - 5);

        p.fill(255);
        p.textSize(14);
        p.textAlign(p.LEFT, p.CENTER);
        p.text(`${band}: ${value}`, 5, y + energyHeight / 2);
    });

    spectrum.forEach((value, index) => {
        let x = halfWidth + index * spectrumBarWidth;
        let h = p.map(value, 0, 255, 0, p.height);

        let color = palette.background;
        if (value > 230) {
            color = palette.colors[5];
        } else if (value > 200) {
            color = palette.colors[4];
        } else if (value > 150) {
            color = palette.colors[3];
        } else if (value > 100) {
            color = palette.colors[2];
        }
        p.fill(color);
        p.noStroke();

        p.rect(x, p.height - h, spectrumBarWidth - 1, h);
    });
    
    p.stroke(255);
    p.strokeWeight(2);
    p.line(halfWidth, 0, halfWidth, p.height);
}

export const octaveAnalysisVisual = (p, context) => {
    const { fft, palette } = context;
    const { octaveBands } = fft;

    p.background(palette.background);

    const bandWidth = p.width / octaveBands.length;
    const maxBandHeight = p.height;

    octaveBands.forEach((band, index) => {
        const { energy } = band;

        const barHeight = p.map(energy, 0, 255, 0, maxBandHeight);
        const color = palette.colors[index % palette.colors.length];

        const x = index * bandWidth;
        const y = p.height - barHeight;

        p.fill(color);
        p.noStroke();
        p.rect(x, y, bandWidth - 1, barHeight);

        p.fill(255);
        p.textSize(10);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text(`${Math.round(band.lo)}-${Math.round(band.hi)} Hz`, x + bandWidth / 2, y - 5);

        p.textAlign(p.CENTER, p.TOP);
        p.text(`E: ${Math.round(energy)}`, x + bandWidth / 2, y + 5);
        p.fill(255)
        p.text(`I: ${index}`, x + bandWidth / 2, 20);
    });

    p.stroke(255);
    p.strokeWeight(1);
    p.line(0, p.height / 2, p.width, p.height / 2);
};

