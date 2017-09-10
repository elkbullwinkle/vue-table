<template>
    <td @click="clickFired">
        <slot :name="column.title" :column="column" :item="item" :content="content">
            <template v-html="content"></template>
        </slot>
    </td>
</template>

<script>

    export default {

        props : {
            column : {
                required : true,
            },

            item : {
                required : true,
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

        computed: {

            content() {

                const column = this.column

                if (typeof column === "function")
                {
                    return column(item)
                }

                if (Array.isArray(column.field))
                {
                    const output = []
                    column.forEach(arg =>
                    {
                        output.push(this.evaluateColumn(arg))
                    })

                    return output.join(' ')
                }

                return this.evaluateColumn(column.field)
            }
        },

        methods: {

            clickFired() {

                if(this.column.disableClick)
                {
                    return
                }

                if (this.rowClick)
                {
                    this.$emit('click-fired', 'row', this.column, this.item);

                    return
                }

                if(typeof this.column.click === "string")
                {
                    this.$emit('click-fired', this.column.click, this.column, this.item);

                    return
                }


            },

            evaluateColumn(argument) {

                let output = ''

                try {
                    output = eval('this.item.' + argument)
                }
                catch(e) {
                    output = 'Undefined'
                    console.warn(`Unable to evaluate "item.${argument}"`, e.message)
                }

                return output
            }

        },
    }
</script>