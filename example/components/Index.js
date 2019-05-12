/** @vue */

function connect(props) {
    return (component) => {
        return component;
    }
}
const Index = ({props}) => {
    return <span>count: {props.msg}</span>;
}


export default connect()(Index);


