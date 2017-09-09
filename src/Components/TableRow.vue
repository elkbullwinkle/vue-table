<template>
    <tr>
        <elk-table-col v-for="field in fields" :field="field" :item="item" @click-fired="clickFired" :row-click="rowClick">
            <template :slot="field.title" scope="props">
                <slot :name="field.title" :field="props.field" :item="props.item" :content="props.content"></slot>
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
            fields : {
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

        data() {
            return {
                
            }
        },

        methods: {
            clickFired(...args) {

                this.$emit('click-fired', ...args)

            }
        },

        mounted() {

            console.log('TH mounted')

        }
    }
</script>