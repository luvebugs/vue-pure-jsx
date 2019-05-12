import template from 'babel-template';

export default ({
    types: t
}) => {
    const syntaxJsx = require('babel-plugin-syntax-jsx');
    const VUE_ANNOTATION_REGEX = /\*?\s*@vue\s+([^\s]+)/;
    const VUE_DECLARATION_REGEX = /\*?\s*@vue\s+$/;
    const JSX = 'jsx';
    const TPL = 'tpl';

    const transform = (path, data, functional) => {
        path.traverse({
            JSXElement() {
                this.type = JSX;
            },
            TemplateElement() {
                this.type = TPL;
            }
        }, data.state);

        if (!data.state.type) {
            return;
        }

        path.traverse({
            ReturnStatement(path) {
                const returnArg = path.node.argument;
                if (this.type === JSX) {
                    //对jsx不需要任何替换
                    // path.get('argument').replaceWith(returnArg);

                }
                if (this.type === TPL) {
                    // 对Tpl需要替换成Vue.compile(tpl).render.call(this)
                    const callExpr = t.callExpression(
                        t.memberExpression(
                            t.memberExpression(
                                t.callExpression(
                                    t.memberExpression(
                                        t.identifier('Vue'),
                                        t.identifier('compile')
                                    ),
                                    [returnArg]
                                ),
                                t.identifier('render')
                            ),
                            t.identifier('call')
                        ),
                        [t.thisExpression()]
                    );

                    path.get('argument').replaceWith(callExpr);
                }
                path.stop();
            }
        }, data.state)

        let value = {};

        const funExpr = t.functionExpression(null, path.node.params, path.node.body);
        const params = [t.identifier('h'), t.identifier('context')];

        if (data.state.type === JSX) {
            
            const ast = template(`
                for (const key in context.props) {
                    if (!context.hasOwnProperty(key)) {
                        context[key] = context.props[key];
                    }
                }
            `)();

            const blocks =  functional ? [ast] : [];
            
            const arg = functional ? t.identifier('context') : t.thisExpression();

            const args = [t.thisExpression()].concat([arg]);

            const callExpr = t.callExpression(
                t.memberExpression(
                    funExpr,
                    t.identifier('call')
                ),
                args
            );
            
            const body = t.blockStatement(
                blocks.concat([
                    t.returnStatement(callExpr)
                ])
            );

            value = t.functionExpression(null, params, body);
        }
        if (data.state.type === TPL) {

            const args = [t.thisExpression(), t.thisExpression()];

            const callExpr = t.callExpression(
                t.memberExpression(
                    funExpr,
                    t.identifier('call')
                ),
                args
            );

            const body = t.blockStatement([
                t.returnStatement(callExpr)
            ]);

            value = t.functionExpression(null, params, body);
        }
        const comments = path.find(path => path.parentPath.isProgram()).node.leadingComments
        
        const [comment] = comments ? [...comments].reverse() : [null];
        

        const matches = comment && VUE_ANNOTATION_REGEX.exec(comment.value);
        const [, name] = matches ? matches : [,,];
        if (name || data.state.pragma) {
            
            const prop = functional ? [
                t.objectProperty(t.identifier('functional'), t.booleanLiteral(true))
            ] : [].concat(name ? [t.objectProperty(t.identifier('name'), t.stringLiteral(name)),] : []);
            const properties = prop.concat([
                t.objectProperty(t.identifier('render'), value)
            ]);
            
            path.replaceWith(
                t.objectExpression(properties)
            );
        }
        
        path.stop();
    }
    const traverser = {
        ArrowFunctionExpression(path, data) {
            transform(path, data, true);
        },
        FunctionDeclaration(path, data) {
            transform(path, data, false);
        },
        FunctionExpression(path, data) {
            transform(path, data, false);
        }
    }
    return {
        inherits: syntaxJsx,
        pre(path, state) {
            this.state = {
                type: '',
                pragma: false
            };
        },
        visitor: {
            Program(path, data) {
                path.traverse({
                    enter(path, data) {
                        const {file} = data;
                        for (const comment of file.ast.comments) {
                            const matches = VUE_DECLARATION_REGEX.exec(comment.value);
                            if (matches) {
                                this.state.pragma = true;
                            }
                        }
                    },
                    ...traverser,
                    exit(path, state) {
                        this.state.pragma = false;
                    }
                }, {
                    ...data,
                    state: this.state
                });
            }
        },
        post() {
            delete this.state;
        }
    };
}