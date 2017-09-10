<template>
    <tr>
        <elk-table-col v-for="column in columns" :column="column" :item="item" @click-fired="clickFired" :row-click="rowClick">
            <template :slot="column.title" scope="props">
                <slot :name="column.title" :column="props.column" :item="props.item" :content="props.content"></slot>
            </template>
        </elk-table-col>
    </tr>
</template>

<script>
    import TableCol from './TableCol.vue'

    export default {

        components : {
            'elk-table-col' : TableCol,
        },

        props : {
            columns : {
                required : true,
                type : Array,
            },

            item : {
                required : true,
                type : Object,
            },

            'row-click' : {
                type : Boolean,
                default : false,
            }
        },

        methods: {
            clickFired(...args) {

                this.$emit('click-fired', ...args)

            }
        },
    }
</script>