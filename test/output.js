/** @vue */

const Counter = {
    render: function (h, context) {
        return function ({ count, $store }) {
            function handleClick(total) {
                $store.dispatch('count/addTotal', total + 1);
            }
            return <div>
        <button style={{ padding: '5px 20px', border: '1px solid #fff', background: '#fff' }} onClick={() => handleClick(count.total)}>+</button>
        <Info num={count.total} />
    </div>;
        }.call(this, this);
    }
};

export default co({
    components: { Info }
}, ['count'])(Counter);