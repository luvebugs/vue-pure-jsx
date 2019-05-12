'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var t = _ref.types;

    var syntaxJsx = require('babel-plugin-syntax-jsx');
    var VUE_ANNOTATION_REGEX = /\*?\s*@vue\s+([^\s]+)/;
    var VUE_DECLARATION_REGEX = /\*?\s*@vue\s+$/;
    var JSX = 'jsx';
    var TPL = 'tpl';

    var transform = function transform(path, data, functional) {
        path.traverse({
            JSXElement: function JSXElement() {
                this.type = JSX;
            },
            TemplateElement: function TemplateElement() {
                this.type = TPL;
            }
        }, data.state);

        if (!data.state.type) {
            return;
        }

        path.traverse({
            ReturnStatement: function ReturnStatement(path) {
                var returnArg = path.node.argument;
                if (this.type === JSX) {
                    //对jsx不需要任何替换
                    // path.get('argument').replaceWith(returnArg);

                }
                if (this.type === TPL) {
                    // 对Tpl需要替换成Vue.compile(tpl).render.call(this)
                    var callExpr = t.callExpression(t.memberExpression(t.memberExpression(t.callExpression(t.memberExpression(t.identifier('Vue'), t.identifier('compile')), [returnArg]), t.identifier('render')), t.identifier('call')), [t.thisExpression()]);

                    path.get('argument').replaceWith(callExpr);
                }
                path.stop();
            }
        }, data.state);

        var value = {};

        var funExpr = t.functionExpression(null, path.node.params, path.node.body);
        var params = [t.identifier('h'), t.identifier('context')];

        if (data.state.type === JSX) {

            var ast = (0, _babelTemplate2.default)('\n                for (const key in context.props) {\n                    if (!context.hasOwnProperty(key)) {\n                        context[key] = context.props[key];\n                    }\n                }\n            ')();

            var blocks = functional ? [ast] : [];

            var arg = functional ? t.identifier('context') : t.thisExpression();

            var args = [t.thisExpression()].concat([arg]);

            var callExpr = t.callExpression(t.memberExpression(funExpr, t.identifier('call')), args);

            var body = t.blockStatement(blocks.concat([t.returnStatement(callExpr)]));

            value = t.functionExpression(null, params, body);
        }
        if (data.state.type === TPL) {

            var _args = [t.thisExpression(), t.thisExpression()];

            var _callExpr = t.callExpression(t.memberExpression(funExpr, t.identifier('call')), _args);

            var _body = t.blockStatement([t.returnStatement(_callExpr)]);

            value = t.functionExpression(null, params, _body);
        }
        var comments = path.find(function (path) {
            return path.parentPath.isProgram();
        }).node.leadingComments;

        var _ref2 = comments ? [].concat((0, _toConsumableArray3.default)(comments)).reverse() : [null],
            _ref3 = (0, _slicedToArray3.default)(_ref2, 1),
            comment = _ref3[0];

        var matches = comment && VUE_ANNOTATION_REGEX.exec(comment.value);

        var _ref4 = matches ? matches : [,,],
            _ref5 = (0, _slicedToArray3.default)(_ref4, 2),
            name = _ref5[1];

        if (name || data.state.pragma) {

            var prop = functional ? [t.objectProperty(t.identifier('functional'), t.booleanLiteral(true))] : [].concat(name ? [t.objectProperty(t.identifier('name'), t.stringLiteral(name))] : []);
            var properties = prop.concat([t.objectProperty(t.identifier('render'), value)]);

            path.replaceWith(t.objectExpression(properties));
        }

        path.stop();
    };
    var traverser = {
        ArrowFunctionExpression: function ArrowFunctionExpression(path, data) {
            transform(path, data, true);
        },
        FunctionDeclaration: function FunctionDeclaration(path, data) {
            transform(path, data, false);
        },
        FunctionExpression: function FunctionExpression(path, data) {
            transform(path, data, false);
        }
    };
    return {
        inherits: syntaxJsx,
        pre: function pre(path, state) {
            this.state = {
                type: '',
                pragma: false
            };
        },

        visitor: {
            Program: function Program(path, data) {
                path.traverse((0, _extends3.default)({
                    enter: function enter(path, data) {
                        var file = data.file;
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = (0, _getIterator3.default)(file.ast.comments), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var comment = _step.value;

                                var matches = VUE_DECLARATION_REGEX.exec(comment.value);
                                if (matches) {
                                    this.state.pragma = true;
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                    }
                }, traverser, {
                    exit: function exit(path, state) {
                        this.state.pragma = false;
                    }
                }), (0, _extends3.default)({}, data, {
                    state: this.state
                }));
            }
        },
        post: function post() {
            delete this.state;
        }
    };
};

module.exports = exports['default'];