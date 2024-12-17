export const setupCircling = (p, context) => {
    const { palette } = context;
    const drawContext = { particles: [], resolution: [60, 40], padding: -2 };
    p.background(palette.background);
    p.noSmooth();

    for (let i = 0; i < 1500; i++) {
        drawContext.particles.push(new CirclingMover(p, p.color(palette.colors[i % palette.colors.length])));
    }

    return drawContext;
};

export const drawCircling = (p, context) => {
    const { fft, drawContext } = context;
    const { particles } = drawContext;

    p.noStroke();
    p.fill(0, 40, 50, 10);
    p.rect(0, 0, p.width, p.height);

    const octaveBands = fft.octaveBands;

    const parameters = {
        band11: octaveBands[11]?.energy || 0,
        band10: octaveBands[10]?.energy || 0,
        band21: octaveBands[21]?.energy || 0,
        band31: octaveBands[31]?.energy || 0,
        lowBandSum: octaveBands.slice(-7, -3).reduce((sum, band) => sum + (band.energy || 0), 0),
        mid: fft.energies.mid,
        bass: fft.energies.bass,
    };

    const posX = p.noise(p.frameCount / 500.0) * p.width;
    const posY = p.noise(100 + p.frameCount / 400.0);

    particles.forEach((particle) => {
        particle.setVelo(p, posX, posY, parameters);
        particle.move(p);
        particle.checkEdges(p);
        particle.display(p);
    });
};

class CirclingMover {
    constructor(p, color) {
        this.location = p.createVector(p.random(p.width), p.random(p.height));
        this.velo = p.createVector(p.random(-1, 1), p.random(-1, 1));
        this.velo.normalize();
        this.speed = p.random(1, 3);
        this.size = p.random(1, 3);
        this.color = color;
    }

    setVelo(p, posX, posY, parameters) {
        const { band11, band10, band21, lowBandSum, band31, bass, mid } = parameters;
        const dis = p.dist(this.location.x, this.location.y, p.width / 2, p.height / 2);
        const maxDis = p.map(posX, 0, p.width, -1.2, 1.2) * p.dist(0, 0, p.width / 2, p.height / 2);

        const fAngle = p.map(dis, 0, maxDis, posY, 0);
        const angle11 = p.map(band11, 0, 255, -p.PI / 8, p.PI / 8);
        const angle10 = p.map(band10, 0, 255, -p.PI / 6, p.PI / 6);
        const angle21 = p.map(band21, 0, 255, -p.PI / 4, p.PI / 4);

        let angle = p.map(dis, 0, maxDis, p.PI, 0) - angle11 * fAngle - angle10 * fAngle;

        if (band31 > 1) {
            angle += p.PI/6;
        }

        angle += p.map(lowBandSum, 0, 4*255, -p.PI / 12, p.PI / 12) * p.map(bass, 0, 255, -p.PI/12, p.PI/12);

        this.velo.x += p.cos(angle);
        this.velo.y += p.sin(angle);
        this.velo.normalize();

        this.speed = p.map(band11 + band10, 0, 510, 1, 10) * p.map(mid, 0, 255, 0.3, 1);
    }

    move(p) {
        this.location.add(this.velo.copy().mult(this.speed));
    }

    checkEdges(p) {
        if (
            this.location.x < 0 ||
            this.location.x > p.width ||
            this.location.y < 0 ||
            this.location.y > p.height
        ) {
            this.location.x = p.random(p.width);
            this.location.y = p.random(p.height);
        }
    }

    display(p) {
        p.strokeWeight(this.size);
        p.stroke(this.color);
        p.point(this.location.x, this.location.y);
    }
}
