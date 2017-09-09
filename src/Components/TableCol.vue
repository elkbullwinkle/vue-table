<template>
    <td @click="clickFired">
        <slot :name="field.title" :field="field" :item="item" :content="content">
            <template v-html="content"></template>
        </slot>
    </td>
</template>

<script>

    export default {

        props : {
            field : {
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

                const field = this.field

                if (typeof field === "function")
                {
                    return field(item)
                }

                if (Array.isArray(field.field))
                {
                    const output = []
                    field.forEach(arg =>
                    {
                        output.push(this.evaluateField(arg))
                    })

                    return output.join(' ')
                }

                return this.evaluateField(field.field)
            }
        },

        methods: {

            clickFired() {

                if(this.field.disableClick)
                {
                    return
                }

                if (this.rowClick)
                {
                    this.$emit('click-fired', 'row', this.field, this.item);

                    return
                }

                if(typeof this.field.click === "string")
                {
                    this.$emit('click-fired', this.field.click, this.field, this.item);

                    return
                }


            },

            evaluateField(argument) {

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

        watch : {
        },

        mounted() {

            //console.log('Table column mounted')

        }
    }
</script>