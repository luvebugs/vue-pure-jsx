<template>
    <div>
        <div>
            <button @click="handleClick">add</button>
        </div>
        <Index :msg="msg" />
        <Test :msg="msg" />
    </div>
</template>

<script>

import Index from './components/Index.js';
import Test from './components/Test.js';

export default {
    components: {Index, Test},
    data: function () {
        return {
            msg: 1
        }
    },
    methods: {
        handleClick() {
            this.msg ++;
        }
    }
}
</script>

<style>
</style>