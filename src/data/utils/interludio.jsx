const pointBaseSize = 3;
const pulseSpeed = 1;
const gridDensity = 35;

export const setupInterludio = (p, context) => {
    const drawContext = {
        points: [],
        zoom: 0,
        size: pointBaseSize,
        pointsManager: null,
    };

    const { palette } = context;

    p.colorMode(p.HSB);
    p.noStroke();
    p.background(palette.background);

    drawContext.pointsManager = new InterludioPoints(p, palette.colors.length);
    drawContext.points = drawContext.pointsManager.getPoints();

    return drawContext;
};

export const drawInterludio = (p, context) => {
    const { fft, palette, drawContext } = context;
    const { pointsManager } = drawContext;

    const octaveBands = fft.octaveBands;
    const transformedPoints = pointsManager.transformPoints(octaveBands, palette);

    p.noStroke();
    p.fill(palette.background + "1A");
    p.rect(0, 0, p.width, p.height);

    transformedPoints.forEach((point) => {
        const color = p.color(palette.colors[point.colorIndex]);
        p.fill(color);
        p.circle(point.x0, point.y0, point.size);
    });
};

class InterludioPoints {
    constructor(p, paletteLength) {
        this.p = p;
        this.points = this.createPoints(paletteLength);
        this.paletteLength = paletteLength;
    }

    createPoints(paletteLength) {
        const points = [];
        const I = gridDensity;

        let cI = 0;
        for (let i = 0; i <= I; i++) {
            for (let j = 0; j <= I; j++) {
                const x = i * this.p.width / I;
                const y = j * this.p.height / I;

                const octaveIndex = 13 + (cI % 4);

                points.push(new InterludioPoint(this.p, x, y, cI % paletteLength, octaveIndex));
                cI += 1;
            }
        }
        return points;
    }

    transformPoints(octaveBands, palette) {
        const highestBand = octaveBands[octaveBands.length - 1];

        const isPulsingConditionMet =
            highestBand.energy > 5;

        const transformedPoints = this.points.map((point) => {
            const band = octaveBands[point.octaveIndex];
            const { energy } = band;

            const scale = this.p.map(energy, 0, 255, 0.5, 3);
            const rotation = this.p.map(energy, 0, 255, -this.p.PI/4, this.p.PI/4);

            const dx = point.x0 - this.p.width / 2;
            const dy = point.y0 - this.p.height / 2;

            const xScaled = dx * scale;
            const yScaled = dy * scale;

            const xRot = xScaled * this.p.cos(rotation) - yScaled * this.p.sin(rotation);
            const yRot = xScaled * this.p.sin(rotation) + yScaled * this.p.cos(rotation);

            point.updatePulse(isPulsingConditionMet, this.paletteLength);

            return {
                x0: xRot + this.p.width / 2,
                y0: yRot + this.p.height / 2,
                colorIndex: point.colorIndex,
                size: point.size,
            };
        });

        return transformedPoints;
    }

    getPoints() {
        return this.points;
    }
}
class InterludioPoint {
    constructor(p, x, y, colorIndex, octaveIndex) {
        this.p = p;
        this.x0 = x;
        this.y0 = y;
        this.colorIndex = colorIndex;
        this.octaveIndex = octaveIndex;
        this.size = pointBaseSize;
        this.pulsing = false;
        this.pulseAmount = 2;

        const dx = x - this.p.width / 2;
        const dy = y - this.p.height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const maxDistance = Math.sqrt((this.p.width / 2) ** 2 + (this.p.height / 2) ** 2);
        this.maxSize = pointBaseSize + this.p.map(distance, 0, maxDistance, 0, 20);
    }

    updatePulse(isPulsingConditionMet, paletteLength) {
        if (isPulsingConditionMet && !this.pulsing) {
            this.pulsing = true;
            this.pulseAmount = pulseSpeed;
        }

        if (this.pulsing) {
            this.size += this.pulseAmount;

            if (this.size >= this.maxSize) {
                this.pulseAmount = -pulseSpeed;
            }

            if (this.size <= pointBaseSize) {
                this.size = pointBaseSize;
                this.pulsing = false;
            }

            if (this.size >= this.maxSize) {
                this.colorIndex = (this.colorIndex + 1) % paletteLength;
            }
        }
    }
}
