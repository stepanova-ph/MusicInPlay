import { setupCircling, drawCircling } from "./utils/circling";
import { octaveAnalysisVisual } from "./utils/common";
import { setupInterludio, drawInterludio } from "./utils/interludio";
import { setupGodHour, drawGodHour } from "./utils/god_hour";
import { drawXtal, setupXtal } from "./utils/180db";
import { drawLighter, setupLighter } from "./utils/lighter";

const VISUALS = {
    1: {
        setup: setupInterludio,
        draw: drawInterludio,
        // draw: octaveAnalysisVisual,
    },
    2: {
        setup: setupXtal,
        draw: drawXtal,
        // draw: octaveAnalysisVisual,
    },
    3: {
        setup: setupCircling,
        draw: drawCircling,
        // draw: octaveAnalysisVisual,
    },
    4: {
        setup: setupGodHour,
        draw: drawGodHour,
        // draw: octaveAnalysisVisual,
    },
    5 : {
        setup: setupLighter,
        draw: drawLighter,
        // draw: octaveAnalysisVisual,
    },

};


export default VISUALS;
