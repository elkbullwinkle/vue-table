<template>
    <th v-html="column.title"
        :class="sortClasses"
        @click="sort()"
    ></th>
</template>

<script>

    export default {

        props : {
            column : {
                required : true,
                default : () => {{}},
            },

            'active-sort-column' : {
                required : true,
                type : String,
            },

            'active-sort-direction' : {
                default : true,
                type : Boolean,
            }
        },

        data() {
            return {

            }
        },

        computed : {
            isSortable() {
                return typeof this.column.sortable === 'string'
            },

            isActiveSortColumn() {
                return this.isSortable && this.column.sortable == this.activeSortColumn
            },

            sortClasses() {

                let sortClass = this.activeSortDirection ? 'sort-down' : 'sort-up'

                return {
                    active : this.isActiveSortColumn,
                    [sortClass] : this.isActiveSortColumn,
                }
            }
        },

        methods: {

            sort() {
                if (this.isSortable)
                {
                    if (this.isActiveSortColumn)
                    {
                        this.$emit('update:active-sort-direction', !this.activeSortDirection)
                    }
                    else
                    {
                        this.$emit('update:active-sort-column', this.column.sortable)

                        if (!this.activeSortDirection) {
                            this.$emit('update:active-sort-direction', true)
                        }
                    }

                    this.$emit('sort', this.column.sortable, this.activeSortDirection)
                }
            }

        },

        mounted() {

        }
    }
</script>

<style>
    th.active {
        border-bottom-color: lightblue;
        color : lightblue !important;
    }

    th.active.sort-up:after,
    th.active.sort-down:after {
        display: inline-block;
        width: 0;
        height: 0;
        content: "";
        margin-right: -10px;
        margin-bottom: 2px;
        margin-left: 5px;
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
    }

    th.active.sort-up:after {
        border-top: 5px solid;
    }

    th.active.sort-down:after {
        border-bottom: 5px solid;
    }


</style>