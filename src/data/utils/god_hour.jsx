const lyricsLRC = `
[00:0.00]
[01:19.00]Show me 
[01:19.90]someone
[01:20.96]
[01:22.15]I know 
[01:23.10]who 
[01:23.63]feels 
[01:24.14]the same
[01:25.13]
[01:26.25]Gold 
[01:26.65]bling 
[01:27.20]on my 
[01:27.80]finger
[01:29.60]
[01:29.95]Keeps me 
[01:30.80]from pain
[01:32.00]
[01:33.60]Are you 
[01:34.55]serious?
[01:35.75]
[01:36.40]I won't 
[01:37.60]say 
[01:38.10]a thing
[01:39.48]
[01:40.90]Tourist 
[01:41.80]of my 
[01:42.78]heart
[01:43.56]
[01:44.00]And 
[01:44.60]in my 
[01:45.50]brain
[01:47.40]
[01:55.65]Tourist 
[01:56.60]of my 
[01:57.50]heart
[01:58.33]
[01:58.90]And 
[01:59.30]in my 
[02:00.30]brain
[02:02.21]`;

const padding = 4;
const agentTextSize = 14;
const lyricTextSize = 300;

export const setupGodHour = (p, context) => {
    const font = p.loadFont("./font/Helvetica-Bold.ttf")
    p.textFont(font)
    const parsedLyrics = parseLrc(lyricsLRC);
    const words = parsedLyrics.flatMap(
        (line) => line.text.split(/\s+/)
        .filter((word) => word.trim() !== "")
    );
    const drawContext = {
        agents: [],
        agentRowHeight: agentTextSize + padding * 2,
        lyricRowHeight: lyricTextSize / 4 * 3 + padding * 20,
        lyrics: parsedLyrics
    };

    const bandsCount = 31;

    let x = -10;
    let y = -10;
    let wordIndex = 0;

    while (y < p.height) {
        const word = words[wordIndex % words.length];
        const widthVariation = p.random(1, 3);
        const textWidth = p.textWidth(word);
        const rectWidth = textWidth + 4 * padding + 2 * widthVariation;

        if (x > p.width + 100) {
            x = -10;
            y += drawContext.agentRowHeight;
        }

        if (y > p.height + 10) break;

        const noiseOffset = p.random(255);
        const bandIndex = p.floor(p.noise(noiseOffset) * bandsCount);
        const colorIndex = p.floor(p.random(context.palette.colors.length));

        drawContext.agents.push({
            x,
            y,
            text: word,
            rectWidth,
            bandIndex,
            isActive: false,
            noiseOffset,
            color: context.palette.colors[colorIndex],
            threshold: p.random(140, 230),
            widthVariation
        });

        x += rectWidth;
        wordIndex++;
    }

    p.textAlign(p.CENTER, p.CENTER);

    return drawContext;
};

export const drawGodHour = (p, context) => {
    const { fft, palette, drawContext, progress } = context;
    const { agents, agentRowHeight, lyricRowHeight, lyrics } = drawContext;

    const currentLyric = lyrics.find(
        (line) => line.time <= progress / 1000 && line.nextTime > progress / 1000
    );

    const octaveBands = fft.octaveBands;

    p.background(palette.background || 0);
    p.textSize(agentTextSize);

    agents.forEach((agent) => {
        const band = octaveBands[agent.bandIndex];
        const bandEnergy = band?.energy || 0;

        agent.isActive = bandEnergy > agent.threshold;

        if (agent.isActive) {
            p.noStroke();
            p.fill(agent.color);
            p.rect(agent.x, agent.y, agent.rectWidth, agentRowHeight);
        }

        const textX = agent.x + agent.rectWidth / 2;
        const textY = agent.y + agentRowHeight / 2;

        p.fill(255);
        p.text(agent.text, textX, textY);
    });

    if (currentLyric?.text) {
        const rectHeight = lyricRowHeight;
    
        const rectY = p.height / 2 - rectHeight / 2;
        const textY = rectY + rectHeight / 2;
    
        p.fill(palette.colors[currentLyric.index % palette.colors.length]);
        p.rect(0, rectY, p.width, rectHeight);
    
        p.fill(255);
        p.textSize(lyricTextSize);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(
            currentLyric.text.toUpperCase(),
            p.width / 2,
            textY
        );
    }
};

function parseLrc(lrc) {
    const lines = lrc
        .split("\n")
        .map((line, index) => {
            const match = line.match(/\[(\d+):(\d+\.\d+)](.*)/);
            if (!match) return null;

            const [_, minutes, seconds, text] = match;
            return {
                time: parseInt(minutes) * 60 + parseFloat(seconds),
                text: text.trim(),
                index: index,
            };
        })
        .filter(Boolean);

    for (let i = 0; i < lines.length; i++) {
        lines[i].nextTime = lines[i + 1] ? lines[i + 1].time : Infinity;
    }

    return lines;
}
