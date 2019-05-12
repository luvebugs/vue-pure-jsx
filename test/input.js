/** @vue */
// const child1 = function () {
//     const a = '213123';
//     return <span></span>
// }

// const child2 = function () {
//     return <span></span>
// }

// export default child2;

// module.export = child2

const Index = function(props) {
    return <span>{props.index.total}</span>;
}
/** @vue name */
export default (props) => {
    const child = function () {
        return <span></span>
    }
    return <span></span>;
}

// export default function(props) {
//     return <span></span>;
// }

// const Index = function(props) {
//     const name = 123;
//     return `<div>
//     </div>`;
// }

// const Header = function ({title, $store}) {
//     function addTodo(e) {
//         if (e.key !== 'Enter') {
//             return;
//         }
//         const text = e.target.value
//         if (text.trim()) {
//             $store.dispatch('todo/addTodo', {text});
//         }
//         e.target.value = ''
//     };
//     return <header class="header">
//         <h1>{title}</h1>
//         <input class="new-todo"
//             autofocus
//             autocomplete="off"
//             placeholder="输入一个待做事件"
//             onKeydown={addTodo} />
//     </header>;
// }