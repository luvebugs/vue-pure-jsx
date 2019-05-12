/** @vue */
import Vue from 'vue';

var Test = function (context) {
    setTimeout(function () {
        context.name = 2;
    }, 2000);
    return `<div>count: {{this.msg}} {{this.name}}</div>`;
};

// debugger
export default {
    data() {
        return {
            name: 1
        }
    },
    props: ['msg'],
    render: Test.render
};