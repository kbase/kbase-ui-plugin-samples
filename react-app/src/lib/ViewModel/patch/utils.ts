/* istanbul ignore file */

import {intersection} from "@kbase/ui-lib/lib/lang";
import sesarData from "../../client/formats/sesar/sesar.json";
import enigmaData from "../../client/formats/enigma/enigma.json";
import {
    Format
} from "../../client/samples/Samples";
import sesarTemplateData from "lib/ViewModel/data/templates/sesar/sesar1.json";
import enigmaTemplateData from "lib/ViewModel/data/templates/enigma/enigma1.json";
import {GetSampleResult} from "../../client/SampleServiceClient";

const sesarFormatData = sesarData as Format;
const enigmaFormatData = enigmaData as Format;

export function grokFormat(result: GetSampleResult): string {
    // if a sample contains fields not defined by a format, then it isn't that format!
    const controlledKeys = Object.keys(result.node_tree[0].meta_controlled);
    const standardKeys = ["id", "name", "parent_id"];
    const commonKeys = intersection(
        sesarFormatData.fields,
        enigmaFormatData.fields,
    );
    const ignoreKeys = commonKeys.concat(standardKeys);

    const notSesar = controlledKeys.filter((key) => {
        if (ignoreKeys.includes(key)) {
            return false;
        }
        return !sesarFormatData.fields.includes(key);
    });

    const sesarIntersect = controlledKeys.filter((key) => {
        if (ignoreKeys.includes(key)) {
            return false;
        }
        return sesarTemplateData.fields.includes(key);
    });

    const notEnigma = controlledKeys.filter((key) => {
        if (ignoreKeys.includes(key)) {
            return false;
        }
        return !enigmaFormatData.fields.includes(key);
    });


    const enigmaIntersect = controlledKeys.filter((key) => {
        if (ignoreKeys.includes(key)) {
            return false;
        }
        return enigmaTemplateData.fields.includes(key);
    });

    const sesarRatio = sesarIntersect.length / controlledKeys.length;
    const enigmaRatio = enigmaIntersect.length / controlledKeys.length;

    // if (sesarRatio > 0.5) {
    //     if (sesarRatio > enigmaRatio) {
    //         return  'sesar';
    //     }
    //     return 'sesar';
    // } else if (enigmaRatio > 0.5) {
    //
    // } else {
    //     return 'kbase';
    // }

    if (sesarIntersect.length > 0 && notSesar.length === 0) {
        return "sesar";
    }

    if (enigmaIntersect.length > 0 && notEnigma.length === 0) {
        return "enigma";
    }

    return "kbase";
}