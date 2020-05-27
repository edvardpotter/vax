function walkCalculator(VAX) {
    var trees = VAX.composeTreesInlined();

    if (trees.length !== 1) {
        return alert("There should be exactly one tree!");
    }

    var root = trees[0];

    if (root.c !== "Result") {
        return alert("Root node should be 'Result'!");
    }

    var prompts = {};

    var walkCalc = function walk(node) {
        if (!node) {
            return '';
        }

        switch (node.c) {
            case 'Result':
                return walk(node.links.I).toString();

            case 'Repeat':
                return walk(node.links.I);

            case 'Add':
                return walk(node.links.A) + walk(node.links.B);

            case 'Sub':
                return walk(node.links.A) - walk(node.links.B);

            case 'Mul':
                return walk(node.links.A) * walk(node.links.B);

            case 'Div':
                return walk(node.links.A) / walk(node.links.B);

            case 'Number':
                return parseFloat(node.a.V);

            case 'String':
                return node.a.V.toString();

            case 'ToString':
                return walk(node.links.I).toString();

            case 'Concat':
                var chunks = [];
                for (var i = 1; i <= 4; ++i) {
                    var s = walk(node.links['S' + i]);
                    if (s) {
                        chunks.push(s);
                    }
                }
                return chunks.join('');

            case 'Sqrt':
                return Math.sqrt(walk(node.links.I));

            case 'Prompt':
                var name = node.a.Name;
                if (prompts.hasOwnProperty(name)) {
                    return prompts[name];
                }
                else {
                    var res = parseFloat(prompt('Введите параметр ' + name, '1'));
                    prompts[name] = res;
                    return res;
                }

            case 'If':
                return walk(node.links.Condition) ? walk(node.links.onTrue) : walk(node.links.onFalse);

            case 'Gt':
                return walk(node.links.A) > walk(node.links.B);

            case 'Eq':
                return walk(node.links.A) === walk(node.links.B);

            case 'Not':
                return !walk(node.links.I);

            case 'And':
                return walk(node.links.A) && walk(node.links.B);

            case 'Or':
                return walk(node.links.A) || walk(node.links.B);

            default:
                throw new Error("Unsupported node component: " + node.component);
        }
    };

    return walkCalc(root);
}