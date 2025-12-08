import { writeFileSync } from "fs";
import { generatedTome } from "./helpers/generate-tome";

writeFileSync(
    "./src/app/tome.ts",
    `import type {TomeItem} from './types';\n\nexport const tomeLength = ${generatedTome.length};\nexport const tome: TomeItem[] = ${JSON.stringify(generatedTome, null, 2)}`,
);
